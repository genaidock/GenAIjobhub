import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(request: Request) {
  try {
    const { job_id } = await request.json();
    
    if (!job_id) {
      return NextResponse.json({ error: 'job_id is required' }, { status: 400 });
    }

    const { error } = await supabase
      .from('applications')
      .insert([{ job_id }]);

    if (error) {
      console.error('Error tracking application:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Error tracking application:', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
