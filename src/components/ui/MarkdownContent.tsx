import ReactMarkdown from "react-markdown";
import { PawIcon } from "@/components/ui/PawIcon";

// 商品詳細ページ・SEO記事など、Markdown本文を同じ見た目で表示するための共通コンポーネント
export function MarkdownContent({ content }: { content: string }) {
  return (
    <ReactMarkdown
      components={{
        h2: ({ children }) => (
          <h2 className="text-xl md:text-2xl font-bold font-heading mt-10 mb-4 pb-3 flex items-center gap-3" style={{ color: "#2D2D2D", borderBottom: "2px solid #F6A54B" }}>
            <span className="w-1.5 h-6 rounded-full inline-block" style={{ backgroundColor: "#F6A54B" }} />
            {children}
          </h2>
        ),
        h3: ({ children }) => (
          <h3 className="text-lg font-bold font-heading mt-8 mb-3" style={{ color: "#2D2D2D" }}>
            {children}
          </h3>
        ),
        p: ({ children }) => (
          <p className="text-sm md:text-base leading-relaxed mb-4" style={{ color: "#2D2D2D", opacity: 0.7 }}>
            {children}
          </p>
        ),
        ul: ({ children }) => (
          <ul className="space-y-2 mb-6 ml-1">
            {children}
          </ul>
        ),
        ol: ({ children }) => (
          <ol className="space-y-2 mb-6 ml-1 list-decimal list-inside">
            {children}
          </ol>
        ),
        li: ({ children }) => (
          <li className="flex items-start gap-2 text-sm md:text-base leading-relaxed" style={{ color: "#2D2D2D", opacity: 0.7 }}>
            <span className="mt-2 w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: "#F6A54B" }} />
            <span>{children}</span>
          </li>
        ),
        strong: ({ children }) => (
          <strong className="font-bold" style={{ color: "#F6A54B" }}>
            {children}
          </strong>
        ),
        blockquote: ({ children }) => (
          <blockquote className="border-l-4 pl-4 my-6 py-2 rounded-r-xl" style={{ borderColor: "#F6A54B", backgroundColor: "#FFF8F1" }}>
            {children}
          </blockquote>
        ),
        hr: () => (
          <div className="flex items-center justify-center gap-3 my-8">
            <div className="h-px flex-1" style={{ backgroundColor: "rgba(45,45,45,0.08)" }} />
            <PawIcon size={14} color="#F6A54B" className="opacity-30" />
            <div className="h-px flex-1" style={{ backgroundColor: "rgba(45,45,45,0.08)" }} />
          </div>
        ),
        img: ({ src, alt }) => (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={typeof src === "string" ? src : ""}
            alt={alt || ""}
            className="w-full rounded-2xl my-6 object-cover"
            loading="lazy"
          />
        ),
      }}
    >
      {content}
    </ReactMarkdown>
  );
}
