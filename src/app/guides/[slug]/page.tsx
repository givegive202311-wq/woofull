import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PawIcon } from "@/components/ui/PawIcon";
import { MarkdownContent } from "@/components/ui/MarkdownContent";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { articles, getArticle } from "@/lib/articles";
import { supabase } from "@/lib/supabase";
import { isDiscountActive, getDiscountedPrice } from "@/lib/discount";

export function generateStaticParams() {
  return articles.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticle(slug);
  if (!article) return {};
  return {
    title: article.title,
    description: article.metaDescription,
    alternates: { canonical: `/guides/${article.slug}` },
    openGraph: {
      type: "article",
      title: article.title,
      description: article.metaDescription,
      publishedTime: article.publishedAt,
    },
    twitter: {
      card: "summary",
      title: article.title,
      description: article.metaDescription,
    },
  };
}

export default async function GuideArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = getArticle(slug);
  if (!article) notFound();

  const { data: relatedProductsRaw } = await supabase
    .from("products")
    .select("*")
    .eq("is_published", true)
    .in("slug", article.relatedProductSlugs);

  // article.relatedProductSlugsで指定した順番を保つ（.inはDB側の順序を保証しないため）
  const relatedProducts = article.relatedProductSlugs
    .map((slug) => relatedProductsRaw?.find((p) => p.slug === slug))
    .filter((p): p is NonNullable<typeof p> => Boolean(p));

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.metaDescription,
    datePublished: article.publishedAt,
    author: { "@type": "Organization", name: "Woofull" },
    publisher: { "@type": "Organization", name: "Woofull" },
  };

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: article.faq.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  };

  return (
    <main className="flex-1 pt-32 pb-20 px-6">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />

      <div className="max-w-2xl mx-auto">
        <Link
          href="/guides"
          className="inline-flex items-center gap-1.5 text-sm mb-8 hover:opacity-70 transition-opacity"
          style={{ color: "#2D2D2D", opacity: 0.5 }}
        >
          <ArrowLeft size={14} />
          お悩み相談室トップへ
        </Link>

        <span className="inline-block text-[10px] font-bold px-2 py-0.5 rounded-full mb-3" style={{ backgroundColor: "#F6A54B15", color: "#F6A54B" }}>
          {article.concept_tag}
        </span>
        <h1 className="text-2xl md:text-3xl font-bold font-heading mb-6 leading-tight" style={{ color: "#2D2D2D" }}>
          {article.title}
        </h1>

        <p
          className="text-sm md:text-base leading-relaxed mb-8 p-4 rounded-2xl"
          style={{ color: "#2D2D2D", opacity: 0.85, backgroundColor: "#FFF8F1" }}
        >
          {article.directAnswer}
        </p>

        <MarkdownContent content={article.body} />

        <div className="mt-12 pt-8" style={{ borderTop: "1px solid rgba(45,45,45,0.08)" }}>
          <h2 className="text-lg font-bold font-heading mb-5 flex items-center gap-2" style={{ color: "#2D2D2D" }}>
            <PawIcon size={16} color="#F6A54B" />
            よくある質問
          </h2>
          <div className="space-y-4">
            {article.faq.map((item, i) => (
              <div key={i} className="bg-white rounded-2xl p-5 shadow-sm">
                <p className="text-sm font-bold mb-2" style={{ color: "#F6A54B" }}>Q. {item.q}</p>
                <p className="text-sm leading-relaxed" style={{ color: "#2D2D2D", opacity: 0.7 }}>A. {item.a}</p>
              </div>
            ))}
          </div>
        </div>

        {relatedProducts && relatedProducts.length > 0 && (
          <div className="mt-12 pt-8" style={{ borderTop: "1px solid rgba(45,45,45,0.08)" }}>
            <h2 className="text-lg font-bold font-heading mb-5 flex items-center gap-2" style={{ color: "#2D2D2D" }}>
              <PawIcon size={16} color="#F6A54B" />
              関連する商品
            </h2>
            <div className="grid grid-cols-2 gap-3 md:gap-4">
              {relatedProducts.map((product) => (
                <Link key={product.id} href={`/products/${product.slug}`}>
                  <div className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300">
                    <div className="relative aspect-square overflow-hidden">
                      <Image
                        src={product.image_url || "/images/concept-brain.png"}
                        alt={product.name}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>
                    <div className="p-3">
                      <h3 className="text-xs md:text-sm font-bold font-heading mb-1.5 line-clamp-2" style={{ color: "#2D2D2D" }}>
                        {product.name}
                      </h3>
                      <p className="text-sm font-extrabold font-heading" style={{ color: isDiscountActive(product) ? "#e53e3e" : "#2D2D2D" }}>
                        ¥{getDiscountedPrice(product).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
            <Link
              href="/products"
              className="inline-flex items-center gap-1.5 text-sm font-medium mt-5 hover:gap-2.5 transition-all"
              style={{ color: "#F6A54B" }}
            >
              商品一覧をもっと見る <ArrowRight size={14} />
            </Link>
          </div>
        )}
      </div>
    </main>
  );
}
