// import type { Metadata } from 'next';

import './globals.css'
import { Poppins } from 'next/font/google'
import NavbarTest from '@/components/Navbar';
import Footer from '@/components/Footer';
import { ThemeProvider } from '@/context/ThemeContext';
import { SITE } from '@/lib/seo';
import JsonLd from '@/components/JsonLd';
import { organizationSchema, websiteSchema } from '@/lib/schema';

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  display: 'swap',
  variable: '--font-poppins',
})

export const metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    // Used by the homepage and as the fallback for any route that forgets.
    default: SITE.defaultTitle,
    // Every child route's `title` string gets the brand appended automatically,
    // so no page ever hand-writes " | RealHive Consultants".
    template: `%s | ${SITE.name}`,
  },
  description: SITE.defaultDescription,
  applicationName: SITE.name,
  // NOTE: no `alternates.canonical` here on purpose. Page metadata inherits
  // from the layout, so a canonical set here would make every page that forgot
  // to declare its own silently self-identify as a duplicate of the homepage.
  // Canonicals are declared per-route via buildMetadata() in lib/seo.js.
  icons: {
    // Square crops of the sphere mark from the brand logo. The full logo is a
    // 2.09:1 wordmark, which a browser would squash into an illegible tab icon,
    // so the mark alone is used here.
    icon: [{ url: '/icon.png', type: 'image/png', sizes: '512x512' }],
    apple: [{ url: '/apple-icon.png', sizes: '180x180' }],
  },
}

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#f1f5f9' },
    { media: '(prefers-color-scheme: dark)', color: '#020817' },
  ],
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${poppins.variable} font-sans p-2 screen-max-width min-h-screen`}>
        {/* Sitewide entity graph, server-rendered into the initial HTML. */}
        <JsonLd schema={organizationSchema()} />
        <JsonLd schema={websiteSchema()} />
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
          storageKey="realhive-theme"
        >
          <NavbarTest />
          <main className="relative container overflow-hidden">
            {children}
          </main>
          <Footer />
        </ThemeProvider>        
      </body>
    </html>
  )
}
