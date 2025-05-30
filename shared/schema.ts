import { pgTable, text, serial, timestamp, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Articles schema for storing news articles
export const articles = pgTable("articles", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description"),
  content: text("content"),
  url: text("url").notNull(),
  urlToImage: text("url_to_image"),
  publishedAt: timestamp("published_at").notNull(),
  source: text("source").notNull(),
  category: text("category").notNull(),
  author: text("author"),
});

export const insertArticleSchema = createInsertSchema(articles).omit({
  id: true,
});

export type InsertArticle = z.infer<typeof insertArticleSchema>;
export type Article = typeof articles.$inferSelect;

// API response types for external news API
export type NewsAPIResponse = {
  status: string;
  totalResults: number;
  articles: NewsAPIArticle[];
};

export type NewsAPIArticle = {
  source: {
    id: string | null;
    name: string;
  };
  author: string | null;
  title: string;
  description: string | null;
  url: string;
  urlToImage: string | null;
  publishedAt: string;
  content: string | null;
};

// Filter types
export type CategoryFilter = 'all' | 'technology' | 'business' | 'sports' | 'entertainment' | 'health';
export type DateFilter = 'today' | 'week' | 'month' | 'custom';

export type ArticleFilters = {
  category: CategoryFilter;
  dateRange: DateFilter;
  customDate?: string;
  sortBy?: 'newest' | 'oldest' | 'relevance';
};
