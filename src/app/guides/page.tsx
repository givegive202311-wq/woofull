import Link from "next/link";
import type { Metadata } from "next";
import { PawIcon } from "@/components/ui/PawIcon";
import { ArrowRight } from "lucide-react";
import { articles } from "@/lib/articles";
import { categories } from "@/lib/categories";

export const metadata: Metadata = {
  title: "愛犬のお悩み相談室",
  description:
    "しつけ、健康、食事、お手入れ、お散歩、迎え入れ、多頭飼いまで。飼い主さんの日常的な悩みに、Woofullがアドバイスします。",
  alternates: { canonical: "/guides" },
};

export default function GuidesIndexPage() {
  return (
    <main className="flex-1 pt-32 pb-20 px-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-14">
          <PawIcon size={24} color="#F6A54B" className="mx-auto mb-4 opacity-60" />
          <h1 className="text-2xl md:text-3xl font-bold font-heading mb-3" style={{ color: "#2D2D2D" }}>
            愛犬のお悩み相談室
          </h1>
          <p className="text-sm md:text-base leading-relaxed" style={{ color: "#2D2D2D", opacity: 0.6 }}>
            しつけ、健康、食事、お手入れ、お散歩…毎日の小さな困りごとに、
            <br className="hidden md:block" />
            Woofullがアドバイスします。
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-x-10 gap-y-12">
          {categories.map((category) => {
            const categoryArticles = articles.filter((a) => a.category === category.slug);
            return (
              <div key={category.slug}>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="text-lg font-bold font-heading" style={{ color: "#2D2D2D" }}>{category.label}</h2>
                    <p className="text-xs mt-0.5" style={{ color: "#2D2D2D", opacity: 0.45 }}>{category.description}</p>
                  </div>
                  <Link
                    href={`/guides/${category.slug}`}
                    className="flex-shrink-0 inline-flex items-center gap-1 text-xs font-medium hover:gap-1.5 transition-all"
                    style={{ color: "#F6A54B" }}
                  >
                    すべて見る <ArrowRight size={12} />
                  </Link>
                </div>

                {categoryArticles.length === 0 ? (
                  <p className="text-xs" style={{ color: "#2D2D2D", opacity: 0.35 }}>準備中です</p>
                ) : (
                  <div className="space-y-2">
                    {categoryArticles.slice(0, 3).map((article) => (
                      <Link
                        key={article.slug}
                        href={`/guides/${article.category}/${article.slug}`}
                        className="block text-sm font-medium py-2 border-b hover:opacity-60 transition-opacity line-clamp-1"
                        style={{ color: "#2D2D2D", borderColor: "rgba(45,45,45,0.06)" }}
                      >
                        {article.title}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </main>
  );
}
