'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Facebook, Instagram, Linkedin, Phone, Mail, MapPin } from 'lucide-react';

export function Footer() {
  const pathname = usePathname();
  const currentYear = new Date().getFullYear();

  if (pathname?.startsWith('/admin')) return null;

  return (
    <footer className="relative mt-20 overflow-hidden"
      style={{ background: 'linear-gradient(160deg, #6b1a1a 0%, #7d2020 30%, #5c1515 70%, #4a1010 100%)' }}>

      {/* Top border accent */}
      <div className="absolute top-0 left-0 w-full h-px"
        style={{ background: 'linear-gradient(90deg, transparent, rgba(255,120,120,0.5), transparent)' }} />
      {/* Subtle dot texture */}
      <div className="absolute inset-0 opacity-[0.04]" style={{
        backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.8) 1px, transparent 0)',
        backgroundSize: '28px 28px',
      }} />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

        {/* ── Main grid ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">

          {/* Brand */}
          <div>
            <Link href="/" className="flex items-center gap-2.5 mb-3">
              <div className="w-9 h-9 rounded-xl overflow-hidden ring-2 ring-white/20 flex-shrink-0">
                <img src="/alfima.png" alt="Alfima Realty" className="w-full h-full object-cover" />
              </div>
              <div>
                <p className="font-black text-sm text-white">Alfima Realty Inc.</p>
                <p className="text-[10px] text-red-200/70 tracking-widest uppercase">Licensed Broker</p>
              </div>
            </Link>
            <p className="text-xs text-white/65 leading-relaxed mb-4">
              Helping Filipinos find their dream homes with integrity and expertise.
            </p>
            <div className="flex gap-2">
              {[
                { icon: <Facebook  className="w-3.5 h-3.5" />, href: '#', label: 'Facebook'  },
                { icon: <Instagram className="w-3.5 h-3.5" />, href: '#', label: 'Instagram' },
                { icon: <Linkedin  className="w-3.5 h-3.5" />, href: '#', label: 'LinkedIn'  },
              ].map(({ icon, href, label }) => (
                <a key={label} href={href} aria-label={label}
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-white/70 hover:text-white border border-white/20 hover:border-white/40 transition-all"
                  style={{ background: 'rgba(0,0,0,0.2)' }}>
                  {icon}
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs font-black text-white uppercase tracking-widest mb-4 flex items-center gap-2">
              <span className="w-4 h-0.5 bg-red-300 inline-block rounded-full" /> Links
            </h4>
            <ul className="space-y-2.5">
              {[
                { label: 'Properties',    href: '/properties'    },
                { label: 'Agents',        href: '/agents'        },
                { label: 'About Us',      href: '/about'         },
                { label: 'Contact Us',    href: '/contact'       },
                // { label: 'List Property', href: '/list-property' },
              ].map(({ label, href }) => (
                <li key={href}>
                  <Link href={href}
                    className="text-xs text-white/70 hover:text-white transition-colors hover:underline underline-offset-2">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-xs font-black text-white uppercase tracking-widest mb-4 flex items-center gap-2">
              <span className="w-4 h-0.5 bg-red-300 inline-block rounded-full" /> Contact
            </h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-3.5 h-3.5 text-red-200 flex-shrink-0 mt-0.5" />
                <span className="text-xs text-white/70 leading-relaxed">Quezon City, Metro Manila, Philippines</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-3.5 h-3.5 text-red-200 flex-shrink-0" />
                <a href="tel:+639171234567" className="text-xs text-white/70 hover:text-white transition-colors">
                  +63 917 123 4567
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-3.5 h-3.5 text-red-200 flex-shrink-0" />
                <a href="mailto:info@alfimarealtyinc.com" className="text-xs text-white/70 hover:text-white transition-colors">
                  info@alfimarealtyinc.com
                </a>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="text-xs font-black text-white uppercase tracking-widest mb-4 flex items-center gap-2">
              <span className="w-4 h-0.5 bg-red-300 inline-block rounded-full" /> Newsletter
            </h4>
            <p className="text-xs text-white/70 mb-3 leading-relaxed">
              Get the latest listings delivered to your inbox.
            </p>
            <div className="flex flex-col gap-2">
              <input
                type="email"
                placeholder="Your email address"
                className="w-full px-3 py-2.5 rounded-lg text-xs text-white placeholder-white/40 focus:outline-none border border-white/20 focus:border-white/40 transition-all"
                style={{ background: 'rgba(0,0,0,0.25)' }}
              />
              <button
                className="w-full py-2.5 rounded-lg text-white text-xs font-bold transition-all border border-white/20 hover:border-white/40 hover:opacity-90"
                style={{ background: 'linear-gradient(135deg, #c0392b, #96281b)' }}>
                Subscribe
              </button>
            </div>
            <p className="text-[10px] text-white/40 mt-2">No spam. Unsubscribe anytime.</p>
          </div>

        </div>

        {/* ── Divider ── */}
        <div className="h-px w-full mb-5 bg-white/15" />

        {/* ── Bottom bar ── */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-3 text-[11px] text-white/55">
          <p>© {currentYear} Alfima Realty Inc. All rights reserved.</p>
          <div className="flex gap-5">
            {['Terms', 'Privacy', 'Cookies'].map(item => (
              <a key={item} href="#" className="hover:text-white transition-colors">{item}</a>
            ))}
          </div>
        </div>

      </div>
    </footer>
  );
}