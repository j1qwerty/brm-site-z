"use client";

import {
  InstagramLogo,
  YoutubeLogo,
  FacebookLogo,
  XLogo,
  LinkedinLogo,
  Gear,
} from "@phosphor-icons/react/dist/ssr";
import { useSite, type ViewKey } from "./site-context";

const FOOTER_LINKS: { heading: string; links: { label: string; view: ViewKey }[] }[] = [
  {
    heading: "Explore",
    links: [
      { label: "Home", view: "home" },
      { label: "About", view: "about" },
      { label: "Academics", view: "academics" },
      { label: "Events", view: "events" },
      { label: "Gallery", view: "gallery" },
    ],
  },
  {
    heading: "Enroll",
    links: [
      { label: "Admissions", view: "admissions" },
      { label: "Inquiry form", view: "inquiry" },
      { label: "Contact", view: "contact" },
    ],
  },
];

const SOCIAL_LINKS = [
  { label: "Instagram", href: "https://instagram.com", Icon: InstagramLogo },
  { label: "YouTube", href: "https://youtube.com", Icon: YoutubeLogo },
  { label: "Facebook", href: "https://facebook.com", Icon: FacebookLogo },
  { label: "X (Twitter)", href: "https://x.com", Icon: XLogo },
  { label: "LinkedIn", href: "https://linkedin.com", Icon: LinkedinLogo },
];

export function Footer() {
  const { setView } = useSite();
  return (
    <footer className="mt-auto bg-brand text-brand-foreground">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-16 grid gap-12 md:grid-cols-12">
        <div className="md:col-span-5 space-y-4">
          <div className="flex items-center gap-2">
            <span className="grid place-items-center h-8 w-8 rounded-full bg-brand-foreground text-brand font-bold text-sm">
              B
            </span>
            <span className="font-display font-bold text-lg">BRM International School</span>
          </div>
          <p className="text-sm text-brand-foreground/70 max-w-sm leading-relaxed">
            An independent K-10 school where curiosity, craft, and community
            shape every lesson. Established 1998.
          </p>
          <p className="text-sm text-brand-foreground/70">
            242 Linden Ridge Road<br />
            Willowbrook, OR 97XXX<br />
            <a href="tel:+15035550140" className="hover:text-amber underline-offset-4 hover:underline">
              (503) 555-0140
            </a><br />
            <a href="mailto:hello@brm-international.org" className="hover:text-amber underline-offset-4 hover:underline">
              hello@brm-international.org
            </a>
          </p>
          <ul className="flex flex-wrap gap-3 pt-2" aria-label="Social media">
            {SOCIAL_LINKS.map(({ label, href, Icon }) => (
              <li key={label}>
                <a
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${label} - opens in new tab`}
                  className="grid place-items-center h-10 w-10 rounded-full border border-brand-foreground/25 hover:border-amber hover:text-amber transition-colors"
                >
                  <Icon size={18} weight="regular" />
                </a>
              </li>
            ))}
          </ul>
        </div>

        {FOOTER_LINKS.map((group) => (
          <div key={group.heading} className="md:col-span-3">
            <h3 className="text-xs uppercase tracking-[0.16em] font-mono text-brand-foreground/60 mb-4">
              {group.heading}
            </h3>
            <ul className="space-y-2.5">
              {group.links.map((link) => (
                <li key={link.label}>
                  <button
                    type="button"
                    onClick={() => setView(link.view)}
                    className="text-sm text-brand-foreground/80 hover:text-amber transition-colors"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        ))}

        <div className="md:col-span-1 md:flex md:justify-end">
          <button
            type="button"
            onClick={() => setView("admin")}
            aria-label="Admin panel"
            title="Admin panel"
            className="grid place-items-center h-10 w-10 rounded-full border border-brand-foreground/25 hover:border-amber hover:text-amber transition-colors"
          >
            <Gear size={18} weight="regular" />
          </button>
        </div>
      </div>

      <div className="border-t border-brand-foreground/15">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 py-6 flex flex-col sm:flex-row gap-3 justify-between text-xs text-brand-foreground/60">
          <span>© {new Date().getFullYear()} BRM International School. All rights reserved.</span>
          <span>Independent school, est. 1998.</span>
        </div>
      </div>
    </footer>
  );
}
