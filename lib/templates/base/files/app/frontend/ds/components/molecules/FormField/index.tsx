import { Input } from '../../atoms/Input'
import { cn } from '../../../utils/cn'

interface FormFieldProps {
  label: string
  name: string
  type?: string
  placeholder?: string
  value?: string
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
  error?: string
  hint?: string
  required?: boolean
  disabled?: boolean
  className?: string
}

export function FormField({
  label,
  name,
  type = 'text',
  placeholder,
  value,
  onChange,
  error,
  hint,
  required = false,
  disabled = false,
  className,
}: FormFieldProps) {
  return (
    <div className={cn('flex flex-col', className)} style={{ gap: '0.25rem' }}>
      <label
        htmlFor={name}
        style={{
          fontFamily: 'var(--font-base)',
          color: 'var(--color-gray-500)',
          fontSize: '0.75rem',
          fontWeight: 500,
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
        }}
      >
        {label}
        {required && (
          <span style={{ color: 'var(--color-danger)', marginLeft: '0.25rem' }}>*</span>
        )}
      </label>

      <Input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        error={error}
        disabled={disabled}
      />

      {hint && !error && (
        <span style={{ fontFamily: 'var(--font-base)', color: 'var(--color-gray-600)', fontSize: '0.7rem', fontStyle: 'italic' }}>
          {hint}
        </span>
      )}
    </div>
  )
}
