import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'AI PowerPoint Generator | Create Stunning Presentations with AI',
  description: 'Transform your ideas into professional PowerPoint presentations instantly. AI-powered slide generator with beautiful designs, smart content creation, and instant downloads.',
  keywords: ['AI PowerPoint', 'presentation generator', 'AI slides', 'PowerPoint maker', 'presentation creator', 'AI presentation'],
  authors: [{ name: 'Amarjyoti Patra' }],
  creator: 'Amarjyoti Patra',
  publisher: 'Amarjyoti Patra',
  openGraph: {
    title: 'AI PowerPoint Generator | Create Stunning Presentations',
    description: 'Transform your ideas into professional PowerPoint presentations instantly with AI',
    type: 'website',
    url: 'https://amarjyotipatra.dev/powerpoint-generator',
    siteName: 'AI PowerPoint Generator',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI PowerPoint Generator',
    description: 'Create professional presentations with AI in seconds',
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  )
}