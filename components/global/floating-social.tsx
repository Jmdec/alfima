'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import { Mail, Phone, X, Share2 } from 'lucide-react';

// TikTok SVG icon (not in lucide)
function TikTokIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.32 6.32 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.18 8.18 0 0 0 4.78 1.52V6.75a4.85 4.85 0 0 1-1.01-.06z" />
    </svg>
  );
}

// Facebook SVG
function FacebookIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  );
}

// Instagram SVG
function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

// WhatsApp SVG
function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z" />
    </svg>
  );
}

export function FloatingSocialWidget() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  if (pathname.startsWith('/admin')) return null;

  const socialLinks = [
    {
      icon: <FacebookIcon className="w-5 h-5" />,
      iconMobile: <FacebookIcon className="w-6 h-6" />,
      label: 'Facebook',
      href: 'https://www.facebook.com/p/Alfima-Realty-Inc-61579807227114/',
      style: { background: 'linear-gradient(135deg, #1877f2, #0d5dc7)' },
    },
    // {
    //   icon: <InstagramIcon className="w-5 h-5" />,
    //   iconMobile: <InstagramIcon className="w-6 h-6" />,
    //   label: 'Instagram',
    //   href: 'https://instagram.com/alfimarealtyinc',
    //   style: { background: 'linear-gradient(135deg, #f58529, #dd2a7b, #8134af)' },
    // },
    // {
    //   icon: <TikTokIcon className="w-5 h-5" />,
    //   iconMobile: <TikTokIcon className="w-6 h-6" />,
    //   label: 'TikTok',
    //   href: 'https://tiktok.com/@alfimarealtyinc',
    //   style: { background: 'linear-gradient(135deg, #010101, #69c9d0)' },
    // },
    {
      icon: <WhatsAppIcon className="w-5 h-5" />,
      iconMobile: <WhatsAppIcon className="w-6 h-6" />,
      label: 'WhatsApp',
      href: 'https://wa.me/639171742419',
      style: { background: 'linear-gradient(135deg, #25d366, #128c7e)' },
    },
    {
      icon: <Mail className="w-5 h-5" />,
      iconMobile: <Mail className="w-6 h-6" />,
      label: 'Email',
      href: 'mailto:ABMacalincag@alfimarealtyinc.com',
      style: { background: 'linear-gradient(135deg, #c0392b, #96281b)' },
    },
    {
      icon: <Phone className="w-5 h-5" />,
      iconMobile: <Phone className="w-6 h-6" />,
      label: 'Call Us',
      href: 'tel:+639171742419',
      style: { background: 'linear-gradient(135deg, #27ae60, #1e8449)' },
    },
  ];

  return (
    <>
      {/* ── Desktop: stacked on right edge ── */}
      <div className="hidden md:flex fixed right-0 top-1/2 -translate-y-1/2 z-40 flex-col gap-1.5">
        {socialLinks.map(({ icon, label, href, style }) => (
          <a
            key={label}
            href={href}
            target={href.startsWith('http') ? '_blank' : undefined}
            rel="noopener noreferrer"
            title={label}
            className="group flex items-center justify-end overflow-hidden rounded-l-2xl text-white shadow-lg transition-all duration-300 hover:pr-1"
            style={{
              ...style,
              width:  '44px',
              height: '44px',
            }}
          >
            <div className="flex items-center justify-center w-11 h-11 flex-shrink-0">
              {icon}
            </div>
          </a>
        ))}
      </div>

      {/* ── Mobile: FAB with expandable icons — right center ── */}
      <div className="md:hidden fixed right-0 top-1/2 -translate-y-1/2 z-40 flex flex-col items-center gap-1.5">
        {/* Toggle button — flush to right edge, pill shaped left side */}
        <button
          onClick={() => setIsOpen(o => !o)}
          className="flex items-center justify-center w-11 h-11 rounded-l-2xl text-white shadow-xl transition-all duration-300 border-l border-t border-b border-red-500/30"
          style={{ background: 'linear-gradient(135deg, #c0392b, #96281b)' }}
          aria-label={isOpen ? 'Close social menu' : 'Open social menu'}
        >
          {isOpen ? <X className="w-5 h-5" /> : <Share2 className="w-5 h-5" />}
        </button>

        {/* Expanded social icons — same pill style as desktop */}
        {isOpen && (
          <div className="flex flex-col items-end gap-1.5">
            {socialLinks.map(({ iconMobile, label, href, style }) => (
              <a
                key={label}
                href={href}
                target={href.startsWith('http') ? '_blank' : undefined}
                rel="noopener noreferrer"
                title={label}
                className="flex items-center justify-center w-11 h-11 rounded-l-2xl text-white shadow-lg transition-all duration-200"
                style={style}
              >
                {iconMobile}
              </a>
            ))}
          </div>
        )}
      </div>
    </>
  );
}