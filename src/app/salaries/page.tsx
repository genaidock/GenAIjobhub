import { supabase } from '@/lib/supabase';
import SalaryExplorerClient from './SalaryExplorerClient';

export const metadata = {
  title: "AI Salary Matrix 2026 | GenAIJobHub — ML Engineer, Prompt Engineer Pay",
  description: "Compare average compensation for the hottest AI roles globally vs. in India across all experience levels. Dynamically updated by AI.",
};

export const revalidate = 0;

export default async function SalaryExplorer() {
  
  // Try to fetch dynamic data
  let roles: any[] = [];
  let errorMsg = '';
  let lastUpdated = '';

  try {
    const { data, error } = await supabase
      .from('salary_trends')
      .select('*')
      .order('role_title', { ascending: true });
      
    if (error) throw error;
    if (data && data.length > 0) {
      roles = data;
      lastUpdated = new Date(data[0].last_updated).toLocaleDateString();
    }
  } catch (err: any) {
    console.error('Failed to load salary trends:', err);
    errorMsg = "Database tables not found. Please ensure you've run the Phase 6 SQL migration to seed the massive Salary Matrix.";
  }

  // If no data, we pass an empty array and let the client component handle the empty state
  // Though typically we'd show the error boundary or the UI with 0 results.
  
  return <SalaryExplorerClient roles={roles} errorMsg={errorMsg} lastUpdated={lastUpdated} />;
}
