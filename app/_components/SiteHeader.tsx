"use client";

import { useEffect, useRef, useState } from "react";
import { flushSync } from "react-dom";
import Image from "next/image";
import Link from "next/link";
import logo from "@/app/assets/kottler-logo.png";
import { nav, phoneDisplay, phoneHref, PhoneIcon } from "./site";

type AttorneyLink = { slug: string; name: string };

const linkClass =
  "whitespace-nowrap text-lg font-semibold underline decoration-transparent decoration-2 underline-offset-8 transition hover:decoration-[#d9a441]";

function ChevronIcon({ open }: { open: boolean }) {
  return (
    <svg viewBox="0 0 20 20" width={18} height={18} fill="none" stroke="currentColor" strokeWidth="2.25" aria-hidden="true" className={`transition-transform duration-200 motion-reduce:transition-none group-hover:rotate-180 ${open ? "rotate-180" : ""}`}>
      <path d="m5 7.5 5 5 5-5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/** "About Us" link plus a menu of attorney names. Opens on hover, or on click/keyboard via the chevron button. */
function AboutMenu({ label, attorneys }: { label: string; attorneys: AttorneyLink[] }) {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (e: PointerEvent) => {
      if (!wrapRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        buttonRef.current?.focus();
      }
    };
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  return (
    <div
      ref={wrapRef}
      className="group relative flex items-center gap-1"
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setOpen(false);
      }}
    >
      <Link href="/about" className={linkClass}>{label}</Link>
      <button
        ref={buttonRef}
        type="button"
        className="grid h-11 w-8 place-items-center rounded-sm text-[#f0cf86] transition hover:text-white"
        aria-expanded={open}
        aria-controls="about-menu"
        aria-label={`${open ? "Hide" : "Show"} attorneys`}
        onClick={() => setOpen(!open)}
      >
        <ChevronIcon open={open} />
      </button>
      {/* pt-3 bridges the gap so the menu stays open while the pointer moves down to it. */}
      <div
        id="about-menu"
        className={`absolute top-full left-0 z-50 pt-3 transition-[opacity,translate,visibility] duration-200 ease-out motion-reduce:transition-none group-hover:visible group-hover:translate-y-0 group-hover:opacity-100 ${open ? "visible translate-y-0 opacity-100" : "invisible -translate-y-2 opacity-0"}`}
      >
        <ul className="min-w-64 rounded-sm border-t-4 border-[#d9a441] bg-[#14213a] py-2 shadow-xl">
          {attorneys.map((a) => (
            <li key={a.slug}>
              <Link
                href={`/about#${a.slug}`}
                onClick={() => setOpen(false)}
                className="block px-5 py-3 text-base font-semibold whitespace-nowrap transition hover:bg-white/10 hover:text-[#f0cf86] focus-visible:bg-white/10"
              >
                {a.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export function SiteHeader({ attorneys }: { attorneys: AttorneyLink[] }) {
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
          {nav.map(([h, l]) =>
            h === "/about" ? (
              <AboutMenu key={h} label={l} attorneys={attorneys} />
            ) : (
              <Link key={h} href={h} className={linkClass}>{l}</Link>
            ),
          )}
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
                {h === "/about" && (
                  <ul className="-mt-2 mb-4 space-y-1 border-l-2 border-[#d9a441] pl-4">
                    {attorneys.map((a) => (
                      <li key={a.slug}>
                        <Link href={`/about#${a.slug}`} onClick={closeFromLink} className="block py-2.5 text-lg text-white/85 hover:text-[#f0cf86]">{a.name}</Link>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </nav>
      </div>
    </header>
  );
}
