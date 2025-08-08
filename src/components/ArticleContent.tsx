
import React from "react";
import { CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tag } from "lucide-react";

interface ArticleContentProps {
  content: string;
  tags: string[];
  articleId?: number | string;
  articleTitle?: string;
}

export const ArticleContent: React.FC<ArticleContentProps> = ({ content, tags, articleId, articleTitle }) => {
  const containerRef = React.useRef<HTMLDivElement | null>(null);

  // Delegate clicks: only push when a link inside a blockquote is clicked
  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const target = e.target as HTMLElement;
    if (!target) return;

    const link = target.closest('a');
    if (!link) return;

    // Ensure the link is within a blockquote
    const inBlockquote = link.closest('blockquote');
    if (!inBlockquote) return;

    const href = (link as HTMLAnchorElement).href || '';
    const text = (link.textContent || '').trim();
    const url = (() => {
      try { return new URL(href); } catch { return null; }
    })();

    const payload = {
      event: 'gtm.click',
      event_source: 'article_content',
      is_blockquote: true,
      element_url: href,
      element_text: text,
      element_domain: url?.hostname || '',
      element_id: (link as HTMLElement).id || '',
      element_classes: (link as HTMLElement).className || '',
      element_target: (link as HTMLAnchorElement).target || '',
      article_id: articleId ?? '',
      article_title: articleTitle ?? '',
    };

    const w: any = window as any;
    w.dataLayer = w.dataLayer || [];
    w.dataLayer.push(payload);
  };

  // Annotate blockquote links for GTM targeting and safety
  React.useEffect(() => {
    const root = containerRef.current;
    if (!root) return;
    const links = root.querySelectorAll('blockquote a');
    links.forEach((a) => {
      const el = a as HTMLAnchorElement;
      el.setAttribute('data-gtm', 'blockquote-link');
      if (el.target === '_blank') {
        const existingRel = el.getAttribute('rel') || '';
        if (!existingRel.includes('noopener')) {
          el.setAttribute('rel', `${existingRel} noopener noreferrer`.trim());
        }
      }
    });
  }, [content]);

  return (
    <CardContent className="p-4 md:p-8">
      <div
        ref={containerRef}
        onClick={handleClick}
        className="prose prose-invert max-w-none text-gray-200 
        prose-headings:text-shadow-lg prose-h1:text-4xl prose-h1:font-bold prose-h1:mb-6 prose-h1:text-white
        prose-h2:text-2xl prose-h2:font-semibold prose-h2:mb-4 prose-h2:mt-8 prose-h2:text-white
        prose-h3:text-xl prose-h3:font-medium prose-h3:mb-3 prose-h3:mt-6 prose-h3:text-gray-100
        prose-h4:text-lg prose-h4:font-medium prose-h4:mb-2 prose-h4:mt-4 prose-h4:text-gray-200
        prose-p:mb-8 prose-p:leading-relaxed prose-p:text-gray-200
        prose-ul:mb-6 prose-li:mb-2"
        dangerouslySetInnerHTML={{ __html: content }}
      />

      {/* Article Tags */}
      <div className="border-t border-gray-600 pt-6 mt-8">
        <div className="flex items-center gap-2 mb-3">
          <Tag className="h-4 w-4 text-blue-400" />
          <span className="text-white font-medium">Tags:</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {tags.map((tag: string, index: number) => (
            <Badge
              key={index}
              variant="outline" 
              className="bg-gray-700/50 border-gray-600 text-gray-300 hover:bg-gray-600/50"
            >
              {tag}
            </Badge>
          ))}
        </div>
      </div>
    </CardContent>
  );
};
