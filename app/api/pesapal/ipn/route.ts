import { NextRequest, NextResponse } from 'next/server'
import { getFirestore, Timestamp, doc, updateDoc, setDoc, getDoc } from 'firebase-admin/firestore'
import { initializeApp } from 'firebase-admin/app'
import {
  getTransactionStatus,
  parseMerchantReference,
  PAYMENT_STATUS,
  getBoostExpirationTime,
} from '@/lib/pesapal'

// Initialize Firebase Admin
let adminApp: any = null
try {
  adminApp = require('firebase-admin').app()
} catch (error) {
  if (process.env.FIREBASE_ADMIN_PROJECT_ID) {
    adminApp = initializeApp({
      projectId: process.env.FIREBASE_ADMIN_PROJECT_ID,
      clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    })
  }
}

export async function GET(request: NextRequest) {
  try {
    // Get query parameters from IPN
    const searchParams = request.nextUrl.searchParams
    const orderTrackingId = searchParams.get('OrderTrackingId')
    const orderMerchantReference = searchParams.get('OrderMerchantReference')

    if (!orderTrackingId || !orderMerchantReference) {
      console.warn('Missing IPN parameters')
      // Return OK to stop Pesapal from retrying
      return NextResponse.json({ status: 'OK' })
    }

    // Verify payment status with Pesapal
    const transactionStatus = await getTransactionStatus(orderTrackingId)

    // Only proceed if payment is completed
    if (transactionStatus.status !== PAYMENT_STATUS.COMPLETED) {
      console.log(`Payment not completed. Status: ${transactionStatus.status}`)
      // Return OK to stop Pesapal from retrying
      return NextResponse.json({ status: 'OK' })
    }

    // Parse merchant reference to get pollId and userId
    const parsed = parseMerchantReference(orderMerchantReference)
    if (!parsed) {
      console.error('Invalid merchant reference format')
      return NextResponse.json({ status: 'OK' })
    }

    const { pollId, userId } = parsed

    // Initialize Firestore
    if (!adminApp) {
      throw new Error('Firebase Admin not initialized')
    }

    const db = getFirestore(adminApp)

    // Check if payment already exists (idempotency)
    const paymentsRef = await db.collection('payments').where('pesapalOrderTrackingId', '==', orderTrackingId).limit(1).get()

    if (!paymentsRef.empty) {
      console.log('Payment already processed')
      return NextResponse.json({ status: 'OK' })
    }

    // Get poll to verify it exists
    const pollRef = doc(db, 'polls', pollId)
    const pollDoc = await getDoc(pollRef)

    if (!pollDoc.exists()) {
      console.error('Poll not found')
      return NextResponse.json({ status: 'OK' })
    }

    // Calculate boost expiration
    const boostedUntil = getBoostExpirationTime()

    // Update poll with boost information
    await updateDoc(pollRef, {
      isBoosted: true,
      boostedUntil: Timestamp.fromDate(boostedUntil),
      boostedBy: userId,
    })

    // Record payment in payments collection
    const paymentRef = doc(db, 'payments', `${userId}_${pollId}_${orderTrackingId}`)
    await setDoc(paymentRef, {
      userId,
      pollId,
      provider: 'pesapal',
      amount: transactionStatus.amount,
      currency: transactionStatus.currency,
      status: 'completed',
      pesapalOrderTrackingId: orderTrackingId,
      pesapalMerchantReference: orderMerchantReference,
      paymentMethod: transactionStatus.paymentMethod || 'unknown',
      createdAt: Timestamp.now(),
      boostedUntil: Timestamp.fromDate(boostedUntil),
    })

    console.log(`Payment processed successfully for poll ${pollId}`)
    return NextResponse.json({ status: 'OK' })
  } catch (error) {
    console.error('IPN processing error:', error)
    // Still return OK to stop Pesapal from retrying
    // Log error for manual review
    return NextResponse.json({ status: 'OK' })
  }
}

/**
 * POST handler for IPN (alternative to GET)
 * Some payment gateways use POST for IPN instead of GET
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const orderTrackingId = body.OrderTrackingId || body.order_tracking_id
    const orderMerchantReference = body.OrderMerchantReference || body.order_merchant_reference

    if (!orderTrackingId || !orderMerchantReference) {
      console.warn('Missing IPN parameters in POST')
      return NextResponse.json({ status: 'OK' })
    }

    // Verify payment status
    const transactionStatus = await getTransactionStatus(orderTrackingId)

    if (transactionStatus.status !== PAYMENT_STATUS.COMPLETED) {
      console.log(`Payment not completed. Status: ${transactionStatus.status}`)
      return NextResponse.json({ status: 'OK' })
    }

    // Parse merchant reference
    const parsed = parseMerchantReference(orderMerchantReference)
    if (!parsed) {
      console.error('Invalid merchant reference format')
      return NextResponse.json({ status: 'OK' })
    }

    const { pollId, userId } = parsed

    // Initialize Firestore
    if (!adminApp) {
      throw new Error('Firebase Admin not initialized')
    }

    const db = getFirestore(adminApp)

    // Check if payment already exists (idempotency)
    const paymentsRef = await db.collection('payments').where('pesapalOrderTrackingId', '==', orderTrackingId).limit(1).get()

    if (!paymentsRef.empty) {
      console.log('Payment already processed')
      return NextResponse.json({ status: 'OK' })
    }

    // Verify poll exists
    const pollRef = doc(db, 'polls', pollId)
    const pollDoc = await getDoc(pollRef)

    if (!pollDoc.exists()) {
      console.error('Poll not found')
      return NextResponse.json({ status: 'OK' })
    }

    // Calculate boost expiration
    const boostedUntil = getBoostExpirationTime()

    // Update poll
    await updateDoc(pollRef, {
      isBoosted: true,
      boostedUntil: Timestamp.fromDate(boostedUntil),
      boostedBy: userId,
    })

    // Record payment
    const paymentRef = doc(db, 'payments', `${userId}_${pollId}_${orderTrackingId}`)
    await setDoc(paymentRef, {
      userId,
      pollId,
      provider: 'pesapal',
      amount: transactionStatus.amount,
      currency: transactionStatus.currency,
      status: 'completed',
      pesapalOrderTrackingId: orderTrackingId,
      pesapalMerchantReference: orderMerchantReference,
      paymentMethod: transactionStatus.paymentMethod || 'unknown',
      createdAt: Timestamp.now(),
      boostedUntil: Timestamp.fromDate(boostedUntil),
    })

    console.log(`Payment processed successfully for poll ${pollId}`)
    return NextResponse.json({ status: 'OK' })
  } catch (error) {
    console.error('IPN POST processing error:', error)
    return NextResponse.json({ status: 'OK' })
  }
}
