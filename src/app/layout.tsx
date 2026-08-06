import type { Metadata } from "next";
import { cookies, headers } from "next/headers";
import { Geist_Mono, Inter, Noto_Sans_Arabic, Sora } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";
import {
  getServerLanguage,
  type AppLanguage,
} from "@/lib/i18n/server-language";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const sora = Sora({
  variable: "--font-sora",
  subsets: ["latin"],
});

const notoArabic = Noto_Sans_Arabic({
  variable: "--font-arabic",
  subsets: ["arabic"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ShopWave",
  description: "Next.js frontend for the ShopWave ecommerce + products API",
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies();
  const headerStore = await headers();
  const initialLang: AppLanguage = getServerLanguage(
    cookieStore.get("app-language")?.value ?? null,
    headerStore.get("accept-language"),
  );

  return (
    <html
      lang={initialLang}
      suppressHydrationWarning
      className={`${inter.variable} ${sora.variable} ${notoArabic.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <Providers initialLang={initialLang}>{children}</Providers>
      </body>
    </html>
  );
}
