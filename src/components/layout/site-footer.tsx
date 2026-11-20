import Link from "next/link";
import { Scissors } from "lucide-react";

const footerLinkClass = "nav-link !px-0 !py-1";

const quickLinks = [
  { href: "/", label: "Home" },
  { href: "/services", label: "Services" },
  { href: "/signin", label: "Sign in" },
  { href: "/signup", label: "Create account" },
];

const socialLinks = [
  {
    href: "https://example.com/instagram",
    label: "Instagram (demo link)",
  },
  {
    href: "https://example.com/facebook",
    label: "Facebook (demo link)",
  },
];

export default function SiteFooter() {
  return (
    <footer className="border-t border-rose-100 bg-white px-4 py-10 sm:px-7 lg:px-10">
      <div className="mx-auto grid max-w-7xl gap-8 sm:grid-cols-2 lg:grid-cols-4">
        <section>
          <Link
            href="/"
            className="site-brand"
            aria-label="StyleSync home"
          >
            <span className="brand-mark" aria-hidden="true">
              <Scissors size={18} />
            </span>
            <span className="brand-name">
              Style<span className="gradient-text">Sync</span>
            </span>
          </Link>
          <p className={`${footerLinkClass} mt-3`}>
            Salon bookings, made simple.
          </p>
          <p className={`${footerLinkClass} mt-2`}>
            Sample footer details — replace before launch.
          </p>
        </section>

        <nav aria-label="Footer navigation" className="flex flex-col items-start">
          <h2 className={`${footerLinkClass} !text-[#493943]`}>Quick links</h2>
          {quickLinks.map(({ href, label }) => (
            <Link key={href} href={href} className={footerLinkClass}>
              {label}
            </Link>
          ))}
        </nav>

        <section aria-labelledby="footer-contact-title">
          <h2
            id="footer-contact-title"
            className={`${footerLinkClass} !text-[#493943]`}
          >
            Contact
          </h2>
          <p className={footerLinkClass}>Sample address, Dhaka, Bangladesh</p>
          <a className={footerLinkClass} href="tel:+880000000000">
            +880 0000-000000 (sample)
          </a>
          <a
            className={footerLinkClass}
            href="mailto:hello@stylesync.example"
          >
            hello@stylesync.example
          </a>
        </section>

        <section aria-labelledby="footer-hours-title">
          <h2
            id="footer-hours-title"
            className={`${footerLinkClass} !text-[#493943]`}
          >
            Hours &amp; social
          </h2>
          <p className={footerLinkClass}>Mon–Sat: 9:00 AM–8:00 PM (sample)</p>
          <p className={footerLinkClass}>Sunday: Closed (sample)</p>
          {socialLinks.map(({ href, label }) => (
            <a
              key={label}
              className={footerLinkClass}
              href={href}
              target="_blank"
              rel="noreferrer"
            >
              {label}
            </a>
          ))}
        </section>
      </div>
      <div className="mx-auto mt-8 max-w-7xl border-t border-rose-100 pt-4">
        <p className={footerLinkClass}>
          © 2026 StyleSync. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
