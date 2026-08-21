import { NextRequest, NextResponse } from 'next/server'
import {
  generateMerchantReference,
  submitOrder,
  BOOST_AMOUNT,
  BOOST_CURRENCY,
  getBoostExpirationTime,
} from '@/lib/pesapal'

// Initialize Firebase Admin if not already done
let adminApp: any = null
try {
  // Try to get the default app
  adminApp = require('firebase-admin').app()
} catch (error) {
  // If no app exists, create one
  if (process.env.FIREBASE_ADMIN_PROJECT_ID) {
    const admin = require('firebase-admin')
    adminApp = admin.initializeApp({
      projectId: process.env.FIREBASE_ADMIN_PROJECT_ID,
    })
  }
}

export async function POST(request: NextRequest) {
  try {
    // Get the request body
    const { pollId } = await request.json()

    if (!pollId) {
      return NextResponse.json({ error: 'Poll ID is required' }, { status: 400 })
    }

    // Get and verify the user token from Authorization header
    const authHeader = request.headers.get('authorization')
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Missing or invalid auth token' }, { status: 401 })
    }

    const idToken = authHeader.substring(7)

    // Verify the token with Firebase Admin SDK
    let userId: string
    let decodedToken: any
    try {
      if (!adminApp) {
        throw new Error('Firebase Admin not initialized')
      }

      const admin = require('firebase-admin')
      const auth = admin.auth(adminApp)
      decodedToken = await auth.verifyIdToken(idToken)
      userId = decodedToken.uid
    } catch (error) {
      console.error('Token verification failed:', error)
      return NextResponse.json(
        { error: 'Invalid or expired token' },
        { status: 401 }
      )
    }

    // Generate merchant reference
    const merchantReference = generateMerchantReference(pollId, userId)

    // Get the app URL for callbacks
    const appUrl = process.env.NEXT_PUBLIC_URL || 'http://localhost:3000'
    const redirectUrl = `${appUrl}/payment/result`
    const callbackUrl = `${appUrl}/api/pesapal/ipn`

    // Submit order to Pesapal
    const orderResult = await submitOrder({
      amount: BOOST_AMOUNT,
      currency: BOOST_CURRENCY,
      description: 'Voxly Poll Boost - 24 hours',
      merchantReference,
      redirectUrl,
      callbackUrl,
      billingFirstName: decodedToken.name?.split(' ')[0] || 'User',
      billingLastName: decodedToken.name?.split(' ')[1] || '',
      billingEmail: decodedToken.email || '',
    })

    return NextResponse.json({
      redirectUrl: orderResult.redirectUrl,
      orderTrackingId: orderResult.orderTrackingId,
      merchantReference,
      pollId,
      userId,
      amount: BOOST_AMOUNT,
      currency: BOOST_CURRENCY,
      boostUntil: getBoostExpirationTime().toISOString(),
    })
  } catch (error) {
    console.error('Checkout error:', error)
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json(
      { error: 'Checkout failed', details: errorMessage },
      { status: 500 }
    )
  }
}
