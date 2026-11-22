import type { ReactNode } from "react";
import SiteFooter from "@/components/layout/site-footer";
import Navbar from "@/components/navbar/navbar";

export function SiteLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <Navbar />
      {children}
      <SiteFooter />
    </>
  );
}
