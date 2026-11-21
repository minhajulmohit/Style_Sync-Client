import Link from "next/link";
import { Clock3, Mail, MapPin, Phone, Scissors } from "lucide-react";
import { FaFacebookF, FaInstagram } from "react-icons/fa";

const footerHeadingClass =
  "text-sm font-semibold tracking-wide text-[#493943]";
const footerLinkClass =
  "text-sm leading-6 text-[#756a72] transition-colors hover:text-[#c65371]";

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
    <footer className="border-t border-rose-100 bg-[#fffdfc] px-4 py-12 sm:px-7 lg:px-10">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-x-10 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
        <section className="flex flex-col items-start">
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
          <p className="mt-3 text-sm leading-6 text-[#756a72]">
            Salon bookings, made simple.
          </p>
        </section>

        <nav
          aria-label="Footer navigation"
          className="flex flex-col items-start gap-2"
        >
          <h2 className={footerHeadingClass}>Quick links</h2>
          <div className="mt-1 flex flex-col items-start gap-2">
            {quickLinks.map(({ href, label }) => (
              <Link key={href} href={href} className={footerLinkClass}>
                {label}
              </Link>
            ))}
          </div>
        </nav>

        <section
          aria-labelledby="footer-contact-title"
          className="flex flex-col items-start"
        >
          <h2 id="footer-contact-title" className={footerHeadingClass}>
            Contact
          </h2>
          <address className="mt-4 flex flex-col items-start gap-3 not-italic">
            <p className="flex items-start gap-2 text-sm leading-6 text-[#756a72]">
              <MapPin
                aria-hidden="true"
                size={16}
                className="mt-1 shrink-0 text-[#e45c78]"
              />
              <span>Tejgaon, Dhaka, Bangladesh</span>
            </p>
            <a
              className={`flex items-center gap-2 ${footerLinkClass}`}
              href="tel:+8801234567890"
            >
              <Phone
                aria-hidden="true"
                size={15}
                className="shrink-0 text-[#e45c78]"
              />
              <span>+880 1234-567890</span>
            </a>
            <a
              className={`flex items-center gap-2 ${footerLinkClass}`}
              href="mailto:info@stylesync.com"
            >
              <Mail
                aria-hidden="true"
                size={15}
                className="shrink-0 text-[#e45c78]"
              />
              <span>info@stylesync.com</span>
            </a>
          </address>
        </section>

        <section
          aria-labelledby="footer-hours-title"
          className="flex flex-col items-start"
        >
          <h2 id="footer-hours-title" className={footerHeadingClass}>
            Hours &amp; social
          </h2>
          <p className="mt-4 flex items-center gap-2 text-sm leading-6 text-[#756a72]">
            <Clock3
              aria-hidden="true"
              size={16}
              className="shrink-0 text-[#e45c78]"
            />
            <span>Open 24 hours</span>
          </p>
          <div className="mt-5 flex flex-wrap gap-2">
            {socialLinks.map(({ href, label, icon: Icon, iconClass }) => (
              <a
                key={label}
                className="inline-flex items-center gap-2 rounded-full border border-rose-100 bg-white px-2.5 py-1.5 text-sm text-[#756a72] transition hover:-translate-y-0.5 hover:border-rose-200 hover:text-[#c65371] hover:shadow-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-400"
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
      <div className="mx-auto mt-10 max-w-7xl border-t border-rose-100 pt-5">
        <p className="text-xs leading-5 text-[#8e7e86]">
          © 2026 StyleSync. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
