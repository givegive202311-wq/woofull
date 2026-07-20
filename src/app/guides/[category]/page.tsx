import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PawIcon } from "@/components/ui/PawIcon";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { articles } from "@/lib/articles";
import { categories, getCategory } from "@/lib/categories";

export function generateStaticParams() {
  return categories.map((c) => ({ category: c.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ category: string }> }): Promise<Metadata> {
  const { category } = await params;
  const info = getCategory(category);
  if (!info) return {};
  return {
    title: `${info.label}の記事一覧`,
    description: info.description,
    alternates: { canonical: `/guides/${info.slug}` },
  };
}

export default async function GuideCategoryPage({ params }: { params: Promise<{ category: string }> }) {
  const { category } = await params;
  const info = getCategory(category);
  if (!info) notFound();

  const categoryArticles = articles.filter((a) => a.category === category);

  return (
    <main className="flex-1 pt-32 pb-20 px-6">
      <div className="max-w-3xl mx-auto">
        <Link
          href="/guides"
          className="inline-flex items-center gap-1.5 text-sm mb-8 hover:opacity-70 transition-opacity"
          style={{ color: "#2D2D2D", opacity: 0.5 }}
        >
          <ArrowLeft size={14} />
          お悩み相談室トップへ
        </Link>

        <div className="text-center mb-10">
          <PawIcon size={22} color="#F6A54B" className="mx-auto mb-3 opacity-60" />
          <h1 className="text-2xl md:text-3xl font-bold font-heading mb-3" style={{ color: "#2D2D2D" }}>
            {info.label}
          </h1>
          <p className="text-sm md:text-base leading-relaxed" style={{ color: "#2D2D2D", opacity: 0.6 }}>
            {info.description}
          </p>
        </div>

        {categoryArticles.length === 0 ? (
          <div className="text-center py-16">
            <p style={{ color: "#2D2D2D", opacity: 0.4 }}>準備中です。近日公開予定です。</p>
          </div>
        ) : (
          <div className="space-y-4">
            {categoryArticles.map((article) => (
              <Link
                key={article.slug}
                href={`/guides/${article.category}/${article.slug}`}
                className="group flex gap-4 bg-white rounded-2xl p-4 md:p-6 shadow-sm hover:shadow-lg transition-all duration-300"
              >
                <div className="relative w-24 h-24 md:w-32 md:h-32 flex-shrink-0 rounded-xl overflow-hidden">
                  <Image src={article.heroImage.url} alt={article.heroImage.alt} fill className="object-cover transition-transform duration-500 group-hover:scale-105" />
                </div>
                <div className="min-w-0">
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
        )}
      </div>
    </main>
  );
}
