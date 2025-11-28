import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'MirrorAI - Truth Verification',
  description: 'AI-powered truth verification using DKG',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
