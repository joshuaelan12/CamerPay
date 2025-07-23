
import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

/**
 * This endpoint handles webhook notifications from Tranzak.
 * Tranzak will send a POST request to this URL to update the status of a transaction.
 *
 * To use this, you must configure this URL in your Tranzak dashboard's webhook settings.
 * The full URL will be: https://<your-app-url>/api/tranzak-webhook
 */
export async function POST(req: NextRequest) {
  try {
    const signature = req.headers.get('X-Tranzak-Signature');
    const secret = process.env.TRANZAK_WEBHOOK_SECRET;
    const bodyText = await req.text(); // Read the body as raw text

    if (!secret) {
        console.error('Tranzak webhook secret is not configured.');
        return NextResponse.json({ message: 'Server configuration error' }, { status: 500 });
    }

    if (!signature) {
        console.warn('Received webhook without signature.');
        return NextResponse.json({ message: 'Missing signature' }, { status: 400 });
    }

    // Verify the webhook signature
    const hmac = crypto.createHmac('sha256', secret);
    hmac.update(bodyText);
    const calculatedSignature = hmac.digest('hex');

    if (calculatedSignature !== signature) {
        console.warn('Invalid webhook signature received.');
        return NextResponse.json({ message: 'Invalid signature' }, { status: 403 });
    }
    
    // The signature is valid, so we can now safely parse the body as JSON
    const body = JSON.parse(bodyText);

    // Log the entire webhook payload for debugging purposes
    console.log('Received verified Tranzak Webhook:', JSON.stringify(body, null, 2));

    // =================================================================================
    // TODO: Process the webhook data
    //
    // Now that the webhook is verified, you would do the following:
    // 1. Get the transaction status and ID from the `body`.
    // 2. Find the corresponding transaction in your database using the ID.
    // 3. Update the transaction's status in the database (e.g., 'SUCCESSFUL', 'FAILED').
    // 4. Optionally, trigger other actions like sending a confirmation email to the user.
    // =================================================================================

    // Respond to Tranzak with a 200 OK to acknowledge receipt of the webhook.
    return NextResponse.json({ message: 'Webhook received and verified' }, { status: 200 });

  } catch (error: any) {
    console.error('Error processing Tranzak webhook:', error);
    // Respond with an error status if something goes wrong
    return NextResponse.json({ message: 'Error processing webhook', error: error.message }, { status: 500 });
  }
}
