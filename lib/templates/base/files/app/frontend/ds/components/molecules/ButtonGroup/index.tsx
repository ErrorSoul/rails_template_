import React from 'react'
import { cn } from '../../../utils/cn'
import type { ButtonSize, ButtonVariant } from '../../atoms/Button'

export interface ButtonGroupProps {
  children: React.ReactNode
  orientation?: 'horizontal' | 'vertical'
  size?: ButtonSize
  variant?: ButtonVariant
  className?: string
}

export function ButtonGroup({
  children,
  orientation = 'horizontal',
  className,
}: ButtonGroupProps) {
  const isVertical = orientation === 'vertical'

  const childArray = React.Children.toArray(children)

  return (
    <div
      className={cn('ds-button-group', className)}
      role="group"
      style={{
        display: 'inline-flex',
        flexDirection: isVertical ? 'column' : 'row',
        fontFamily: 'var(--font-base)',
      }}
    >
      {childArray.map((child, index) => {
        const isFirst = index === 0
        const isLast = index === childArray.length - 1

        const borderRadius = isVertical
          ? `${isFirst ? 'var(--radius-lg)' : '0'} ${isFirst ? 'var(--radius-lg)' : '0'} ${isLast ? 'var(--radius-lg)' : '0'} ${isLast ? 'var(--radius-lg)' : '0'}`
          : `${isFirst ? 'var(--radius-lg)' : '0'} ${isLast ? 'var(--radius-lg)' : '0'} ${isLast ? 'var(--radius-lg)' : '0'} ${isFirst ? 'var(--radius-lg)' : '0'}`

        const margin = isVertical
          ? { marginTop: isFirst ? 0 : -1 }
          : { marginLeft: isFirst ? 0 : -1 }

        return (
          <div
            key={index}
            style={{
              ...margin,
              display: 'flex',
            }}
          >
            {React.isValidElement(child)
              ? React.cloneElement(child as React.ReactElement<{ style?: React.CSSProperties }>, {
                  style: {
                    ...(child.props as { style?: React.CSSProperties }).style,
                    borderRadius,
                    position: 'relative',
                    zIndex: 1,
                    boxShadow: 'none',
                  },
                })
              : child}
          </div>
        )
      })}
    </div>
  )
}
