'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Menu, X, LogOut, Heart, LayoutDashboard, Settings, Download, ChevronDown } from 'lucide-react';
import { useAuth } from '@/lib/store';
import { useRouter, usePathname } from 'next/navigation';

const NAV_LINKS = [
  { label: 'Agents',     href: '/agents' },
  { label: 'About',      href: '/about' },
  { label: 'Contact Us', href: '/contact' },
];

const PROPERTY_LINKS = [
  {
    label: 'For Sale',
    href: '/properties?listingType=sale',
    sub: 'Browse properties for purchase',
    icon: (
      <svg viewBox="0 0 20 20" fill="none" stroke="#4b5563" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
        <path d="M3 10L10 3l7 7v7H13v-4h-6v4H3V10z" />
      </svg>
    ),
    iconBg: 'bg-gray-100 border border-gray-200',
  },
  {
    label: 'For Rent',
    href: '/properties?listingType=rent',
    sub: 'Browse rental properties',
    icon: (
      <svg viewBox="0 0 20 20" fill="none" stroke="#6b7280" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
        <rect x="3" y="7" width="14" height="10" rx="1.5" />
        <path d="M1 7l9-5 9 5" />
        <path d="M8 17v-5h4v5" />
      </svg>
    ),
    iconBg: 'bg-gray-50 border border-gray-200',
  },
];

const SERVICE_LINKS = [
  {
    label: 'Leasing',
    href: '/services#leasing',
    sub: 'Short & long-term lease solutions',
    icon: (
      <svg viewBox="0 0 20 20" fill="none" stroke="#4b5563" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
        <path d="M4 4h12v12H4z" />
        <path d="M8 8h4M8 11h4M8 14h2" />
      </svg>
    ),
    iconBg: 'bg-gray-100 border border-gray-200',
  },
  {
    label: 'Legal Transfer',
    href: '/services#legal-transfer',
    sub: 'Secure title & ownership transfers',
    icon: (
      <svg viewBox="0 0 20 20" fill="none" stroke="#6b7280" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
        <path d="M10 2L3 7v11h14V7L10 2z" />
        <path d="M7 18v-6h6v6" />
      </svg>
    ),
    iconBg: 'bg-gray-50 border border-gray-200',
  },
  {
    label: 'Property Management',
    href: '/services#property-management',
    sub: 'Your property, expertly managed',
    icon: (
      <svg viewBox="0 0 20 20" fill="none" stroke="#4b5563" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
        <circle cx="10" cy="10" r="8" />
        <path d="M10 6v4l3 2" />
      </svg>
    ),
    iconBg: 'bg-gray-100 border border-gray-200',
  },
  {
    label: 'Investment Services',
    href: '/services#investment-services',
    sub: 'Build wealth through real estate',
    icon: (
      <svg viewBox="0 0 20 20" fill="none" stroke="#6b7280" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
        <path d="M2 14l4-4 3 3 5-6 4 4" />
        <path d="M2 18h16" />
      </svg>
    ),
    iconBg: 'bg-gray-50 border border-gray-200',
  },
  {
    label: 'Housing Loan Application',
    href: '/services#housing-loan',
    sub: 'Finance your dream home',
    icon: (
      <svg viewBox="0 0 20 20" fill="none" stroke="#4b5563" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
        <rect x="2" y="6" width="16" height="11" rx="1.5" />
        <path d="M6 6V5a4 4 0 018 0v1" />
        <path d="M10 12v2M8 12h4" />
      </svg>
    ),
    iconBg: 'bg-gray-100 border border-gray-200',
  },
  {
    label: 'Designs',
    href: '/services#designs',
    sub: 'Spaces that tell your story',
    icon: (
      <svg viewBox="0 0 20 20" fill="none" stroke="#6b7280" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
        <path d="M4 16l3-3 9-9-3-3L4 10v6z" />
        <path d="M13 3l3 3" />
      </svg>
    ),
    iconBg: 'bg-gray-50 border border-gray-200',
  },
  {
    label: 'Construction',
    href: '/services#construction',
    sub: 'Built right. Built to last.',
    icon: (
      <svg viewBox="0 0 20 20" fill="none" stroke="#4b5563" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
        <path d="M2 18h16" />
        <path d="M4 18V9l6-6 6 6v9" />
        <path d="M8 18v-5h4v5" />
      </svg>
    ),
    iconBg: 'bg-gray-100 border border-gray-200',
  },
];

export function Navbar() {
  const router   = useRouter();
  const pathname = usePathname();
  const { user, logout, loading } = useAuth();

  const [isOpen,         setIsOpen]         = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [scrolled,       setScrolled]       = useState(false);
  const [mounted,        setMounted]        = useState(false);

  const [installPrompt, setInstallPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled,   setIsInstalled]   = useState(false);

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const close = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('#user-menu-wrap')) setIsUserMenuOpen(false);
    };
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, []);

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setInstallPrompt(e as BeforeInstallPromptEvent);
    };
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  useEffect(() => {
    const handler = () => setIsInstalled(true);
    window.addEventListener('appinstalled', handler);
    return () => window.removeEventListener('appinstalled', handler);
  }, []);

  useEffect(() => {
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
    }
  }, []);

  if (pathname.startsWith('/admin')) return null;

  const handleInstall = async () => {
    if (!installPrompt) return;
    await installPrompt.prompt();
    const { outcome } = await installPrompt.userChoice;
    if (outcome === 'accepted') {
      setInstallPrompt(null);
      setIsInstalled(true);
    }
  };

  const handleLogout = async () => {
    setIsUserMenuOpen(false);
    setIsOpen(false);
    await logout();
    router.replace('/');
  };

  const dashboardHref =
    user?.role === 'admin' ? '/admin' :
    user?.role === 'agent' ? '/agent/dashboard' :
    '/';

  const isAgent            = user?.role === 'agent';
  const showInstall        = mounted && !!installPrompt && !isInstalled;
  const isPropertiesActive = pathname.startsWith('/properties');
  const isServicesActive   = pathname.startsWith('/services');

  return (
    <nav style={{ background: 'linear-gradient(135deg, #e5e7eb 0%, #d1d5db 50%, #e5e7eb 100%)' }} className={`fixed top-0 w-full z-50 transition-all duration-500 ${
      scrolled
        ? 'shadow-lg shadow-black/10 border-b border-gray-300'
        : 'backdrop-blur-md border-b border-gray-300/80'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl overflow-hidden shadow-md flex-shrink-0">
              <img
                src="/alfima.png"
                alt="Alfima"
                className="w-full h-full object-contain"
              />
            </div>
            <span className="hidden sm:inline font-bold text-lg text-gray-900 tracking-tight">
              Alfima Realty Inc.
            </span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-8">

            {/* Properties hover dropdown */}
            <div className="relative group">
              <button
                className={`flex items-center gap-1 text-sm font-semibold transition-colors relative ${
                  isPropertiesActive ? 'text-gray-900' : 'text-gray-700 hover:text-gray-900'
                }`}
              >
                Properties
                <ChevronDown className="w-3.5 h-3.5 transition-transform duration-200 group-hover:rotate-180" />
                <span className={`absolute -bottom-1 left-0 h-0.5 bg-gray-600 rounded-full transition-all duration-300 ${
                  isPropertiesActive ? 'w-full' : 'w-0 group-hover:w-full'
                }`} />
              </button>
              <div className="absolute top-full left-0 w-full h-3" />

              {/* Dropdown panel */}
              <div className="absolute left-1/2 -translate-x-1/2 top-[calc(100%+12px)] w-64
                bg-white border border-gray-200 rounded-2xl
                shadow-2xl shadow-black/10 py-2 overflow-hidden
                opacity-0 invisible -translate-y-1.5
                group-hover:opacity-100 group-hover:visible group-hover:translate-y-0
                transition-all duration-200 ease-out
                pointer-events-none group-hover:pointer-events-auto">

                {/* Arrow tip */}
                <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-white border-l border-t border-gray-200 rotate-45" />

                <div className="px-2">
                  {PROPERTY_LINKS.map(({ label, href, sub, icon, iconBg }) => (
                    <Link
                      key={href}
                      href={href}
                      className="flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-gray-100 transition-colors"
                    >
                      <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${iconBg}`}>
                        {icon}
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-gray-900">{label}</span>
                        <span className="text-xs text-gray-400">{sub}</span>
                      </div>
                    </Link>
                  ))}
                </div>

                <div className="mx-3 my-1 border-t border-gray-100" />

                <div className="px-2">
                  <Link
                    href="/properties"
                    className="flex items-center justify-center px-3 py-2 rounded-xl hover:bg-gray-100 transition-colors"
                  >
                    <span className="text-xs text-gray-400 hover:text-gray-600 transition-colors">
                      Browse all properties →
                    </span>
                  </Link>
                </div>
              </div>
            </div>

            {/* Services hover dropdown */}
            <div className="relative group">
              <button
                className={`flex items-center gap-1 text-sm font-semibold transition-colors relative ${
                  isServicesActive ? 'text-gray-900' : 'text-gray-700 hover:text-gray-900'
                }`}
              >
                Services
                <ChevronDown className="w-3.5 h-3.5 transition-transform duration-200 group-hover:rotate-180" />
                <span className={`absolute -bottom-1 left-0 h-0.5 bg-gray-600 rounded-full transition-all duration-300 ${
                  isServicesActive ? 'w-full' : 'w-0 group-hover:w-full'
                }`} />
              </button>
              <div className="absolute top-full left-0 w-full h-3" />

              {/* Dropdown panel — wider to fit 7 services */}
              <div className="absolute left-1/2 -translate-x-1/2 top-[calc(100%+12px)] w-80
                bg-white border border-gray-200 rounded-2xl
                shadow-2xl shadow-black/10 py-2 overflow-hidden
                opacity-0 invisible -translate-y-1.5
                group-hover:opacity-100 group-hover:visible group-hover:translate-y-0
                transition-all duration-200 ease-out
                pointer-events-none group-hover:pointer-events-auto">

                {/* Arrow tip */}
                <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-white border-l border-t border-gray-200 rotate-45" />

                <div className="px-2">
                  {SERVICE_LINKS.map(({ label, href, sub, icon, iconBg }) => (
                    <Link
                      key={href}
                      href={href}
                      className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-gray-100 transition-colors"
                    >
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${iconBg}`}>
                        {icon}
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-gray-900">{label}</span>
                        <span className="text-xs text-gray-400">{sub}</span>
                      </div>
                    </Link>
                  ))}
                </div>

                <div className="mx-3 my-1 border-t border-gray-100" />

                <div className="px-2">
                  <Link
                    href="/services"
                    className="flex items-center justify-center px-3 py-2 rounded-xl hover:bg-gray-100 transition-colors"
                  >
                    <span className="text-xs text-gray-400 hover:text-gray-600 transition-colors">
                      View all services →
                    </span>
                  </Link>
                </div>
              </div>
            </div>

            {/* Other nav links */}
            {NAV_LINKS.map(({ label, href }) => (
              <Link
                key={href}
                href={href}
                className={`text-sm font-semibold transition-colors relative group ${
                  pathname === href ? 'text-gray-900' : 'text-gray-700 hover:text-gray-900'
                }`}
              >
                {label}
                <span className={`absolute -bottom-1 left-0 h-0.5 bg-gray-600 rounded-full transition-all duration-300 ${
                  pathname === href ? 'w-full' : 'w-0 group-hover:w-full'
                }`} />
              </Link>
            ))}
          </div>

          {/* Right side */}
          <div className="flex items-center gap-3">
            {(!mounted || loading) && <div className="w-8 h-8 rounded-full bg-gray-200 animate-pulse" />}

            {showInstall && (
              <button
                onClick={handleInstall}
                className="hidden md:flex items-center gap-1.5 text-sm font-semibold text-gray-700 hover:text-gray-900 border border-gray-400 hover:border-gray-600 px-4 py-1.5 rounded-full transition-all hover:bg-gray-200"
              >
                <Download className="w-3.5 h-3.5" />
                Install App
              </button>
            )}

            {mounted && !loading && user ? (
              <>
                {isAgent && (
                  <Link href="/list-property" className="hidden sm:inline">
                    <button className="text-sm font-bold text-gray-700 hover:text-gray-900 border border-gray-400 hover:border-gray-600 px-4 py-1.5 rounded-full transition-all hover:bg-gray-200">
                      + List Property
                    </button>
                  </Link>
                )}

                <div className="relative" id="user-menu-wrap">
                  <button
                    onClick={() => setIsUserMenuOpen(o => !o)}
                    className="flex items-center gap-2 hover:opacity-80 transition"
                  >
                    {user.avatar
                      ? <img src={user.avatar} alt={user.name} className="w-8 h-8 rounded-full ring-2 ring-gray-200 object-cover" />
                      : <div className="w-8 h-8 rounded-full ring-2 ring-gray-300 bg-gray-500 flex items-center justify-center text-white text-sm font-bold">
                          {user.name.charAt(0).toUpperCase()}
                        </div>
                    }
                    <span className="hidden sm:inline text-sm font-medium text-gray-800">{user.name.split(' ')[0]}</span>
                  </button>

                  {isUserMenuOpen && (
                    <div className="absolute right-0 mt-2 w-52 bg-white border border-gray-200 rounded-2xl shadow-2xl shadow-black/20 py-2 overflow-hidden">
                      <div className="px-4 py-3 border-b border-gray-200">
                        <p className="text-sm font-semibold text-gray-900 truncate">{user.name}</p>
                        <p className="text-xs text-gray-400 truncate">{user.email}</p>
                        <span className="inline-block mt-1 text-xs font-medium px-2 py-0.5 rounded-full bg-gray-100 text-gray-500 capitalize">{user.role}</span>
                      </div>
                      <Link href={dashboardHref} onClick={() => setIsUserMenuOpen(false)}
                        className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition">
                        <LayoutDashboard className="w-4 h-4" /> Dashboard
                      </Link>
                      <Link href="/settings" onClick={() => setIsUserMenuOpen(false)}
                        className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition">
                        <Settings className="w-4 h-4" /> Settings
                      </Link>
                      {user.role === 'buyer' && (
                        <Link href="/favorites" onClick={() => setIsUserMenuOpen(false)}
                          className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition">
                          <Heart className="w-4 h-4" /> Favorites
                        </Link>
                      )}
                      <div className="mx-3 my-1 border-t border-gray-200" />
                      <button onClick={handleLogout}
                        className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-600 hover:text-red-700 hover:bg-red-50 transition">
                        <LogOut className="w-4 h-4" /> Logout
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : mounted && !loading && (
              <div className="hidden md:flex items-center gap-3">
                <Link href="/login">
                  <button className="text-sm font-semibold text-gray-700 hover:text-gray-900 transition px-3 py-1.5">
                    Login
                  </button>
                </Link>
                <Link href="/register">
                  <button className="text-sm font-bold text-white bg-gray-700 hover:bg-gray-600 px-5 py-2 rounded-full transition-all shadow-lg shadow-gray-900/20 border border-gray-600/30">
                    Sign Up
                  </button>
                </Link>
              </div>
            )}

            {/* Hamburger */}
            <button
              onClick={() => setIsOpen(o => !o)}
              className="md:hidden w-9 h-9 flex items-center justify-center rounded-full border border-gray-300 hover:border-gray-400 bg-white hover:bg-gray-100 transition-all duration-200 text-gray-800"
            >
              {isOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {isOpen && (
          <div className="md:hidden border-t border-gray-200 py-4 space-y-1 bg-white/60 -mx-4 px-4">

            {/* Mobile Properties section */}
            <div className="px-4 pt-1 pb-2">
              <p className="text-[10px] font-bold tracking-widest uppercase text-gray-400 mb-2">
                Properties
              </p>
              {PROPERTY_LINKS.map(({ label, href, icon }) => (
                <Link
                  key={href}
                  href={href}
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-3 px-2 py-2.5 rounded-xl hover:bg-gray-50 transition"
                >
                  <span>{icon}</span>
                  <span className="text-sm font-semibold text-gray-800">{label}</span>
                </Link>
              ))}
              <Link
                href="/properties"
                onClick={() => setIsOpen(false)}
                className="block px-2 py-2 text-xs text-gray-400 hover:text-gray-600 transition"
              >
                Browse all →
              </Link>
            </div>

            <div className="mx-4 border-t border-gray-100" />

            {/* Mobile Services section */}
            <div className="px-4 pt-2 pb-2">
              <p className="text-[10px] font-bold tracking-widest uppercase text-gray-400 mb-2">
                Services
              </p>
              {SERVICE_LINKS.map(({ label, href, icon }) => (
                <Link
                  key={href}
                  href={href}
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-3 px-2 py-2.5 rounded-xl hover:bg-gray-50 transition"
                >
                  <span>{icon}</span>
                  <span className="text-sm font-semibold text-gray-800">{label}</span>
                </Link>
              ))}
              <Link
                href="/services"
                onClick={() => setIsOpen(false)}
                className="block px-2 py-2 text-xs text-gray-400 hover:text-gray-600 transition"
              >
                View all →
              </Link>
            </div>

            <div className="mx-4 border-t border-gray-100" />

            {NAV_LINKS.map(({ label, href }) => (
              <Link
                key={href}
                href={href}
                onClick={() => setIsOpen(false)}
                className={`block px-4 py-2.5 rounded-xl transition font-medium ${
                  pathname === href
                    ? 'text-gray-900 bg-gray-100'
                    : 'text-gray-800 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                {label}
              </Link>
            ))}

            <div className="pt-2 border-t border-gray-100 mt-2">
              {user ? (
                <>
                  {isAgent && (
                    <Link href="/list-property" onClick={() => setIsOpen(false)}
                      className="block px-4 py-2.5 text-gray-800 hover:text-gray-900 hover:bg-gray-50 rounded-xl transition font-medium">
                      + List Property
                    </Link>
                  )}
                  <Link href={dashboardHref} onClick={() => setIsOpen(false)}
                    className="block px-4 py-2.5 text-gray-800 hover:text-gray-900 hover:bg-gray-50 rounded-xl transition font-medium">
                    Dashboard
                  </Link>
                  <button onClick={handleLogout}
                    className="w-full text-left px-4 py-2.5 text-gray-500 hover:bg-gray-50 rounded-xl transition font-medium">
                    Logout
                  </button>
                </>
              ) : (
                <div className="flex flex-col gap-1">
                  <Link href="/login" onClick={() => setIsOpen(false)}
                    className="block px-4 py-2.5 text-gray-800 hover:text-gray-900 hover:bg-gray-50 rounded-xl transition font-medium">
                    Login
                  </Link>
                  <Link href="/register" onClick={() => setIsOpen(false)}
                    className="mx-4 mt-1 text-center py-2.5 text-sm font-bold text-white bg-gray-700 hover:bg-gray-600 rounded-xl transition-all shadow-lg shadow-gray-900/20">
                    Sign Up
                  </Link>
                </div>
              )}

              {showInstall && (
                <button
                  onClick={() => { handleInstall(); setIsOpen(false); }}
                  className="w-full flex items-center gap-2 px-4 py-2.5 text-gray-800 hover:text-gray-900 hover:bg-gray-50 rounded-xl transition font-medium"
                >
                  <Download className="w-4 h-4" />
                  Install App
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}

declare global {
  interface BeforeInstallPromptEvent extends Event {
    prompt(): Promise<void>;
    userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
  }
}