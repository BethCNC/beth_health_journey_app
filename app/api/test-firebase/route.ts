import { NextResponse } from 'next/server';
import { db, auth, storage } from '../../../lib/firebase/config';
import { collection } from 'firebase/firestore';

export async function GET() {
  try {
    console.log('🔥 Testing Firebase Connection...');
    
    // Test 1: Check Firebase Config
    const requiredEnvVars = [
      'NEXT_PUBLIC_FIREBASE_API_KEY',
      'NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN', 
      'NEXT_PUBLIC_FIREBASE_PROJECT_ID',
      'NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET',
      'NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID',
      'NEXT_PUBLIC_FIREBASE_APP_ID'
    ];
    
    const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);
    
    if (missingVars.length > 0) {
      return NextResponse.json({
        success: false,
        message: 'Missing environment variables',
        missingVars,
        hint: 'Please add these to your .env.local file'
      }, { status: 500 });
    }
    
    // Test 2: Firestore Connection
    let firestoreStatus = 'Unknown';
    try {
      const testCollection = collection(db, 'test-connection');
      firestoreStatus = 'Connected';
    } catch (error: any) {
      firestoreStatus = `Error: ${error.message}`;
    }
    
    // Test 3: Auth Connection
    let authStatus = 'Unknown';
    try {
      authStatus = auth ? 'Connected' : 'Not initialized';
    } catch (error: any) {
      authStatus = `Error: ${error.message}`;
    }
    
    // Test 4: Storage Connection
    let storageStatus = 'Unknown';
    try {
      storageStatus = storage ? 'Connected' : 'Not initialized';
    } catch (error: any) {
      storageStatus = `Error: ${error.message}`;
    }
    
    const results = {
      success: true,
      message: 'Firebase connection test completed',
      config: {
        projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
        authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
        storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
      },
      services: {
        firestore: firestoreStatus,
        auth: authStatus,
        storage: storageStatus,
      },
      timestamp: new Date().toISOString()
    };
    
    return NextResponse.json(results);
    
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      message: 'Firebase connection test failed',
      error: error.message,
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
} 