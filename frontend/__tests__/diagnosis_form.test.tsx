import '@testing-library/jest-dom'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import DiagnosisForm from '@/components/diagnosis/DiagnosisForm'

describe('DiagnosisForm', () => {
  it('shows error messages for required fields', async () => {
    render(<DiagnosisForm />)
    
    const submitButton = screen.getByRole('button', { name: /의뢰하기/i })
    fireEvent.click(submitButton)
    
    await waitFor(() => {
      expect(screen.getByText(/이름을 입력해주세요/i)).toBeInTheDocument()
      expect(screen.getByText(/연락처를 입력해주세요/i)).toBeInTheDocument()
      expect(screen.getByText(/주소를 입력해주세요/i)).toBeInTheDocument()
      expect(screen.getByText(/증상을 입력해주세요/i)).toBeInTheDocument()
    })
  })
})
