import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
  sendPasswordResetEmail,
  User,
  UserCredential,
} from 'firebase/auth';
import { doc, setDoc, getDoc, updateDoc } from 'firebase/firestore';
import { auth, db } from './config';
import { UserProfile, COLLECTIONS } from './types';

export class AuthService {
  // Sign in with email and password
  async signIn(email: string, password: string): Promise<UserCredential> {
    return signInWithEmailAndPassword(auth, email, password);
  }

  // Create new user account
  async signUp(email: string, password: string, displayName?: string): Promise<UserCredential> {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    
    // Update display name if provided
    if (displayName && userCredential.user) {
      await updateProfile(userCredential.user, { displayName });
    }

    // Create user profile in Firestore
    if (userCredential.user) {
      await this.createUserProfile(userCredential.user, displayName);
    }

    return userCredential;
  }

  // Sign out
  async signOut(): Promise<void> {
    return signOut(auth);
  }

  // Get current user
  getCurrentUser(): User | null {
    return auth.currentUser;
  }

  // Listen to auth state changes
  onAuthStateChange(callback: (user: User | null) => void): () => void {
    return onAuthStateChanged(auth, callback);
  }

  // Reset password
  async resetPassword(email: string): Promise<void> {
    return sendPasswordResetEmail(auth, email);
  }

  // Create user profile in Firestore
  private async createUserProfile(user: User, displayName?: string): Promise<void> {
    const userProfile: Omit<UserProfile, 'id'> = {
      uid: user.uid,
      email: user.email || '',
      displayName: displayName || user.displayName || undefined,
      photoURL: user.photoURL || undefined,
      emergencyContacts: [],
      allergies: [],
      medications: [],
      conditions: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await setDoc(doc(db, COLLECTIONS.USER_PROFILES, user.uid), userProfile);
  }

  // Get user profile from Firestore
  async getUserProfile(uid: string): Promise<UserProfile | null> {
    const docRef = doc(db, COLLECTIONS.USER_PROFILES, uid);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as unknown as UserProfile;
    }
    return null;
  }

  // Update user profile
  async updateUserProfile(uid: string, updates: Partial<UserProfile>): Promise<void> {
    const docRef = doc(db, COLLECTIONS.USER_PROFILES, uid);
    await updateDoc(docRef, {
      ...updates,
      updatedAt: new Date(),
    });
  }

  // Check if user is authenticated
  isAuthenticated(): boolean {
    return !!auth.currentUser;
  }

  // Get user ID
  getUserId(): string | null {
    return auth.currentUser?.uid || null;
  }
}

// Export singleton instance
export const authService = new AuthService();

// React hook for authentication state
export const useAuth = () => {
  // This would be implemented in a React component
  // For now, we'll provide the basic structure
  return {
    user: auth.currentUser,
    isAuthenticated: authService.isAuthenticated(),
    signIn: authService.signIn.bind(authService),
    signUp: authService.signUp.bind(authService),
    signOut: authService.signOut.bind(authService),
    resetPassword: authService.resetPassword.bind(authService),
  };
}; 