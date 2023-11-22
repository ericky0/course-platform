import type { Metadata } from 'next'
import { Inter } from 'next/font/google'

import { ThemeProvider } from "@/components/theme-provider"
import ModalProvider from '@/providers/modal-provider'
import ToastProvider from '@/providers/toast-provider'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Create Next App',
  description: 'Generated by create next app',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeProvider
            attribute="class"
            defaultTheme=""
            enableSystem
            disableTransitionOnChange
          >
            <ModalProvider />
            <ToastProvider />
            {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
