import {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  startAfter,
  QueryDocumentSnapshot,
  DocumentData,
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { db, storage } from './config';
import {
  MedicalCondition,
  Treatment,
  Symptom,
  MedicalEvent,
  HealthcareProvider,
  LabResult,
  Document,
  EmergencyContact,
  UserProfile,
  COLLECTIONS,
} from './types';

// Generic CRUD operations
export class FirebaseService<T> {
  constructor(private collectionName: string) {}

  async getAll(): Promise<T[]> {
    const querySnapshot = await getDocs(collection(db, this.collectionName));
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as T));
  }

  async getById(id: string): Promise<T | null> {
    const docRef = doc(db, this.collectionName, id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as T;
    }
    return null;
  }

  async create(data: Omit<T, 'id'>): Promise<string> {
    const docRef = await addDoc(collection(db, this.collectionName), {
      ...data,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    return docRef.id;
  }

  async update(id: string, data: Partial<T>): Promise<void> {
    const docRef = doc(db, this.collectionName, id);
    await updateDoc(docRef, {
      ...data,
      updatedAt: new Date(),
    });
  }

  async delete(id: string): Promise<void> {
    const docRef = doc(db, this.collectionName, id);
    await deleteDoc(docRef);
  }

  async query(conditions: Array<{ field: string; operator: any; value: any }>): Promise<T[]> {
    const collectionRef = collection(db, this.collectionName);
    const whereConditions = conditions.map(({ field, operator, value }) => 
      where(field, operator, value)
    );
    
    const q = query(collectionRef, ...whereConditions);
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as T));
  }
}

// Specific services for each collection
export const conditionsService = new FirebaseService<MedicalCondition>(COLLECTIONS.CONDITIONS);
export const treatmentsService = new FirebaseService<Treatment>(COLLECTIONS.TREATMENTS);
export const symptomsService = new FirebaseService<Symptom>(COLLECTIONS.SYMPTOMS);
export const medicalEventsService = new FirebaseService<MedicalEvent>(COLLECTIONS.MEDICAL_EVENTS);
export const providersService = new FirebaseService<HealthcareProvider>(COLLECTIONS.PROVIDERS);
export const labResultsService = new FirebaseService<LabResult>(COLLECTIONS.LAB_RESULTS);
export const documentsService = new FirebaseService<Document>(COLLECTIONS.DOCUMENTS);
export const emergencyContactsService = new FirebaseService<EmergencyContact>(COLLECTIONS.EMERGENCY_CONTACTS);
export const userProfilesService = new FirebaseService<UserProfile>(COLLECTIONS.USER_PROFILES);

// Specialized medical data functions
export const medicalDataService = {
  // Get medical timeline (events ordered by date)
  async getMedicalTimeline(limitCount: number = 50): Promise<MedicalEvent[]> {
    const q = query(
      collection(db, COLLECTIONS.MEDICAL_EVENTS),
      orderBy('date', 'desc'),
      limit(limitCount)
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as MedicalEvent));
  },

  // Get active conditions
  async getActiveConditions(): Promise<MedicalCondition[]> {
    return conditionsService.query([
      { field: 'status', operator: '==', value: 'active' }
    ]);
  },

  // Get treatments for a specific condition
  async getTreatmentsForCondition(conditionId: string): Promise<Treatment[]> {
    return treatmentsService.query([
      { field: 'conditionId', operator: '==', value: conditionId }
    ]);
  },

  // Get symptoms for a specific condition
  async getSymptomsForCondition(conditionId: string): Promise<Symptom[]> {
    return symptomsService.query([
      { field: 'conditionId', operator: '==', value: conditionId }
    ]);
  },

  // Get lab results by date range
  async getLabResultsByDateRange(startDate: Date, endDate: Date): Promise<LabResult[]> {
    const q = query(
      collection(db, COLLECTIONS.LAB_RESULTS),
      where('date', '>=', startDate),
      where('date', '<=', endDate),
      orderBy('date', 'desc')
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as LabResult));
  },

  // Get abnormal lab results
  async getAbnormalLabResults(): Promise<LabResult[]> {
    return labResultsService.query([
      { field: 'isAbnormal', operator: '==', value: true }
    ]);
  },
};

// File upload service
export const fileUploadService = {
  async uploadMedicalDocument(
    file: File,
    category: string,
    relatedEntityId?: string
  ): Promise<string> {
    const timestamp = Date.now();
    const fileName = `${category}/${timestamp}_${file.name}`;
    const storageRef = ref(storage, `medical-documents/${fileName}`);
    
    await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(storageRef);
    
    return downloadURL;
  },

  async deleteMedicalDocument(fileUrl: string): Promise<void> {
    const storageRef = ref(storage, fileUrl);
    await deleteObject(storageRef);
  },

  async uploadLabResult(file: File, testName: string): Promise<string> {
    const timestamp = Date.now();
    const fileName = `lab-results/${testName}/${timestamp}_${file.name}`;
    const storageRef = ref(storage, fileName);
    
    await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(storageRef);
    
    return downloadURL;
  },
};

// Search and filtering service
export const searchService = {
  async searchMedicalEvents(searchTerm: string): Promise<MedicalEvent[]> {
    // Note: Firestore doesn't support full-text search natively
    // For production, consider using Algolia or similar
    const events = await medicalEventsService.getAll();
    return events.filter(event => 
      event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
  },

  async getEventsByProvider(providerId: string): Promise<MedicalEvent[]> {
    return medicalEventsService.query([
      { field: 'providerId', operator: '==', value: providerId }
    ]);
  },

  async getEventsByCondition(conditionId: string): Promise<MedicalEvent[]> {
    return medicalEventsService.query([
      { field: 'conditionId', operator: '==', value: conditionId }
    ]);
  },
}; 