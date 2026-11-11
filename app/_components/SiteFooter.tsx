import Image from "next/image";
import { cacheLife } from "next/cache";
import logo from "@/app/assets/kottler-logo.png";
import { phoneDisplay, phoneHref, PhoneIcon } from "./site";

async function CurrentYear() {
  "use cache";
  cacheLife("days");
  return new Date().getFullYear();
}

export function SiteTopBar() {
  return (
    <div className="hidden bg-[#d9a441] py-2 text-center text-base font-bold text-[#101c32] md:block">
      No fee unless we win · Free consultation · Available 24/7 · Habla Español
    </div>
  );
}

export function SiteFooter() {
  return (
    <>
      <footer className="bg-[#0a1425] py-12 text-white">
        <div className="v2-wrap flex flex-col justify-between gap-8 md:flex-row md:items-end">
          <div>
            <Image src={logo} alt="Kottler & Kottler Attorneys at Law" className="h-20 w-auto brightness-0 invert" />
            <p className="mt-5 text-lg leading-relaxed text-white/85">6420 Wilshire Boulevard, Penthouse<br />Los Angeles, CA 90048-5562<br />Fax: 213-387-2889</p>
          </div>
          <div className="md:text-right">
            <a href={phoneHref} className="font-serif text-3xl text-[#f0cf86]">{phoneDisplay}</a>
            <p className="mt-4 text-base text-white/75">© <CurrentYear /> Kottler &amp; Kottler. Attorney advertising. Prior results do not guarantee a similar outcome.</p>
          </div>
        </div>
      </footer>

      <a href={phoneHref} className="fixed right-0 bottom-0 left-0 z-50 flex min-h-[4.5rem] items-center justify-center gap-3 bg-[#d9a441] text-xl font-extrabold text-[#101c32] md:hidden">
        <PhoneIcon /> Click to call · Free consultation
      </a>
    </>
  );
}
