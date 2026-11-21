import type { ReactNode } from "react";
import { AuthPageGuard } from "@/components/auth/auth-page-guard";

export default function SignUpLayout({
  children,
}: {
  children: ReactNode;
}) {
  return <AuthPageGuard>{children}</AuthPageGuard>;
}
