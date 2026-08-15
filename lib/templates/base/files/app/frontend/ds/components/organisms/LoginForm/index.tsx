import React, { useState } from 'react'
import { cn } from '../../../utils/cn'
import { FormField } from '../../molecules/FormField'
import { Button } from '../../atoms/Button'

export interface LoginFormValues {
  email: string
  password: string
  rememberMe: boolean
}

export interface LoginFormProps {
  onSubmit?: (values: LoginFormValues) => void
  loading?: boolean
  error?: string
  className?: string
}

export function LoginForm({
  onSubmit,
  loading = false,
  error,
  className,
}: LoginFormProps) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [rememberMe, setRememberMe] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit?.({ email, password, rememberMe })
  }

  return (
    <div
      className={cn('ds-login-form', className)}
      style={{
        width: '100%',
        maxWidth: '400px',
        background: 'var(--color-surface)',
        borderRadius: 'var(--radius-xl)',
        padding: '2rem',
        boxShadow: 'var(--shadow-raised)',
        border: '1px solid var(--color-default)',
      }}
    >
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
        <div
          style={{
            width: '48px',
            height: '48px',
            borderRadius: '50%',
            background: 'var(--gradient-primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1rem',
            fontSize: '1.25rem',
          }}
        >
          🔐
        </div>
        <h2
          style={{
            fontFamily: 'var(--font-base)',
            fontWeight: 700,
            fontSize: '1.25rem',
            color: 'var(--color-gray-100)',
            margin: '0 0 0.25rem',
          }}
        >
          Sign In
        </h2>
        <p
          style={{
            fontFamily: 'var(--font-base)',
            fontSize: '0.8rem',
            color: 'var(--color-gray-600)',
            margin: 0,
          }}
        >
          Welcome back — enter your credentials
        </p>
      </div>

      {/* Error message */}
      {error && (
        <div
          role="alert"
          style={{
            background: 'rgba(253,93,147,0.1)',
            border: '1px solid rgba(253,93,147,0.3)',
            borderRadius: 'var(--radius-base)',
            padding: '0.6rem 0.875rem',
            marginBottom: '1.25rem',
            fontFamily: 'var(--font-base)',
            fontSize: '0.8rem',
            color: 'var(--color-danger)',
          }}
        >
          {error}
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <FormField
          label="Email"
          name="email"
          type="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <FormField
          label="Password"
          name="password"
          type="password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        {/* Remember me */}
        <label
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            cursor: 'pointer',
            fontFamily: 'var(--font-base)',
            fontSize: '0.8rem',
            color: 'var(--color-gray-500)',
            userSelect: 'none',
          }}
        >
          <input
            type="checkbox"
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.target.checked)}
            style={{
              accentColor: 'var(--color-primary)',
              width: '14px',
              height: '14px',
              cursor: 'pointer',
            }}
          />
          Remember me
        </label>

        <div style={{ marginTop: '0.5rem' }}>
          <Button
            variant="primary"
            fullWidth
            disabled={loading}
            onClick={handleSubmit}
          >
            {loading ? 'Signing in…' : 'Sign In'}
          </Button>
        </div>
      </form>
    </div>
  )
}
