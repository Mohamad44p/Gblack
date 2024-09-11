import Transition from "./Transition";

export default function TransitionWrapper({ children }: {
    children: React.ReactNode
}) {
  return <Transition>{children}</Transition>;
}