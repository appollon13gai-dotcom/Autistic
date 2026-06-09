import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ИИ-Помощник для детей с аутизмом | Спортзал Суперзверей (гибкая локация)",
  description: "Веб-приложение с ИИ-агентом для родителей детей с аутизмом. Глобальная база знаний по доказательным практикам (ESDM, TEACCH, NCAEP), ресурсы по локации, ежедневные планы занятий, трекер прогресса, printable-материалы. По умолчанию русский язык с переключением на английский, украинский и испанский. Гибкая локация — для семей, которые часто переезжают. Важно: приложение информативное и не заменяет врачей, диагноз или профессиональную терапию.",
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
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100">
        {children}
        <Toaster position="top-center" richColors closeButton />
      </body>
    </html>
  );
}
