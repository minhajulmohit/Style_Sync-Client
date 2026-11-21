"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { NavigationLinks } from "./navlinks";
import NavButtons from "./navbuttons";

function closeMenu(menu: HTMLDetailsElement | null) {
  if (!menu) return;

  menu.open = false;
  menu.querySelectorAll<HTMLDetailsElement>("details[open]").forEach((submenu) => {
    submenu.open = false;
  });
}

export default function MobileNavMenu() {
  const menuRef = useRef<HTMLDetailsElement>(null);
  const pathname = usePathname();

  useEffect(() => {
    closeMenu(menuRef.current);
  }, [pathname]);

  useEffect(() => {
    function handlePointerDown(event: PointerEvent) {
      const menu = menuRef.current;
      if (
        menu?.open &&
        event.target instanceof Node &&
        !menu.contains(event.target)
      ) {
        closeMenu(menu);
      }
    }

    document.addEventListener("pointerdown", handlePointerDown);
    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
    };
  }, []);

  return (
    <details
      className="mobile-menu"
      ref={menuRef}
      onClickCapture={(event) => {
        if (event.target instanceof Element && event.target.closest("a")) {
          closeMenu(menuRef.current);
        }
      }}
    >
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
  );
}
