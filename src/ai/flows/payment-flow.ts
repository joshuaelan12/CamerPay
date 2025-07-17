'use server';
/**
 * @fileOverview A Tranzak payment processing flow.
 *
 * - processPayment - A function that handles the payment request to Tranzak.
 * - PaymentRequestInput - The input type for the processPayment function.
 * - PaymentRequestOutput - The return type for the processPayment function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { v4 as uuidv4 } from 'uuid';

const PaymentRequestInputSchema = z.object({
  phoneNumber: z.string().describe('The phone number to charge.'),
  amount: z.number().describe('The amount to charge.'),
  paymentMethod: z.string().describe('The payment channel (e.g., mtn-momo).'),
});
export type PaymentRequestInput = z.infer<typeof PaymentRequestInputSchema>;

const PaymentRequestOutputSchema = z.object({
  success: z.boolean().describe('Whether the payment request was successful.'),
  message: z.string().describe('A message detailing the result.'),
  transactionId: z.string().optional().describe('The transaction ID if successful.'),
});
export type PaymentRequestOutput = z.infer<typeof PaymentRequestOutputSchema>;

export async function processPayment(input: PaymentRequestInput): Promise<PaymentRequestOutput> {
  return processPaymentFlow(input);
}

const processPaymentFlow = ai.defineFlow(
  {
    name: 'processPaymentFlow',
    inputSchema: PaymentRequestInputSchema,
    outputSchema: PaymentRequestOutputSchema,
  },
  async (input) => {
    const apiKey = process.env.TRANZAK_API_KEY;
    const appId = process.env.TRANZAK_APP_ID;
    
    if (!apiKey || !appId) {
      console.error('Tranzak API key or App ID is not configured.');
      return {
        success: false,
        message: 'Server configuration error. Please contact support.',
      };
    }

    const url = 'https://api.tranzak.net/v1/request';
    const requestId = uuidv4();
    const currencyCode = 'XAF';

    const requestBody = {
        amount: input.amount,
        currency_code: currencyCode,
        request_id: requestId,
        memo: 'CamerPay Airtime Top-up',
        mno_code: input.paymentMethod === 'mtn-momo' ? 'MTN' : 'ORANGE',
        phone_number: `+237${input.phoneNumber}`,
    }

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-App-Id': appId,
          'X-Api-Key': apiKey,
        },
        body: JSON.stringify(requestBody),
      });

      const responseData = await response.json();

      if (response.ok && responseData.status === 'SUCCESSFUL') {
        return {
          success: true,
          message: 'Payment initiated successfully. Please approve the transaction on your phone.',
          transactionId: responseData.transaction_id,
        };
      } else {
        console.error('Tranzak API Error:', responseData);
        return {
          success: false,
          message: responseData.message || 'Payment request failed.',
        };
      }
    } catch (error) {
      console.error('Failed to make payment request:', error);
      return {
        success: false,
        message: 'An unexpected error occurred. Please try again.',
      };
    }
  }
);
