import type { Metadata } from "next"
import { Plus_Jakarta_Sans, JetBrains_Mono } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { GoogleAnalytics } from "@/components/google-analytics"

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-geist-sans",   // keep same var name — no other files need changing
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  display: "swap",
})

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-geist-mono",   // keep same var name
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
})

export const metadata: Metadata = {
  metadataBase: new URL("https://devopsboys.com"),
  title: {
    default: "DevOpsBoys - DevOps, Cloud, AI & ML Tutorials",
    template: "%s | DevOpsBoys",
  },
  description:
    "In-depth guides on DevOps, Cloud engineering, Docker, Kubernetes, AWS, CI/CD, AI and ML. Practical tutorials written by engineers, for engineers.",
  keywords: ["devops", "docker", "kubernetes", "aws", "cloud", "ai", "ml", "cicd", "terraform", "gitops", "platform engineering"],
  authors: [{ name: "DevOpsBoys" }],
  creator: "DevOpsBoys",
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://devopsboys.com",
    title: "DevOpsBoys - DevOps, Cloud, AI & ML Tutorials",
    description:
      "In-depth guides on DevOps, Cloud, Docker, Kubernetes, AWS, CI/CD, and AI/ML.",
    siteName: "DevOpsBoys",
  },
  twitter: {
    card: "summary_large_image",
    title: "DevOpsBoys",
    description: "Practical DevOps, Cloud, and AI/ML engineering guides.",
    creator: "@devopsboys",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
  other: {
    "impact-site-verification": "00477302-97b7-4682-b980-73c7eba5d2e9",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${plusJakartaSans.variable} ${jetbrainsMono.variable} antialiased min-h-screen flex flex-col`}
      >
        <GoogleAnalytics />
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  )
}
