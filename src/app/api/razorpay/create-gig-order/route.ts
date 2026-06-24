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

    const { gig_id } = await req.json();

    if (!gig_id) {
      return NextResponse.json({ error: 'Gig ID is required' }, { status: 400 });
    }

    // Verify ownership
    const { data: gig } = await supabase.from('gigs').select('employer_id, payment_status').eq('id', gig_id).single();
    if (!gig || gig.employer_id !== user.id) {
      return NextResponse.json({ error: "Forbidden: You do not own this gig" }, { status: 403 });
    }

    if (gig.payment_status === 'paid') {
      return NextResponse.json({ error: "Gig is already paid for" }, { status: 400 });
    }

    // Amount is in currency subunits. 499 INR = 49900 paise.
    const amount = 49900;
    const currency = 'INR';

    const options = {
      amount: amount.toString(),
      currency,
      receipt: `receipt_gig_${gig_id}`,
      notes: {
        gig_id,
        plan: 'gig_post'
      }
    };

    const order = await razorpay.orders.create(options);

    return NextResponse.json({ order });
  } catch (error: any) {
    console.error('Razorpay Create Gig Order Error:', error);
    return NextResponse.json(
      { error: 'Failed to create gig payment order' },
      { status: 500 }
    );
  }
}
