import { ReactNode } from "react";

interface ConsultationLayoutProps {
  children: ReactNode;
}

export default function ConsultationLayout({ children }: ConsultationLayoutProps) {
  return <>{children}</>;
}
