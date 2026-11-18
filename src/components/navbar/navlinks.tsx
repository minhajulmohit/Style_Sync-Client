import Link from "next/link";

const navigationLinks = [
  { href: "/", label: "Home" },
  { href: "/services", label: "Browse services" },
];

export function NavigationLinks() {
  return (
    <>
      {navigationLinks.map(({ href, label }, index) => (
        <Link
          key={href}
          href={href}
          className={`nav-link${index === 0 ? " nav-link--active" : ""}`}
        >
          {label}
        </Link>
      ))}
    </>
  );
}