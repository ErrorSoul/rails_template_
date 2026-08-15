import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import { Tabs } from './index'

const tabs = [
  { id: 'overview', label: 'Overview' },
  { id: 'analytics', label: 'Analytics', badge: 5 },
  { id: 'settings', label: 'Settings', disabled: true },
  { id: 'icon-tab', label: 'With Icon', icon: '🔥' },
]

describe('Tabs', () => {
  it('renders without crash', () => {
    render(<Tabs tabs={tabs} activeTab="overview" onTabChange={() => {}} />)
  })

  it('renders all tab labels', () => {
    render(<Tabs tabs={tabs} activeTab="overview" onTabChange={() => {}} />)
    expect(screen.getByText('Overview')).toBeInTheDocument()
    expect(screen.getByText('Analytics')).toBeInTheDocument()
    expect(screen.getByText('Settings')).toBeInTheDocument()
    expect(screen.getByText('With Icon')).toBeInTheDocument()
  })

  it('active tab has aria-selected="true"', () => {
    render(<Tabs tabs={tabs} activeTab="analytics" onTabChange={() => {}} />)
    const tabEls = screen.getAllByRole('tab')
    const analyticsTab = tabEls.find((el) => el.textContent?.includes('Analytics'))
    expect(analyticsTab).toHaveAttribute('aria-selected', 'true')
    const overviewTab = tabEls.find((el) => el.textContent?.includes('Overview'))
    expect(overviewTab).toHaveAttribute('aria-selected', 'false')
  })

  it('onClick calls onTabChange with correct id', async () => {
    const onTabChange = vi.fn()
    render(<Tabs tabs={tabs} activeTab="overview" onTabChange={onTabChange} />)
    const tabEls = screen.getAllByRole('tab')
    const analyticsTab = tabEls.find((el) => el.textContent?.includes('Analytics'))!
    await userEvent.click(analyticsTab)
    expect(onTabChange).toHaveBeenCalledWith('analytics')
  })

  it('disabled tab does not call onTabChange', async () => {
    const onTabChange = vi.fn()
    render(<Tabs tabs={tabs} activeTab="overview" onTabChange={onTabChange} />)
    const tabEls = screen.getAllByRole('tab')
    const settingsTab = tabEls.find((el) => el.textContent?.includes('Settings'))!
    await userEvent.click(settingsTab)
    expect(onTabChange).not.toHaveBeenCalled()
  })

  it('underline variant: active tab has bottom border with info color', () => {
    render(<Tabs tabs={tabs} activeTab="overview" onTabChange={() => {}} variant="underline" />)
    const tabEls = screen.getAllByRole('tab')
    const overviewTab = tabEls.find((el) => el.textContent?.includes('Overview'))!
    expect(overviewTab.style.borderBottom).toContain('var(--color-info)')
  })

  it('pills variant: active tab has gradient background', () => {
    render(<Tabs tabs={tabs} activeTab="overview" onTabChange={() => {}} variant="pills" />)
    const tabEls = screen.getAllByRole('tab')
    const overviewTab = tabEls.find((el) => el.textContent?.includes('Overview'))!
    expect(overviewTab.style.background).toContain('var(--gradient-info)')
  })

  it('badge is rendered when provided', () => {
    render(<Tabs tabs={tabs} activeTab="overview" onTabChange={() => {}} />)
    expect(screen.getByText('5')).toBeInTheDocument()
  })

  it('fullWidth: tabs have flex set', () => {
    render(<Tabs tabs={tabs} activeTab="overview" onTabChange={() => {}} fullWidth />)
    const tabEls = screen.getAllByRole('tab')
    tabEls.forEach((tab) => {
      // Browser normalizes flex:1 to "1 1 0%" or similar
      expect(tab.style.flex).toBeTruthy()
    })
  })

  it('custom className is applied', () => {
    render(
      <Tabs tabs={tabs} activeTab="overview" onTabChange={() => {}} className="my-custom-class" />
    )
    const tablist = screen.getByRole('tablist')
    expect(tablist.classList.contains('my-custom-class')).toBe(true)
  })
})
