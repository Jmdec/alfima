'use client';

import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import { Menu, X, LogOut, Heart, LayoutDashboard, Settings, Download } from 'lucide-react';
import { useAuth } from '@/lib/store';
import { useRouter, usePathname } from 'next/navigation';

const NAV_LINKS = [
  { label: 'Properties', href: '/properties' },
  { label: 'Agents',     href: '/agents' },
  { label: 'About',      href: '/about' },
  { label: 'Contact Us', href: '/contact' },
];

export function Navbar() {
  const router   = useRouter();
  const pathname = usePathname();
  const { user, logout, loading } = useAuth();
  const [isOpen,         setIsOpen]         = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [scrolled,       setScrolled]       = useState(false);
  const [mounted,        setMounted]        = useState(false);

  // PWA install prompt
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

  // Capture the install prompt
  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setInstallPrompt(e as BeforeInstallPromptEvent);
    };
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  // Hide button once app is installed
  useEffect(() => {
    const handler = () => setIsInstalled(true);
    window.addEventListener('appinstalled', handler);
    return () => window.removeEventListener('appinstalled', handler);
  }, []);

  // Also hide if already running as standalone (PWA)
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

  const isAgent = user?.role === 'agent';

  // Show the install button only when prompt is available and not yet installed
  const showInstall = mounted && !!installPrompt && !isInstalled;

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-500 ${
      scrolled
        ? 'bg-gradient-to-r from-red-900/95 to-red-800/95 backdrop-blur-xl shadow-2xl shadow-black/30 border-b border-red-700/50'
        : 'bg-gradient-to-b from-black/40 to-transparent backdrop-blur-sm border-b border-white/5'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl overflow-hidden shadow-lg flex-shrink-0">
              <img src="/alfima.png" alt="Alfima" className="w-full h-full object-cover" />
            </div>
            <span className="hidden sm:inline font-bold text-lg text-white tracking-tight">
              Alfima Realty Inc.
            </span>
          </Link>

          {/* Desktop nav links */}
          <div className="hidden md:flex items-center gap-8">
            {NAV_LINKS.map(({ label, href }) => (
              <Link
                key={href}
                href={href}
                className={`text-sm font-semibold transition-colors relative group ${
                  pathname === href ? 'text-white' : 'text-white/80 hover:text-white'
                }`}
              >
                {label}
                <span className={`absolute -bottom-1 left-0 h-0.5 bg-red-400 rounded-full transition-all duration-300 ${
                  pathname === href ? 'w-full' : 'w-0 group-hover:w-full'
                }`} />
              </Link>
            ))}
          </div>

          {/* Right side */}
          <div className="flex items-center gap-3">
            {(!mounted || loading) && <div className="w-8 h-8 rounded-full bg-white/10 animate-pulse" />}

            {/* Desktop Install Button */}
            {showInstall && (
              <button
                onClick={handleInstall}
                className="hidden md:flex items-center gap-1.5 text-sm font-semibold text-white/80 hover:text-white border border-white/20 hover:border-white/40 px-4 py-1.5 rounded-full transition-all hover:bg-white/10"
              >
                <Download className="w-3.5 h-3.5" />
                Install App
              </button>
            )}

            {mounted && !loading && user ? (
              <>
                {isAgent && (
                  <Link href="/list-property" className="hidden sm:inline">
                    <button className="text-sm font-bold text-white/80 hover:text-white border border-white/20 hover:border-white/40 px-4 py-1.5 rounded-full transition-all hover:bg-white/10">
                      + List Property
                    </button>
                  </Link>
                )}

                <div className="relative" id="user-menu-wrap">
                  <button onClick={() => setIsUserMenuOpen(o => !o)} className="flex items-center gap-2 hover:opacity-80 transition">
                    {user.avatar
                      ? <img src={user.avatar} alt={user.name} className="w-8 h-8 rounded-full ring-2 ring-white/20 object-cover" />
                      : <div className="w-8 h-8 rounded-full ring-2 ring-white/20 bg-red-700 flex items-center justify-center text-white text-sm font-bold">
                          {user.name.charAt(0).toUpperCase()}
                        </div>
                    }
                    <span className="hidden sm:inline text-sm font-medium text-white">{user.name.split(' ')[0]}</span>
                  </button>

                  {isUserMenuOpen && (
                    <div className="absolute right-0 mt-2 w-52 bg-neutral-900/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl py-2 overflow-hidden">
                      <div className="px-4 py-3 border-b border-white/10">
                        <p className="text-sm font-semibold text-white truncate">{user.name}</p>
                        <p className="text-xs text-white/40 truncate">{user.email}</p>
                        <span className="inline-block mt-1 text-xs font-medium px-2 py-0.5 rounded-full bg-white/10 text-white/60 capitalize">{user.role}</span>
                      </div>
                      <Link href={dashboardHref} onClick={() => setIsUserMenuOpen(false)}
                        className="flex items-center gap-2 px-4 py-2.5 text-sm text-white/70 hover:text-white hover:bg-white/5 transition">
                        <LayoutDashboard className="w-4 h-4" /> Dashboard
                      </Link>
                      <Link href="/settings" onClick={() => setIsUserMenuOpen(false)}
                        className="flex items-center gap-2 px-4 py-2.5 text-sm text-white/70 hover:text-white hover:bg-white/5 transition">
                        <Settings className="w-4 h-4" /> Settings
                      </Link>
                      {user.role === 'buyer' && (
                        <Link href="/favorites" onClick={() => setIsUserMenuOpen(false)}
                          className="flex items-center gap-2 px-4 py-2.5 text-sm text-white/70 hover:text-white hover:bg-white/5 transition">
                          <Heart className="w-4 h-4" /> Favorites
                        </Link>
                      )}
                      <div className="mx-3 my-1 border-t border-white/10" />
                      <button onClick={handleLogout}
                        className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 transition">
                        <LogOut className="w-4 h-4" /> Logout
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : mounted && !loading && (
              /* ✅ Login/Sign Up — Desktop ONLY, hidden on mobile */
              <div className="hidden md:flex items-center gap-3">
                <Link href="/login">
                  <button className="text-sm font-semibold text-white/80 hover:text-white transition px-3 py-1.5">
                    Login
                  </button>
                </Link>
                <Link href="/register">
                  <button className="text-sm font-bold text-white bg-red-700 hover:bg-red-600 px-5 py-2 rounded-full transition-all shadow-lg shadow-red-900/40 border border-red-500/30">
                    Sign Up
                  </button>
                </Link>
              </div>
            )}

            {/* ✅ Hamburger — styled as a clean rounded button */}
            <button
              onClick={() => setIsOpen(o => !o)}
              className="md:hidden w-9 h-9 flex items-center justify-center rounded-full border border-white/25 hover:border-white/50 bg-white/5 hover:bg-white/15 transition-all duration-200 text-white"
            >
              {isOpen
                ? <X className="w-4 h-4" />
                : <Menu className="w-4 h-4" />
              }
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {isOpen && (
          <div className="md:hidden border-t border-white/10 py-4 space-y-1 bg-black/20 backdrop-blur-xl -mx-4 px-4">
            {NAV_LINKS.map(({ label, href }) => (
              <Link
                key={href}
                href={href}
                onClick={() => setIsOpen(false)}
                className={`block px-4 py-2.5 rounded-xl transition font-medium ${
                  pathname === href
                    ? 'text-white bg-white/10'
                    : 'text-white/80 hover:text-white hover:bg-white/10'
                }`}
              >
                {label}
              </Link>
            ))}

            <div className="pt-2 border-t border-white/10 mt-2">
              {user ? (
                <>
                  {isAgent && (
                    <Link href="/list-property" onClick={() => setIsOpen(false)}
                      className="block px-4 py-2.5 text-white/80 hover:text-white hover:bg-white/10 rounded-xl transition font-medium">
                      + List Property
                    </Link>
                  )}
                  <Link href={dashboardHref} onClick={() => setIsOpen(false)}
                    className="block px-4 py-2.5 text-white/80 hover:text-white hover:bg-white/10 rounded-xl transition font-medium">
                    Dashboard
                  </Link>
                  <button onClick={handleLogout}
                    className="w-full text-left px-4 py-2.5 text-red-400 hover:bg-red-500/10 rounded-xl transition font-medium">
                    Logout
                  </button>
                </>
              ) : (
                /* ✅ Mobile: Login & Register as separate styled buttons */
                <div className="flex flex-col gap-1">
                  <Link href="/login" onClick={() => setIsOpen(false)}
                    className="block px-4 py-2.5 text-white/80 hover:text-white hover:bg-white/10 rounded-xl transition font-medium">
                    Login
                  </Link>
                  <Link href="/register" onClick={() => setIsOpen(false)}
                    className="mx-4 mt-1 text-center py-2.5 text-sm font-bold text-white bg-red-700 hover:bg-red-600 rounded-xl transition-all shadow-lg shadow-red-900/40">
                    Sign Up
                  </Link>
                </div>
              )}

              {/* Mobile Install Button */}
              {showInstall && (
                <button
                  onClick={() => { handleInstall(); setIsOpen(false); }}
                  className="w-full flex items-center gap-2 px-4 py-2.5 text-white/80 hover:text-white hover:bg-white/10 rounded-xl transition font-medium"
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

// Extend the Window interface for the PWA install prompt
declare global {
  interface BeforeInstallPromptEvent extends Event {
    prompt(): Promise<void>;
    userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
  }
}