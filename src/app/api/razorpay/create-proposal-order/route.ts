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

    const { proposal_id } = await req.json();

    if (!proposal_id) {
      return NextResponse.json({ error: 'Proposal ID is required' }, { status: 400 });
    }

    // Verify ownership
    const { data: proposal } = await supabase.from('proposals').select('freelancer_id, payment_status').eq('id', proposal_id).single();
    if (!proposal || proposal.freelancer_id !== user.id) {
      return NextResponse.json({ error: "Forbidden: You do not own this proposal" }, { status: 403 });
    }

    if (proposal.payment_status === 'paid') {
      return NextResponse.json({ error: "Proposal is already paid for" }, { status: 400 });
    }

    // Amount is in currency subunits. 49 INR = 4900 paise.
    const amount = 4900;
    const currency = 'INR';

    const options = {
      amount: amount.toString(),
      currency,
      receipt: `receipt_proposal_${proposal_id}`,
      notes: {
        proposal_id,
        plan: 'proposal_submission'
      }
    };

    const order = await razorpay.orders.create(options);

    return NextResponse.json({ order });
  } catch (error: any) {
    console.error('Razorpay Create Proposal Order Error:', error);
    return NextResponse.json(
      { error: 'Failed to create proposal payment order' },
      { status: 500 }
    );
  }
}
