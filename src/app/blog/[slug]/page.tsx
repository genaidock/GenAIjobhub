import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, Calendar, Clock, User, Share2 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

// We import the same BLOG_POSTS list to search and match
import { BLOG_POSTS } from '../page';

interface ArticleData {
  title: string;
  category: string;
  date: string;
  readTime: string;
  author: string;
  content: string;
}

const ARTICLE_BODY: Record<string, ArticleData> = {
  'land-prompt-engineering-job-2026': {
    title: 'How to Land a Prompt Engineering Job in 2026',
    category: 'Career Advice',
    date: 'June 18, 2026',
    readTime: '5 min read',
    author: 'Arjun Sharma',
    content: `
Prompt engineering has officially transitioned from a simple trial-and-error hack to a systematic, software engineering discipline. In the early days of ChatGPT, simply knowing how to say "Act as a software developer..." was enough. Today, recruiters expect deep competencies in testing, evaluation, optimization, and AI application architecture.

Here is what hiring teams at top startups are looking for this year:

### 1. Systematic Evaluations and Red-Teaming
It's no longer about finding a prompt that works *once*. It's about ensuring your prompts are robust against millions of user requests.
* **Competency:** You should be familiar with creating evaluation frameworks (using tools like Promptfoo, LangSmith, or custom scripts).
* **Skills:** Red-teaming prompts to prevent prompt injection and system instruction leaks.

### 2. Multi-Agent Systems & Flow Engineering
Single prompts are hitting cognitive walls. Modern AI apps are built using **multi-agent architectures** where specialized prompts handle distinct steps in a complex workflow.
* **Competency:** Experience with orchestration frameworks like LangGraph, CrewAI, or Autogen.
* **Concept:** Understanding state management, human-in-the-loop triggers, and routing.

### 3. Basic Programming Proficiency (Python/TS)
The days of non-technical prompt engineers are largely over. Startups need team players who can write the code that executes the prompts.
* **Competency:** You must be comfortable working with LLM client libraries, orchestrators, and APIs.
* **Skills:** Writing scripts to evaluate outputs, format data schemas, and interface with vector stores.

---

### Actionable Advice for Applicants:
1. **Build a GitHub Portfolio:** Do not just write a list of skills on your resume. Build a real, working chatbot or agent workflow, publish the codebase, and link it in your application.
2. **Quantify Your Success:** Don't write "Optimized prompts for customer support." Write: *"Reduced LLM token consumption by 32% and lowered hallucination rates by 18% using systematic few-shot evaluations."*
`
  },
  'fine-tuning-vs-rag': {
    title: 'Fine-Tuning vs RAG: Which Skill is More Valuable?',
    category: 'AI Engineering',
    date: 'June 15, 2026',
    readTime: '7 min read',
    author: 'Sarah Connor',
    content: `
If you are transitioning into AI Engineering, one of the most critical decisions you will make is deciding where to focus your engineering study time. Two paradigms dominate the landscape of custom LLM implementations: **Retrieval-Augmented Generation (RAG)** and **Fine-Tuning**.

Let's break down which skill is more valuable, why, and when to use each.

### 1. Retrieval-Augmented Generation (RAG)
RAG is the process of supplying an LLM with external documents (from databases, vector stores, or APIs) at runtime so it has the context it needs to answer queries.

* **When it is used:** For dynamic data, real-time knowledge, and strict factual compliance (e.g., querying private company wikis).
* **Key Skills Required:** Semantic search, vector databases (Pinecone, pgvector, Qdrant), chunking strategies, and re-ranking models.
* **Job Market Value:** **Extremely High.** 90% of business applications built today use RAG because it is cheap, easy to update, and prevents hallucinations.

### 2. Fine-Tuning
Fine-tuning is the process of taking an existing pre-trained model and training it further on a specific dataset to alter its behavior, style, or structure.

* **When it is used:** For domain-specific formatting (e.g., outputting exact code syntax), reducing model size (distilling a massive model into a fast, cheap 7B model), and style alignment.
* **Key Skills Required:** Dataset curation, LoRA/QLoRA adapters, compute scaling (DeepSpeed), and evaluation benchmarks.
* **Job Market Value:** **High but Specialized.** Only a fraction of companies require training custom adapters, but the ones who do pay a massive premium.

---

### The Verdict:
If you are starting out, **master RAG first**. RAG represents the day-to-day workhorse of the AI engineering industry. Once you have built a strong grasp of vector search and orchestrators, layer in **Fine-Tuning** (specifically parameter-efficient fine-tuning like QLoRA) to set yourself apart as an elite practitioner.
`
  },
  'top-remote-ai-companies': {
    title: 'Top AI Startups Hiring Remote Developers Right Now',
    category: 'Job Search',
    readTime: '4 min read',
    author: 'Vikram Rao',
    date: 'June 10, 2026',
    content: `
Working remotely in AI is becoming the standard. Because the talent pool for machine learning, prompt engineering, and RAG systems is highly global, fast-growing AI startups are aggressively hiring remote talent. 

Here are the top sectors and companies hiring remote AI professionals right now:

### 1. AI Infrastructure & Tooling
Startups building the plumbing for AI models (orchestrators, vector search, evaluation suites) are leading remote hiring.
* **Notable Sectors:** Vector database providers, observability suites, and compute platforms.
* **In-Demand Roles:** Backend Engineers (Rust/Go), ML Systems Engineers, and Developer Advocates.

### 2. AI Agents & Workflows
Companies building autonomous agents for customer success, software engineering, and sales ops are scaling rapidly.
* **Notable Sectors:** DevTools (AI coding assistants), customer support automation.
* **In-Demand Roles:** Full Stack AI Engineers, Prompt Engineers, and QA automation specialists.

### 3. Applied ML & Fine-Tuning Agencies
B2B consultancy teams that build custom AI models for traditional enterprises are growing.
* **Notable Sectors:** Specialized consultancy, custom adapter training.
* **In-Demand Roles:** Applied AI Researchers, Data Curators, and Solutions Architects.

---

### How to stand out to Remote Startups:
* **Showcase Open Source Contributions:** Contributions to LangChain, LlamaIndex, or huggingface libraries are the gold standard for resumes.
* **Build Publicly:** Write blogs or post Twitter/X updates explaining how you solved a challenging technical issue (like model latency or chunking limitations). Startups hire builders who communicate exceptionally well.
`
  }
};

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = BLOG_POSTS.find(p => p.slug === slug);
  if (!post) return { title: 'Post Not Found | GenAIJobHub' };
  return {
    title: `${post.title} | GenAIJobHub Blog`,
    description: post.excerpt,
  };
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = ARTICLE_BODY[slug];

  if (!post) {
    notFound();
  }

  return (
    <div className="flex flex-col items-center">
      {/* Article Header */}
      <section className="hero-glow hero-grid w-full py-16 md:py-20 px-[5%] bg-background relative overflow-hidden">
        <div className="max-w-[800px] mx-auto relative z-10">
          <Link href="/blog" className="inline-flex items-center gap-2 text-text-secondary hover:text-white mb-6 transition-colors text-sm font-medium">
            <ArrowLeft className="w-4 h-4" /> Back to Blog
          </Link>
          <span className="inline-block px-3 py-1 bg-accent-primary/10 text-accent-primary rounded-full font-bold text-xs uppercase tracking-wider mb-4 border border-accent-primary/10">
            {post.category}
          </span>
          <h1 className="text-3xl md:text-5xl font-extrabold mb-6 text-white tracking-tight leading-tight">
            {post.title}
          </h1>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-3 text-text-secondary font-medium text-sm">
            <div className="flex items-center gap-2 text-accent-primary">
              <User className="w-4 h-4" />
              <span>By {post.author}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <span>{post.date}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              <span>{post.readTime}</span>
            </div>
          </div>
        </div>
      </section>

      <div className="section-transition-dark-to-light w-full" />

      {/* Article Content */}
      <section className="section-light w-full py-12 px-[5%]">
        <div className="max-w-[800px] mx-auto flex flex-col md:flex-row gap-8 items-start">
          <article className="flex-grow card-light p-8 md:p-12 w-full">
            <div className="prose prose-purple prose-slate max-w-none text-text-dark-secondary leading-relaxed">
              <ReactMarkdown>{post.content}</ReactMarkdown>
            </div>
          </article>

          {/* Share Widget */}
          <aside className="w-full md:w-[180px] flex-shrink-0 sticky top-24 card-light p-5 flex flex-col gap-3 items-center text-center">
            <Share2 className="w-5 h-5 text-text-dark-tertiary mb-1" />
            <span className="font-bold text-xs uppercase text-text-dark-tertiary tracking-wider">Share Article</span>
            <button 
              onClick={() => {
                navigator.clipboard.writeText(window.location.href);
                alert("Article link copied to clipboard!");
              }} 
              className="text-xs font-semibold px-4 py-2 bg-slate-50 border border-border-light hover:bg-slate-100 rounded-lg text-text-dark transition-colors w-full"
            >
              Copy Link
            </button>
          </aside>
        </div>
      </section>
    </div>
  );
}
