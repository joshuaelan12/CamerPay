
import { NextRequest, NextResponse } from 'next/server';

/**
 * This endpoint handles webhook notifications from Tranzak.
 * Tranzak will send a POST request to this URL to update the status of a transaction.
 *
 * To use this, you must configure this URL in your Tranzak dashboard's webhook settings.
 * The full URL will be: https://<your-app-url>/api/tranzak-webhook
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Log the entire webhook payload for debugging purposes
    console.log('Received Tranzak Webhook:', JSON.stringify(body, null, 2));

    // =================================================================================
    // TODO: Process the webhook data
    //
    // In a real application, you would do the following:
    // 1. Verify the webhook signature (if Tranzak provides one) to ensure it's authentic.
    // 2. Get the transaction status and ID from the `body`.
    // 3. Find the corresponding transaction in your database using the ID.
    // 4. Update the transaction's status in the database (e.g., 'SUCCESSFUL', 'FAILED').
    // 5. Optionally, trigger other actions like sending a confirmation email to the user.
    // =================================================================================

    // Respond to Tranzak with a 200 OK to acknowledge receipt of the webhook.
    // If you don't send a 200 OK, Tranzak may retry sending the webhook.
    return NextResponse.json({ message: 'Webhook received' }, { status: 200 });

  } catch (error: any) {
    console.error('Error processing Tranzak webhook:', error);
    // Respond with an error status if something goes wrong
    return NextResponse.json({ message: 'Error processing webhook', error: error.message }, { status: 500 });
  }
}
