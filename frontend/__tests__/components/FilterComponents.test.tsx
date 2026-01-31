import '@testing-library/jest-dom'
import { render, screen, fireEvent } from '@testing-library/react'
import CategoryFilter from '@/components/performance/CategoryFilter'
import SearchBar from '@/components/performance/SearchBar'
import Pagination from '@/components/performance/Pagination'

describe('CategoryFilter', () => {
  it('renders categories and handles click', () => {
    const categories = ['Cat 1', 'Cat 2']
    const onSelect = jest.fn()
    render(<CategoryFilter categories={categories} selected="Cat 1" onSelect={onSelect} />)
    
    expect(screen.getByText('All')).toBeInTheDocument()
    expect(screen.getByText('Cat 1')).toBeInTheDocument()
    
    fireEvent.click(screen.getByText('Cat 2'))
    expect(onSelect).toHaveBeenCalledWith('Cat 2')
  })
})

describe('SearchBar', () => {
  it('handles input change', () => {
    const onChange = jest.fn()
    render(<SearchBar value="" onChange={onChange} />)
    
    const input = screen.getByPlaceholderText('검색어를 입력하세요')
    fireEvent.change(input, { target: { value: 'test' } })
    
    expect(onChange).toHaveBeenCalledWith('test')
  })
})

describe('Pagination', () => {
  it('renders page numbers and handles click', () => {
    const onPageChange = jest.fn()
    render(<Pagination currentPage={1} totalPages={3} onPageChange={onPageChange} />)
    
    expect(screen.getByText('1')).toBeInTheDocument()
    expect(screen.getByText('2')).toBeInTheDocument()
    
    fireEvent.click(screen.getByText('2'))
    expect(onPageChange).toHaveBeenCalledWith(2)
  })
})
