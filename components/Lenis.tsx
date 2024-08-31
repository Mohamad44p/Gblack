"use client";
import { ReactLenis } from "@studio-freight/react-lenis";
interface LenisProps {
  children: React.ReactNode;
}
export function Lenis({ children }: LenisProps) {
  return <ReactLenis root>{children}</ReactLenis>;
}