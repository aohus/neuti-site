import '@testing-library/jest-dom'
import { render, screen, fireEvent } from '@testing-library/react'
import BoardTable from '@/components/common/BoardTable'

interface TestData {
  id: number
  title: string
  author: string
}

const columns = [
  { header: 'No', key: 'id' },
  { header: '제목', key: 'title' },
  { header: '작성자', key: 'author' },
]

const data: TestData[] = [
  { id: 1, title: 'Test 1', author: 'Admin' },
  { id: 2, title: 'Test 2', author: 'User' },
]

describe('BoardTable', () => {
  it('renders table headers and data', () => {
    render(<BoardTable columns={columns} data={data} />)
    
    expect(screen.getByText('제목')).toBeInTheDocument()
    expect(screen.getByText('Test 1')).toBeInTheDocument()
    expect(screen.getByText('User')).toBeInTheDocument()
  })

  it('handles row click', () => {
    const onRowClick = jest.fn()
    render(<BoardTable columns={columns} data={data} onRowClick={onRowClick} />)
    
    fireEvent.click(screen.getByText('Test 1'))
    expect(onRowClick).toHaveBeenCalledWith(data[0])
  })

  it('shows empty message', () => {
    render(<BoardTable columns={columns} data={[]} />)
    expect(screen.getByText('게시글이 없습니다.')).toBeInTheDocument()
  })
})
