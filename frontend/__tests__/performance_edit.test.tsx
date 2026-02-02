import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import EditPerformancePage from '@/app/performance/[id]/edit/page';
import { useRouter, useParams } from 'next/navigation';

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
  useParams: jest.fn(),
}));

// Mock fetch
global.fetch = jest.fn();

describe('EditPerformancePage', () => {
  const mockPush = jest.fn();
  const mockRefresh = jest.fn();

  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue({
      push: mockPush,
      refresh: mockRefresh,
    });
    (useParams as jest.Mock).mockReturnValue({ id: '1' });
    
    // Mock successful fetch for initial data
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({
        id: 1,
        title: 'Initial Title',
        content: '<p>Initial Content</p>',
        category: '나무병원',
        year: 2024,
      }),
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders loading state initially', async () => {
    render(<EditPerformancePage />);
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('renders form with initial data after loading', async () => {
    render(<EditPerformancePage />);
    
    await waitFor(() => {
        expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
    });

    expect(screen.getByDisplayValue('Initial Title')).toBeInTheDocument();
    expect(screen.getByDisplayValue('2024')).toBeInTheDocument();
    // Tiptap content is harder to test directly via display value, but we can check if it exists
    expect(screen.getByText('시공사례 수정')).toBeInTheDocument();
  });

  it('submits form with updated data', async () => {
    render(<EditPerformancePage />);
    
    await waitFor(() => {
        expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
    });

    const titleInput = screen.getByDisplayValue('Initial Title');
    fireEvent.change(titleInput, { target: { value: 'Updated Title' } });

    // Mock successful update response
    (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true }),
    });
    // mock alert
    window.alert = jest.fn();

    const submitButton = screen.getByText('저장');
    fireEvent.click(submitButton);

    await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledWith('/backend-api/performance/1', expect.objectContaining({
            method: 'PUT',
            body: expect.stringContaining('Updated Title'),
        }));
    });
  });
});
