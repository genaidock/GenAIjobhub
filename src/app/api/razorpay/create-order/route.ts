import { NextResponse } from 'next/server';
import Razorpay from 'razorpay';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

const razorpay = new Razorpay({
  key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || 'rzp_test_mockkey',
  key_secret: process.env.RAZORPAY_KEY_SECRET || 'mocksecret',
});

export async function POST(req: Request) {
  try {
    const cookieStore = await cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() { return cookieStore.getAll() },
          setAll(cookiesToSet) {
            try { cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options)) } catch (_) {}
          },
        },
      }
    );

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { job_id } = await req.json();

    if (!job_id) {
      return NextResponse.json({ error: 'Job ID is required' }, { status: 400 });
    }

    // Verify ownership
    const { data: job } = await supabase.from('jobs').select('employer_id').eq('id', job_id).single();
    if (!job || job.employer_id !== user.id) {
      return NextResponse.json({ error: "Forbidden: You do not own this job" }, { status: 403 });
    }

    // Amount is in currency subunits. 999 INR = 99900 paise.
    const amount = 99900;
    const currency = 'INR';

    const options = {
      amount: amount.toString(),
      currency,
      receipt: `receipt_job_${job_id}`,
      notes: {
        job_id,
        tier: 'featured'
      }
    };

    const order = await razorpay.orders.create(options);

    return NextResponse.json({ order });
  } catch (error: any) {
    console.error('Razorpay Create Order Error:', error);
    return NextResponse.json(
      { error: 'Failed to create payment order' },
      { status: 500 }
    );
  }
}
