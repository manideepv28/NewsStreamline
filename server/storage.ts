import { articles, type Article, type InsertArticle } from "@shared/schema";

export interface IStorage {
  getArticles(filters?: {
    category?: string;
    dateFrom?: Date;
    dateTo?: Date;
    sortBy?: string;
  }): Promise<Article[]>;
  createArticle(article: InsertArticle): Promise<Article>;
  createArticles(articles: InsertArticle[]): Promise<Article[]>;
  clearArticles(): Promise<void>;
}

export class MemStorage implements IStorage {
  private articles: Map<number, Article>;
  private currentId: number;

  constructor() {
    this.articles = new Map();
    this.currentId = 1;
  }

  async getArticles(filters?: {
    category?: string;
    dateFrom?: Date;
    dateTo?: Date;
    sortBy?: string;
  }): Promise<Article[]> {
    let filteredArticles = Array.from(this.articles.values());

    if (filters) {
      // Filter by category
      if (filters.category && filters.category !== 'all') {
        filteredArticles = filteredArticles.filter(
          article => article.category.toLowerCase() === filters.category?.toLowerCase()
        );
      }

      // Filter by date range
      if (filters.dateFrom) {
        filteredArticles = filteredArticles.filter(
          article => new Date(article.publishedAt) >= filters.dateFrom!
        );
      }

      if (filters.dateTo) {
        filteredArticles = filteredArticles.filter(
          article => new Date(article.publishedAt) <= filters.dateTo!
        );
      }

      // Sort articles
      if (filters.sortBy) {
        filteredArticles.sort((a, b) => {
          const dateA = new Date(a.publishedAt).getTime();
          const dateB = new Date(b.publishedAt).getTime();
          
          switch (filters.sortBy) {
            case 'newest':
              return dateB - dateA;
            case 'oldest':
              return dateA - dateB;
            case 'relevance':
            default:
              return dateB - dateA; // Default to newest
          }
        });
      }
    }

    return filteredArticles;
  }

  async createArticle(insertArticle: InsertArticle): Promise<Article> {
    const id = this.currentId++;
    const article: Article = { ...insertArticle, id };
    this.articles.set(id, article);
    return article;
  }

  async createArticles(insertArticles: InsertArticle[]): Promise<Article[]> {
    const createdArticles: Article[] = [];
    for (const insertArticle of insertArticles) {
      const article = await this.createArticle(insertArticle);
      createdArticles.push(article);
    }
    return createdArticles;
  }

  async clearArticles(): Promise<void> {
    this.articles.clear();
    this.currentId = 1;
  }
}

export const storage = new MemStorage();
