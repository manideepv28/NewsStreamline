import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import Header from "@/components/Header";
import FilterSection from "@/components/FilterSection";
import ArticleCard from "@/components/ArticleCard";
import LoadingGrid from "@/components/LoadingGrid";
import ErrorState from "@/components/ErrorState";
import { Button } from "@/components/ui/button";
import type { Article, CategoryFilter, DateFilter } from "@shared/schema";

export default function Home() {
  const [filters, setFilters] = useState({
    category: 'all' as CategoryFilter,
    dateRange: 'today' as DateFilter,
    customDate: '',
    sortBy: 'newest'
  });

  // Fetch articles from storage
  const { data, isLoading, error, refetch } = useQuery<{ articles: Article[]; total: number }>({
    queryKey: ['/api/articles', filters],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (filters.category !== 'all') params.set('category', filters.category);
      if (filters.dateRange) params.set('dateRange', filters.dateRange);
      if (filters.customDate) params.set('customDate', filters.customDate);
      if (filters.sortBy) params.set('sortBy', filters.sortBy);
      
      const response = await fetch(`/api/articles?${params.toString()}`);
      if (!response.ok) throw new Error('Failed to fetch articles');
      return response.json();
    }
  });

  // Fetch fresh articles from NewsAPI
  const fetchArticlesMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest('POST', '/api/articles/fetch', {});
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/articles'] });
    }
  });

  // Fetch fresh articles on component mount
  useEffect(() => {
    if (data?.articles.length === 0) {
      fetchArticlesMutation.mutate();
    }
  }, [data?.articles.length]);

  const handleCategoryChange = (category: CategoryFilter) => {
    setFilters(prev => ({ ...prev, category }));
  };

  const handleDateRangeChange = (dateRange: DateFilter) => {
    setFilters(prev => ({ ...prev, dateRange }));
  };

  const handleCustomDateChange = (customDate: string) => {
    setFilters(prev => ({ ...prev, customDate, dateRange: 'custom' }));
  };

  const handleSortChange = (sortBy: string) => {
    setFilters(prev => ({ ...prev, sortBy }));
  };

  const handleRetry = () => {
    refetch();
  };

  const handleFetchFresh = () => {
    fetchArticlesMutation.mutate();
  };

  if (error && !data) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <ErrorState onRetry={handleRetry} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white font-inter text-secondary">
      <Header />
      
      <FilterSection
        activeCategory={filters.category}
        activeDateRange={filters.dateRange}
        customDate={filters.customDate}
        onCategoryChange={handleCategoryChange}
        onDateRangeChange={handleDateRangeChange}
        onCustomDateChange={handleCustomDateChange}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Results Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-xl font-semibold text-secondary">Latest News</h2>
            <p className="text-neutral text-sm mt-1">
              {data ? `Showing ${data.articles.length} articles` : 'Loading...'}
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <span className="text-sm text-neutral">Sort by:</span>
              <select 
                value={filters.sortBy}
                onChange={(e) => handleSortChange(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="relevance">Most Relevant</option>
              </select>
            </div>
            <Button 
              onClick={handleFetchFresh}
              disabled={fetchArticlesMutation.isPending}
              variant="outline"
              size="sm"
            >
              {fetchArticlesMutation.isPending ? 'Fetching...' : 'Refresh'}
            </Button>
          </div>
        </div>

        {/* Loading State */}
        {(isLoading || fetchArticlesMutation.isPending) && <LoadingGrid />}

        {/* Articles Grid */}
        {data && data.articles.length > 0 && !isLoading && (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {data.articles.map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>
        )}

        {/* Empty State */}
        {data && data.articles.length === 0 && !isLoading && !fetchArticlesMutation.isPending && (
          <div className="text-center py-16">
            <div className="text-6xl text-gray-300 mb-4">📰</div>
            <h3 className="text-xl font-semibold text-secondary mb-2">No articles found</h3>
            <p className="text-neutral mb-6">
              No articles match your current filters. Try adjusting your search criteria or fetch fresh articles.
            </p>
            <Button onClick={handleFetchFresh} disabled={fetchArticlesMutation.isPending}>
              {fetchArticlesMutation.isPending ? 'Fetching...' : 'Fetch Articles'}
            </Button>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-surface border-t border-gray-200 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <p className="text-neutral text-sm">
              &copy; 2024 NewsFlow. Stay informed with the latest news from around the world.
            </p>
            <div className="mt-4 space-x-6">
              <a href="#" className="text-neutral hover:text-secondary text-sm transition-colors">About</a>
              <a href="#" className="text-neutral hover:text-secondary text-sm transition-colors">Privacy</a>
              <a href="#" className="text-neutral hover:text-secondary text-sm transition-colors">Terms</a>
              <a href="#" className="text-neutral hover:text-secondary text-sm transition-colors">Contact</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
