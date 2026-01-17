import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { User } from '@prisma/client';

export interface TokenPayload {
  sub: string;
  email: string;
  type: 'access' | 'refresh';
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface AuthResponse {
  user: Omit<User, 'passwordHash'>;
  tokens: AuthTokens;
}

@Injectable()
export class AuthService {
  private readonly MAX_LOGIN_ATTEMPTS = 5;
  private readonly LOCKOUT_DURATION = 15 * 60 * 1000; // 15 minutes

  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  /**
   * Register new user with email and password
   */
  async register(dto: RegisterDto, ip: string, userAgent: string): Promise<AuthResponse> {
    // Check if email already exists
    const existingUser = await this.prisma.user.findUnique({
      where: { email: dto.email.toLowerCase() },
    });

    if (existingUser) {
      throw new ConflictException('Пользователь с таким email уже существует');
    }

    // Hash password
    const rounds = parseInt(this.configService.get<string>('BCRYPT_ROUNDS', '12'), 10);
    const passwordHash = await bcrypt.hash(dto.password, rounds);

    // Create user
    const user = await this.prisma.user.create({
      data: {
        email: dto.email.toLowerCase(),
        passwordHash,
        name: dto.name,
        lastLoginAt: new Date(),
        lastLoginIp: ip,
      },
    });

    // Generate tokens
    const tokens = await this.generateTokens(user, ip, userAgent);

    // Log audit
    await this.logAudit(user.id, 'REGISTER', 'User', user.id, ip, userAgent);

    // Return user without password hash
    const { passwordHash: _, ...userWithoutPassword } = user;
    return {
      user: userWithoutPassword,
      tokens,
    };
  }

  /**
   * Login with email and password
   */
  async login(dto: LoginDto, ip: string, userAgent: string): Promise<AuthResponse> {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email.toLowerCase() },
    });

    if (!user) {
      throw new UnauthorizedException('Неверный email или пароль');
    }

    // Check if account is locked
    if (user.lockedUntil && user.lockedUntil > new Date()) {
      const minutesLeft = Math.ceil((user.lockedUntil.getTime() - Date.now()) / 60000);
      throw new UnauthorizedException(
        `Аккаунт заблокирован. Попробуйте через ${minutesLeft} минут`,
      );
    }

    // Check if user has password (might be OAuth-only user)
    if (!user.passwordHash) {
      throw new UnauthorizedException('Используйте вход через соцсеть');
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(dto.password, user.passwordHash);

    if (!isPasswordValid) {
      // Increment failed attempts
      await this.handleFailedLogin(user);
      throw new UnauthorizedException('Неверный email или пароль');
    }

    // Reset failed attempts on successful login
    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        failedLoginAttempts: 0,
        lockedUntil: null,
        lastLoginAt: new Date(),
        lastLoginIp: ip,
      },
    });

    // Generate tokens
    const tokens = await this.generateTokens(user, ip, userAgent);

    // Log audit
    await this.logAudit(user.id, 'LOGIN', 'User', user.id, ip, userAgent);

    const { passwordHash: _, ...userWithoutPassword } = user;
    return {
      user: userWithoutPassword,
      tokens,
    };
  }

  /**
   * Refresh access token using refresh token
   */
  async refreshTokens(refreshToken: string, ip: string, userAgent: string): Promise<AuthTokens> {
    // Find refresh token in database
    const storedToken = await this.prisma.refreshToken.findUnique({
      where: { token: refreshToken },
      include: { user: true },
    });

    if (!storedToken || storedToken.revokedAt || storedToken.expiresAt < new Date()) {
      throw new UnauthorizedException('Недействительный refresh token');
    }

    // Verify JWT
    try {
      const payload = this.jwtService.verify<TokenPayload>(refreshToken, {
        secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
      });

      if (payload.type !== 'refresh' || payload.sub !== storedToken.userId) {
        throw new UnauthorizedException('Недействительный refresh token');
      }
    } catch {
      throw new UnauthorizedException('Недействительный refresh token');
    }

    // Revoke old refresh token (rotation)
    await this.prisma.refreshToken.update({
      where: { id: storedToken.id },
      data: { revokedAt: new Date() },
    });

    // Generate new tokens
    return this.generateTokens(storedToken.user, ip, userAgent);
  }

  /**
   * Logout - revoke refresh token
   */
  async logout(userId: string, refreshToken: string, ip: string, userAgent: string): Promise<void> {
    await this.prisma.refreshToken.updateMany({
      where: {
        userId,
        token: refreshToken,
        revokedAt: null,
      },
      data: { revokedAt: new Date() },
    });

    await this.logAudit(userId, 'LOGOUT', 'User', userId, ip, userAgent);
  }

  /**
   * Logout from all devices
   */
  async logoutAll(userId: string, ip: string, userAgent: string): Promise<void> {
    await this.prisma.refreshToken.updateMany({
      where: {
        userId,
        revokedAt: null,
      },
      data: { revokedAt: new Date() },
    });

    await this.logAudit(userId, 'LOGOUT_ALL', 'User', userId, ip, userAgent);
  }

  /**
   * Validate access token payload
   */
  async validateUser(payload: TokenPayload): Promise<User | null> {
    if (payload.type !== 'access') {
      return null;
    }

    const user = await this.prisma.user.findUnique({
      where: { id: payload.sub },
    });

    if (!user || user.deletedAt) {
      return null;
    }

    return user;
  }

  // ============================================
  // PRIVATE METHODS
  // ============================================

  private async generateTokens(user: User, ip: string, userAgent: string): Promise<AuthTokens> {
    const accessPayload: TokenPayload = {
      sub: user.id,
      email: user.email || '',
      type: 'access',
    };

    const refreshPayload: TokenPayload = {
      sub: user.id,
      email: user.email || '',
      type: 'refresh',
    };

    const accessToken = this.jwtService.sign(
      { sub: accessPayload.sub, email: accessPayload.email, type: accessPayload.type },
      {
        secret: this.configService.get<string>('JWT_SECRET') || 'default-secret',
        expiresIn: 900, // 15 minutes
      },
    );

    const refreshToken = this.jwtService.sign(
      { sub: refreshPayload.sub, email: refreshPayload.email, type: refreshPayload.type },
      {
        secret: this.configService.get<string>('JWT_REFRESH_SECRET') || 'default-refresh-secret',
        expiresIn: 604800, // 7 days
      },
    );

    // Store refresh token in database
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    await this.prisma.refreshToken.create({
      data: {
        userId: user.id,
        token: refreshToken,
        userAgent,
        ip,
        expiresAt,
      },
    });

    return { accessToken, refreshToken };
  }

  private async handleFailedLogin(user: User): Promise<void> {
    const newAttempts = user.failedLoginAttempts + 1;
    const updateData: { failedLoginAttempts: number; lockedUntil?: Date } = {
      failedLoginAttempts: newAttempts,
    };

    // Lock account after max attempts
    if (newAttempts >= this.MAX_LOGIN_ATTEMPTS) {
      updateData.lockedUntil = new Date(Date.now() + this.LOCKOUT_DURATION);
    }

    await this.prisma.user.update({
      where: { id: user.id },
      data: updateData,
    });
  }

  private async logAudit(
    userId: string,
    action: string,
    resource: string,
    resourceId: string,
    ip: string,
    userAgent: string,
    metadata?: Record<string, unknown>,
  ): Promise<void> {
    await this.prisma.auditLog.create({
      data: {
        userId,
        action,
        resource,
        resourceId,
        ip,
        userAgent,
        metadata: metadata ? JSON.parse(JSON.stringify(metadata)) : undefined,
      },
    });
  }
}
