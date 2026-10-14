/**
 * Payment gateway abstraction. Implement a Jordan-supported provider (for example,
 * one whose merchant account supports Jordan/JOD) on the server only.
 * Never put secret gateway keys in NEXT_PUBLIC_* variables.
 */
export type PaymentSessionInput = { orderId: string; orderNumber: string; amountJod: number; customerEmail?: string }
export type PaymentSession = { checkoutUrl: string; providerReference: string }
export interface PaymentProvider {
  createCheckoutSession(input: PaymentSessionInput): Promise<PaymentSession>
  verifyWebhook(request: Request): Promise<{ orderNumber: string; status: 'Paid' | 'Failed' }>
}
export function getPaymentProvider(): PaymentProvider | null {
  // TODO: wire the chosen provider here after credentials and webhook URL are configured.
  // Example environment variables: PAYMENT_PROVIDER, PAYMENT_PROVIDER_PUBLIC_KEY,
  // PAYMENT_PROVIDER_SECRET_KEY, PAYMENT_PROVIDER_WEBHOOK_SECRET.
  return null
}
