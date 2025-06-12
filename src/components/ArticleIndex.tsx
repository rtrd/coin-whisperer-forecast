
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { List } from "lucide-react";

interface HeadingItem {
  id: string;
  text: string;
  level: number;
}

interface ArticleIndexProps {
  content: string;
}

export const ArticleIndex: React.FC<ArticleIndexProps> = ({ content }) => {
  const [headings, setHeadings] = useState<HeadingItem[]>([]);

  useEffect(() => {
    // Parse HTML content to extract headings
    const parser = new DOMParser();
    const doc = parser.parseFromString(content, 'text/html');
    const headingElements = doc.querySelectorAll('h1, h2, h3, h4');
    
    const extractedHeadings: HeadingItem[] = Array.from(headingElements).map((heading, index) => {
      const text = heading.textContent || '';
      const level = parseInt(heading.tagName.charAt(1));
      const id = `heading-${index}-${text.toLowerCase().replace(/[^a-z0-9]/g, '-')}`;
      
      // Add id to the heading element for navigation
      heading.id = id;
      
      return {
        id,
        text,
        level
      };
    });

    setHeadings(extractedHeadings);

    // Update the actual article content with the IDs
    const articleElement = document.querySelector('.prose');
    if (articleElement) {
      const actualHeadings = articleElement.querySelectorAll('h1, h2, h3, h4');
      actualHeadings.forEach((heading, index) => {
        if (extractedHeadings[index]) {
          heading.id = extractedHeadings[index].id;
        }
      });
    }
  }, [content]);

  const handleHeadingClick = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }
  };

  if (headings.length === 0) {
    return null;
  }

  return (
    <Card className="bg-gray-800/50 border-gray-700">
      <CardHeader className="pb-3">
        <CardTitle className="text-white text-lg flex items-center gap-2">
          <List className="h-5 w-5 text-blue-400" />
          Article Index
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-1">
          {headings.map((heading, index) => (
            <button
              key={heading.id}
              onClick={() => handleHeadingClick(heading.id)}
              className={`
                block w-full text-left text-sm hover:text-blue-400 transition-colors cursor-pointer
                ${heading.level === 1 ? 'text-white font-semibold' : ''}
                ${heading.level === 2 ? 'text-gray-200 pl-3' : ''}
                ${heading.level === 3 ? 'text-gray-300 pl-6' : ''}
                ${heading.level === 4 ? 'text-gray-400 pl-9' : ''}
                hover:bg-gray-700/30 rounded px-2 py-1
              `}
            >
              <span className="text-blue-400 font-medium mr-2">{index + 1}.</span>
              {heading.text}
            </button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
