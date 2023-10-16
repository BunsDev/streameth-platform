import './globals.css'
import { Ubuntu, Heebo } from 'next/font/google'
import GeneralContext from '@/components/context/GeneralContext'
import { ModalContextProvider } from '@/components/context/ModalContext'
import { MobileContextProvider } from '@/components/context/MobileContext'
import Navbar from '@/components/Layout/NavbarTop'
import { LoadingContextProvider } from '@/components/context/LoadingContext'
import { Metadata } from 'next'

const ubuntu = Ubuntu({
  weight: ['400', '500', '700'],
  subsets: ['latin'],
  variable: '--font-ubuntu',
})

const heebo = Heebo({
  subsets: ['latin'],
  variable: '--font-heebo',
})

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${ubuntu.variable} font-ubuntu`}>
      <body className={`${heebo.variable} font-sans`}>
        <GeneralContext>
          <LoadingContextProvider>
            <MobileContextProvider>
              <ModalContextProvider>
                <div className="flex flex-col h-[100dvh] w-screen">
                  <Navbar />
                  {children}
                </div>
              </ModalContextProvider>
            </MobileContextProvider>
          </LoadingContextProvider>
        </GeneralContext>
      </body>
    </html>
  )
}

export const metadata: Metadata = {
  metadataBase: new URL('https://app.streameth.org'),
  alternates: {
    canonical: '/',
    languages: {
      'en-US': '/en-US',
      'de-DE': '/de-DE',
    },
  },
  openGraph: {
    images: '/og-image.png',
  },
}
