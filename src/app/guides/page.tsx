import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { PawIcon } from "@/components/ui/PawIcon";
import { ArrowRight } from "lucide-react";
import { articles } from "@/lib/articles";

export const metadata: Metadata = {
  title: "愛犬のお悩み相談室",
  description:
    "水こぼれ・早食い・抜け毛・お散歩の負担など、飼い主さんの日常的な困りごとに、Woofullが商品選びの視点からアドバイスします。",
  alternates: { canonical: "/guides" },
};

export default function GuidesIndexPage() {
  return (
    <main className="flex-1 pt-32 pb-20 px-6">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <PawIcon size={24} color="#F6A54B" className="mx-auto mb-4 opacity-60" />
          <h1 className="text-2xl md:text-3xl font-bold font-heading mb-3" style={{ color: "#2D2D2D" }}>
            愛犬のお悩み相談室
          </h1>
          <p className="text-sm md:text-base leading-relaxed" style={{ color: "#2D2D2D", opacity: 0.6 }}>
            水こぼれ、早食い、抜け毛、お散歩の負担…毎日の小さな困りごとに、
            <br className="hidden md:block" />
            Woofullが商品選びの視点からアドバイスします。
          </p>
        </div>

        <div className="space-y-4">
          {articles.map((article) => (
            <Link
              key={article.slug}
              href={`/guides/${article.slug}`}
              className="group flex gap-4 bg-white rounded-2xl p-4 md:p-6 shadow-sm hover:shadow-lg transition-all duration-300"
            >
              <div className="relative w-24 h-24 md:w-32 md:h-32 flex-shrink-0 rounded-xl overflow-hidden">
                <Image
                  src={article.heroImage.url}
                  alt={article.heroImage.alt}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div className="min-w-0">
                <span className="inline-block text-[10px] font-bold px-2 py-0.5 rounded-full mb-2" style={{ backgroundColor: "#F6A54B15", color: "#F6A54B" }}>
                  {article.concept_tag}
                </span>
                <h2 className="text-sm md:text-lg font-bold font-heading mb-1.5 line-clamp-2" style={{ color: "#2D2D2D" }}>
                  {article.title}
                </h2>
                <p className="text-xs md:text-sm leading-relaxed mb-2 line-clamp-2" style={{ color: "#2D2D2D", opacity: 0.6 }}>
                  {article.excerpt}
                </p>
                <span className="inline-flex items-center gap-1 text-xs md:text-sm font-medium group-hover:gap-2 transition-all" style={{ color: "#F6A54B" }}>
                  続きを読む <ArrowRight size={13} />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
