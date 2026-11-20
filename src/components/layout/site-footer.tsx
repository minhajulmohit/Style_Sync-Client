import Link from "next/link";
import { Scissors } from "lucide-react";
import { FaFacebookF, FaInstagram } from "react-icons/fa";

const footerLinkClass = "nav-link !px-0 !py-1";

const quickLinks = [
  { href: "/", label: "Home" },
  { href: "/services", label: "Services" },
  { href: "/signin", label: "Sign in" },
  { href: "/signup", label: "Create account" },
];

const socialLinks = [
  {
    href: "https://www.facebook.com/",
    label: "Facebook",
    icon: FaFacebookF,
    iconClass: "bg-[#1877f2]",
  },
  {
    href: "https://www.instagram.com/",
    label: "Instagram",
    icon: FaInstagram,
    iconClass: "bg-gradient-to-tr from-[#feda75] via-[#d62976] to-[#4f5bd5]",
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
          <p className={footerLinkClass}>Tejgaon, Dhaka, Bangladesh</p>
          <a className={footerLinkClass} href="tel:+8801234567890">
            +880 1234-567890
          </a>
          <a
            className={footerLinkClass}
            href="mailto:info@stylesync.com"
          >
            info@stylesync.com
          </a>
        </section>

        <section aria-labelledby="footer-hours-title">
          <h2
            id="footer-hours-title"
            className={`${footerLinkClass} !text-[#493943]`}
          >
            Hours &amp; social
          </h2>
          <p className={footerLinkClass}>Open 24 hours</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {socialLinks.map(({ href, label, icon: Icon, iconClass }) => (
              <a
                key={label}
                className="nav-link !px-3 !py-1.5 rounded-full border border-rose-100 bg-white text-[#756a72] transition hover:-translate-y-0.5 hover:border-rose-200 hover:text-[#c65371] hover:shadow-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-400"
                href={href}
                target="_blank"
                rel="noreferrer"
                aria-label={`Visit ${label}`}
              >
                <span
                  className={`grid size-8 place-items-center rounded-full text-white ${iconClass}`}
                >
                  <Icon aria-hidden="true" className="size-4" />
                </span>
                {label}
              </a>
            ))}
          </div>
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
