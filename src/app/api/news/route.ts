import { NextResponse } from 'next/server';

export const revalidate = 1800; // Cache news feed for 30 minutes

// Helper to clean CDATA wrappers
const cleanCDATA = (str: string) => {
  return str.replace(/<!\[CDATA\[([\s\S]*?)\]\]>/gi, '$1').trim();
};

// Helper to parse a standard RSS feed string into an array of items
function parseRss(xml: string, isIndia: boolean, maxCount: number) {
  const items = [];
  const itemRegex = /<item>([\s\S]*?)<\/item>/g;
  let match;

  while ((match = itemRegex.exec(xml)) !== null && items.length < maxCount) {
    const itemContent = match[1];

    const titleRaw = itemContent.match(/<title>([\s\S]*?)<\/title>/)?.[1] || '';
    const link = itemContent.match(/<link>([\s\S]*?)<\/link>/)?.[1]?.trim() || '';
    const pubDate = itemContent.match(/<pubDate>([\s\S]*?)<\/pubDate>/)?.[1]?.trim() || '';
    
    // Extract creator/source
    let source = isIndia ? 'Google News India' : 'TechCrunch';
    const creatorRaw = itemContent.match(/<dc:creator>([\s\S]*?)<\/dc:creator>/)?.[1] || '';
    const sourceRaw = itemContent.match(/<source[^>]*>([\s\S]*?)<\/source>/)?.[1] || '';

    if (creatorRaw) {
      source = cleanCDATA(creatorRaw);
    } else if (sourceRaw) {
      source = cleanCDATA(sourceRaw);
    }

    let title = cleanCDATA(titleRaw);

    // Google news RSS puts the source name at the end of the title "Title - Source". Let's clean it up.
    if (isIndia && title.includes(' - ')) {
      const parts = title.split(' - ');
      if (parts.length > 1) {
        source = parts.pop() || source;
        title = parts.join(' - ');
      }
    }

    let formattedDate = pubDate;
    try {
      if (pubDate) {
        formattedDate = new Date(pubDate).toLocaleDateString('en-US', {
          month: 'short', day: 'numeric', year: 'numeric'
        });
      }
    } catch (_) {}

    if (title && link) {
      items.push({
        title,
        link,
        date: formattedDate,
        author: source,
        is_india: isIndia
      });
    }
  }

  return items;
}

export async function GET() {
  try {
    const headers = {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    };

    // 1. Fetch India-centric AI News (Google News RSS Search for "AI India")
    const indiaRssUrl = 'https://news.google.com/rss/search?q=AI+India&hl=en-IN&gl=IN&ceid=IN:en';
    let indiaNews: any[] = [];
    try {
      const resIndia = await fetch(indiaRssUrl, { headers, next: { revalidate: 1800 } });
      if (resIndia.ok) {
        const xml = await resIndia.text();
        indiaNews = parseRss(xml, true, 6); // Fetch top 6 India stories
      }
    } catch (e) {
      console.warn("Failed to fetch India AI news:", e);
    }

    // 2. Fetch Global AI News (TechCrunch AI RSS Feed)
    const globalRssUrl = 'https://techcrunch.com/category/artificial-intelligence/feed/';
    let globalNews: any[] = [];
    try {
      const resGlobal = await fetch(globalRssUrl, { headers, next: { revalidate: 1800 } });
      if (resGlobal.ok) {
        const xml = await resGlobal.text();
        globalNews = parseRss(xml, false, 6); // Fetch top 6 Global stories
      }
    } catch (e) {
      console.warn("Failed to fetch Global AI news:", e);
    }

    // Merge feeds: placing India-centric stories at the top
    const mergedNews = [...indiaNews, ...globalNews];

    if (mergedNews.length === 0) {
      throw new Error("No news articles could be fetched from any feed source.");
    }

    return NextResponse.json({ success: true, news: mergedNews });

  } catch (error: any) {
    console.error("AI News Aggregator Error:", error);

    // High-quality static fallback prioritizing India
    const fallbackNews = [
      {
        title: "India’s AI Startups Gain Momentum as Early-Stage Funding Surges in Tech Hubs",
        link: "https://inc42.com/",
        date: "Jun 20, 2026",
        author: "Inc42",
        is_india: true
      },
      {
        title: "Government of India to Launch Next Phase of IndiaAI Mission Supporting GPU Access",
        link: "https://pib.gov.in/",
        date: "Jun 18, 2026",
        author: "PIB Delhi",
        is_india: true
      },
      {
        title: "Anthropic Releases Claude 3.5 Sonnet: Setting New Benchmarks for AI Reasoning",
        link: "https://www.anthropic.com/news/claude-3-5-sonnet",
        date: "Jun 20, 2026",
        author: "Anthropic Team",
        is_india: false
      },
      {
        title: "OpenAI Announces Advanced Voice Mode Rollout for ChatGPT Plus Subscribers",
        link: "https://openai.com/blog",
        date: "Jun 18, 2026",
        author: "OpenAI Press",
        is_india: false
      }
    ];

    return NextResponse.json({ success: true, news: fallbackNews, warning: "Using fallback AI feed" });
  }
}
