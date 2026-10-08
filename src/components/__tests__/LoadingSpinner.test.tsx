import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { LoadingSpinner, Skeleton } from '../LoadingSpinner'

describe('LoadingSpinner', () => {
  it('renders with default props', () => {
    render(<LoadingSpinner />)
    const spinner = screen.getByRole('status')
    expect(spinner).toBeInTheDocument()
    const loader = spinner.querySelector('svg')
    expect(loader).toHaveClass('animate-spin')
  })

  it('renders with small size', () => {
    render(<LoadingSpinner size="sm" />)
    const spinner = screen.getByRole('status')
    const loader = spinner.querySelector('svg')
    expect(loader).toHaveClass('h-4', 'w-4')
  })

  it('renders with large size', () => {
    render(<LoadingSpinner size="lg" />)
    const spinner = screen.getByRole('status')
    const loader = spinner.querySelector('svg')
    expect(loader).toHaveClass('h-8', 'w-8')
  })

  it('renders with custom className', () => {
    render(<LoadingSpinner className="custom-class" />)
    const spinner = screen.getByRole('status')
    expect(spinner).toHaveClass('custom-class')
  })

  it('displays loading text when provided', () => {
    render(<LoadingSpinner text="Loading data..." />)
    expect(screen.getByText('Loading data...')).toBeInTheDocument()
  })
})

describe('Skeleton', () => {
  it('renders with default props', () => {
    render(<Skeleton />)
    const skeleton = screen.getByTestId('skeleton')
    expect(skeleton).toBeInTheDocument()
    expect(skeleton).toHaveClass('animate-pulse', 'bg-muted')
  })

  it('renders with custom className', () => {
    render(<Skeleton className="h-20 w-full" />)
    const skeleton = screen.getByTestId('skeleton')
    expect(skeleton).toHaveClass('h-20', 'w-full')
  })

  it('renders with custom style', () => {
    render(<Skeleton style={{ height: '100px', width: '200px' }} />)
    const skeleton = screen.getByTestId('skeleton')
    expect(skeleton).toHaveStyle({ height: '100px', width: '200px' })
  })
})