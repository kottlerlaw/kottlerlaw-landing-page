"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import logo from "@/app/assets/kottler-logo.png";
import { nav, phoneDisplay, phoneHref, PhoneIcon } from "./site";

export function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-[#101c32] text-white shadow-lg">
      <div className="v2-wrap flex min-h-24 items-center justify-between gap-4 sm:gap-6">
        <Link href="/" aria-label="Kottler and Kottler home" className="shrink-0">
          <Image src={logo} alt="Kottler & Kottler Attorneys at Law" priority className="h-12 w-auto brightness-0 invert min-[380px]:h-14 sm:h-20" />
        </Link>
        <nav className="hidden items-center gap-9 xl:flex" aria-label="Main navigation">
          {nav.map(([h, l]) => (
            <Link key={h} href={h} className="whitespace-nowrap text-lg font-semibold underline decoration-transparent decoration-2 underline-offset-8 transition hover:decoration-[#d9a441]">{l}</Link>
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
          <button type="button" className="v2-btn border-2 border-white/60 px-5 xl:hidden" onClick={() => setMenuOpen(!menuOpen)} aria-expanded={menuOpen} aria-controls="mobile-nav">
            {menuOpen ? "Close" : "Menu"}
          </button>
        </div>
      </div>
      {menuOpen && (
        <nav id="mobile-nav" className="border-t border-white/20 px-6 pb-6 xl:hidden" aria-label="Mobile navigation">
          {nav.map(([h, l]) => (
            <Link key={h} href={h} onClick={() => setMenuOpen(false)} className="block border-b border-white/15 py-5 text-xl font-semibold">{l}</Link>
          ))}
        </nav>
      )}
    </header>
  );
}
