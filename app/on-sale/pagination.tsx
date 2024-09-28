'use client'

import Link from 'next/link'
import { usePathname, useSearchParams } from 'next/navigation'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function Pagination({ totalPages, currentPage }: { totalPages: number; currentPage: number }) {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const createPageURL = (pageNumber: number | string) => {
    const params = new URLSearchParams(searchParams)
    params.set('page', pageNumber.toString())
    return `${pathname}?${params.toString()}`
  }

  return (
    <div className="flex justify-center items-center space-x-6 mt-8">
      <Button
        variant="outline"
        className={`${currentPage === 1 ? 'opacity-50 cursor-not-allowed' : ''}`}
        disabled={currentPage === 1}
      >
        <Link href={createPageURL(currentPage - 1)} className="flex items-center">
          <ChevronLeft className="h-4 w-4 mr-2" />
          Previous
        </Link>
      </Button>
      <span className="text-sm font-medium">
        Page {currentPage} of {totalPages}
      </span>
      <Button
        variant="outline"
        className={`${currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : ''}`}
        disabled={currentPage === totalPages}
      >
        <Link href={createPageURL(currentPage + 1)} className="flex items-center">
          Next
          <ChevronRight className="h-4 w-4 ml-2" />
        </Link>
      </Button>
    </div>
  )
}