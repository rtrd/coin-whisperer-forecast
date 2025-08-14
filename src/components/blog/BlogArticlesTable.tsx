import React from "react";
import { Link } from "react-router-dom";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, ExternalLink } from "lucide-react";
import { Article } from "@/types/blog";
import { trackArticleClick } from "@/utils/analytics";

interface BlogArticlesTableProps {
  articles: Article[];
}

export const BlogArticlesTable: React.FC<BlogArticlesTableProps> = ({ articles }) => {
  const handleArticleClick = (article: Article) => {
    trackArticleClick(article.title, 0);
  };

  return (
    <div className="bg-gray-800/30 border border-gray-700 rounded-lg overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="border-gray-700">
            <TableHead className="text-gray-300">Article</TableHead>
            <TableHead className="text-gray-300">Category</TableHead>
            <TableHead className="text-gray-300">Date</TableHead>
            <TableHead className="text-gray-300">Read Time</TableHead>
            <TableHead className="text-gray-300 w-12"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {articles.map((article) => (
            <TableRow 
              key={article.id} 
              className="border-gray-700 hover:bg-gray-700/50 transition-colors"
            >
              <TableCell className="font-medium">
                <div className="flex items-start gap-3">
                  <img
                    src={article.image}
                    alt={article.title}
                    className="w-16 h-12 object-cover rounded flex-shrink-0"
                    loading="lazy"
                  />
                  <div className="min-w-0 flex-1">
                    <Link
                      to={`/article/${article.id}`}
                      onClick={() => handleArticleClick(article)}
                      className="text-white hover:text-blue-400 transition-colors line-clamp-2 font-medium block"
                    >
                      {article.title}
                    </Link>
                    <p className="text-sm text-gray-400 mt-1 line-clamp-1">
                      {article.excerpt}
                    </p>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <Badge variant="outline" className="text-gray-300 border-gray-600">
                  {article.category}
                </Badge>
              </TableCell>
              <TableCell className="text-gray-400">
                <div className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  <span className="text-sm">
                    {new Date(article.date).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric'
                    })}
                  </span>
                </div>
              </TableCell>
              <TableCell className="text-gray-400">
                <div className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  <span className="text-sm">{article.readTime}</span>
                </div>
              </TableCell>
              <TableCell>
                <Link
                  to={`/article/${article.id}`}
                  onClick={() => handleArticleClick(article)}
                  className="text-gray-400 hover:text-blue-400 transition-colors"
                >
                  <ExternalLink className="h-4 w-4" />
                </Link>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};