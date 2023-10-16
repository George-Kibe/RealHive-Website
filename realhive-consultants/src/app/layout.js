// import type { Metadata } from 'next';

import './globals.css'
import { Roboto } from 'next/font/google'
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const roboto = Roboto({ subsets: ['latin'], weight: '400'  })

export const metadata = {
  title: 'Realhive Consultants',
  description: 'Mobile, Web, Software and Data Consultants',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={roboto.className}>
        <Navbar />
        <main className="relative overflow-hidden">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  )
}
