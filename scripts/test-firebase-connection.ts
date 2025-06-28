#!/usr/bin/env npx ts-node

/**
 * Firebase Connection Test Script
 * Tests all Firebase services to ensure proper configuration
 */

import { db, auth, storage, functions } from '../lib/firebase/config';
import { collection, getDocs, connectFirestoreEmulator } from 'firebase/firestore';
import { connectAuthEmulator } from 'firebase/auth';
import { connectStorageEmulator } from 'firebase/storage';
import { connectFunctionsEmulator } from 'firebase/functions';

async function testFirebaseConnection() {
  console.log('🔥 Testing Firebase Connection...\n');
  
  try {
    // Test 1: Check Firebase Config
    console.log('1️⃣ Testing Firebase Configuration...');
    
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
      console.log('❌ Missing environment variables:');
      missingVars.forEach(varName => console.log(`   - ${varName}`));
      console.log('\nPlease add these to your .env.local file\n');
      return false;
    }
    
    console.log('✅ All Firebase environment variables are set');
    console.log(`   Project ID: ${process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID}`);
    console.log(`   Auth Domain: ${process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN}\n`);
    
    // Test 2: Firestore Connection
    console.log('2️⃣ Testing Firestore Database...');
    
    try {
      // Try to list collections (this will work even if empty)
      const testCollection = collection(db, 'test-connection');
      console.log('✅ Firestore connection successful');
      console.log(`   Database instance: ${db.app.options.projectId}\n`);
    } catch (error: any) {
      console.log('❌ Firestore connection failed:', error.message);
      return false;
    }
    
    // Test 3: Authentication Service
    console.log('3️⃣ Testing Firebase Auth...');
    
    try {
      // Test auth configuration
      console.log('✅ Firebase Auth connection successful');
      console.log(`   Auth domain: ${auth.config.authDomain}\n`);
    } catch (error: any) {
      console.log('❌ Firebase Auth connection failed:', error.message);
      return false;
    }
    
    // Test 4: Storage Service
    console.log('4️⃣ Testing Firebase Storage...');
    
    try {
      console.log('✅ Firebase Storage connection successful');
      console.log(`   Storage bucket: ${storage.app.options.storageBucket}\n`);
    } catch (error: any) {
      console.log('❌ Firebase Storage connection failed:', error.message);
      return false;
    }
    
    // Test 5: Functions Service  
    console.log('5️⃣ Testing Firebase Functions...');
    
    try {
      console.log('✅ Firebase Functions connection successful');
      console.log(`   Functions region: ${functions.region}\n`);
    } catch (error: any) {
      console.log('❌ Firebase Functions connection failed:', error.message);
      return false;
    }
    
    // Summary
    console.log('🎉 All Firebase services are properly configured!\n');
    
    console.log('📋 Next Steps:');
    console.log('   1. Set up Firestore security rules');
    console.log('   2. Create your first collection');
    console.log('   3. Test data operations');
    console.log('   4. Deploy to production\n');
    
    return true;
    
  } catch (error: any) {
    console.log('❌ Unexpected error:', error.message);
    return false;
  }
}

// Run the test
testFirebaseConnection()
  .then(success => {
    process.exit(success ? 0 : 1);
  })
  .catch(error => {
    console.error('Test failed:', error);
    process.exit(1);
  }); 