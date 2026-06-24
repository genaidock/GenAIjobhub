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
      job_id,
      gig_id,
      proposal_id
    } = await req.json();

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
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

    // Verify order details directly from Razorpay
    const response = await fetch(`https://${process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID}:${key_secret}@api.razorpay.com/v1/orders/${razorpay_order_id}`);
    if (!response.ok) {
      return NextResponse.json({ error: 'Failed to fetch order details from Razorpay' }, { status: 500 });
    }
    const orderDetails = await response.json();
    const notes = orderDetails.notes || {};
    
    if (notes.tier === 'featured') {
      const verified_job_id = notes.job_id || job_id;
      if (notes.job_id && job_id && notes.job_id !== job_id) {
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
        .eq('id', verified_job_id);

      if (updateError) {
        console.error('Failed to update job status in DB:', updateError);
        return NextResponse.json({ error: 'Payment verified but failed to update job' }, { status: 500 });
      }
    } else if (notes.plan === 'gig_post') {
      const verified_gig_id = notes.gig_id || gig_id;
      if (notes.gig_id && gig_id && notes.gig_id !== gig_id) {
         return NextResponse.json({ error: 'Tampered gig_id detected' }, { status: 400 });
      }

      const { error: updateError } = await supabaseAdmin
        .from('gigs')
        .update({ payment_status: 'paid' })
        .eq('id', verified_gig_id);

      if (updateError) {
         throw updateError;
      }
    } else if (notes.plan === 'proposal_submission') {
      const verified_proposal_id = notes.proposal_id || proposal_id;
      if (notes.proposal_id && proposal_id && notes.proposal_id !== proposal_id) {
         return NextResponse.json({ error: 'Tampered proposal_id detected' }, { status: 400 });
      }

      const { error: updateError } = await supabaseAdmin
        .from('proposals')
        .update({ payment_status: 'paid' })
        .eq('id', verified_proposal_id);

      if (updateError) {
         throw updateError;
      }
    } else if (notes.plan === 'job_package') {
      const user_id = notes.user_id;
      const credits_to_add = parseInt(notes.credits_to_add || '0', 10);
      if (!user_id || credits_to_add <= 0) {
         return NextResponse.json({ error: 'Missing user_id or credits_to_add in notes' }, { status: 400 });
      }

      // Fetch current credits
      const { data: profile, error: fetchError } = await supabaseAdmin
        .from('profiles')
        .select('job_credits_remaining')
        .eq('id', user_id)
        .single();
        
      if (fetchError || !profile) {
         return NextResponse.json({ error: 'User not found' }, { status: 400 });
      }

      const { error: updateError } = await supabaseAdmin
        .from('profiles')
        .update({ job_credits_remaining: (profile.job_credits_remaining || 0) + credits_to_add })
        .eq('id', user_id);

      if (updateError) {
         throw updateError;
      }
    } else {
      return NextResponse.json({ error: 'Unknown payment plan' }, { status: 400 });
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Razorpay Verification Error:', error);
    return NextResponse.json({ error: 'Payment verification failed' }, { status: 500 });
  }
}
