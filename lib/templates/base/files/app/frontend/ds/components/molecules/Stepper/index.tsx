import React from 'react'
import { cn } from '../../../utils/cn'

export interface StepItem {
  label: string
  description?: string
  icon?: React.ReactNode
}

export interface StepperProps {
  steps: StepItem[]
  activeStep: number
  orientation?: 'horizontal' | 'vertical'
  className?: string
}

export function Stepper({ steps, activeStep, orientation = 'horizontal', className }: StepperProps) {
  const isVertical = orientation === 'vertical'

  return (
    <div
      className={cn('ds-stepper', className)}
      role="list"
      aria-label="Steps"
      style={{
        display: 'flex',
        flexDirection: isVertical ? 'column' : 'row',
        gap: isVertical ? '0' : '0',
        fontFamily: 'var(--font-base)',
        alignItems: isVertical ? 'flex-start' : 'flex-start',
      }}
    >
      {steps.map((step, idx) => {
        const isCompleted = idx < activeStep
        const isActive = idx === activeStep
        const isLast = idx === steps.length - 1

        const dotBg = isCompleted
          ? 'var(--gradient-success)'
          : isActive
          ? 'var(--gradient-info)'
          : 'var(--color-default)'

        const labelColor = isActive
          ? 'var(--color-info)'
          : isCompleted
          ? 'var(--color-success)'
          : 'var(--color-gray-600)'

        return (
          <div
            key={idx}
            role="listitem"
            aria-current={isActive ? 'step' : undefined}
            style={{
              display: 'flex',
              flexDirection: isVertical ? 'row' : 'column',
              alignItems: isVertical ? 'flex-start' : 'center',
              flex: isVertical ? undefined : 1,
              position: 'relative',
            }}
          >
            {/* dot + connector row */}
            <div
              style={{
                display: 'flex',
                flexDirection: isVertical ? 'column' : 'row',
                alignItems: 'center',
                width: isVertical ? undefined : '100%',
                alignSelf: isVertical ? 'stretch' : undefined,
              }}
            >
              {/* dot */}
              <div
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  background: dotBg,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#fff',
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  flexShrink: 0,
                  zIndex: 1,
                }}
              >
                {step.icon ?? (isCompleted ? '✓' : idx + 1)}
              </div>

              {/* connector */}
              {!isLast && (
                <div
                  aria-hidden="true"
                  style={{
                    flex: 1,
                    width: isVertical ? '3px' : undefined,
                    height: isVertical ? undefined : '3px',
                    minHeight: isVertical ? '1.5rem' : undefined,
                    background: isCompleted ? 'var(--gradient-success)' : 'var(--color-default)',
                    marginLeft: isVertical ? '14px' : undefined,
                    alignSelf: isVertical ? undefined : 'center',
                    boxShadow: isCompleted ? '0 0 6px rgba(var(--color-accent-rgb), 0.3)' : 'none',
                  }}
                />
              )}
            </div>

            {/* label block */}
            <div
              style={{
                marginTop: isVertical ? '0' : '0.6rem',
                marginLeft: isVertical ? '0.75rem' : undefined,
                paddingBottom: isVertical && !isLast ? '2.5rem' : undefined,
                textAlign: isVertical ? 'left' : 'center',
              }}
            >
              <div style={{ color: labelColor, fontWeight: isActive ? 600 : 400, fontSize: 'var(--font-size-base)' }}>
                {step.label}
              </div>
              {step.description && (
                <div style={{ color: 'var(--color-gray-600)', fontSize: 'var(--font-size-sm)', marginTop: '0.2rem' }}>
                  {step.description}
                </div>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}
