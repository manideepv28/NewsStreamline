import { ExternalLink } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { Article } from "@shared/schema";

interface ArticleCardProps {
  article: Article;
}

const getCategoryColor = (category: string) => {
  switch (category.toLowerCase()) {
    case 'technology':
      return 'bg-accent text-white';
    case 'business':
      return 'bg-blue-100 text-blue-800';
    case 'sports':
      return 'bg-green-100 text-green-800';
    case 'entertainment':
      return 'bg-purple-100 text-purple-800';
    case 'health':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

const formatTimeAgo = (date: Date) => {
  const now = new Date();
  const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
  
  if (diffInHours < 1) {
    return 'Less than an hour ago';
  } else if (diffInHours < 24) {
    return `${diffInHours} hour${diffInHours === 1 ? '' : 's'} ago`;
  } else {
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays} day${diffInDays === 1 ? '' : 's'} ago`;
  }
};

export default function ArticleCard({ article }: ArticleCardProps) {
  const handleOpenArticle = () => {
    window.open(article.url, '_blank', 'noopener,noreferrer');
  };

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-200 cursor-pointer">
      {article.urlToImage && (
        <img
          src={article.urlToImage}
          alt={article.title}
          className="w-full h-48 object-cover"
          onError={(e) => {
            (e.target as HTMLImageElement).style.display = 'none';
          }}
        />
      )}
      <CardContent className="p-6">
        <div className="flex items-center mb-2">
          <Badge className={`text-xs font-medium rounded-full ${getCategoryColor(article.category)}`}>
            {article.category.charAt(0).toUpperCase() + article.category.slice(1)}
          </Badge>
          <span className="ml-2 text-xs text-neutral">
            {formatTimeAgo(new Date(article.publishedAt))}
          </span>
        </div>
        
        <h3 className="text-lg font-semibold text-secondary mb-2 line-clamp-2">
          {article.title}
        </h3>
        
        {article.description && (
          <p className="text-neutral text-sm mb-4 line-clamp-3">
            {article.description}
          </p>
        )}
        
        <div className="flex justify-between items-center">
          <span className="text-xs text-neutral">{article.source}</span>
          <Button
            onClick={handleOpenArticle}
            variant="link"
            size="sm"
            className="text-primary hover:text-blue-700 p-0 h-auto font-medium"
          >
            Read More <ExternalLink className="ml-1 h-3 w-3" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
