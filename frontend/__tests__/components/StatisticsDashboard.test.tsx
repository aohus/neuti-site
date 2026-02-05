import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import StatisticsDashboard from '@/components/home/StatisticsDashboard'

// Mock fetch
global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () =>
      Promise.resolve({
        total_count: 150,
        public_client_count: 50,
        categories: { '나무병원': 100 },
        job_categories: { '방제': 80 },
        years: { '2024': 150 },
      }),
  })
) as jest.Mock

describe('StatisticsDashboard', () => {
  it('renders stats correctly after fetching data', async () => {
    render(<StatisticsDashboard />)

    // Wait for the stats to be displayed
    await waitFor(() => {
      expect(screen.getByText('누적 시공 완료')).toBeInTheDocument()
      expect(screen.getByText('관리 수목 (주)')).toBeInTheDocument()
      expect(screen.getByText('나무의사 직접 진단')).toBeInTheDocument()
    })

    // Animation might take time, so we check if the values are starting to appear
    // Note: Localized string '150' might be '150' or '150+' depending on suffix
    expect(screen.getByText(/150/)).toBeInTheDocument()
  })
})
