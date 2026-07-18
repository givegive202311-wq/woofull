import Link from "next/link";
import type { Metadata } from "next";
import { PawIcon } from "@/components/ui/PawIcon";
import { ArrowRight } from "lucide-react";
import { articles } from "@/lib/articles";

export const metadata: Metadata = {
  title: "愛犬のお悩み相談室",
  description:
    "認知症予防・運動不足・分離不安・コミュニケーション・お散歩の負担など、飼い主さんのよくある悩みに、Woofullが商品選びの視点からアドバイスします。",
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
            認知症予防、運動不足、分離不安…飼い主さんのよくある悩みに、
            <br className="hidden md:block" />
            Woofullが商品選びの視点からアドバイスします。
          </p>
        </div>

        <div className="space-y-4">
          {articles.map((article) => (
            <Link
              key={article.slug}
              href={`/guides/${article.slug}`}
              className="group block bg-white rounded-2xl p-6 shadow-sm hover:shadow-lg transition-all duration-300"
            >
              <span className="inline-block text-[10px] font-bold px-2 py-0.5 rounded-full mb-3" style={{ backgroundColor: "#F6A54B15", color: "#F6A54B" }}>
                {article.concept_tag}
              </span>
              <h2 className="text-base md:text-lg font-bold font-heading mb-2" style={{ color: "#2D2D2D" }}>
                {article.title}
              </h2>
              <p className="text-sm leading-relaxed mb-3" style={{ color: "#2D2D2D", opacity: 0.6 }}>
                {article.excerpt}
              </p>
              <span className="inline-flex items-center gap-1 text-sm font-medium group-hover:gap-2 transition-all" style={{ color: "#F6A54B" }}>
                続きを読む <ArrowRight size={13} />
              </span>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
