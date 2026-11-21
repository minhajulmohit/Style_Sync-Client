"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ChevronDown, LayoutDashboard, LogOut } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { toast } from "@/components/ui/toast";
import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";

const NavButtons = () => {
  const router = useRouter();
  const pathname = usePathname();
  const { data: session, isPending } = authClient.useSession();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const accountMenuRef = useRef<HTMLDetailsElement>(null);
  const user = session?.user;
  const firstLetter = user?.name.trim().charAt(0).toUpperCase() || "U";

  useEffect(() => {
    if (accountMenuRef.current) {
      accountMenuRef.current.open = false;
    }
  }, [pathname]);

  useEffect(() => {
    function handlePointerDown(event: PointerEvent) {
      const menu = accountMenuRef.current;
      if (
        menu?.open &&
        event.target instanceof Node &&
        !menu.contains(event.target)
      ) {
        menu.open = false;
      }
    }

    document.addEventListener("pointerdown", handlePointerDown);
    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
    };
  }, []);

  const handleLogout = async () => {
    setIsLoggingOut(true);

    try {
      const { error } = await authClient.signOut();

      if (error) {
        toast.add({
          type: "error",
          title: "Could not log out",
          description: error.message,
        });
        return;
      }

      toast.add({
        type: "success",
        title: "Logged out",
        description: "You have been signed out.",
      });
      router.push("/");
      router.refresh();
    } catch (error) {
      console.error("Logout failed:", error);
      toast.add({
        type: "error",
        title: "Could not log out",
        description: "Please try again.",
      });
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <>
      {!isPending && !user && (
        <>
          <Link className="nav-sign-in" href="/signin">
            Sign in
          </Link>
          <Link className="nav-sign-up gradient-surface" href="/signup">
            Sign up
          </Link>
        </>
      )}
      {!isPending && user && (
        <details
          className="relative"
          ref={accountMenuRef}
          onClickCapture={(event) => {
            if (event.target instanceof Element && event.target.closest("a")) {
              if (accountMenuRef.current) {
                accountMenuRef.current.open = false;
              }
            }
          }}
        >
          <summary
            aria-label={`Account menu for ${user.name}`}
            className="flex cursor-pointer list-none items-center gap-1.5 rounded-full p-1 transition hover:bg-rose-50 focus-visible:outline-2 focus-visible:outline-primary [&::-webkit-details-marker]:hidden"
          >
            <span className="grid size-10 place-items-center overflow-hidden rounded-full border-2 border-white bg-rose-100 font-semibold text-primary shadow-md shadow-rose-200/70 ring-1 ring-rose-200">
              {user.image ? (
                <Image
                  src={user.image}
                  alt=""
                  width={40}
                  height={40}
                  unoptimized
                  className="size-full object-cover"
                />
              ) : (
                firstLetter
              )}
            </span>
            <ChevronDown
              aria-hidden="true"
              size={16}
              className="text-muted-foreground"
            />
          </summary>

          <div className="absolute right-0 top-full z-50 mt-2 w-64 rounded-2xl border border-rose-100 bg-white/95 p-2 shadow-xl shadow-rose-200/50 backdrop-blur-xl">
            <div className="border-b border-rose-100 px-3 py-3">
              <p className="truncate text-sm font-semibold text-foreground">
                {user.name}
              </p>
              <p className="truncate text-xs text-muted-foreground">
                {user.email}
              </p>
            </div>

            <Link
              href="/dashboard"
              className="flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-medium text-foreground transition hover:bg-rose-50 hover:text-primary"
            >
              <LayoutDashboard aria-hidden="true" size={17} />
              Dashboard
            </Link>

            <button
              type="button"
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="flex w-full items-center gap-2 rounded-xl px-3 py-2.5 text-left text-sm font-medium text-destructive transition hover:bg-rose-50 disabled:opacity-60"
            >
              <LogOut aria-hidden="true" size={17} />
              {isLoggingOut ? "Logging out..." : "Log out"}
            </button>
          </div>
        </details>
      )}
    </>
  );
};

export default NavButtons;
