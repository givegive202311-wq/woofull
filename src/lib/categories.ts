// 「愛犬のお悩み相談室」のカテゴリ（柱）定義。docs/seo/media-plan.md の設計に対応。
export type CategorySlug =
  | "shitsuke"
  | "kenkou"
  | "shokuji"
  | "grooming"
  | "sanpo"
  | "hajimete"
  | "lifeevent";

export type Category = {
  slug: CategorySlug;
  label: string;
  description: string;
};

export const categories: Category[] = [
  { slug: "shitsuke", label: "しつけ・問題行動", description: "無駄吠え、トイレの失敗、噛み癖、分離不安など、日々のしつけの悩み。" },
  { slug: "kenkou", label: "健康・体調管理", description: "体調のちょっとした変化や、シニア犬のケアについて。" },
  { slug: "shokuji", label: "食事・栄養", description: "フード選び、水分補給、早食いなど、毎日の食事にまつわる悩み。" },
  { slug: "grooming", label: "お手入れ・グルーミング", description: "歯みがき、抜け毛、寝床など、日常のお手入れについて。" },
  { slug: "sanpo", label: "お散歩・お出かけ", description: "散歩の負担、暑さ対策、外出時の持ち物など。" },
  { slug: "hajimete", label: "迎え入れ・初心者", description: "子犬を迎える準備や、はじめての飼育で気になること。" },
  { slug: "lifeevent", label: "ライフイベント・多頭飼い", description: "多頭飼い、引っ越し、赤ちゃんとの同居など、暮らしの変化にまつわる悩み。" },
];

export function getCategory(slug: string): Category | undefined {
  return categories.find((c) => c.slug === slug);
}
