import type { Metadata } from "next";
import { Nunito, Zen_Kaku_Gothic_New } from "next/font/google";
import { Providers } from "@/components/layout/Providers";
import "./globals.css";

const nunito = Nunito({
  variable: "--font-nunito",
  subsets: ["latin"],
  weight: ["400", "600", "700", "800"],
});

const zenKaku = Zen_Kaku_Gothic_New({
  variable: "--font-zen-kaku",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

export const metadata: Metadata = {
  title: "Woofull | 愛犬の毎日を、もっと豊かに。もっと長く。",
  description:
    "犬と過ごす時間をもっと豊かに。毎日の遊び・運動・食事から、愛犬の健康寿命を伸ばすグッズを届けるECサイト。",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ja"
      className={`${nunito.variable} ${zenKaku.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground font-body">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
