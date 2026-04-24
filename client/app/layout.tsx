import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { ScreeningProvider } from '@/lib/screening-context'
import { ThemeProvider } from '@/lib/theme-provider'
import { Toaster } from 'sonner'
import './globals.css'

const geist = Geist({ subsets: ["latin"] });
const geistMono = Geist_Mono({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: 'Umurava AI Screening - AI-Powered Talent Assessment Platform',
    template: '%s | Umurava AI Screening'
  },
  description: 'Revolutionize your hiring process with Umurava\'s AI-powered talent screening platform. Automate candidate assessment, reduce bias, and find the best talent faster.',
  keywords: [
    'Rwanda AI screening',
    'Umurava AI screening',
    'Umurava AI screening platform',
    'Umurava recruiter ai platform',
    'Umurava recruiter ai',
    'Umurava talent assessment',
    'Umurava recruitment platform',
    'Rwanda recruitment platform',
    'AI screening rwanda',
    'AI screening ',
    'talent assessment',
    'umurava recruitment automation',
    'rwanda recruitment automation',
    'candidate screening',
    'AI recruitment',
    'talent acquisition',
    'rwanda hiring platform',
    'rwanda skills assessment',
    'pre-employment testing',
    'umurava recruitment AI',
    'recruitment AI',
    'umurava candidate evaluation',
    'candidate evaluation',
    'rwanda candidate evaluation',
    'Umurava',
    'Umurava platform',
    'talent management',
    'HR technology',
    'automated screening',
    'rwanda automated screening',
    'Umurava hiring solution'
  ],
  authors: [{ name: 'Inzozi Tech' }],
  creator: 'Inzozi Tech',
  publisher: 'Umurava',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://umurava-recruiter-ai.vercel.app',
    siteName: 'Umurava AI Screening',
    title: 'Umurava AI Screening - AI-Powered Talent Assessment Platform',
    description: 'Revolutionize your hiring process with Umurava\'s AI-powered talent screening platform. Automate candidate assessment, reduce bias, and find the best talent faster.',
    images: [
      {
        url: '/umurava.png',
        width: 1200,
        height: 630,
        alt: 'Umurava AI Screening Platform Logo',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Umurava AI Screening - AI-Powered Talent Assessment',
    description: 'Revolutionize your hiring process with Umurava\'s AI-powered talent screening. Automate candidate assessment and find the best talent faster.',
    images: ['/umurava.png'],
    creator: '@umurava',
    site: '@umurava',
  },
  alternates: {
    canonical: 'https://umurava-recruiter-ai.vercel.app',
  },
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 5,
  },
  category: 'technology',
  classification: 'Recruitment Technology, HR Software, AI Screening',
  metadataBase: new URL('https://umurava-recruiter-ai.vercel.app'),
  applicationName: 'Umurava AI Screening',

  icons: {
    icon: [
      { url: '/icon.png' },
      { url: '/icon.png', sizes: '16x16', type: 'image/png' },
      { url: '/icon.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: [
      { url: '/icon.png' },
    ],
    shortcut: ['/icon.png'],
  },
  verification: {
    google: 'LfCXyc0DnX3D8vpZpSIR7B3S24sg1_oOwdDgQMmUByU',
  },

}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Additional meta tags for better SEO */}
        <meta name="geo.region" content="RW" />
        <meta name="geo.placename" content="Global" />
        <meta name="distribution" content="global" />
        <meta name="language" content="English" />
        <meta httpEquiv="Content-Type" content="text/html; charset=utf-8" />
        <meta httpEquiv="Content-Language" content="en" />
        
        {/* Preconnect for performance */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        
        
        {/* Additional Umurava branding meta tags */}
        <meta name="brand" content="Umurava" />
        <meta name="product" content="Umurava AI Screening Platform" />
      </head>
      <body className="font-sans antialiased bg-background text-foreground" suppressHydrationWarning>
        <ThemeProvider>
          <ScreeningProvider>
            {children}
            <Toaster position="bottom-right" richColors />
          </ScreeningProvider>
        </ThemeProvider>
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}