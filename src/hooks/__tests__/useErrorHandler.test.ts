import { renderHook, act } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { useErrorHandler } from '../useErrorHandler'

// Mock toast
const mockToast = {
  error: vi.fn()
}

vi.mock('sonner', () => ({
  toast: mockToast
}))

describe('useErrorHandler', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockToast.error.mockClear()
  })

  it('initializes with no error state', () => {
    const { result } = renderHook(() => useErrorHandler())

    expect(result.current.error).toBe(null)
    expect(result.current.isError).toBe(false)
    expect(result.current.errorMessage).toBe('')
    expect(result.current.retryAction).toBe(null)
  })

  it('handles error correctly', () => {
    const { result } = renderHook(() => useErrorHandler())
    const testError = new Error('Test error')

    act(() => {
      result.current.handleError(testError)
    })

    expect(result.current.error).toBe(testError)
    expect(result.current.isError).toBe(true)
    expect(result.current.errorMessage).toBe('Test error')
  })

  it('handles string error correctly', () => {
    const { result } = renderHook(() => useErrorHandler())

    act(() => {
      result.current.handleError('String error message')
    })

    expect(result.current.error).toBeInstanceOf(Error)
    expect(result.current.isError).toBe(true)
    expect(result.current.errorMessage).toBe('String error message')
  })

  it('clears error state', () => {
    const { result } = renderHook(() => useErrorHandler())
    const testError = new Error('Test error')

    act(() => {
      result.current.handleError(testError)
    })

    expect(result.current.isError).toBe(true)

    act(() => {
      result.current.clearError()
    })

    expect(result.current.error).toBe(null)
    expect(result.current.isError).toBe(false)
    expect(result.current.errorMessage).toBe('')
  })

  it('shows toast when showToast option is true', () => {
    const { result } = renderHook(() => useErrorHandler())

    act(() => {
      result.current.handleError('Test error', { showToast: true })
    })

    expect(mockToast.error).toHaveBeenCalled()
  })

  it('does not show toast when showToast option is false', () => {
    const { result } = renderHook(() => useErrorHandler())

    act(() => {
      result.current.handleError('Test error', { showToast: false })
    })

    expect(mockToast.error).not.toHaveBeenCalled()
  })

  it('sets retry action correctly', () => {
    const { result } = renderHook(() => useErrorHandler())
    const retryFn = vi.fn()

    act(() => {
      result.current.handleError('Test error', { retryAction: retryFn })
    })

    expect(result.current.retryAction).toBe(retryFn)
  })

  it('can set and clear retry action manually', () => {
    const { result } = renderHook(() => useErrorHandler())
    const retryFn = vi.fn()

    act(() => {
      result.current.setRetryAction(retryFn)
    })

    expect(result.current.retryAction).toBe(retryFn)

    act(() => {
      result.current.setRetryAction(null)
    })

    expect(result.current.retryAction).toBe(null)
  })

  it('logs error when logError option is true', () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
    const { result } = renderHook(() => useErrorHandler())

    act(() => {
      result.current.handleError('Test error', { logError: true })
    })

    expect(consoleSpy).toHaveBeenCalled()
    consoleSpy.mockRestore()
  })

  it('uses custom toast title when provided', () => {
    const { result } = renderHook(() => useErrorHandler())

    act(() => {
      result.current.handleError('Test error', { 
        showToast: true, 
        toastTitle: 'Custom Error Title' 
      })
    })

    expect(mockToast.error).toHaveBeenCalledWith('Custom Error Title', expect.any(Object))
  })

  it('handles silent errors without toast', () => {
    const { result } = renderHook(() => useErrorHandler())

    act(() => {
      result.current.handleError('Test error', { silent: true })
    })

    expect(mockToast.error).not.toHaveBeenCalled()
    expect(result.current.isError).toBe(true)
  })
})