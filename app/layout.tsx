import type React from "react"
import type { Metadata } from "next"
import { Orbitron } from "next/font/google"
import { GeistMono } from "geist/font/mono"
import "./globals.css"

const orbitron = Orbitron({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-orbitron",
  weight: ["400", "500", "600", "700", "800", "900"],
})

export const metadata: Metadata = {
  title: "Futuristic Task Manager",
  description: "A cyberpunk-themed todo app built with Next.js",
  generator: "mirella",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`dark ${orbitron.variable}`}>
      <head>
        <style>{`
html {
  font-family: ${orbitron.style.fontFamily};
  --font-sans: ${orbitron.style.fontFamily};
  --font-mono: ${GeistMono.variable};
}
        `}</style>
      </head>
      <body className="font-sans">{children}</body>
    </html>
  )
}
