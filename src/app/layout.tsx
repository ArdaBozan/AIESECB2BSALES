import type { Metadata } from "next";
import { Open_Sans } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";
import { SearchProvider } from "@/contexts/SearchContext";
import MainLayout from "@/components/layout/MainLayout";

const openSans = Open_Sans({
  variable: "--font-main",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "AIESEC B2B Sales - Yönetim Paneli",
  description: "AIESEC B2B CRM ve Satış Yönetim Sistemi",
  icons: {
    icon: "/logo/fav.svg",
    shortcut: "/logo/fav.svg",
    apple: "/logo/fav.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr">
      <body className={`${openSans.variable}`}>
        <AuthProvider>
          <SearchProvider>
            <MainLayout>
              {children}
            </MainLayout>
          </SearchProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
