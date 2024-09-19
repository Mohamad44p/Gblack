import dynamic from 'next/dynamic'
import { Skeleton } from './ui/skeleton'

const PageTransition = dynamic(() => import('./Transition'), {
  ssr: false,
  loading: () => <div>
    <Skeleton>
      <div className="h-16 bg-gray-200 rounded-md" />
      <div className="h-96 bg-gray-200 rounded-md mt-4" />
      <div className="h-16 bg-gray-200 rounded-md" />
      <div className="h-96 bg-gray-200 rounded-md mt-4" />
    </Skeleton>
  </div>
})

export default function TransitionWrapper({ children }: {
  children: React.ReactNode
}) {
  return <PageTransition>{children}</PageTransition>
}