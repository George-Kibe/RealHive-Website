// import type { Metadata } from 'next';

import './globals.css'
import { Poppins } from 'next/font/google'
import Navbar from '@/components/Navbar';
import NavbarTest from '@/components/NavTest';
import Footer from '@/components/Footer';
import { ThemeProvider } from '@/context/ThemeContext';

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  display: 'swap',
  variable: '--font-poppins',
})

export const metadata = {
  title: 'Realhive Consultants',
  description: 'Mobile, Web, Software and Data Consultants',
  icons: {
    icon: [
      {
        media: "(prefers-color-scheme: light)",
        url: "/data.jpeg",
        type: "image/png",
        href: "/data.jpeg",      
      },
      {
        media: "(prefers-color-scheme: dark)",
        url: "/data.jpeg",
        type: "image/png",
        href: "/data.jpeg",      
      },
    ]
  } 
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${poppins.variable} font-sans p-2 screen-max-width min-h-screen`}>
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
