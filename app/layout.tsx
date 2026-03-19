import type { Metadata, Viewport } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { Navbar } from '@/components/layout/navbar'
import { Footer } from '@/components/layout/footer'
import { FloatingSocialWidget } from '@/components/global/floating-social'
import { Chatbot } from '@/components/global/chatbot'
import { CookieConsent } from '@/components/global/cookie-consent'
import { AuthProvider } from '@/components/AuthProvider'
import './globals.css'

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });

// Bump this string any time you change the favicon to bust CDN cache
const FAVICON_VERSION = 'v2';

export const metadata: Metadata = {
  title: 'ALFIMA Realty Inc. - Buy, Rent & Sell Properties',
  description: 'Find your dream home or investment property. Connect with top real estate agents.',
  icons: {
    icon: [
      { url: `/icon-32x32.png?v=${FAVICON_VERSION}`, media: '(prefers-color-scheme: light)' },
      { url: `/icon-32x32.png?v=${FAVICON_VERSION}`,  media: '(prefers-color-scheme: dark)'  },
    ],
    apple: `/apple-icon.png?v=${FAVICON_VERSION}`,
  },
}

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)',  color: '#000000' },
  ],
  userScalable: true,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="overflow-x-hidden">
      <body className="font-sans antialiased overflow-x-hidden">
        {/*
          AuthProvider runs fetchUser() on mount to hydrate the auth state
          from the httpOnly cookie — no localStorage, works on every page.
        */}
        <AuthProvider>
          <Navbar />
          <main className="pt-16 min-h-screen">
            {children}
          </main>
          <Chatbot />
          <FloatingSocialWidget />
          <Footer />
          <CookieConsent />
        </AuthProvider>
        <Analytics />
      </body>
    </html>
  )
}