import { cn } from '../../../utils/cn'

export interface ChartData {
  label: string
  value: number
  color?: string
}

export interface ChartProps {
  type: 'bar' | 'line' | 'donut'
  data: ChartData[]
  width?: number
  height?: number
  title?: string
  showLabels?: boolean
  className?: string
}

const DEFAULT_COLORS = [
  'var(--color-primary)',
  'var(--color-info)',
  'var(--color-success)',
  'var(--color-warning)',
  'var(--color-danger)',
  'var(--color-purple)',
  'var(--color-teal)',
]

function BarChart({ data, width, height, showLabels }: { data: ChartData[]; width: number; height: number; showLabels: boolean }) {
  const max = Math.max(...data.map((d) => d.value), 1)
  const barAreaHeight = height - 40
  const barWidth = Math.floor((width - 40) / data.length) - 8
  const barAreaLeft = 20

  return (
    <svg viewBox={`0 0 ${width} ${height}`} width="100%" style={{ display: 'block' }} role="img" aria-label="Bar chart">
      {data.map((d, i) => {
        const barH = Math.max(2, (d.value / max) * barAreaHeight)
        const x = barAreaLeft + i * ((width - 40) / data.length) + 4
        const y = barAreaHeight - barH + 10
        const color = d.color ?? DEFAULT_COLORS[i % DEFAULT_COLORS.length]
        return (
          <g key={i}>
            <rect x={x} y={y} width={barWidth} height={barH} rx={4} fill={color} opacity={0.9} />
            {showLabels && (
              <>
                <text x={x + barWidth / 2} y={barAreaHeight + 25} textAnchor="middle" fontSize={10} fill="var(--color-gray-500)" fontFamily="var(--font-base)">
                  {d.label}
                </text>
                <text x={x + barWidth / 2} y={y - 4} textAnchor="middle" fontSize={10} fill={color} fontFamily="var(--font-base)">
                  {d.value}
                </text>
              </>
            )}
          </g>
        )
      })}
    </svg>
  )
}

function LineChart({ data, width, height, showLabels }: { data: ChartData[]; width: number; height: number; showLabels: boolean }) {
  const max = Math.max(...data.map((d) => d.value), 1)
  const padH = 30
  const padV = 20
  const chartW = width - padH * 2
  const chartH = height - padV * 2 - 20

  const points = data.map((d, i) => {
    const x = padH + (i / Math.max(data.length - 1, 1)) * chartW
    const y = padV + (1 - d.value / max) * chartH
    return { x, y, ...d }
  })

  const polyline = points.map((p) => `${p.x},${p.y}`).join(' ')

  return (
    <svg viewBox={`0 0 ${width} ${height}`} width="100%" style={{ display: 'block' }} role="img" aria-label="Line chart">
      <polyline points={polyline} fill="none" stroke="var(--color-primary)" strokeWidth={2.5} strokeLinejoin="round" strokeLinecap="round" />
      {points.map((p, i) => (
        <g key={i}>
          <circle cx={p.x} cy={p.y} r={5} fill="var(--color-primary)" />
          <circle cx={p.x} cy={p.y} r={3} fill="var(--color-bg)" />
          {showLabels && (
            <>
              <text x={p.x} y={height - 5} textAnchor="middle" fontSize={10} fill="var(--color-gray-500)" fontFamily="var(--font-base)">{p.label}</text>
              <text x={p.x} y={p.y - 10} textAnchor="middle" fontSize={10} fill="var(--color-primary)" fontFamily="var(--font-base)">{p.value}</text>
            </>
          )}
        </g>
      ))}
    </svg>
  )
}

function DonutChart({ data, width, height, showLabels }: { data: ChartData[]; width: number; height: number; showLabels: boolean }) {
  const total = data.reduce((s, d) => s + d.value, 0) || 1
  const cx = width / 2
  const cy = height / 2 - (showLabels ? 20 : 0)
  const r = Math.min(cx, cy) - 20
  const innerR = r * 0.55

  let angle = -Math.PI / 2
  const slices = data.map((d, i) => {
    const slice = (d.value / total) * 2 * Math.PI
    const startAngle = angle
    angle += slice
    const endAngle = angle
    const x1 = cx + r * Math.cos(startAngle)
    const y1 = cy + r * Math.sin(startAngle)
    const x2 = cx + r * Math.cos(endAngle)
    const y2 = cy + r * Math.sin(endAngle)
    const ix1 = cx + innerR * Math.cos(endAngle)
    const iy1 = cy + innerR * Math.sin(endAngle)
    const ix2 = cx + innerR * Math.cos(startAngle)
    const iy2 = cy + innerR * Math.sin(startAngle)
    const largeArc = slice > Math.PI ? 1 : 0
    const path = `M ${x1} ${y1} A ${r} ${r} 0 ${largeArc} 1 ${x2} ${y2} L ${ix1} ${iy1} A ${innerR} ${innerR} 0 ${largeArc} 0 ${ix2} ${iy2} Z`
    return { path, color: d.color ?? DEFAULT_COLORS[i % DEFAULT_COLORS.length], label: d.label, value: d.value }
  })

  return (
    <svg viewBox={`0 0 ${width} ${height}`} width="100%" style={{ display: 'block' }} role="img" aria-label="Donut chart">
      {slices.map((s, i) => (
        <path key={i} d={s.path} fill={s.color} opacity={0.9} />
      ))}
      {/* Legend */}
      {showLabels && (
        <g>
          {slices.map((s, i) => (
            <g key={i} transform={`translate(${10 + (i % 3) * (width / 3)}, ${height - 30 + Math.floor(i / 3) * 16})`}>
              <rect width={8} height={8} rx={2} fill={s.color} />
              <text x={12} y={8} fontSize={9} fill="var(--color-gray-500)" fontFamily="var(--font-base)">{s.label}: {s.value}</text>
            </g>
          ))}
        </g>
      )}
    </svg>
  )
}

export function Chart({
  type,
  data,
  width = 400,
  height = 250,
  title,
  showLabels = true,
  className,
}: ChartProps) {
  return (
    <div className={cn('ds-chart', className)} style={{ fontFamily: 'var(--font-base)' }}>
      {title && (
        <p style={{ margin: '0 0 0.75rem', fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-gray-300)' }}>
          {title}
        </p>
      )}
      <div style={{ width: '100%' }}>
        {type === 'bar' && <BarChart data={data} width={width} height={height} showLabels={showLabels} />}
        {type === 'line' && <LineChart data={data} width={width} height={height} showLabels={showLabels} />}
        {type === 'donut' && <DonutChart data={data} width={width} height={height} showLabels={showLabels} />}
      </div>
    </div>
  )
}
