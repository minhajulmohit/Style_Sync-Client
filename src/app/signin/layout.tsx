import type { ReactNode } from "react";
import { redirectIfAuthenticated } from "@/lib/auth-page-guard";

export default async function SignInLayout({
  children,
}: {
  children: ReactNode;
}) {
  await redirectIfAuthenticated();
  return children;
}
