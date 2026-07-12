---
name: ai-seo
description: "Guidelines and instructions for optimizing content, structure, and metadata for AI SEO."
---

# AI SEO (Search Engine Optimization for AI)

This skill provides guidelines and best practices for optimizing web content so that it is easily discoverable, parsed, and understood by both traditional search engines and AI-driven aggregators (like LLMs and AI search bots).

## Core Principles

When writing, designing, or structuring web applications, adhere to the following principles:

### 1. Optimizing Metadata
- **Descriptive Titles & Meta Tags:** Ensure `<title>` and `<meta name="description">` are concise, descriptive, and accurately summarize the page content.
- **Structured Data:** Implement JSON-LD structured data (e.g., Article, Product, FAQPage) where applicable. AI parsers heavily rely on structured data to quickly identify entities and relationships.
- **Rich Previews:** Provide Open Graph (`og:`) and Twitter card metadata for better context when content is referenced or shared.

### 2. Structuring Semantic HTML
- **Logical Hierarchy:** Use a single `<h1>` tag for the page's primary topic. Use `<h2>`, `<h3>`, etc., in a strictly logical, descending order to form an outline of the page.
- **Semantic Elements:** Utilize HTML5 semantic elements (`<main>`, `<article>`, `<section>`, `<nav>`, `<aside>`) instead of generic `<div>` tags whenever possible. This helps AI bots understand the layout and purpose of different content blocks.
- **Accessibility (A11y):** Ensure good accessibility practices (like meaningful `alt` text on images and descriptive link text). Accessible content is inherently easier for AI models to parse.

### 3. Focusing on Intent-Based Keywords
- **Directly Answer Questions:** AI search systems try to directly answer user queries (e.g., "how to do X", "what is Y"). Structure content to clearly and concisely answer these likely intents.
- **Natural Language:** Write in a clear, conversational, and natural tone. Avoid keyword stuffing. Use semantically related terms naturally.
- **Information Density:** Place the most critical information early in the content (the inverted pyramid approach). Use bullet points and concise paragraphs to make data extraction easy for AI aggregators.
