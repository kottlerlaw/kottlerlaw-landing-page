import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import cityPhoto from "@/app/assets/la-building.jpg";
import officePhoto from "@/app/assets/office-conference-room.jpg";
import { LeadForm } from "../_components/LeadForm";
import { SiteHeader } from "../_components/SiteHeader";
import { SiteFooter, SiteTopBar } from "../_components/SiteFooter";
import { attorneys, type Attorney } from "../_components/attorneys";
import { phoneDisplay, phoneHref, PhoneIcon } from "../_components/site";

export const metadata: Metadata = {
  title: "About Us | Kottler & Kottler Personal Injury Attorneys",
  description:
    "Meet the attorneys of Kottler & Kottler, a family-owned Los Angeles personal injury firm serving Southern California since 1968. Free consultation. Call 888-300-2266.",
};

function CredentialList({ label, items }: { label: string; items: string[] }) {
  if (items.length === 0) return null;
  return (
    <div>
      <h4 className="text-sm font-bold tracking-[0.12em] text-[#14213a] uppercase">{label}</h4>
      <ul className="mt-3 space-y-2 text-base leading-snug text-[#2b3750]">
        {items.map((item) => (
          <li key={item} className="flex gap-3">
            <span aria-hidden="true" className="mt-[0.45em] size-1.5 shrink-0 rounded-full bg-[#d9a441]" />
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

function AttorneyProfile({ attorney: a, shaded }: { attorney: Attorney; shaded: boolean }) {
  return (
    <article id={a.slug} aria-labelledby={`${a.slug}-name`} className={`scroll-mt-24 py-16 lg:py-24 ${shaded ? "bg-[#f6f2e9]" : "bg-white"}`}>
      <div className="v2-wrap grid gap-10 lg:grid-cols-[22rem_1fr] lg:gap-16">
        <aside className="lg:sticky lg:top-32 lg:self-start">
          <div aria-hidden="true" className="grid size-20 place-items-center rounded-full bg-[#101c32] font-serif text-3xl text-[#f0cf86] ring-4 ring-[#d9a441]/40">
            {a.initials}
          </div>
          <h3 id={`${a.slug}-name`} className="mt-6 font-serif text-[clamp(2.25rem,3.6vw,3rem)] leading-[1.08]">{a.name}</h3>
          <p className="mt-2 text-sm font-bold tracking-[0.12em] text-[#2b3750]/80 uppercase">Attorney at law</p>
          <p className="mt-5 border-l-4 border-[#d9a441] pl-4 text-lg font-semibold text-[#14213a]">{a.highlight}</p>
          <div className="mt-8 space-y-6 border-t border-[#14213a]/15 pt-6">
            <CredentialList label="Education" items={a.education} />
            <CredentialList label="Admitted to practice" items={a.admissions} />
            <CredentialList label="Memberships" items={a.memberships} />
          </div>
        </aside>
        <div className="max-w-[68ch] space-y-6">
          {a.bio.map((p, i) => (
            <p key={i} className={i === 0 ? "text-[1.4rem] leading-[1.6] text-[#14213a]" : "v2-body"}>{p}</p>
          ))}
        </div>
      </div>
    </article>
  );
}

export default function AboutPage() {
  return (
    <div className="v2 min-h-screen bg-white pb-20 text-[#14213a] md:pb-0">
      <SiteTopBar />
      <SiteHeader />

      <main id="top">
        {/* HERO */}
        <section className="relative isolate bg-[#101c32] text-white">
          <Image src={cityPhoto} alt="" fill priority placeholder="blur" sizes="100vw" className="-z-20 object-cover" />
          <div className="absolute inset-0 -z-10 bg-[linear-gradient(100deg,rgba(10,20,38,.97)_0%,rgba(10,20,38,.92)_60%,rgba(10,20,38,.78)_100%)]" />
          <div className="v2-wrap py-16 lg:py-24">
            <nav aria-label="Breadcrumb">
              <ol className="flex items-center gap-2 text-base text-white/75">
                <li><Link href="/" className="underline decoration-white/40 underline-offset-4 hover:text-white">Home</Link></li>
                <li aria-hidden="true">/</li>
                <li aria-current="page" className="font-semibold text-white">About Us</li>
              </ol>
            </nav>
            <p className="mt-8 text-[clamp(0.8rem,1.15vw,1.125rem)] font-bold tracking-[0.06em] text-[#f0cf86] uppercase">About Kottler &amp; Kottler · Since 1968</p>
            <h1 className="mt-5 max-w-4xl font-serif text-[clamp(2.75rem,5.2vw,4.75rem)] leading-[1.05] font-normal">
              A family firm that fights for injured people.
            </h1>
            <p className="mt-6 max-w-2xl text-[1.25rem] leading-[1.65] text-white/90">
              Family-owned since 1968. Speak one-on-one with the same experienced attorney from start to finish, and pay no fee unless we win.
            </p>
            <ul className="mt-10 flex flex-wrap gap-3">
              {attorneys.map((a) => (
                <li key={a.slug}>
                  <a href={`#${a.slug}`} className="inline-flex min-h-11 items-center rounded-full border border-white/40 px-5 text-base font-semibold transition hover:border-[#d9a441] hover:bg-white/10">
                    {a.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* FIRM */}
        <section className="py-20 lg:py-28">
          <div className="v2-wrap grid items-center gap-14 lg:grid-cols-2">
            <div>
              <p className="v2-eyebrow">Boutique, family-owned law firm</p>
              <h2 className="v2-h2 mt-4">Big-firm strength. Personal attention.</h2>
              <p className="v2-body mt-6">
                Kottler &amp; Kottler is a family-owned and operated personal injury firm that has always limited its practice to representing seriously injured people and their families in and around Southern California. Because we carefully select our cases, you get one-on-one communication with the same attorney, every step of the way.
              </p>
              <p className="v2-body mt-5">
                Our attorneys are well respected in legal circles, and the Kottlers have appeared on national programs such as &ldquo;The Today Show.&rdquo; Most of our clients are repeat clients or referrals from other clients, and we prepare every case to its maximum potential.
              </p>
            </div>
            <div className="relative aspect-[4/3] overflow-hidden rounded-sm bg-[#101c32]">
              <Image src={officePhoto} alt="Conference room at the Kottler & Kottler office overlooking Los Angeles" fill placeholder="blur" sizes="(min-width: 1024px) 50vw, 100vw" className="object-cover" />
              <div className="absolute bottom-0 left-0 bg-[#d9a441] px-5 py-4 text-[#101c32] sm:px-7 sm:py-5">
                <p className="text-base font-bold sm:text-lg">Serving Southern California since</p>
                <p className="mt-2 font-serif text-5xl leading-none">1968</p>
              </div>
            </div>
          </div>
        </section>

        {/* ATTORNEYS */}
        <section id="attorneys" aria-labelledby="attorneys-heading" className="scroll-mt-24">
          <div className="border-t border-[#14213a]/10 bg-[#f6f2e9] pt-20 lg:pt-28">
            <div className="v2-wrap">
              <p className="v2-eyebrow">Our attorneys</p>
              <h2 id="attorneys-heading" className="v2-h2 mt-4 max-w-3xl">The attorneys on your case.</h2>
            </div>
          </div>
          {attorneys.map((a, i) => (
            <AttorneyProfile key={a.slug} attorney={a} shaded={i % 2 === 0} />
          ))}
        </section>

        {/* CONTACT */}
        <section id="contact" className="scroll-mt-24 bg-[#101c32] py-20 text-white lg:py-28">
          <div className="v2-wrap grid gap-14 lg:grid-cols-2">
            <div>
              <p className="v2-eyebrow !text-[#f0cf86]">Free consultation</p>
              <h2 className="v2-h2 mt-4">Talk to an attorney today.</h2>
              <p className="mt-6 max-w-lg text-[1.25rem] leading-[1.65] text-white/90">
                Tell us what happened and we will explain your options at no cost to you. No fee unless we win a recovery for you. Habla Español.
              </p>
              <a href={phoneHref} className="v2-btn v2-btn-gold mt-9 !text-2xl"><PhoneIcon /> {phoneDisplay}</a>
            </div>
            <LeadForm id="about-form" title="Get your free case consultation" />
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
