import {
  Controller,
  Post,
  Body,
  Req,
  Res,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import type { Request, Response } from 'express';
import { Throttle } from '@nestjs/throttler';
import { AuthService, AuthResponse, AuthTokens } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { Public } from '../common/decorators/public.decorator';
import { CurrentUser } from '../common/decorators/user.decorator';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import type { User } from '@prisma/client';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /**
   * Register new user
   * Rate limited: 3 attempts per hour
   */
  @Public()
  @Post('register')
  @Throttle({ default: { limit: 3, ttl: 3600000 } })
  @HttpCode(HttpStatus.CREATED)
  async register(
    @Body() dto: RegisterDto,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ): Promise<{ user: Omit<User, 'passwordHash'>; accessToken: string }> {
    const ip = this.getClientIp(req);
    const userAgent = req.headers['user-agent'] || 'unknown';

    const result = await this.authService.register(dto, ip, userAgent);

    // Set refresh token as httpOnly cookie
    this.setRefreshTokenCookie(res, result.tokens.refreshToken);

    return {
      user: result.user,
      accessToken: result.tokens.accessToken,
    };
  }

  /**
   * Login with email and password
   * Rate limited: 5 attempts per 15 minutes
   */
  @Public()
  @Post('login')
  @Throttle({ default: { limit: 5, ttl: 900000 } })
  @HttpCode(HttpStatus.OK)
  async login(
    @Body() dto: LoginDto,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ): Promise<{ user: Omit<User, 'passwordHash'>; accessToken: string }> {
    const ip = this.getClientIp(req);
    const userAgent = req.headers['user-agent'] || 'unknown';

    const result = await this.authService.login(dto, ip, userAgent);

    this.setRefreshTokenCookie(res, result.tokens.refreshToken);

    return {
      user: result.user,
      accessToken: result.tokens.accessToken,
    };
  }

  /**
   * Refresh access token
   */
  @Public()
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  async refresh(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ): Promise<{ accessToken: string }> {
    const refreshToken = req.cookies?.refreshToken;

    if (!refreshToken) {
      throw new Error('Refresh token not found');
    }

    const ip = this.getClientIp(req);
    const userAgent = req.headers['user-agent'] || 'unknown';

    const tokens = await this.authService.refreshTokens(refreshToken, ip, userAgent);

    this.setRefreshTokenCookie(res, tokens.refreshToken);

    return { accessToken: tokens.accessToken };
  }

  /**
   * Logout from current device
   */
  @Post('logout')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async logout(
    @CurrentUser() user: User,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ): Promise<{ message: string }> {
    const refreshToken = req.cookies?.refreshToken;
    const ip = this.getClientIp(req);
    const userAgent = req.headers['user-agent'] || 'unknown';

    if (refreshToken) {
      await this.authService.logout(user.id, refreshToken, ip, userAgent);
    }

    this.clearRefreshTokenCookie(res);

    return { message: 'Вы вышли из системы' };
  }

  /**
   * Logout from all devices
   */
  @Post('logout-all')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async logoutAll(
    @CurrentUser() user: User,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ): Promise<{ message: string }> {
    const ip = this.getClientIp(req);
    const userAgent = req.headers['user-agent'] || 'unknown';

    await this.authService.logoutAll(user.id, ip, userAgent);

    this.clearRefreshTokenCookie(res);

    return { message: 'Вы вышли из системы на всех устройствах' };
  }

  /**
   * Get current user profile
   */
  @Post('me')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async me(@CurrentUser() user: User): Promise<Omit<User, 'passwordHash'>> {
    const { passwordHash: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  // ============================================
  // HELPER METHODS
  // ============================================

  private getClientIp(req: Request): string {
    const forwarded = req.headers['x-forwarded-for'];
    if (typeof forwarded === 'string') {
      return forwarded.split(',')[0].trim();
    }
    return req.ip || req.socket.remoteAddress || 'unknown';
  }

  private setRefreshTokenCookie(res: Response, token: string): void {
    res.cookie('refreshToken', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      path: '/auth',
    });
  }

  private clearRefreshTokenCookie(res: Response): void {
    res.clearCookie('refreshToken', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/auth',
    });
  }
}
