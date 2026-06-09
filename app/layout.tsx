import type { Metadata } from "next";
import { Quicksand, Open_Sans } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";

const quicksand = Quicksand({
  variable: "--font-quicksand",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const openSans = Open_Sans({
  variable: "--font-open-sans",
  subsets: ["latin", "cyrillic"],
  weight: ["400", "600", "700"],
});

export const metadata: Metadata = {
  title: "SkyBridge — поддержка нейроотличных детей и семей (РАС)",
  description:
    "SkyBridge — спокойное приложение для родителей детей с аутизмом (РАС): ИИ-помощник, локальные ресурсы, глобальная база доказательных практик (ESDM, TEACCH, NCAEP), ежедневный трекер и онлайн-программа реабилитации. Мотив «авиатор + флаги мира». Языки: русский и английский. Гибкая локация для семей, которые часто переезжают. Информационный инструмент — не заменяет врачей и диагноз.",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ru"
      className={`${quicksand.variable} ${openSans.variable} h-full antialiased`}
    >
      <head>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=swap"
        />
      </head>
      <body className="min-h-full flex flex-col bg-background text-on-surface">
        {children}
        <Toaster position="top-center" richColors closeButton />
      </body>
    </html>
  );
}
