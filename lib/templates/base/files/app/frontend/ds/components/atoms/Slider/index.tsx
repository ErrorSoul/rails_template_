import { cn } from '../../../utils/cn'

export interface SliderProps {
  min?: number
  max?: number
  value: number
  onChange: (value: number) => void
  step?: number
  label?: string
  showValue?: boolean
  disabled?: boolean
  className?: string
}

export function Slider({
  min = 0,
  max = 100,
  value,
  onChange,
  step = 1,
  label,
  showValue = false,
  disabled = false,
  className,
}: SliderProps) {
  const pct = max === min ? 0 : ((value - min) / (max - min)) * 100

  return (
    <div
      className={cn('ds-slider', className)}
      style={{ fontFamily: 'var(--font-base)', opacity: disabled ? 0.6 : 1 }}
    >
      {(label || showValue) && (
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', alignItems: 'center' }}>
          {label && (
            <span style={{ color: 'var(--color-gray-400)', fontSize: 'var(--font-size-sm)' }}>{label}</span>
          )}
          {showValue && (
            <span style={{ color: 'var(--color-gray-300)', fontSize: 'var(--font-size-sm)', fontWeight: 600, marginLeft: 'auto' }}>
              {value}
            </span>
          )}
        </div>
      )}

      <div style={{ position: 'relative', height: '20px', display: 'flex', alignItems: 'center' }}>
        {/* Track background */}
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
        {/* Filled track */}
        <div
          style={{
            position: 'absolute',
            left: 0,
            width: `${pct}%`,
            height: '4px',
            background: 'var(--gradient-primary)',
            borderRadius: '2px',
            boxShadow: '0 0 6px rgba(var(--color-accent-rgb), 0.4)',
            pointerEvents: 'none',
          }}
        />

        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          disabled={disabled}
          onChange={(e) => onChange(Number(e.target.value))}
          aria-label={label ?? 'Slider'}
          aria-valuenow={value}
          aria-valuemin={min}
          aria-valuemax={max}
          style={{
            WebkitAppearance: 'none',
            appearance: 'none',
            position: 'absolute',
            width: '100%',
            height: '4px',
            background: 'transparent',
            cursor: disabled ? 'not-allowed' : 'pointer',
            outline: 'none',
            margin: 0,
          }}
        />
      </div>

      <style>{`
        .ds-slider input[type="range"] {
          -webkit-appearance: none;
          appearance: none;
          background: transparent;
        }
        .ds-slider input[type="range"]::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 18px;
          height: 18px;
          border-radius: 50%;
          background: var(--gradient-primary);
          cursor: pointer;
          border: 2px solid var(--color-bg);
          box-shadow: 0 0 6px rgba(var(--color-accent-rgb), 0.5);
          transition: transform 0.15s ease;
        }
        .ds-slider input[type="range"]:not(:disabled)::-webkit-slider-thumb:hover {
          transform: scale(1.2);
        }
        .ds-slider input[type="range"]::-moz-range-thumb {
          width: 18px;
          height: 18px;
          border-radius: 50%;
          background: var(--gradient-primary);
          cursor: pointer;
          border: 2px solid var(--color-bg);
          box-shadow: 0 0 6px rgba(var(--color-accent-rgb), 0.5);
        }
        .ds-slider input[type="range"]::-webkit-slider-runnable-track {
          height: 4px;
          background: transparent;
        }
        .ds-slider input[type="range"]::-moz-range-track {
          height: 4px;
          background: transparent;
        }
      `}</style>
    </div>
  )
}
