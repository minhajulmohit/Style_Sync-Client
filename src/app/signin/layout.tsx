import type { ReactNode } from "react";
import { AuthPageGuard } from "@/lib/auth-page-guard";

export default function SignInLayout({
  children,
}: {
  children: ReactNode;
}) {
  return <AuthPageGuard>{children}</AuthPageGuard>;
}
