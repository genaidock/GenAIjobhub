import { supabase } from '@/lib/supabase';

export const metadata = {
  title: "Best AI Tools Directory | GenAIJobHub",
  description: "The ultimate curated list of the best AI tools and resources.",
};

export const revalidate = 0;

export default async function ToolsDirectory() {
  const { data: tools } = await supabase
    .from('tools')
    .select('*')
    .order('created_at', { ascending: false });

  // Group tools by category
  const groupedTools = tools?.reduce((acc: any, tool: any) => {
    if (!acc[tool.category]) {
      acc[tool.category] = [];
    }
    acc[tool.category].push(tool);
    return acc;
  }, {}) || {};

  const categories = Object.keys(groupedTools).sort();

  return (
    <div className="flex flex-col items-center py-12 px-[5%]">
      <div className="max-w-[1200px] w-full">
        
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4">
            AI <span className="gradient-text">Tools Directory</span>
          </h1>
          <p className="text-text-secondary text-lg">
            The ultimate curated list of the best AI tools and resources.
          </p>
        </div>

        {(!tools || tools.length === 0) ? (
           <div className="text-center py-20 bg-bg-card rounded-2xl border border-border">
             <p className="text-text-secondary text-lg mb-4">✨ Top AI tools directory coming soon!</p>
           </div>
        ) : (
          <div className="flex flex-col gap-16">
            {categories.map((category) => (
              <div key={category}>
                <h2 className="text-2xl font-bold mb-6 text-white border-b border-white/10 pb-2 inline-block">
                  {category}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {groupedTools[category].map((tool: any) => (
                    <div key={tool.id} className="bg-bg-card border border-border rounded-2xl p-6 flex flex-col hover:-translate-y-1 hover:border-accent-primary hover:shadow-[0_10px_30px_rgba(0,0,0,0.2)] transition-all">
                      <div className="flex justify-between items-start mb-4">
                        <span className="px-3 py-1 bg-white/5 rounded-md text-xs font-semibold text-text-secondary">
                          {tool.category}
                        </span>
                        {tool.is_featured && (
                          <span className="text-xs font-bold text-accent-primary">Featured ⭐</span>
                        )}
                      </div>
                      <h3 className="text-2xl font-bold mb-2 text-text-primary">{tool.name}</h3>
                      <p className="text-text-secondary text-sm mb-6 flex-grow">{tool.description}</p>
                      <a 
                        href={tool.website_url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="w-full text-center py-3 rounded-lg font-semibold text-white bg-white/5 hover:bg-white/10 border border-white/10 transition-all"
                      >
                        Visit Website &rarr;
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
