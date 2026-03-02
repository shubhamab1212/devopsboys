import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: {
    default: "DevOpsBoys - DevOps, Cloud, AI & ML Tutorials",
    template: "%s | DevOpsBoys",
  },
  description:
    "DevOps, Cloud, AI aur ML ke baare mein practical guides, tutorials aur tips. Docker, Kubernetes, AWS, CI/CD aur bahut kuch.",
  keywords: ["devops", "docker", "kubernetes", "aws", "cloud", "ai", "ml", "cicd", "hindi"],
  authors: [{ name: "DevOpsBoys" }],
  creator: "DevOpsBoys",
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://devopsboys.com",
    title: "DevOpsBoys - DevOps, Cloud, AI & ML Tutorials",
    description:
      "DevOps, Cloud, AI aur ML ke baare mein practical guides aur tutorials.",
    siteName: "DevOpsBoys",
  },
  twitter: {
    card: "summary_large_image",
    title: "DevOpsBoys",
    description: "DevOps, Cloud, AI aur ML ke practical tutorials.",
    creator: "@devopsboys",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
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
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col`}
      >
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
