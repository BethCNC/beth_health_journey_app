// Firebase Firestore Types for Health Journey App

export interface MedicalCondition {
  id: string;
  name: string;
  description: string;
  dateDiagnosed: Date;
  status: 'active' | 'resolved' | 'in_remission';
  severity: number; // 1-10 scale
  category: string;
  notes: string;
  providerId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Treatment {
  id: string;
  conditionId?: string;
  name: string;
  type: 'medication' | 'procedure' | 'therapy' | 'lifestyle';
  description: string;
  startDate: Date;
  endDate?: Date;
  dosage: string;
  frequency: string;
  effectiveness: number; // 1-10 scale
  sideEffects: string;
  prescribedBy: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Symptom {
  id: string;
  conditionId?: string;
  name: string;
  description: string;
  severity: number; // 1-10 scale
  frequency: string;
  duration: string;
  triggers: string[];
  alleviatingFactors: string[];
  dateRecorded: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface MedicalEvent {
  id: string;
  title: string;
  description: string;
  eventType: 'appointment' | 'hospitalization' | 'procedure' | 'test' | 'other';
  date: Date;
  location: string;
  providerId?: string;
  conditionId?: string;
  treatmentId?: string;
  notes: string;
  documents: string[]; // Firebase Storage URLs
  createdAt: Date;
  updatedAt: Date;
}

export interface HealthcareProvider {
  id: string;
  name: string;
  specialty: string;
  facility: string;
  address: string;
  phone: string;
  email: string;
  website: string;
  notes: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface LabResult {
  id: string;
  testName: string;
  category: string;
  date: Date;
  result: string;
  unit: string;
  referenceRange: string;
  isAbnormal: boolean;
  providerId: string;
  notes: string;
  fileUrl: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Document {
  id: string;
  title: string;
  description: string;
  fileUrl: string;
  fileType: string;
  category: string;
  date: Date;
  tags: string[];
  relatedEntityId: string;
  relatedEntityType: 'condition' | 'treatment' | 'event' | 'provider';
  createdAt: Date;
  updatedAt: Date;
}

export interface EmergencyContact {
  id: string;
  name: string;
  relationship: string;
  primaryPhone: string;
  secondaryPhone?: string;
  email?: string;
  address?: string;
  isPrimary: boolean;
  notes: string;
  createdAt: Date;
  updatedAt: Date;
}

// Firebase Auth User Profile
export interface UserProfile {
  uid: string;
  email: string;
  displayName?: string;
  photoURL?: string;
  emergencyContacts: string[]; // Array of EmergencyContact IDs
  primaryProviderId?: string;
  dateOfBirth?: Date;
  bloodType?: string;
  allergies: string[];
  medications: string[]; // Array of Treatment IDs
  conditions: string[]; // Array of MedicalCondition IDs
  createdAt: Date;
  updatedAt: Date;
}

// Collection names for Firestore
export const COLLECTIONS = {
  CONDITIONS: 'conditions',
  TREATMENTS: 'treatments',
  SYMPTOMS: 'symptoms',
  MEDICAL_EVENTS: 'medicalEvents',
  PROVIDERS: 'providers',
  LAB_RESULTS: 'labResults',
  DOCUMENTS: 'documents',
  EMERGENCY_CONTACTS: 'emergencyContacts',
  USER_PROFILES: 'userProfiles',
} as const; 