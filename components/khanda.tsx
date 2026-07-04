import type { SVGProps } from "react";

/**
 * The Khanda — the Sikh emblem from the funeral card: a double-edged
 * sword (khanda) flanked by two curved kirpans, encircled by the chakkar.
 * Rendered as a single-colour glyph so it can be tinted gold via `text-*`.
 */
export function Khanda({
  title = "Khanda",
  ...props
}: SVGProps<SVGSVGElement> & { title?: string }) {
  return (
    <svg
      viewBox="0 0 100 100"
      role="img"
      aria-label={title}
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      {/* Chakkar (ring) */}
      <path
        fill="none"
        stroke="currentColor"
        strokeWidth="5"
        d="M50 16a34 34 0 1 0 0 68 34 34 0 1 0 0-68Z"
      />
      {/* Central double-edged khanda blade */}
      <path d="M50 6c-3.4 3.6-5 8-5 13v46c0 4.2 1.7 7.7 5 10.6 3.3-2.9 5-6.4 5-10.6V19c0-5-1.6-9.4-5-13Zm0 12.5c1.2 1.8 1.8 3.8 1.8 6.1v40c0 2.1-.6 3.9-1.8 5.5-1.2-1.6-1.8-3.4-1.8-5.5v-40c0-2.3.6-4.3 1.8-6.1Z" />
      {/* Left kirpan */}
      <path d="M31 30c-9 8-13 18-11 30 1.8 10 8 17 18 21-7-6-10.5-13-10.5-21 0-3 .6-6 1.9-9l4.6 2.2c-1 2.2-1.5 4.5-1.5 6.8 0 6.4 3 11.8 9 16-2.2-5-3.3-9.6-3.3-14 0-11.6 5-22 14.9-31-8.6 1.2-15.6 4.2-22 9Z" />
      {/* Right kirpan (mirror) */}
      <path d="M69 30c9 8 13 18 11 30-1.8 10-8 17-18 21 7-6 10.5-13 10.5-21 0-3-.6-6-1.9-9l-4.6 2.2c1 2.2 1.5 4.5 1.5 6.8 0 6.4-3 11.8-9 16 2.2-5 3.3-9.6 3.3-14 0-11.6-5-22-14.9-31 8.6 1.2 15.6 4.2 22 9Z" />
    </svg>
  );
}
