import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { createClient } from '@supabase/supabase-js';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
  try {
    const { 
      razorpay_order_id, 
      razorpay_payment_id, 
      razorpay_signature, 
      job_id 
    } = await req.json();

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !job_id) {
      return NextResponse.json({ error: 'Missing required parameters' }, { status: 400 });
    }

    const key_secret = process.env.RAZORPAY_KEY_SECRET || 'mocksecret';

    // Verify signature
    const generated_signature = crypto
      .createHmac('sha256', key_secret)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest('hex');

    if (generated_signature !== razorpay_signature) {
      return NextResponse.json({ error: 'Invalid payment signature' }, { status: 400 });
    }

    // Verify job ID matches the order details directly from Razorpay
    const response = await fetch(`https://${process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID}:${key_secret}@api.razorpay.com/v1/orders/${razorpay_order_id}`);
    if (!response.ok) {
      return NextResponse.json({ error: 'Failed to fetch order details from Razorpay' }, { status: 500 });
    }
    const orderDetails = await response.json();
    
    if (orderDetails.notes?.job_id !== job_id) {
       return NextResponse.json({ error: 'Tampered job_id detected' }, { status: 400 });
    }

    // Payment is verified! Update the job to be featured
    const { error: updateError } = await supabaseAdmin
      .from('jobs')
      .update({
        is_featured: true,
        razorpay_order_id,
        razorpay_payment_id,
      })
      .eq('id', job_id);

    if (updateError) {
      console.error('Failed to update job status in DB:', updateError);
      return NextResponse.json({ error: 'Payment verified but failed to update job' }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Razorpay Verification Error:', error);
    return NextResponse.json({ error: 'Payment verification failed' }, { status: 500 });
  }
}
