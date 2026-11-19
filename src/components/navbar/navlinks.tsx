"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navigationLinks = [
  { href: "/", label: "Home" },
  { href: "/services", label: "Browse services" },
];

export function NavigationLinks() {
  const pathname = usePathname();

  return (
    <>
      {navigationLinks.map(({ href, label }) => {
        const isActive =
          href === "/"
            ? pathname === href
            : pathname === href || pathname.startsWith(`${href}/`);

        return (
          <Link
            key={href}
            href={href}
            aria-current={isActive ? "page" : undefined}
            className={`nav-link${isActive ? " nav-link--active" : ""}`}
          >
            {label}
          </Link>
        );
      })}
    </>
  );
}