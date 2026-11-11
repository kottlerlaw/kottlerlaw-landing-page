import Image from "next/image";
import Link from "next/link";
import cityPhoto from "@/app/assets/la-building.jpg";
import aaajLogo from "@/app/assets/membership-aaaj.jpg";
import caalaLogo from "@/app/assets/membership-caala.png";
import bbbLogo from "@/app/assets/membership-bbb.png";
import officePhoto from "@/app/assets/office-conference-room.jpg";
import carAccidentPhoto from "@/app/assets/practice-car-accident.jpg";
import dogBitePhoto from "@/app/assets/practice-dog-bite.jpg";
import pedestrianPhoto from "@/app/assets/practice-pedestrian-accident.jpg";
import slipFallPhoto from "@/app/assets/practice-slip-and-fall.jpg";
import truckAccidentPhoto from "@/app/assets/practice-truck-accident.jpg";
import wrongfulDeathPhoto from "@/app/assets/practice-wrongful-death.jpg";
import { LeadForm } from "./_components/LeadForm";
import { SiteHeader } from "./_components/SiteHeader";
import { SiteFooter, SiteTopBar } from "./_components/SiteFooter";
import { attorneys } from "./_components/attorneys";
import { phoneDisplay, phoneHref, PhoneIcon } from "./_components/site";

const wins = [
  { amount: "$40,500,000", type: "Insurance bad faith" },
  { amount: "$22,000,000", type: "Auto accident" },
  { amount: "$4,500,000", type: "Truck accident" },
  { amount: "$3,700,000", type: "Apartment fire" },
  { amount: "$1,900,000", type: "Auto accident" },
  { amount: "$1,451,000", type: "Drunk driver auto accident" },
  { amount: "$1,301,000", type: "Auto accident" },
  { amount: "$1,050,000", type: "Bicycle vs. auto" },
  { amount: "$1,000,000", type: "Assault" },
  { amount: "$1,000,000", type: "Premises liability" },
  { amount: "$1,000,000", type: "Rideshare passenger" },
  { amount: "$1,000,000", type: "Rideshare" },
  { amount: "$900,000", type: "Auto accident" },
  { amount: "$810,000", type: "Auto accident" },
];

// Four slots, each fading through its share of results (see .v2-flash in globals.css). Grouped so the
// $1,000,000 results don't all show at once.
const winSlots = [[0, 4, 8, 12], [1, 9, 5, 13], [2, 6, 10], [3, 11, 7]].map((slot) => slot.map((i) => wins[i]));

const reasons = [
  { t: "Dedicated", d: "We are not afraid to fight on behalf of our clients. Our winning attitude and unfailing dedication gives our clients an advantage right from the start, every time." },
  { t: "Experienced", d: "Serving California since 1968. Our experienced attorneys will advocate for your maximum recovery." },
  { t: "Trusted", d: "Most of our clients are repeat customers or are referrals from other clients." },
];

// Verbatim from the firm's Google and Yelp listings (Oct 2026). "…" marks trimmed text.
const reviewSources = [
  { name: "Google", rating: "4.2", count: 42, href: "https://www.google.com/maps/search/Kottler+%26+Kottler+6420+Wilshire+Blvd+Los+Angeles" },
  { name: "Yelp", rating: "4.5", count: 71, href: "https://www.yelp.com/search?find_desc=Kottler+%26+Kottler&find_loc=Los+Angeles%2C+CA" },
];

const reviews = [
  {
    name: "Naz N.",
    source: "Yelp",
    text: "From the very beginning, Cathy was incredibly helpful, compassionate, and attentive throughout the entire process. She always kept us informed and was available whenever we had questions. … We are extremely happy with the outcome of my mother's case, especially the settlement and the excellent job they did negotiating the medical liens.",
  },
  {
    name: "James S.",
    source: "Google",
    text: "This law firm was handling a claim for my estranged father. He unfortunately passed away during the process and this firm hired a PI who tracked me down. … For a firm to do this for a smaller payout speaks volumes about their integrity.",
  },
  {
    name: "Giannina T.",
    source: "Yelp",
    text: "Attorney Douglas Kottler also checked in with me personally from time to time, which gave me confidence that my case and well-being truly mattered to them. … I found them to be honest, knowledgeable, dedicated, and truly committed to helping people in need.",
  },
  {
    name: "Stephanie V.",
    source: "Google",
    text: "Last year I was hit while at a stop and knew that K&K was who I needed to reach out to, even with me now living in AZ. I worked with Cathy Gomez & team, they were absolutely incredible to work with. Very responsive to emails, calls and always kind and professional.",
  },
  {
    name: "Roger T.",
    source: "Yelp",
    text: "I was able to seek treatment for my medical needs without any anxiety. Throughout the process I felt that Kottler and Kottler had my best interest. … It's a relief to know you are in good hands. I had a team of attorneys on my side.",
  },
  {
    name: "Jessica M.",
    source: "Google",
    text: "So satisfied with Kottler and Kottler! They took on my case November 2024, Cathy Gomez was on top of it! Always communicating with me via phone and email! Let me know all the details and talked me through everything, answered all my questions.",
  },
];

const areas = [
  { name: "Car Accidents", photo: carAccidentPhoto },
  { name: "Truck Accidents", photo: truckAccidentPhoto },
  { name: "Pedestrian Accidents", photo: pedestrianPhoto },
  { name: "Slip & Fall", photo: slipFallPhoto },
  { name: "Wrongful Death", photo: wrongfulDeathPhoto },
  { name: "Dog Bites", photo: dogBitePhoto },
];

const steps = [
  { t: "Contact us", d: "Call us or complete the form anytime—we’re available 24/7 and ready to help. Habla Español." },
  { t: "Tell us about your case", d: "Share what happened. We’ll help you understand your options and take the next step with confidence." },
  { t: "We get to work", d: "Focus on your recovery while we handle your case and fight for the maximum recovery you deserve." },
];

const perks = [
  "No upfront fees",
  "No fee unless we win",
  "Same attorney, one-on-one",
  "Habla Español",
  "Free initial consultation",
];

export default function Home() {
  return (
    <div className="v2 min-h-screen bg-white pb-20 text-[#14213a] md:pb-0">
      <SiteTopBar />

      <SiteHeader />

      <main id="top">
        {/* HERO */}
        <section className="relative isolate bg-[#101c32] text-white">
          <Image src={cityPhoto} alt="" fill priority placeholder="blur" sizes="100vw" className="-z-20 object-cover" />
          <div className="absolute inset-0 -z-10 bg-[linear-gradient(100deg,rgba(10,20,38,.97)_0%,rgba(10,20,38,.9)_55%,rgba(10,20,38,.7)_100%)]" />
          <div className="v2-wrap grid items-center gap-12 py-14 lg:grid-cols-[1.05fr_0.95fr] lg:py-20">
            <div>
              <p className="text-[clamp(0.8rem,1.15vw,1.125rem)] font-bold tracking-[0.06em] text-[#f0cf86] uppercase lg:whitespace-nowrap">Southern California Personal Injury Attorneys · Since 1968</p>
              <h1 className="mt-6 font-serif text-[clamp(3.25rem,5.8vw,5.25rem)] leading-[1.03] font-normal">
                <span className="block">Your case.</span>
                <span className="block text-[#f0cf86] italic">Our priority.</span>
              </h1>
              <div className="mt-6 h-[3px] w-[5.25rem] bg-[#d9a441]" aria-hidden="true" />
              <p className="mt-7 max-w-xl text-[1.3rem] leading-[1.65] text-white/90">
                Family-owned since 1968. Speak one-on-one with the same experienced attorney from start to finish, and pay no fee unless we win.
              </p>
              <a href={phoneHref} className="mt-8 flex max-w-xl items-center gap-3 rounded-[3px] border border-[#f0cf86]/60 bg-white/[0.06] p-4 transition hover:bg-white/[0.12] sm:gap-6 sm:px-7 sm:py-6">
                <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-[#d9a441] text-[#101c32] sm:h-16 sm:w-16"><PhoneIcon size={26} /></span>
                <span className="min-w-0">
                  <span className="flex items-start gap-2 text-[0.8rem] leading-snug font-bold tracking-[0.08em] text-white/85 uppercase sm:text-[0.95rem]">
                    <span className="mt-[0.33em] size-2.5 shrink-0 rounded-full bg-[#2fbf6b] ring-[3px] ring-[#2fbf6b]/30" aria-hidden="true" />
                    <span><span className="block sm:inline">Free consultation</span><span className="hidden sm:inline"> · </span><span className="block sm:inline">Available 24/7</span></span>
                  </span>
                  <span className="mt-1 block font-serif text-[clamp(2.2rem,10vw,3.6rem)] leading-none whitespace-nowrap text-[#f0cf86]">{phoneDisplay}</span>
                </span>
              </a>
              <p className="mt-7 text-base text-white/80 sm:text-lg">
                <span className="block sm:inline">
                  <span className="mr-2 text-[#d9a441]" aria-hidden="true">★</span>
                  {reviewSources.toReversed().map((s, i) => (
                    <span key={s.name}>{i > 0 && " · "}<strong className="font-bold text-white">{s.rating}</strong> on {s.name} ({s.count})</span>
                  ))}
                </span>
                <span className="hidden sm:inline"> · </span>
                <span className="block sm:inline">Habla Español</span>
              </p>
            </div>
            <LeadForm id="hero-form" title="Get your free case consultation" />
          </div>
        </section>

        {/* WHY CHOOSE US */}
        <section className="bg-[#d9a441] text-[#101c32]">
          <div className="v2-wrap grid gap-10 py-14 lg:grid-cols-[1.1fr_2fr] lg:items-center">
            <div>
              <h2 className="text-[clamp(2rem,3.2vw,2.75rem)] leading-tight font-extrabold tracking-tight text-balance">Why choose Kottler &amp; Kottler?</h2>
              <p className="mt-5 text-[1.15rem] leading-[1.65] font-medium">
                In the blink of an eye, an accident caused by someone else&apos;s negligence can change your life in countless ways. How will you pay your bills? Who will cover your medical costs? What are your rights? For answers to your questions, you can turn to the experienced personal injury attorneys of Kottler &amp; Kottler.
              </p>
            </div>
            <div className="grid gap-px bg-[#101c32]/25 md:grid-cols-3">
              {reasons.map((r) => (
                <div key={r.t} className="bg-[#d9a441] p-6">
                  <h3 className="font-serif text-[2.6rem] leading-none">{r.t}</h3>
                  <p className="mt-4 text-lg leading-snug font-semibold">{r.d}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* MEMBERSHIPS */}
        <section className="border-b border-[#14213a]/15 bg-[#f6f2e9] py-8">
          <div className="v2-wrap flex flex-col items-center justify-center gap-6 sm:flex-row sm:gap-12">
            <p className="text-lg font-bold tracking-[0.1em] uppercase">Proud members of</p>
            <Image src={aaajLogo} alt="American Association for Justice" className="h-16 w-auto object-contain" />
            <Image src={caalaLogo} alt="Consumer Attorneys Association of Los Angeles" className="h-11 w-auto object-contain" />
            <Image src={bbbLogo} alt="BBB Accredited Business" className="h-20 w-auto object-contain" />
          </div>
        </section>

        {/* ABOUT */}
        <section id="about" className="scroll-mt-24 py-20 lg:py-28">
          <div className="v2-wrap grid items-center gap-14 lg:grid-cols-2">
            <div className="relative aspect-[4/3] overflow-hidden rounded-sm bg-[#101c32]">
              <Image src={officePhoto} alt="Conference room at the Kottler & Kottler office overlooking Los Angeles" fill placeholder="blur" sizes="(min-width: 1024px) 50vw, 100vw" className="object-cover" />
              <div className="absolute bottom-0 left-0 bg-[#d9a441] px-5 py-4 text-[#101c32] sm:px-7 sm:py-5">
                <p className="text-base font-bold sm:text-lg">Serving Southern California since</p>
                <p className="mt-2 font-serif text-5xl leading-none">1968</p>
              </div>
            </div>
            <div>
              <p className="v2-eyebrow">Boutique, family-owned law firm</p>
              <h2 className="v2-h2 mt-4">Big-firm strength. Personal attention.</h2>
              <p className="v2-body mt-6">
                Kottler &amp; Kottler is a family-owned and operated personal injury firm that has always limited its practice to representing seriously injured people and their families in and around Southern California. Because we carefully select our cases, you get one-on-one communication with the same attorney, every step of the way.
              </p>
              <p className="v2-body mt-5">
                Attorneys Douglas E. Kottler and Shari S. Daneshrad are well respected in legal circles, and the Kottlers have appeared on national programs such as &ldquo;The Today Show.&rdquo; Most of our clients are repeat clients or referrals from other clients, and we prepare every case to its maximum potential.
              </p>
              <div className="mt-9 flex flex-col gap-4 sm:flex-row sm:flex-wrap">
                <a href="#contact" className="v2-btn v2-btn-navy tracking-wide whitespace-nowrap uppercase sm:grow">Free case consultation</a>
                <a href={phoneHref} className="v2-btn border-2 border-[#14213a] whitespace-nowrap sm:grow"><PhoneIcon /> {phoneDisplay}</a>
              </div>
              <Link href="/about" className="mt-7 inline-flex min-h-11 items-center gap-2 text-lg font-bold underline decoration-[#d9a441] decoration-2 underline-offset-6 transition hover:decoration-[#14213a]">
                Learn more about our firm <span aria-hidden="true">→</span>
              </Link>
            </div>
          </div>
        </section>

        {/* ATTORNEYS */}
        <section id="attorneys" className="scroll-mt-24 bg-[#f6f2e9] py-20 lg:py-28">
          <div className="v2-wrap">
            <p className="v2-eyebrow">Our attorneys</p>
            <h2 className="v2-h2 mt-4 max-w-3xl">The attorneys on your case.</h2>
            <p className="v2-body mt-6 max-w-3xl">
              Because we carefully select our cases, you get one-on-one communication with the same attorney, every step of the way.
            </p>
            <div className="mt-12 grid gap-5 lg:grid-cols-3">
              {attorneys.map((a) => (
                <article key={a.slug} className="flex flex-col rounded-sm border-t-4 border-[#d9a441] bg-white p-7 shadow-sm lg:p-8">
                  <h3 className="font-serif text-[2rem] leading-tight">{a.name}</h3>
                  <p className="mt-2 text-sm font-bold tracking-[0.12em] text-[#2b3750]/80 uppercase">Attorney at law</p>
                  <p className="mt-5 text-[1.1rem] leading-[1.65] text-[#2b3750]">{a.summary}</p>
                  <h4 className="mt-6 border-t border-[#14213a]/15 pt-5 text-base font-bold tracking-wide uppercase">Education</h4>
                  <ul className="mt-3 space-y-2 text-base leading-snug text-[#2b3750]">
                    {a.education.map((item) => (
                      <li key={item} className="flex gap-3">
                        <span aria-hidden="true" className="mt-[0.45em] size-1.5 shrink-0 rounded-full bg-[#d9a441]" />
                        {item}
                      </li>
                    ))}
                  </ul>
                  <Link href={`/about#${a.slug}`} className="mt-auto inline-flex min-h-11 items-center gap-2 pt-6 text-lg font-bold text-[#14213a] underline decoration-[#d9a441] decoration-2 underline-offset-6 transition hover:decoration-[#14213a]">
                    Read full bio<span className="sr-only"> of {a.name}</span> <span aria-hidden="true">→</span>
                  </Link>
                </article>
              ))}
            </div>
            <div className="mt-12 flex justify-center">
              <Link href="/about" className="v2-btn v2-btn-navy tracking-wide uppercase">Click here to learn more about us</Link>
            </div>
          </div>
        </section>

        {/* RECENT WINS */}
        <section id="results" className="scroll-mt-24 bg-[#101c32] py-20 text-white lg:py-28">
          <div className="v2-wrap">
            <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
              <div>
                <p className="v2-eyebrow !text-[#f0cf86]">Case results</p>
                <h2 className="v2-h2 mt-4">Results for our clients.</h2>
              </div>
              <label className="v2-flash-toggle inline-flex min-h-11 w-fit cursor-pointer items-center gap-3 rounded-sm border-2 border-white/40 px-4 text-base font-bold motion-reduce:hidden">
                <input type="checkbox" id="pause-results" className="sr-only" />
                <span aria-hidden="true" className="v2-flash-icon" />
                <span className="v2-flash-pause">Pause results</span>
                <span className="v2-flash-play">Play results</span>
              </label>
            </div>
            <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {winSlots.map((slot, s) => (
                <ul key={s} className="v2-flash @container grid border-t-4 border-[#d9a441] bg-white/[0.07]">
                  {slot.map((w, i) => (
                    <li
                      key={i}
                      className={`p-7 v2-flash-${slot.length}`}
                      style={{ animationDelay: `${i * 3 - s * 0.75}s` }}
                    >
                      <p className="font-serif text-[min(3rem,calc(17cqi-0.6rem))] leading-none whitespace-nowrap text-[#f0cf86]">{w.amount}</p>
                      <p className="mt-5 text-xl font-bold tracking-wide uppercase">{w.type}</p>
                    </li>
                  ))}
                </ul>
              ))}
            </div>
            <p className="mt-8 max-w-4xl text-base leading-relaxed text-white/75">
              Prior results do not guarantee a similar outcome. Every case is different. This advertisement may contain a testimonial or endorsement which does not constitute a guarantee, warranty, or prediction regarding the outcome of your legal matter.
            </p>
          </div>
        </section>

        {/* REVIEWS */}
        <section id="reviews" className="scroll-mt-24 bg-[#f6f2e9] py-20 lg:py-28">
          <div className="v2-wrap">
            <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
              <div>
                <p className="v2-eyebrow">Client reviews</p>
                <h2 className="v2-h2 mt-4">What our clients say.</h2>
              </div>
              <div className="flex flex-wrap gap-4">
                {reviewSources.map((s) => (
                  <a key={s.name} href={s.href} target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 rounded-sm border-2 border-[#14213a] bg-white px-5 py-3 transition hover:-translate-y-px">
                    <span className="font-serif text-4xl leading-none"><span className="text-[#d9a441]" aria-hidden="true">★</span> {s.rating}</span>
                    <span className="text-base leading-snug">
                      <span className="block font-bold">{s.name} rating</span>{s.count} reviews
                    </span>
                  </a>
                ))}
              </div>
            </div>
            <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {reviews.map((r) => (
                <figure key={r.name} className="flex flex-col rounded-sm border-t-4 border-[#d9a441] bg-white p-7 shadow-sm">
                  <p className="text-xl tracking-[0.15em] text-[#d9a441]" role="img" aria-label="5 out of 5 stars">★★★★★</p>
                  <blockquote className="mt-4 flex-1 text-[1.1rem] leading-[1.65] text-[#2b3750]">&ldquo;{r.text}&rdquo;</blockquote>
                  <figcaption className="mt-6 flex items-center justify-between gap-3 border-t border-[#14213a]/15 pt-4">
                    <span className="text-lg font-bold">{r.name}</span>
                    <span className="text-sm font-semibold tracking-wide text-[#2b3750]/80 uppercase">{r.source} review</span>
                  </figcaption>
                </figure>
              ))}
            </div>
            <p className="mt-8 max-w-4xl text-base leading-relaxed text-[#2b3750]/80">
              Reviews are quoted as written on Google and Yelp; some are shortened, marked with &ldquo;…&rdquo;. Testimonials do not constitute a guarantee, warranty, or prediction regarding the outcome of your legal matter.
            </p>
          </div>
        </section>

        {/* PRACTICE AREAS */}
        <section id="practice" className="scroll-mt-24 py-20 lg:py-28">
          <div className="v2-wrap">
            <p className="v2-eyebrow">Personal injury</p>
            <h2 className="v2-h2 mt-4 max-w-3xl">How can we help you?</h2>
            <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {areas.map((a) => (
                <a key={a.name} href="#contact" className="group relative isolate flex min-h-72 flex-col justify-end overflow-hidden rounded-sm bg-[#101c32] p-7 text-white">
                  <Image
                    src={a.photo}
                    alt=""
                    fill
                    placeholder="blur"
                    sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                    className="-z-20 object-cover transition duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 -z-10 bg-[linear-gradient(180deg,rgba(16,28,50,.15)_0%,rgba(16,28,50,.55)_45%,rgba(16,28,50,.95)_90%)]" />
                  <h3 className="text-[1.9rem] leading-tight font-extrabold tracking-tight uppercase">{a.name}</h3>
                  <span className="mt-4 inline-flex w-fit items-center gap-2 border-b-2 border-[#d9a441] pb-1 text-lg font-bold text-[#f0cf86]">Get started →</span>
                </a>
              ))}
            </div>
          </div>
        </section>

        {/* PROCESS */}
        <section className="bg-[#f6f2e9] py-20 lg:py-28">
          <div className="v2-wrap">
            <p className="v2-eyebrow">Simple and stress-free</p>
            <h2 className="v2-h2 mt-4">Three easy steps to get started.</h2>
            <ol className="mt-12 grid gap-6 md:grid-cols-3">
              {steps.map((s, i) => (
                <li key={s.t} className="rounded-sm bg-white p-8 text-center shadow-sm">
                  <span className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-[#101c32] font-serif text-4xl text-[#f0cf86]">{i + 1}</span>
                  <h3 className="mt-6 text-[1.6rem] leading-snug font-extrabold uppercase">{s.t}</h3>
                  <p className="mt-3 text-[1.15rem] leading-[1.6] text-[#2b3750]">{s.d}</p>
                </li>
              ))}
            </ol>
            <div className="mt-10 flex justify-center">
              <a href="#contact" className="v2-btn v2-btn-navy w-full tracking-wide uppercase sm:w-auto sm:min-w-[24rem]">Get started</a>
            </div>
          </div>
        </section>

        {/* POST-ACCIDENT BANNER */}
        <section className="bg-[#d9a441] py-14 text-[#101c32]">
          <div className="v2-wrap">
            <h2 className="text-[clamp(2rem,4vw,3.4rem)] leading-tight font-extrabold tracking-tight uppercase">Been in an accident? Get the help you need.</h2>
            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
              {perks.map((p) => (
                <div key={p} className="flex items-center justify-center border-2 border-[#101c32] bg-white/30 p-5 text-center text-xl leading-snug font-bold">{p}</div>
              ))}
            </div>
            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              <a href={phoneHref} className="v2-btn v2-btn-navy flex-wrap !text-2xl"><PhoneIcon /> Call Kottler &amp; Kottler now <span className="whitespace-nowrap text-[#f0cf86]">{phoneDisplay}</span></a>
              <a href="#contact" className="v2-btn border-2 border-[#101c32] tracking-wide uppercase">Free case consultation</a>
            </div>
          </div>
        </section>

        {/* CONTACT */}
        <section id="contact" className="scroll-mt-24 bg-[#101c32] py-20 text-white lg:py-28">
          <div className="v2-wrap grid gap-14 lg:grid-cols-2">
            <div>
              <p className="v2-eyebrow !text-[#f0cf86]">Free consultation</p>
              <h2 className="v2-h2 mt-4">Injured? Don&apos;t wait. Call us today.</h2>
              <p className="mt-6 max-w-lg text-[1.25rem] leading-[1.65] text-white/90">
                Every day matters after an injury. Tell us what happened and we will explain your options at no cost to you. We usually respond within 1 hour, and always within 8 hours.
              </p>
              <a href={phoneHref} className="v2-btn v2-btn-gold mt-9 !text-2xl"><PhoneIcon /> {phoneDisplay}</a>
              <ul className="mt-10 grid gap-4 border-t border-white/25 pt-8 text-xl">
                {["Free initial consultation", "No fee unless we win a recovery for you", "One-on-one with the same attorney", "Available 24/7", "Habla Español"].map((t) => (
                  <li key={t} className="flex items-center gap-3"><span className="text-[#f0cf86]" aria-hidden="true">✓</span>{t}</li>
                ))}
              </ul>
              <address className="mt-10 text-[1.15rem] leading-relaxed not-italic text-white/90">
                <strong className="block text-white">Visit our Los Angeles office</strong>
                6420 Wilshire Boulevard, Penthouse<br />Los Angeles, CA 90048-5562<br />Fax: 213-387-2889
              </address>
            </div>
            <LeadForm id="contact-form" title="Get your free case consultation" />
          </div>
          <div className="v2-wrap mt-14">
            <iframe
              title="Map to the Kottler & Kottler office at 6420 Wilshire Boulevard, Los Angeles"
              src="https://www.google.com/maps?q=Kottler+%26+Kottler,+6420+Wilshire+Blvd,+Los+Angeles,+CA+90048&output=embed"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="block h-[22rem] w-full rounded-sm border-0 lg:h-[26rem]"
            />
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
