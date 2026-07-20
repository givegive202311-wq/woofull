import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { ProductDetailClient } from "./ProductDetailClient";

// 管理画面での価格・在庫・割引の変更が最短1分でサイトに反映されるようにする
export const revalidate = 60;

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const { data: product } = await supabase.from("products").select("*").eq("slug", slug).single();
  if (!product) return {};

  const description = product.description || `${product.name}。Woofullが厳選する愛犬向けグッズ。`;
  return {
    title: product.name,
    description,
    alternates: { canonical: `/products/${product.slug}` },
    openGraph: {
      type: "website",
      title: product.name,
      description,
      images: product.image_url ? [{ url: product.image_url }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: product.name,
      description,
      images: product.image_url ? [product.image_url] : undefined,
    },
  };
}

export default async function ProductDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  const { data: product } = await supabase.from("products").select("*").eq("slug", slug).single();
  if (!product) notFound();

  const { data: related } = await supabase
    .from("products")
    .select("*")
    .eq("is_published", true)
    .eq("concept_tag", product.concept_tag)
    .neq("slug", slug)
    .limit(4);

  return <ProductDetailClient product={product} related={related || []} />;
}
