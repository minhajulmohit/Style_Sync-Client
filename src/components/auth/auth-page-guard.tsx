import { Suspense, type ReactNode } from "react";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";

async function AuthenticatedRedirect({
  children,
}: {
  children: ReactNode;
}) {
  const session = await auth.api.getSession({ headers: await headers() });

  if (session) {
    redirect("/dashboard");
  }

  return children;
}

export function AuthPageGuard({ children }: { children: ReactNode }) {
  return (
    <Suspense
      fallback={
        <div
          className="flex flex-1 items-center justify-center py-16 text-sm text-muted-foreground"
          aria-busy="true"
        >
          Checking your session...
        </div>
      }
    >
      <AuthenticatedRedirect>{children}</AuthenticatedRedirect>
    </Suspense>
  );
}
