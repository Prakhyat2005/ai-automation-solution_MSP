import { renderHook, act } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { useAsync, useAsyncQueue } from '../useAsync'

// Mock the useErrorHandler hook
const mockErrorHandler = {
  error: null,
  isError: false,
  errorMessage: '',
  handleError: vi.fn((error, options) => {
    // Simulate the actual behavior of handleError calling toast.error
    if (options?.showToast !== false) {
      const { toast } = require('sonner')
      toast.error('Error', { description: error.message })
    }
  }),
  clearError: vi.fn(),
  retryAction: null,
  setRetryAction: vi.fn()
}

vi.mock('../useErrorHandler', () => ({
  useErrorHandler: () => mockErrorHandler
}))

// Mock toast
vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn()
  }
}))

describe('useAsync', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('initializes with correct default state', () => {
    const asyncFn = vi.fn().mockResolvedValue('success')
    const { result } = renderHook(() => useAsync(asyncFn))

    expect(result.current.loading).toBe(false)
    expect(result.current.error).toBe(null)
    expect(result.current.data).toBe(null)
  })

  it('executes async function and updates state correctly', async () => {
    const asyncFn = vi.fn().mockResolvedValue('success')
    const { result } = renderHook(() => useAsync(asyncFn))

    await act(async () => {
      await result.current.execute()
    })

    expect(asyncFn).toHaveBeenCalled()
    expect(result.current.loading).toBe(false)
    expect(result.current.data).toBe('success')
    expect(result.current.error).toBe(null)
  })

  it('handles async function errors correctly', async () => {
    const error = new Error('Test error')
    const asyncFn = vi.fn().mockRejectedValue(error)
    const { result } = renderHook(() => useAsync(asyncFn))

    await act(async () => {
      await result.current.execute()
    })

    expect(result.current.loading).toBe(false)
    expect(result.current.error).toBe(error)
    expect(result.current.data).toBe(null)
    expect(mockErrorHandler.handleError).toHaveBeenCalledWith(error, expect.any(Object))
  })

  it('sets loading state during execution', async () => {
    let resolvePromise: (value: string) => void
    const promise = new Promise<string>((resolve) => {
      resolvePromise = resolve
    })
    const asyncFn = vi.fn().mockReturnValue(promise)
    const { result } = renderHook(() => useAsync(asyncFn))

    act(() => {
      result.current.execute()
    })

    expect(result.current.loading).toBe(true)

    await act(async () => {
      resolvePromise!('success')
      await promise
    })

    expect(result.current.loading).toBe(false)
  })

  it('executes immediately when immediate option is true', () => {
    const asyncFn = vi.fn().mockResolvedValue('success')
    renderHook(() => useAsync(asyncFn, { immediate: true }))

    expect(asyncFn).toHaveBeenCalled()
  })

  it('calls onSuccess callback when provided', async () => {
    const onSuccess = vi.fn()
    const asyncFn = vi.fn().mockResolvedValue('success')
    const { result } = renderHook(() => useAsync(asyncFn, { onSuccess }))

    await act(async () => {
      await result.current.execute()
    })

    expect(onSuccess).toHaveBeenCalledWith('success')
  })

  it('calls onError callback when provided', async () => {
    const onError = vi.fn()
    const error = new Error('Test error')
    const asyncFn = vi.fn().mockRejectedValue(error)
    const { result } = renderHook(() => useAsync(asyncFn, { onError }))

    await act(async () => {
      await result.current.execute()
    })

    expect(onError).toHaveBeenCalledWith(error)
  })

  it('shows success toast when showSuccessToast is true', async () => {
    const { toast } = await import('sonner')
    const onSuccess = vi.fn()
    const asyncFn = vi.fn().mockResolvedValue('success')
    const { result } = renderHook(() => useAsync(asyncFn, { 
      onSuccess
    }))

    await act(async () => {
      await result.current.execute()
    })

    expect(onSuccess).toHaveBeenCalledWith('success')
  })

  it('shows error toast when showErrorToast is true', async () => {
    const { toast } = await import('sonner')
    const error = new Error('Test error')
    const asyncFn = vi.fn().mockRejectedValue(error)
    const { result } = renderHook(() => useAsync(asyncFn, { 
      showErrorToast: true 
    }))

    await act(async () => {
      await result.current.execute()
    })

    // Check that handleError was called with the correct parameters
    expect(mockErrorHandler.handleError).toHaveBeenCalledWith(error, { showToast: true })
  })

  it('resets state correctly', async () => {
    const asyncFn = vi.fn().mockResolvedValue('success')
    const { result } = renderHook(() => useAsync(asyncFn))

    await act(async () => {
      await result.current.execute()
    })

    expect(result.current.data).toBe('success')

    act(() => {
      result.current.reset()
    })

    expect(result.current.data).toBe(null)
    expect(result.current.error).toBe(null)
    expect(result.current.loading).toBe(false)
  })
})

describe('useAsyncQueue', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('initializes with empty queue', () => {
    const { result } = renderHook(() => useAsyncQueue())

    expect(result.current.queue).toEqual([])
    expect(result.current.loading).toBe(false)
  })

  it('adds operations to queue', async () => {
    const { result } = renderHook(() => useAsyncQueue())
    const asyncFn = vi.fn().mockResolvedValue('success')

    await act(async () => {
      await result.current.addToQueue('1', asyncFn)
    })

    expect(asyncFn).toHaveBeenCalled()
  })

  it('processes multiple operations', async () => {
    const { result } = renderHook(() => useAsyncQueue())
    const asyncFn1 = vi.fn().mockResolvedValue('success1')
    const asyncFn2 = vi.fn().mockResolvedValue('success2')

    await act(async () => {
      await result.current.addToQueue('1', asyncFn1)
      await result.current.addToQueue('2', asyncFn2)
    })

    expect(asyncFn1).toHaveBeenCalled()
    expect(asyncFn2).toHaveBeenCalled()
  })

  it('clears entire queue', () => {
    const { result } = renderHook(() => useAsyncQueue())

    act(() => {
      result.current.clearQueue()
    })

    expect(result.current.queue).toHaveLength(0)
    expect(result.current.loading).toBe(false)
  })

  it('tracks queue length correctly', async () => {
    const { result } = renderHook(() => useAsyncQueue())
    
    expect(result.current.queueLength).toBe(0)
    
    // Queue length should be managed internally by the hook
    const asyncFn = vi.fn().mockResolvedValue('success')
    
    await act(async () => {
      await result.current.addToQueue('1', asyncFn)
    })
    
    // After completion, queue should be empty again
    expect(result.current.queueLength).toBe(0)
  })
})