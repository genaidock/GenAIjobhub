import { NextResponse } from 'next/server';
import Razorpay from 'razorpay';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

const razorpay = new Razorpay({
  key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || 'rzp_test_mockkey',
  key_secret: process.env.RAZORPAY_KEY_SECRET || 'mocksecret',
});

const PACKAGE_PRICES: Record<string, { amount: number, credits: number }> = {
  single: { amount: 49900, credits: 1 },    // 499 INR
  starter: { amount: 199900, credits: 5 },  // 1999 INR
  growth: { amount: 349900, credits: 10 },  // 3499 INR
};

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

    const { package_id } = await req.json();

    if (!package_id || !PACKAGE_PRICES[package_id]) {
      return NextResponse.json({ error: 'Invalid package_id' }, { status: 400 });
    }

    const pkg = PACKAGE_PRICES[package_id];
    const currency = 'INR';

    const options = {
      amount: pkg.amount.toString(),
      currency,
      receipt: `receipt_pkg_${user.id}_${Date.now()}`,
      notes: {
        user_id: user.id,
        plan: 'job_package',
        credits_to_add: pkg.credits
      }
    };

    const order = await razorpay.orders.create(options);

    return NextResponse.json({ order });
  } catch (error: any) {
    console.error('Razorpay Create Package Order Error:', error);
    return NextResponse.json(
      { error: 'Failed to create package payment order' },
      { status: 500 }
    );
  }
}
