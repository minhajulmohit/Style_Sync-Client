import Link from "next/link";
import { Scissors } from "lucide-react";
import { NavigationLinks } from "./navlinks";
import NavButtons from "./navbuttons";

export default function Navbar() {
  return (
    <header className="site-header">
      <nav className="site-nav" aria-label="Main navigation">
        <Link className="site-brand" href="/" aria-label="StyleSync home">
          <span className="brand-mark" aria-hidden="true">
            <Scissors size={21} strokeWidth={2.2} />
          </span>
          <span className="brand-name">
            Style<span className="gradient-text">Sync</span>
          </span>
        </Link>

        <div className="desktop-nav-links">
          <NavigationLinks />
        </div>

        <div className="desktop-nav-actions">
          <NavButtons />
        </div>

        <details className="mobile-menu">
          <summary className="mobile-menu-toggle">
            <span className="sr-only">Toggle navigation menu</span>
            <span className="menu-icon" aria-hidden="true">
              <span />
              <span />
              <span />
            </span>
          </summary>
          <div className="mobile-menu-panel">
            <div className="mobile-nav-links">
              <NavigationLinks />
            </div>
            <div className="mobile-nav-actions">
              <NavButtons />
            </div>
          </div>
        </details>
      </nav>
    </header>
  );
}
