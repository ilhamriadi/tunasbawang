import { MessageCircle } from 'lucide-react'
import { whatsappLink } from '@/lib/format'

function InstagramIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="size-5" aria-hidden="true">
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  )
}

function FacebookIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="size-5" aria-hidden="true">
      <path d="M14 8h3V4h-3c-2.8 0-5 2.2-5 5v2H7v4h2v7h4v-7h3l1-4h-4V9c0-.6.4-1 1-1Z" />
    </svg>
  )
}

function TiktokIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="size-5" aria-hidden="true">
      <path d="M16.5 3c.3 2.2 1.7 3.7 4 3.9v3.4a7.6 7.6 0 0 1-4-1.2v6.2A6.2 6.2 0 1 1 11 9.2v3.5a2.8 2.8 0 1 0 2 2.7V3h3.5Z" />
    </svg>
  )
}

const links = [
  { label: 'Instagram Tunas Bawang', href: 'https://instagram.com/tunasbawang', Icon: InstagramIcon },
  { label: 'Facebook Tunas Bawang', href: 'https://facebook.com/tunasbawang', Icon: FacebookIcon },
  { label: 'TikTok Tunas Bawang', href: 'https://tiktok.com/@tunasbawang', Icon: TiktokIcon },
]

export function SocialLinks() {
  return (
    <ul className="flex gap-3">
      {links.map(({ label, href, Icon }) => (
        <li key={label}>
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="flex size-11 items-center justify-center border-3 border-background bg-foreground text-background transition-colors hover:bg-accent hover:text-foreground"
          >
            <Icon />
            <span className="sr-only">{label}</span>
          </a>
        </li>
      ))}
      <li>
        <a
          href={whatsappLink('Halo Tunas Bawang!')}
          target="_blank"
          rel="noopener noreferrer"
          className="flex size-11 items-center justify-center border-3 border-background bg-primary text-primary-foreground transition-colors hover:bg-accent hover:text-foreground"
        >
          <MessageCircle className="size-5" strokeWidth={2.5} aria-hidden="true" />
          <span className="sr-only">WhatsApp Tunas Bawang</span>
        </a>
      </li>
    </ul>
  )
}
