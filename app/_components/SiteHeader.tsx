"use client";

import { useState } from "react";
import { flushSync } from "react-dom";
import Image from "next/image";
import Link from "next/link";
import logo from "@/app/assets/kottler-logo.png";
import { nav, phoneDisplay, phoneHref, PhoneIcon } from "./site";

const linkClass =
  "whitespace-nowrap text-lg font-semibold underline decoration-transparent decoration-2 underline-offset-8 transition hover:decoration-[#d9a441]";

export function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
  // The mobile menu sits inside the sticky header, so its height pushes the page down. When a link is
  // tapped, collapse it instantly (no transition) and synchronously, so the anchor scroll that follows
  // measures the final layout instead of landing past the target while the menu animates shut.
  const [instantClose, setInstantClose] = useState(false);
  const closeFromLink = () => {
    flushSync(() => {
      setInstantClose(true);
      setMenuOpen(false);
    });
  };

  return (
    <header className="sticky top-0 z-50 bg-[#101c32] text-white shadow-lg">
      <div className="v2-wrap flex min-h-24 items-center justify-between gap-4 sm:gap-6">
        <Link href="/" aria-label="Kottler and Kottler home" className="shrink-0">
          <Image src={logo} alt="Kottler & Kottler Attorneys at Law" priority className="h-12 w-auto brightness-0 invert min-[380px]:h-14 sm:h-20" />
        </Link>
        <nav className="hidden items-center gap-9 xl:flex" aria-label="Main navigation">
          {nav.map(([h, l]) => (
            <Link key={h} href={h} className={linkClass}>{l}</Link>
          ))}
        </nav>
        <div className="flex items-center gap-5">
          <a href={phoneHref} className="hidden shrink-0 items-center gap-3 md:flex">
            <span className="grid h-12 w-12 place-items-center rounded-full bg-[#d9a441] text-[#101c32]"><PhoneIcon /></span>
            <span className="whitespace-nowrap leading-tight">
              <span className="block text-sm font-semibold text-[#f0cf86]">Free consultation</span>
              <span className="block text-2xl font-extrabold">{phoneDisplay}</span>
            </span>
          </a>
          <Link href="/#contact" className="v2-btn v2-btn-gold hidden whitespace-nowrap !text-base tracking-wide uppercase lg:inline-flex xl:hidden">Free consultation</Link>
          <button type="button" className="v2-btn border-2 border-white/60 px-5 xl:hidden" onClick={() => {
              setInstantClose(false);
              setMenuOpen(!menuOpen);
            }} aria-expanded={menuOpen} aria-controls="mobile-nav">
            {menuOpen ? "Close" : "Menu"}
          </button>
        </div>
      </div>
      {/* Always rendered so it can animate; grid rows 0fr -> 1fr animates to the content's height. inert keeps closed links out of tab order. */}
      <div
        inert={!menuOpen}
        className={`grid xl:hidden ${instantClose ? "" : "transition-[grid-template-rows] duration-300 ease-out motion-reduce:transition-none"} ${menuOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}
      >
        <nav
          id="mobile-nav"
          aria-label="Mobile navigation"
          className={`min-h-0 overflow-hidden px-6 transition-[opacity,translate] duration-300 ease-out motion-reduce:transition-none ${menuOpen ? "translate-y-0 opacity-100" : "-translate-y-2 opacity-0"}`}
        >
          <div className="border-t border-white/20 pb-6">
            {nav.map(([h, l], i) => (
              <div
                key={h}
                style={{ transitionDelay: menuOpen ? `${75 + i * 40}ms` : "0ms" }}
                className={`border-b border-white/15 transition-[opacity,translate] duration-300 ease-out motion-reduce:transition-none ${menuOpen ? "translate-y-0 opacity-100" : "-translate-y-1 opacity-0"}`}
              >
                <Link href={h} onClick={closeFromLink} className="block py-5 text-xl font-semibold">{l}</Link>
              </div>
            ))}
          </div>
        </nav>
      </div>
    </header>
  );
}
