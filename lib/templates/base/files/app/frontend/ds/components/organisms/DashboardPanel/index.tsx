import React from 'react'
import { cn } from '../../../utils/cn'
import { Chart, type ChartData } from '../../molecules/Chart'
import { StatsCard, type StatsCardProps } from '../../molecules/StatsCard'

export interface StatItem {
  title: string
  value: string | number
  icon?: React.ReactNode
  iconVariant?: StatsCardProps['iconVariant']
  trend?: StatsCardProps['trend']
  subtitle?: string
}

export interface DashboardPanelProps {
  title: string
  stats?: StatItem[]
  chart?: {
    type: 'bar' | 'line' | 'donut'
    data: ChartData[]
    title?: string
  }
  period?: string
  onPeriodChange?: (period: string) => void
  periods?: string[]
  className?: string
}

const PERIOD_OPTIONS = ['Today', '7 days', '30 days', '90 days']

export function DashboardPanel({
  title,
  stats = [],
  chart,
  period,
  onPeriodChange,
  periods = PERIOD_OPTIONS,
  className,
}: DashboardPanelProps) {
  return (
    <div
      className={cn('ds-dashboard-panel overflow-hidden', className)}
      style={{
        background: 'var(--color-surface)',
        borderRadius: 'var(--radius-xl)',
        border: '1px solid rgba(255,255,255,0.06)',
        boxShadow: 'var(--shadow-base)',
        fontFamily: 'var(--font-base)',
      }}
    >
      {/* Header */}
      <div
        className="flex items-center justify-between py-4 px-5"
        style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}
      >
        <h3
          className="m-0 text-[0.95rem] font-bold"
          style={{ color: 'var(--color-gray-100)' }}
        >
          {title}
        </h3>

        {period !== undefined && (
          <select
            data-testid="period-selector"
            value={period}
            onChange={(e) => onPeriodChange?.(e.target.value)}
            className="text-[0.78rem] px-[0.6rem] py-1 cursor-pointer outline-none"
            style={{
              background: 'rgba(255,255,255,0.06)',
              border: '1px solid rgba(255,255,255,0.12)',
              borderRadius: 'var(--radius-base)',
              color: 'var(--color-gray-400)',
              fontFamily: 'var(--font-base)',
            }}
          >
            {periods.map((p) => (
              <option key={p} value={p} style={{ background: 'var(--color-surface)' }}>
                {p}
              </option>
            ))}
          </select>
        )}
      </div>

      {/* Stats row */}
      {stats.length > 0 && (
        <div
          className="grid gap-3 py-4 px-5"
          style={{
            gridTemplateColumns: `repeat(${Math.min(stats.length, 4)}, 1fr)`,
            borderBottom: chart ? '1px solid rgba(255,255,255,0.06)' : 'none',
          }}
        >
          {stats.map((stat, i) => (
            <StatsCard
              key={i}
              title={stat.title}
              value={stat.value}
              icon={stat.icon}
              iconVariant={stat.iconVariant}
              trend={stat.trend}
              subtitle={stat.subtitle}
            />
          ))}
        </div>
      )}

      {/* Chart */}
      {chart && (
        <div className="pt-4 px-5 pb-5">
          <Chart
            type={chart.type}
            data={chart.data}
            title={chart.title}
            showLabels
            height={220}
          />
        </div>
      )}
    </div>
  )
}
