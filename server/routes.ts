import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { z } from "zod";
import type { NewsAPIResponse, NewsAPIArticle, InsertArticle, ArticleFilters } from "@shared/schema";

const API_KEY = process.env.NEWS_API_KEY || process.env.NEWSAPI_KEY || "";

export async function registerRoutes(app: Express): Promise<Server> {
  
  // Get articles with filtering
  app.get("/api/articles", async (req, res) => {
    try {
      const { category, dateRange, customDate, sortBy } = req.query;
      
      let dateFrom: Date | undefined;
      let dateTo: Date | undefined;
      
      // Calculate date filters
      const now = new Date();
      switch (dateRange) {
        case 'today':
          dateFrom = new Date(now.getFullYear(), now.getMonth(), now.getDate());
          dateTo = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
          break;
        case 'week':
          dateFrom = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          dateTo = now;
          break;
        case 'month':
          dateFrom = new Date(now.getFullYear(), now.getMonth(), 1);
          dateTo = now;
          break;
        case 'custom':
          if (customDate) {
            dateFrom = new Date(customDate as string);
            dateTo = new Date(dateFrom.getTime() + 24 * 60 * 60 * 1000);
          }
          break;
      }

      const articles = await storage.getArticles({
        category: category as string,
        dateFrom,
        dateTo,
        sortBy: sortBy as string || 'newest'
      });

      res.json({ articles, total: articles.length });
    } catch (error) {
      console.error("Error fetching articles:", error);
      res.status(500).json({ message: "Failed to fetch articles" });
    }
  });

  // Fetch fresh articles from NewsAPI
  app.post("/api/articles/fetch", async (req, res) => {
    try {
      if (!API_KEY) {
        return res.status(400).json({ message: "News API key not configured" });
      }

      const { category = 'general', country = 'us' } = req.body;
      
      // Clear existing articles
      await storage.clearArticles();

      // Fetch articles for different categories
      const categories = ['technology', 'business', 'sports', 'entertainment', 'health'];
      const allArticles: InsertArticle[] = [];

      for (const cat of categories) {
        try {
          const url = `https://newsapi.org/v2/top-headlines?category=${cat}&country=${country}&apiKey=${API_KEY}&pageSize=20`;
          const response = await fetch(url);
          
          if (!response.ok) {
            console.error(`Failed to fetch ${cat} articles:`, response.statusText);
            continue;
          }
          
          const data: NewsAPIResponse = await response.json();
          
          const categoryArticles: InsertArticle[] = data.articles
            .filter(article => article.title && article.url && article.title !== '[Removed]')
            .map(article => ({
              title: article.title,
              description: article.description || '',
              content: article.content || '',
              url: article.url,
              urlToImage: article.urlToImage,
              publishedAt: new Date(article.publishedAt),
              source: article.source.name,
              category: cat,
              author: article.author,
            }));

          allArticles.push(...categoryArticles);
        } catch (error) {
          console.error(`Error fetching ${cat} articles:`, error);
        }
      }

      // Store articles in memory
      const storedArticles = await storage.createArticles(allArticles);
      
      res.json({ 
        message: "Articles fetched successfully", 
        count: storedArticles.length 
      });
    } catch (error) {
      console.error("Error fetching fresh articles:", error);
      res.status(500).json({ message: "Failed to fetch fresh articles" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
