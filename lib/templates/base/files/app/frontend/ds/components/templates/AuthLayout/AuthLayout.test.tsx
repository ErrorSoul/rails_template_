import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { AuthLayout } from './index'

describe('AuthLayout', () => {
  it('renders without crash', () => {
    render(<AuthLayout>Form</AuthLayout>)
    expect(document.querySelector('.ds-auth-layout')).toBeInTheDocument()
  })

  it('renders children', () => {
    render(<AuthLayout>Login Form</AuthLayout>)
    expect(screen.getByText('Login Form')).toBeInTheDocument()
  })

  it('renders title', () => {
    render(<AuthLayout title="Вход">Form</AuthLayout>)
    expect(screen.getByText('Вход')).toBeInTheDocument()
  })

  it('renders subtitle', () => {
    render(<AuthLayout title="Вход" subtitle="Введите данные">Form</AuthLayout>)
    expect(screen.getByText('Введите данные')).toBeInTheDocument()
  })

  it('renders footer', () => {
    render(<AuthLayout footer={<a href="/register">Регистрация</a>}>Form</AuthLayout>)
    expect(screen.getByText('Регистрация')).toBeInTheDocument()
  })

  it('applies custom className', () => {
    render(<AuthLayout className="my-auth">Form</AuthLayout>)
    expect(document.querySelector('.my-auth')).toBeInTheDocument()
  })
})
