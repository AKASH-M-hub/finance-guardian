import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface StockQuote {
  symbol: string;
  price: number;
  change: number;
  changePercent: number;
  high: number;
  low: number;
  volume: number;
  lastUpdated: string;
}

interface MarketNews {
  title: string;
  description: string;
  source: string;
  url: string;
  publishedAt: string;
  sentiment?: 'positive' | 'negative' | 'neutral';
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { type, symbol, query } = await req.json();
    
    const ALPHA_VANTAGE_API_KEY = Deno.env.get("ALPHA_VANTAGE_API_KEY");
    const NEWS_API_KEY = Deno.env.get("NEWS_API_KEY");

    if (type === "stock" && symbol) {
      if (!ALPHA_VANTAGE_API_KEY) {
        throw new Error("ALPHA_VANTAGE_API_KEY is not configured");
      }

      console.log(`Fetching stock data for ${symbol}`);
      
      const response = await fetch(
        `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${ALPHA_VANTAGE_API_KEY}`
      );

      if (!response.ok) {
        throw new Error(`Alpha Vantage API error: ${response.status}`);
      }

      const data = await response.json();
      
      if (data["Error Message"]) {
        throw new Error(data["Error Message"]);
      }

      if (data["Note"]) {
        // Rate limit hit
        return new Response(
          JSON.stringify({ error: "API rate limit reached. Please try again in a minute." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      const quote = data["Global Quote"];
      
      if (!quote || Object.keys(quote).length === 0) {
        return new Response(
          JSON.stringify({ error: "No data found for symbol" }),
          { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      const stockData: StockQuote = {
        symbol: quote["01. symbol"],
        price: parseFloat(quote["05. price"]),
        change: parseFloat(quote["09. change"]),
        changePercent: parseFloat(quote["10. change percent"].replace('%', '')),
        high: parseFloat(quote["03. high"]),
        low: parseFloat(quote["04. low"]),
        volume: parseInt(quote["06. volume"]),
        lastUpdated: quote["07. latest trading day"],
      };

      return new Response(
        JSON.stringify({ success: true, data: stockData }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (type === "news") {
      if (!NEWS_API_KEY) {
        throw new Error("NEWS_API_KEY is not configured");
      }

      const searchQuery = query || "finance economy money";
      console.log(`Fetching news for: ${searchQuery}`);

      const response = await fetch(
        `https://newsapi.org/v2/everything?q=${encodeURIComponent(searchQuery)}&language=en&sortBy=publishedAt&pageSize=10&apiKey=${NEWS_API_KEY}`
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `NewsAPI error: ${response.status}`);
      }

      const data = await response.json();

      if (data.status !== "ok") {
        throw new Error(data.message || "Failed to fetch news");
      }

      const newsData: MarketNews[] = data.articles.map((article: any) => ({
        title: article.title,
        description: article.description,
        source: article.source?.name || "Unknown",
        url: article.url,
        publishedAt: article.publishedAt,
        sentiment: analyzeSentiment(article.title + " " + (article.description || "")),
      }));

      return new Response(
        JSON.stringify({ success: true, data: newsData }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (type === "timeseries" && symbol) {
      if (!ALPHA_VANTAGE_API_KEY) {
        throw new Error("ALPHA_VANTAGE_API_KEY is not configured");
      }

      console.log(`Fetching time series for ${symbol}`);

      const response = await fetch(
        `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${symbol}&outputsize=compact&apikey=${ALPHA_VANTAGE_API_KEY}`
      );

      if (!response.ok) {
        throw new Error(`Alpha Vantage API error: ${response.status}`);
      }

      const data = await response.json();

      if (data["Note"]) {
        return new Response(
          JSON.stringify({ error: "API rate limit reached. Please try again in a minute." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      const timeSeries = data["Time Series (Daily)"];
      
      if (!timeSeries) {
        return new Response(
          JSON.stringify({ error: "No time series data found" }),
          { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      const seriesData = Object.entries(timeSeries).slice(0, 30).map(([date, values]: [string, any]) => ({
        date,
        open: parseFloat(values["1. open"]),
        high: parseFloat(values["2. high"]),
        low: parseFloat(values["3. low"]),
        close: parseFloat(values["4. close"]),
        volume: parseInt(values["5. volume"]),
      }));

      return new Response(
        JSON.stringify({ success: true, data: seriesData }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({ error: "Invalid request type. Use 'stock', 'news', or 'timeseries'" }),
      { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("Market data error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});

// Simple sentiment analysis based on keywords
function analyzeSentiment(text: string): 'positive' | 'negative' | 'neutral' {
  const lowerText = text.toLowerCase();
  
  const positiveWords = ['gain', 'growth', 'rise', 'surge', 'profit', 'bullish', 'rally', 'up', 'high', 'record', 'boost', 'positive'];
  const negativeWords = ['loss', 'fall', 'drop', 'crash', 'bearish', 'decline', 'down', 'low', 'fear', 'recession', 'crisis', 'negative'];
  
  let positiveScore = 0;
  let negativeScore = 0;
  
  positiveWords.forEach(word => {
    if (lowerText.includes(word)) positiveScore++;
  });
  
  negativeWords.forEach(word => {
    if (lowerText.includes(word)) negativeScore++;
  });
  
  if (positiveScore > negativeScore) return 'positive';
  if (negativeScore > positiveScore) return 'negative';
  return 'neutral';
}
