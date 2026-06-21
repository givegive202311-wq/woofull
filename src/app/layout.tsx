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
  title: {
    default: "Woofull | 愛犬の毎日を、もっと豊かに。もっと長く。",
    template: "%s | Woofull",
  },
  description:
    "犬と過ごす時間をもっと豊かに。毎日の遊び・運動・食事から、愛犬の健康寿命を伸ばすグッズを届けるECサイト。",
  metadataBase: new URL("https://woofull.vercel.app"),
  openGraph: {
    type: "website",
    locale: "ja_JP",
    siteName: "Woofull",
    title: "Woofull | 愛犬の毎日を、もっと豊かに。もっと長く。",
    description: "犬と過ごす時間をもっと豊かに。愛犬の健康寿命を伸ばすグッズを届けるECサイト。",
    images: [{ url: "/images/hero-first-meet.png", width: 1672, height: 940 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Woofull | 愛犬の毎日を、もっと豊かに。もっと長く。",
    description: "犬と過ごす時間をもっと豊かに。愛犬の健康寿命を伸ばすグッズを届けるECサイト。",
    images: ["/images/hero-first-meet.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const gaId = process.env.NEXT_PUBLIC_GA_ID;

  return (
    <html
      lang="ja"
      className={`${nunito.variable} ${zenKaku.variable} h-full antialiased`}
    >
      <head>
        {gaId && (
          <>
            <script async src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`} />
            <script
              dangerouslySetInnerHTML={{
                __html: `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${gaId}');`,
              }}
            />
          </>
        )}
      </head>
      <body className="min-h-full flex flex-col bg-background text-foreground font-body">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
