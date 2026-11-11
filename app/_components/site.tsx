export const phoneDisplay = "888-300-2266";
export const phoneHref = "tel:8883002266";

// Absolute paths so the links also work from /about.
export const nav: [string, string][] = [
  ["/about", "About Us"],
  ["/#practice", "Personal Injury"],
  ["/#results", "Results"],
  ["/#contact", "Contact Us"],
];

export function PhoneIcon({ size = 24 }: { size?: number }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2Z" />
    </svg>
  );
}
