import type { Metadata, Viewport } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { Toaster } from '@/components/ui/toaster'
import { Navbar } from '@/components/layout/navbar'
import { Footer } from '@/components/layout/footer'
import { FloatingSocialWidget } from '@/components/global/floating-social'
import { Chatbot } from '@/components/global/chatbot'
import { CookieConsent } from '@/components/global/cookie-consent'
import { AuthProvider } from '@/components/AuthProvider'
import './globals.css'

const _geist = Geist({ subsets: ['latin'] })
const _geistMono = Geist_Mono({ subsets: ['latin'] })

const FAVICON_VERSION = 'v2'

export const metadata: Metadata = {
  title: 'ALFIMA Realty Inc. - Buy, Rent & Sell Properties',
  description: 'Find your dream home or investment property. Connect with top real estate agents.',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'ALFIMA Realty',
  },
  formatDetection: {
    telephone: false,
  },
  icons: {
    icon: [
      { url: `/icon-32x32.png?v=${FAVICON_VERSION}`, media: '(prefers-color-scheme: light)' },
      { url: `/icon-32x32.png?v=${FAVICON_VERSION}`, media: '(prefers-color-scheme: dark)' },
    ],
    apple: `/apple-icon.png?v=${FAVICON_VERSION}`,
  },
}

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#000000' },
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
      <head>
        {/* PWA / iOS Safari meta tags — not covered by Next.js metadata API */}
        <meta name="application-name" content="ALFIMA Realty" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="ALFIMA Realty" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="msapplication-TileColor" content="#1a3c5e" />
        <meta name="msapplication-tap-highlight" content="no" />
      </head>
      <body className="font-sans antialiased overflow-x-hidden">
        <AuthProvider>
          <Navbar />
          <main className="pt-16 min-h-screen">
            {children}
          </main>
          <Chatbot />
          <FloatingSocialWidget />
          <Footer />
          <CookieConsent />
          <Toaster />
        </AuthProvider>
        <Analytics />
      </body>
    </html>
  )
}
