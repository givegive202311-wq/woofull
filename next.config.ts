import type { NextConfig } from "next";

// /guides配下をカテゴリ別ディレクトリ（/guides/[category]/[slug]）に再編したため、
// 旧フラットURL（/guides/[slug]）に来たアクセス・検索エンジンを新URLへ301リダイレクトする
const oldGuideSlugToNewPath: Record<string, string> = {
  "inu-mizu-koboreru-taisaku": "/guides/shokuji/inu-mizu-koboreru-taisaku",
  "inu-hayagui-boushi-guzzu": "/guides/shokuji/inu-hayagui-boushi-guzzu",
  "inu-hamigaki-iyagaru-dental-toy": "/guides/grooming/inu-hamigaki-iyagaru-dental-toy",
  "inu-nukege-souji-guzzu": "/guides/grooming/inu-nukege-souji-guzzu",
  "inu-bed-erabikata": "/guides/kenkou/inu-bed-erabikata",
  "inu-necchusho-taisaku-hiyashi-oyatsu": "/guides/kenkou/inu-necchusho-taisaku-hiyashi-oyatsu",
  "inu-nameru-stress-hassan": "/guides/shitsuke/inu-nameru-stress-hassan",
  "inu-unchibukuro-holder-erabikata": "/guides/sanpo/inu-unchibukuro-holder-erabikata",
  "inu-dakko-tsukareru-rucksack": "/guides/sanpo/inu-dakko-tsukareru-rucksack",
  "inu-sanpo-asphalt-yakedo-taisaku": "/guides/sanpo/inu-sanpo-asphalt-yakedo-taisaku",
  "inu-retrieve-hitoriasobi-toy": "/guides/sanpo/inu-retrieve-hitoriasobi-toy",
  "inu-rusuban-undoubusoku-kaishou-guzzu": "/guides/sanpo/inu-rusuban-undoubusoku-kaishou-guzzu",
};

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "qsosnrdjurckdczbtmxd.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
    ],
  },
  async redirects() {
    return Object.entries(oldGuideSlugToNewPath).map(([slug, destination]) => ({
      source: `/guides/${slug}`,
      destination,
      permanent: true,
    }));
  },
};

export default nextConfig;
