import type { Metadata } from "next";
import { Fredoka } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/app/context/ThemeProvider";
import { Providers } from "@/app/context/Providers";
import { Toaster } from "sonner";
import { AuthProvider } from "./context/AuthContext";
import TopHeader from "./components/Tienda/TopHeader";
import NavigationBar from "./components/Tienda/NavigationBar";
import Footer from "./components/Tienda/Footer";

const fredoka = Fredoka({
  variable: "--font-fredoka",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "MaxShop - Tu tienda de herramientas y tecnología online",
    template: "%s | MaxShop"
  },
  description: "Comprá herramientas, tecnología y productos para el hogar. Calidad garantizada, precios justos y envío a todo el país. ¡Entrá, elegí y recibí!",
  keywords: [
    "herramientas",
    "taladro",
    "electrodomésticos",
    "tecnología",
    "hogar",
    "ferretería online",
    "comprar herramientas",
    "tienda online",
    "MaxShop"
  ],
  authors: [{ name: "MaxShop" }],
  creator: "MaxShop",
  publisher: "MaxShop",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://maxshop.com'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: "website",
    locale: "es_AR",
    url: "/",
    siteName: "MaxShop",
    title: "MaxShop - Tu tienda de herramientas y tecnología online",
    description: "Comprá herramientas, tecnología y productos para el hogar. Calidad garantizada, precios justos y envío a todo el país.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "MaxShop - Comprá fácil, solucioná todo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "MaxShop - Tu tienda de herramientas y tecnología online",
    description: "Comprá herramientas, tecnología y productos para el hogar. Calidad garantizada y precios justos.",
    images: ["/twitter-image.png"],
    creator: "@maxshop",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
    other: [
      {
        rel: "mask-icon",
        url: "/safari-pinned-tab.svg",
        color: "#e88a42",
      },
    ],
  },
  manifest: "/site.webmanifest",
  applicationName: "MaxShop",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "MaxShop",
  },
  verification: {
    google: "tu-codigo-de-verificacion-de-google",
  },
  category: "ecommerce",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <head>
        <meta name="theme-color" content="#171c35" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      </head>
      <body className={`${fredoka.variable} antialiased`}>
        <Providers>
          <ThemeProvider>
            <AuthProvider>
              {/* Navbars Container - Sticky Together - Fixed in all pages */}
              <div className="sticky top-0 z-50">
                <TopHeader />
                <NavigationBar />
              </div>
              <div className="flex flex-col min-h-screen">
                {children}
                <Footer />
              </div>
            </AuthProvider>
            <Toaster />
          </ThemeProvider>
        </Providers>
      </body>
    </html>
  );
}