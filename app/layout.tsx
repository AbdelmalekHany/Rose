import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import GlobalLoader from "@/components/GlobalLoader";
import { Suspense } from "react";
import { SeasonalThemeProvider } from "@/components/SeasonalThemeProvider";
import { getActiveSeasonalTheme } from "@/lib/seasonal";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "The Big Rose",
  description: "Discover beautiful products at The Big Rose",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
  manifest: "/site.webmanifest",
  verification: {
    google: "mpj7wdp9tTzeyYtAlNzRE4qTf9c4nD3UJDYtMzKFpac",
  },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const seasonalTheme = await getActiveSeasonalTheme();

  return (
    <html lang="en">
      <body className={inter.className}>
        <SeasonalThemeProvider value={seasonalTheme}>
          <Providers>
            <Suspense fallback={null}>
              <GlobalLoader />
            </Suspense>
            <Navbar />
            <main className="min-h-screen">{children}</main>
            <Footer />
          </Providers>
        </SeasonalThemeProvider>
      </body>
    </html>
  );
}
