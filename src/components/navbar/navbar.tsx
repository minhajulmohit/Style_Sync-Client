import Link from "next/link";
import { Scissors } from "lucide-react";
import { NavigationLinks } from "./navlinks";
import NavButtons from "./navbuttons";
import MobileNavMenu from "./mobile-nav-menu";

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

        <MobileNavMenu />
      </nav>
    </header>
  );
}
