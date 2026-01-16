'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import Link from 'next/link'
import { Loader2 } from 'lucide-react'
import { loginSchema, type LoginInput } from '@/lib/validations/auth'

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
  })

  const onSubmit = async (data: LoginInput) => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch('http://localhost:3001/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
        credentials: 'include',
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.message || 'Ошибка входа')
      }

      localStorage.setItem('accessToken', result.accessToken)
      window.location.href = '/app'
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Произошла ошибка')
    } finally {
      setIsLoading(false)
    }
  }

  const inputStyle = {
    width: '100%',
    height: '52px',
    padding: '0 16px',
    backgroundColor: '#F7F5F3',
    border: '2px solid transparent',
    borderRadius: '14px',
    fontSize: '1rem',
    color: '#1A1714',
    outline: 'none',
    transition: 'border-color 0.15s, background-color 0.15s',
  }

  const labelStyle = {
    display: 'block',
    fontSize: '0.875rem',
    fontWeight: 500,
    color: '#1A1714',
    marginBottom: '8px',
  }

  const buttonStyle = {
    width: '100%',
    height: '52px',
    backgroundColor: '#2D7A4F',
    color: 'white',
    border: 'none',
    borderRadius: '14px',
    fontSize: '1rem',
    fontWeight: 600,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    transition: 'background-color 0.15s',
  }

  const oauthButtonStyle = (color: string) => ({
    width: '100%',
    height: '52px',
    backgroundColor: color,
    color: 'white',
    border: 'none',
    borderRadius: '14px',
    fontSize: '0.95rem',
    fontWeight: 500,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '12px',
    marginBottom: '12px',
  })

  return (
    <>
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 700, color: '#1A1714', marginBottom: '8px' }}>
          Добро пожаловать!
        </h1>
        <p style={{ color: '#6B6259' }}>
          Войдите в аккаунт, чтобы продолжить
        </p>
      </div>

      {/* OAuth кнопки */}
      <div style={{ marginBottom: '24px' }}>
        <button style={oauthButtonStyle('#0077FF')}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
            <path d="M12.785 16.241s.288-.032.436-.194c.136-.148.132-.427.132-.427s-.02-1.304.576-1.496c.588-.19 1.341 1.26 2.14 1.818.605.422 1.064.33 1.064.33l2.137-.03s1.117-.071.587-.964c-.043-.073-.308-.661-1.588-1.87-1.34-1.264-1.16-1.059.453-3.246.983-1.332 1.376-2.145 1.253-2.493-.117-.332-.84-.244-.84-.244l-2.406.015s-.178-.025-.31.055c-.13.079-.212.262-.212.262s-.382 1.03-.89 1.907c-1.07 1.85-1.499 1.948-1.674 1.832-.407-.267-.305-1.075-.305-1.648 0-1.793.267-2.54-.521-2.733-.262-.065-.454-.107-1.123-.114-.858-.009-1.585.003-1.996.208-.274.136-.485.44-.356.457.159.022.519.099.71.363.246.341.237 1.107.237 1.107s.142 2.11-.33 2.371c-.325.18-.77-.187-1.725-1.865-.489-.859-.859-1.81-.859-1.81s-.07-.176-.198-.272c-.154-.115-.37-.151-.37-.151l-2.286.015s-.343.01-.469.161C3.94 7.721 4.043 8 4.043 8s1.79 4.258 3.817 6.403c1.858 1.967 3.968 1.838 3.968 1.838h.957z"/>
          </svg>
          Войти через VK ID
        </button>
        <button style={oauthButtonStyle('#FC3F1D')}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z"/>
          </svg>
          Войти через Яндекс ID
        </button>
        <button style={oauthButtonStyle('#0088CC')}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 00-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.74-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .37z"/>
          </svg>
          Войти через Telegram
        </button>
        <button style={{
          ...oauthButtonStyle('#F7F5F3'),
          color: '#1A1714',
          border: '2px solid #EDE9E4',
        }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="#1A1714">
            <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/>
          </svg>
          Войти по номеру телефона
        </button>
      </div>

      {/* Разделитель */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '16px',
        marginBottom: '24px',
      }}>
        <div style={{ flex: 1, height: '1px', backgroundColor: '#EDE9E4' }} />
        <span style={{ color: '#8C8177', fontSize: '0.875rem' }}>или войдите через email</span>
        <div style={{ flex: 1, height: '1px', backgroundColor: '#EDE9E4' }} />
      </div>

      {/* Форма */}
      <form onSubmit={handleSubmit(onSubmit)}>
        {error && (
          <div style={{
            padding: '16px',
            backgroundColor: '#FEE2E2',
            border: '1px solid #FCA5A5',
            borderRadius: '12px',
            color: '#DC2626',
            fontSize: '0.875rem',
            marginBottom: '16px',
          }}>
            {error}
          </div>
        )}

        <div style={{ marginBottom: '16px' }}>
          <label style={labelStyle}>Email</label>
          <input
            type="email"
            placeholder="ivan@example.ru"
            style={inputStyle}
            {...register('email')}
          />
          {errors.email && (
            <p style={{ color: '#DC2626', fontSize: '0.75rem', marginTop: '4px' }}>
              {errors.email.message}
            </p>
          )}
        </div>

        <div style={{ marginBottom: '16px' }}>
          <label style={labelStyle}>Пароль</label>
          <input
            type="password"
            placeholder="••••••••"
            style={inputStyle}
            {...register('password')}
          />
          {errors.password && (
            <p style={{ color: '#DC2626', fontSize: '0.75rem', marginTop: '4px' }}>
              {errors.password.message}
            </p>
          )}
        </div>

        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '24px',
        }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
            <input type="checkbox" style={{ width: '18px', height: '18px', accentColor: '#2D7A4F' }} />
            <span style={{ fontSize: '0.875rem', color: '#6B6259' }}>Запомнить меня</span>
          </label>
          <Link href="/forgot-password" style={{
            fontSize: '0.875rem',
            color: '#2D7A4F',
            textDecoration: 'none',
            fontWeight: 500,
          }}>
            Забыли пароль?
          </Link>
        </div>

        <button type="submit" disabled={isLoading} style={{
          ...buttonStyle,
          opacity: isLoading ? 0.7 : 1,
          cursor: isLoading ? 'not-allowed' : 'pointer',
        }}>
          {isLoading ? (
            <>
              <Loader2 size={20} style={{ animation: 'spin 1s linear infinite' }} />
              Вход...
            </>
          ) : (
            'Войти'
          )}
        </button>
      </form>

      <p style={{ marginTop: '24px', textAlign: 'center', fontSize: '0.875rem', color: '#6B6259' }}>
        Нет аккаунта?{' '}
        <Link href="/register" style={{ color: '#2D7A4F', textDecoration: 'none', fontWeight: 500 }}>
          Зарегистрироваться
        </Link>
      </p>
    </>
  )
}
