import { ReactNode } from "react";

interface LayoutProps {
  children: ReactNode;
}

export default function DoctorLayout({ children }: LayoutProps) {
  return <>{children}</>;
}
