import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { ErrorBoundary } from '../ErrorBoundary'
import { useErrorHandler } from '../../hooks/useErrorHandler'

// Mock component that throws an error
const ThrowError = ({ shouldThrow }: { shouldThrow: boolean }) => {
  if (shouldThrow) {
    throw new Error('Test error')
  }
  return <div>No error</div>
}

// Mock component to test useErrorHandler hook
const TestErrorHandler = () => {
  const { error, handleError, clearError } = useErrorHandler()
  
  return (
    <div>
      {error && <div data-testid="error-message">{error.message}</div>}
      <button onClick={() => handleError(new Error('Test hook error'))}>
        Trigger Error
      </button>
      <button onClick={clearError}>Clear Error</button>
    </div>
  )
}

describe('ErrorBoundary', () => {
  it('renders children when there is no error', () => {
    render(
      <ErrorBoundary>
        <ThrowError shouldThrow={false} />
      </ErrorBoundary>
    )
    
    expect(screen.getByText('No error')).toBeInTheDocument()
  })

  it('displays error message and retry button', () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
    
    // Set NODE_ENV to development to show error details
    const originalEnv = process.env.NODE_ENV
    process.env.NODE_ENV = 'development'
    
    render(
      <ErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    )
    
    expect(screen.getByText('Something went wrong')).toBeInTheDocument()
    expect(screen.getByText(/Test error/)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /try again/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /go home/i })).toBeInTheDocument()
    
    // Restore original NODE_ENV
    process.env.NODE_ENV = originalEnv
    consoleSpy.mockRestore()
  })

  it('resets error state when retry button is clicked', () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
    
    // Create a component that can toggle between throwing and not throwing
    let shouldThrow = true
    const ToggleErrorComponent = () => {
      if (shouldThrow) {
        throw new Error('Test error')
      }
      return <div>No error</div>
    }
    
    const { rerender } = render(
      <ErrorBoundary>
        <ToggleErrorComponent />
      </ErrorBoundary>
    )
    
    expect(screen.getByText('Something went wrong')).toBeInTheDocument()
    
    // Change the component to not throw before clicking retry
    shouldThrow = false
    
    // Click retry button - this should reset the error state and re-render children
    fireEvent.click(screen.getByRole('button', { name: /try again/i }))
    
    // The component should now render successfully
    expect(screen.getByText('No error')).toBeInTheDocument()
    
    consoleSpy.mockRestore()
  })
})

describe('useErrorHandler', () => {
  it('handles and clears errors correctly', () => {
    render(<TestErrorHandler />)
    
    // Initially no error
    expect(screen.queryByTestId('error-message')).not.toBeInTheDocument()
    
    // Trigger error
    fireEvent.click(screen.getByText('Trigger Error'))
    expect(screen.getByTestId('error-message')).toHaveTextContent('Test hook error')
    
    // Clear error
    fireEvent.click(screen.getByText('Clear Error'))
    expect(screen.queryByTestId('error-message')).not.toBeInTheDocument()
  })
})