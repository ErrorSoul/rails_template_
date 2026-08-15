import React, { useRef, useCallback } from 'react'
import { cn } from '../../../utils/cn'

export interface RangeSliderProps {
  min: number
  max: number
  value: [number, number]
  onChange: (value: [number, number]) => void
  step?: number
  label?: string
  className?: string
}

export function RangeSlider({ min, max, value, onChange, step = 1, label, className }: RangeSliderProps) {
  const [low, high] = value
  const range = max - min

  const lowPct = ((low - min) / range) * 100
  const highPct = ((high - min) / range) * 100

  const handleLow = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const v = Number(e.target.value)
    if (v <= high) onChange([v, high])
  }, [high, onChange])

  const handleHigh = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const v = Number(e.target.value)
    if (v >= low) onChange([low, v])
  }, [low, onChange])

  const thumbStyle: React.CSSProperties = {
    WebkitAppearance: 'none',
    appearance: 'none',
    width: '18px',
    height: '18px',
    borderRadius: '50%',
    background: 'var(--gradient-primary)',
    cursor: 'pointer',
    border: '2px solid var(--color-bg)',
    boxShadow: '0 0 6px rgba(var(--color-accent-rgb), 0.5)',
    marginTop: '-7px',
  }

  const trackStyle: React.CSSProperties = {
    WebkitAppearance: 'none',
    appearance: 'none',
    position: 'absolute',
    width: '100%',
    height: '4px',
    background: 'transparent',
    pointerEvents: 'none',
    top: 0,
    left: 0,
  }

  return (
    <div className={cn('ds-range-slider', className)} style={{ fontFamily: 'var(--font-base)' }}>
      {label && (
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
          <span style={{ color: 'var(--color-gray-400)', fontSize: 'var(--font-size-sm)' }}>{label}</span>
          <span style={{ color: 'var(--color-gray-300)', fontSize: 'var(--font-size-sm)', fontWeight: 600 }}>
            {low} – {high}
          </span>
        </div>
      )}

      <div style={{ position: 'relative', height: '20px', display: 'flex', alignItems: 'center' }}>
        {/* track background */}
        <div
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            height: '4px',
            background: 'var(--color-default)',
            borderRadius: '2px',
          }}
        />
        {/* active range highlight */}
        <div
          style={{
            position: 'absolute',
            left: `${lowPct}%`,
            width: `${highPct - lowPct}%`,
            height: '4px',
            background: 'var(--gradient-primary)',
            borderRadius: '2px',
            boxShadow: '0 0 6px rgba(var(--color-accent-rgb), 0.4)',
          }}
        />

        {/* low thumb */}
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={low}
          onChange={handleLow}
          aria-label={`Minimum value: ${low}`}
          style={{
            ...trackStyle,
            pointerEvents: 'auto',
            zIndex: low > max - 1 ? 5 : 3,
          }}
        />

        {/* high thumb */}
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={high}
          onChange={handleHigh}
          aria-label={`Maximum value: ${high}`}
          style={{
            ...trackStyle,
            pointerEvents: 'auto',
            zIndex: 4,
          }}
        />
      </div>

      <style>{`
        .ds-range-slider input[type="range"] {
          -webkit-appearance: none;
          appearance: none;
          background: transparent;
        }
        .ds-range-slider input[type="range"]::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 18px;
          height: 18px;
          border-radius: 50%;
          background: var(--gradient-primary);
          cursor: pointer;
          border: 2px solid var(--color-bg);
          box-shadow: 0 0 6px rgba(var(--color-accent-rgb), 0.5);
          margin-top: -7px;
          transition: transform 0.15s ease;
        }
        .ds-range-slider input[type="range"]::-webkit-slider-thumb:hover {
          transform: scale(1.2);
        }
        .ds-range-slider input[type="range"]::-moz-range-thumb {
          width: 18px;
          height: 18px;
          border-radius: 50%;
          background: var(--gradient-primary);
          cursor: pointer;
          border: 2px solid var(--color-bg);
          box-shadow: 0 0 6px rgba(var(--color-accent-rgb), 0.5);
        }
        .ds-range-slider input[type="range"]::-webkit-slider-runnable-track {
          height: 4px;
          background: transparent;
        }
        .ds-range-slider input[type="range"]::-moz-range-track {
          height: 4px;
          background: transparent;
        }
      `}</style>
    </div>
  )
}
