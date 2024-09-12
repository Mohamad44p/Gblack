// app/components/ErrorBoundary.tsx
'use client'

import { useEffect } from 'react'

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="flex flex-col items-center justify-center min-h-[200px] bg-red-50 rounded-lg p-4">
      <h2 className="text-lg font-semibold text-red-800 mb-2">
        {error.message === 'Failed to fetch products'
          ? 'Unable to load products at this time'
          : 'Something went wrong!'}
      </h2>
      <button
        className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
        onClick={() => reset()}
      >
        Try again
      </button>
    </div>
  )
}