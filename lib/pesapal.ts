// Pesapal configuration
const PESAPAL_DEMO_URL = 'https://cybqa.pesapal.com/v3/api'
const PESAPAL_LIVE_URL = 'https://pay.pesapal.com/v3/api'

const BASE_URL = process.env.PESAPAL_ENV === 'live' ? PESAPAL_LIVE_URL : PESAPAL_DEMO_URL

interface PesapalTokenCache {
  token: string
  expiresAt: number
}

let tokenCache: PesapalTokenCache | null = null

/**
 * Get OAuth2 token from Pesapal
 */
export async function getPesapalToken(): Promise<string> {
  // Return cached token if still valid
  if (tokenCache && tokenCache.expiresAt > Date.now()) {
    return tokenCache.token
  }

  const consumerKey = process.env.PESAPAL_CONSUMER_KEY
  const consumerSecret = process.env.PESAPAL_CONSUMER_SECRET

  if (!consumerKey || !consumerSecret) {
    throw new Error('Missing Pesapal credentials')
  }

  const auth = Buffer.from(`${consumerKey}:${consumerSecret}`).toString('base64')

  try {
    const response = await fetch(`${BASE_URL}/auth/token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Basic ${auth}`,
      },
      body: JSON.stringify({
        consumer_key: consumerKey,
        consumer_secret: consumerSecret,
      }),
    })

    if (!response.ok) {
      throw new Error(`Token request failed: ${response.statusText}`)
    }

    const data = await response.json()
    const token = data.token
    const expiresIn = data.expiresIn || 3600 // Default 1 hour

    // Cache token with 5-minute buffer
    tokenCache = {
      token,
      expiresAt: Date.now() + (expiresIn - 300) * 1000,
    }

    return token
  } catch (error) {
    console.error('Error getting Pesapal token:', error)
    throw error
  }
}

/**
 * Submit an order to Pesapal
 */
export async function submitOrder(params: {
  amount: number
  currency: string
  description: string
  merchantReference: string
  redirectUrl: string
  callbackUrl: string
  billingFirstName?: string
  billingLastName?: string
  billingEmail?: string
  billingPhoneNumber?: string
}) {
  const token = await getPesapalToken()

  try {
    const response = await fetch(`${BASE_URL}/transactions/initialize`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        amount: params.amount,
        currency: params.currency,
        description: params.description,
        reference: params.merchantReference,
        redirect_url: params.redirectUrl,
        callback_url: params.callbackUrl,
        billing_address: {
          email_address: params.billingEmail || '',
          phone_number: params.billingPhoneNumber || '',
          first_name: params.billingFirstName || '',
          last_name: params.billingLastName || '',
        },
      }),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(
        `Order submission failed: ${response.statusText} - ${JSON.stringify(errorData)}`
      )
    }

    const data = await response.json()
    return {
      redirectUrl: data.redirect_url,
      orderTrackingId: data.order_tracking_id,
    }
  } catch (error) {
    console.error('Error submitting order:', error)
    throw error
  }
}

/**
 * Get transaction status
 */
export async function getTransactionStatus(orderTrackingId: string) {
  const token = await getPesapalToken()

  try {
    const response = await fetch(
      `${BASE_URL}/transactions/track?order_tracking_id=${orderTrackingId}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      }
    )

    if (!response.ok) {
      throw new Error(`Status check failed: ${response.statusText}`)
    }

    const data = await response.json()
    return {
      status: data.payment_status_description,
      amount: data.amount,
      currency: data.currency,
      merchantReference: data.reference,
      paymentMethod: data.payment_method,
      paymentStatusCode: data.payment_status_code,
    }
  } catch (error) {
    console.error('Error getting transaction status:', error)
    throw error
  }
}

/**
 * Register IPN (Instant Payment Notification)
 * Should be called once to register the webhook
 */
export async function registerIPN(ipnUrl: string) {
  const token = await getPesapalToken()

  try {
    const response = await fetch(`${BASE_URL}/notification-webhook`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        url: ipnUrl,
        notification_type: 'PAYMENT',
      }),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(
        `IPN registration failed: ${response.statusText} - ${JSON.stringify(errorData)}`
      )
    }

    const data = await response.json()
    return {
      ipnId: data.ipn_id,
      url: data.url,
      createdDate: data.created_date,
    }
  } catch (error) {
    console.error('Error registering IPN:', error)
    throw error
  }
}

/**
 * Generate merchant reference for tracking
 * Format: pollId_userId_timestamp
 */
export function generateMerchantReference(pollId: string, userId: string): string {
  const timestamp = Date.now()
  return `${pollId}_${userId}_${timestamp}`
}

/**
 * Parse merchant reference to extract poll and user IDs
 */
export function parseMerchantReference(
  reference: string
): { pollId: string; userId: string; timestamp: number } | null {
  const parts = reference.split('_')
  if (parts.length !== 3) {
    return null
  }

  const [pollId, userId, timestamp] = parts
  return {
    pollId,
    userId,
    timestamp: parseInt(timestamp, 10),
  }
}

/**
 * Verify IPN signature (if Pesapal sends a signature in the request)
 */
export function verifyIpnSignature(
  _body: string,
  pesapalSignature: string | undefined
): boolean {
  if (!pesapalSignature) {
    // For now, we'll rely on HTTPS and order tracking verification
    // In production, you should verify the signature using Pesapal's public key
    return true
  }

  // Signature verification would go here
  // For demo purposes, we trust HTTPS
  return true
}

/**
 * Format boost expiration time
 */
export function getBoostExpirationTime(): Date {
  const expirationTime = new Date()
  expirationTime.setHours(expirationTime.getHours() + 24)
  return expirationTime
}

/**
 * Check if a poll is currently boosted
 */
export function isPollCurrentlyBoosted(boostedUntil: Date | null): boolean {
  if (!boostedUntil) return false
  return new Date(boostedUntil) > new Date()
}

/**
 * Constants for payment processing
 */
export const BOOST_AMOUNT = 100 // KES
export const BOOST_CURRENCY = 'KES'
export const BOOST_DURATION_HOURS = 24

/**
 * Payment status constants
 */
export const PAYMENT_STATUS = {
  COMPLETED: 'Completed',
  FAILED: 'Failed',
  PENDING: 'Pending',
  CANCELLED: 'Cancelled',
} as const
