import dynamic from 'next/dynamic'

const PageTransition = dynamic(() => import('./Transition'), {
  ssr: false,
  loading: () => <div>Loading...</div>
})

export default function TransitionWrapper({ children }: {
    children: React.ReactNode
}) {
  return <PageTransition>{children}</PageTransition>
}