// Attorney bios as supplied by the client (Nov 2026). The About page shows the full text; the landing
// page shows `summary` and `credentials`. Keep the wording verbatim unless the client asks for a change.

export type Attorney = {
  slug: string;
  name: string;
  initials: string;
  /** Short line under the name, taken from the bio. */
  highlight: string;
  /** One-sentence version for the landing page card. */
  summary: string;
  bio: string[];
  education: string[];
  admissions: string[];
  memberships: string[];
};

export const attorneys: Attorney[] = [
  {
    slug: "shari-daneshrad",
    name: "Shari S. Daneshrad",
    initials: "SD",
    highlight: "Over 30 years of legal experience",
    summary:
      "A seasoned trial attorney with over 30 years of legal experience, Ms. Daneshrad has devoted the past 16 years exclusively to representing people injured by the negligence of others.",
    bio: [
      "With over 30 years of legal experience, Shari Daneshrad is a seasoned trial attorney and a fierce advocate for her clients. For the past 16 years, she has devoted her practice exclusively to representing individuals who have suffered injuries due to the negligence of others.",
      "Known for her tenacity, dedication, and unwavering commitment to achieving justice, Ms. Daneshrad approaches every case with both determination and compassion. She understands the physical, emotional, and financial toll that serious injuries can take on individuals and their families. Her clients benefit not only from her extensive legal experience and aggressive advocacy, but also from her genuine concern for their well-being and her commitment to guiding them through some of the most difficult times in their lives.",
      "Having represented both plaintiffs and defendants throughout her career, Ms. Daneshrad brings a unique perspective and strategic advantage to every case she handles.",
    ],
    education: ["J.D., Loyola Law School, 1993", "B.S. in Psychology, University of California, Los Angeles, 1989"],
    admissions: [
      "State of California",
      "U.S. District Courts for the Central, Northern and Eastern Districts of California",
    ],
    memberships: ["Consumer Attorneys Association of Los Angeles", "Beverly Hills Bar Association"],
  },
  {
    slug: "douglas-kottler",
    name: "Douglas E. Kottler",
    initials: "DK",
    highlight: "More than 35 years representing injured people",
    summary:
      "With more than 35 years of experience, Douglas Kottler represented injured individuals and built a reputation for taking on insurance companies and refusing to back down until he has achieved the best possible result for his clients.",
    bio: [
      "For more than 35 years, Douglas Kottler has dedicated his legal career exclusively to representing individuals who have suffered injuries due to the negligence of others. A fierce and relentless advocate, Mr. Kottler has built a reputation for taking on insurance companies and refusing to back down until he has achieved the best possible result for his clients.",
      "Known for his tenacity, unwavering determination, and aggressive approach to litigation, Mr. Kottler is a formidable opponent who is respected by his peers and adversaries alike. Insurance companies know that he is not intimidated by their tactics and that he will fight tirelessly to maximize the value of every case he handles.",
      "What truly distinguishes Mr. Kottler, however, is his extraordinary dedication to his clients. He believes that every client deserves personal attention, accessibility, and an attorney who will stand by them throughout the legal process. His commitment goes far beyond the traditional attorney-client relationship. Every client has his personal cell phone number, and he makes himself directly available to address their concerns and provide guidance during some of the most challenging times in their lives.",
      "Perhaps the greatest testament to Mr. Kottler’s reputation is that the majority of his clients come through referrals from former clients, as well as defense attorneys and insurance adjusters who have personally witnessed his skill, determination, and effectiveness as an advocate. These referrals reflect the trust he has earned and the respect he commands from those who have seen him in action.",
      "For Mr. Kottler, representing injured individuals is more than a profession. It is a lifelong commitment to protecting their rights, holding wrongdoers accountable, and securing the compensation they deserve, a passion that he shared with his late father, Donald Kottler.",
    ],
    education: ["J.D., Southwestern Law School, 1991", "B.A., University of California, Santa Barbara, 1988"],
    admissions: ["State of California"],
    memberships: [],
  },
  {
    slug: "robert-trujillo",
    name: "Robert Trujillo",
    initials: "RT",
    highlight: "In the legal profession since 2008",
    summary:
      "Licensed since May 2026, Mr. Trujillo brings nearly two decades of civil litigation experience, from legal support roles to certified paralegal to attorney.",
    bio: [
      "Robert Trujillo has been licensed to practice law in California since May 2026. His journey to becoming an attorney reflects nearly two decades of dedication to the legal profession. Mr. Trujillo began his legal career in 2008, gaining extensive firsthand experience in various legal roles and developing a strong foundation in case management, client communication, and civil litigation, including discovery, legal research, civil procedure, and motion practice. Through years of dedication, perseverance, and a steadfast commitment to serving clients, he earned his paralegal certification in 2017 before ultimately achieving his longstanding goal of becoming an attorney.",
      "Through his progression from legal support roles to certified paralegal and ultimately attorney, Mr. Trujillo has developed a deep understanding of the dedication, preparation, and persistence required to achieve successful results. Today, his practice focuses on advocating for plaintiffs in personal injury cases. He is committed to helping injured individuals obtain the compensation they deserve, holding negligent parties accountable, and guiding clients through every stage of the legal process with personalized attention and dedicated representation.",
      "Drawing on his extensive legal experience, education, and knowledge of the litigation process, Mr. Trujillo is dedicated to achieving the best possible outcomes for his clients while providing compassionate and effective representation.",
    ],
    education: [
      "J.D., The Santa Barbara and Ventura Colleges of Law, 2025",
      "Paralegal Certificate, Los Angeles Valley College Extension, 2017",
      "B.A. in Sociology, minor in Criminology, California State University, Northridge, 2008",
    ],
    admissions: ["State of California, May 2026"],
    memberships: [],
  },
];

/** Names and anchors only, for the header's About Us menu (keeps the bios out of the client bundle). */
export const attorneyNav = attorneys.map(({ slug, name }) => ({ slug, name }));
