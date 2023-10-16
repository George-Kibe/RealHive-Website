// import type { Metadata } from 'next';

import './globals.css'
import { Roboto, Poppins } from 'next/font/google'
import Navbar from '@/components/Navbar';
import NavbarTest from '@/components/NavTest';
import Footer from '@/components/Footer';
import { ThemeProvider } from '@/context/ThemeContext';

const roboto = Roboto({ subsets: ['latin'], weight: '400'  })
const poppins = Poppins({ subsets: ['latin'], weight: '400'  })

export const metadata = {
  title: 'Realhive Consultants',
  description: 'Mobile, Web, Software and Data Consultants',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${poppins.className} min-h-screen`}>
        <ThemeProvider>
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
