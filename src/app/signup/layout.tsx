import type { ReactNode } from "react";
import { AuthPageGuard } from "@/components/auth/auth-page-guard";
import { SiteLayout } from "@/components/layout/site-layout";

export default function SignUpLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <SiteLayout>
      <AuthPageGuard>{children}</AuthPageGuard>
    </SiteLayout>
  );
}
