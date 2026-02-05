import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import MainCarousel from '../src/components/common/MainCarousel'

// Mock Next/Image
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: any) => {
    // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
    return <img {...props} />
  },
}))

describe('MainCarousel Layout', () => {
  it('has correct top padding to avoid navbar overlap', () => {
    render(<MainCarousel />)
    
    // Check for the title text to locate the component
    const title = screen.getByText(/나무는 우리 삶의 동반자/i)
    
    // Structure: Container > motion.div > h1
    // We expect the Container to have the padding classes.
    // However, Container wraps children. 
    // In MainCarousel: 
    // <Container className="...">
    //   <motion.div>
    //     <h1>...</h1>
    //   </motion.div>
    // </Container>
    
    const contentWrapper = title.parentElement // motion.div
    const container = contentWrapper?.parentElement // Container
    
    expect(container).toHaveClass('pt-16')
    expect(container).toHaveClass('md:pt-20')
  })
})
