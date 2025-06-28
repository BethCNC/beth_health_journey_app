# Health Journey App - Tech Stack Documentation

## 🏗️ **Architecture Overview**

The Health Journey App is a modern, full-stack web application built to help manage and visualize complex health data, medical records, and treatment timelines.

## 🔥 **Core Technologies**

### **Frontend**
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS + Custom Design Tokens
- **UI Components**: Custom component library with design system
- **State Management**: React built-in state + Firebase real-time updates

### **Backend & Database**
- **Database**: Firebase Firestore (NoSQL document database)
- **Authentication**: Firebase Auth
- **File Storage**: Firebase Storage
- **Functions**: Firebase Functions (serverless)
- **Analytics**: Firebase Analytics

### **Data Integration**
- **Medical Records**: Notion API for data import/export
- **PDF Processing**: Custom AI extraction pipeline using OpenAI
- **Health Data**: CSV/JSON import capabilities

### **Deployment & Infrastructure**
- **Frontend Hosting**: Vercel (www.bethcartrette.com)
- **Backend Services**: Firebase (Google Cloud)
- **Architecture**: Hybrid (Vercel frontend + Firebase backend)
- **CDN**: Vercel Edge Network
- **Deployment**: Automatic via Git push to main branch
- **Environment**: Production on Vercel, Firebase project: health-app-62653

## 📦 **Package Dependencies**

### **Core Framework**
```json
{
  "next": "^14.0.3",
  "react": "^18.2.0", 
  "react-dom": "^18.2.0",
  "typescript": "^5.3.2"
}
```

### **Firebase Stack**
```json
{
  "firebase": "^11.9.1",
  "firebase-tools": "^14.9.0"
}
```

### **Styling & UI**
```json
{
  "tailwindcss": "^3.3.1",
  "autoprefixer": "^10.4.14",
  "postcss": "^8.4.21"
}
```

### **Data Processing**
```json
{
  "@notionhq/client": "^2.2.13",
  "openai": "^3.3.0",
  "csv-parser": "^3.0.0",
  "csv-writer": "^1.6.0",
  "cheerio": "^1.0.0",
  "puppeteer": "^24.6.1"
}
```

### **Utilities**
```json
{
  "date-fns": "^4.1.0",
  "dayjs": "^1.11.13",
  "axios": "^1.8.4",
  "uuid": "^11.1.0",
  "sharp": "^0.34.1"
}
```

## 🗄️ **Database Structure (Firebase Firestore)**

### **Collections**

#### **conditions**
```typescript
interface Condition {
  id: string;
  name: string;
  description: string;
  datesDiagnosed: Date;
  status: 'active' | 'resolved' | 'in_remission';
  severity: number; // 1-10 scale
  category: string;
  notes: string;
  providerId: string;
  createdAt: Date;
  updatedAt: Date;
}
```

#### **treatments**
```typescript
interface Treatment {
  id: string;
  conditionId: string;
  name: string;
  type: 'medication' | 'procedure' | 'therapy' | 'lifestyle';
  description: string;
  startDate: Date;
  endDate?: Date;
  dosage?: string;
  frequency?: string;
  effectiveness: number; // 1-10 scale
  sideEffects?: string;
  prescribedBy: string;
  createdAt: Date;
  updatedAt: Date;
}
```

#### **symptoms**
```typescript
interface Symptom {
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
```

#### **medicalEvents**
```typescript
interface MedicalEvent {
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
```

#### **providers**
```typescript
interface Provider {
  id: string;
  name: string;
  specialty: string;
  facility: string;
  address: string;
  phone: string;
  email: string;
  website?: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}
```

#### **labResults**
```typescript
interface LabResult {
  id: string;
  testName: string;
  category: string;
  date: Date;
  result: string;
  unit?: string;
  referenceRange?: string;
  isAbnormal: boolean;
  providerId: string;
  notes?: string;
  fileUrl?: string; // Firebase Storage URL
  createdAt: Date;
  updatedAt: Date;
}
```

#### **documents**
```typescript
interface Document {
  id: string;
  title: string;
  description: string;
  fileUrl: string; // Firebase Storage URL
  fileType: string;
  category: string;
  date: Date;
  tags: string[];
  relatedEntityId: string;
  relatedEntityType: 'condition' | 'treatment' | 'event' | 'provider';
  createdAt: Date;
  updatedAt: Date;
}
```

## 🔐 **Firebase Configuration**

### **Project Details**
- **Project ID**: `health-app-62653`
- **Auth Domain**: `health-app-62653.firebaseapp.com`
- **Storage Bucket**: `health-app-62653.firebasestorage.app`

### **Services Enabled**
- ✅ Firestore Database
- ✅ Authentication
- ✅ Storage
- ✅ Functions
- ✅ Analytics
- ✅ Hosting (optional)

### **Security Rules**
- Row-level security for user data
- Admin access for medical professionals (with permissions)
- Read/write rules based on user authentication

## 📁 **Project Structure**

```
beth_health_journey_app/
├── app/                          # Next.js App Router
│   ├── components/               # App-specific components
│   ├── conditions/[id]/          # Dynamic condition pages
│   ├── landing/                  # Landing page
│   ├── medical-events/           # Medical events
│   ├── symptoms/                 # Symptoms tracking
│   ├── timeline/                 # Health timeline
│   └── layout.tsx               # Root layout
├── components/                   # Shared components
│   ├── ui/                      # UI components (Button, Card, etc.)
│   └── diagnoses/               # Medical-specific components
├── lib/                         # Core utilities
│   ├── firebase/                # Firebase configuration & services
│   │   ├── config.ts            # Firebase app config
│   │   ├── auth.ts              # Authentication services
│   │   ├── services.ts          # Database services
│   │   └── types.ts             # TypeScript definitions
│   └── notion/                  # Notion API client
├── data/                        # Medical data storage
│   ├── atrium_summary/          # Atrium Health exports
│   ├── novant_summary/          # Novant Health exports
│   └── notion_import_ready/     # Processed data for import
├── scripts/                     # Automation scripts
│   ├── data-processing/         # Data cleaning & processing
│   └── [various scripts]       # Import, setup, processing
├── public/                      # Static assets
│   ├── images/                  # Medical images & icons
│   └── fonts/                   # Custom fonts
├── styles/                      # Global styles & design tokens
└── supabase/                    # Legacy (being phased out)
```

## 🚀 **Development Workflow**

### **Local Development**
```bash
# Start development server
npm run dev

# Build for production
npm run build

# Run linting
npm run lint

# Process medical PDFs
npm run process-pdfs

# Import data from Notion
npm run import-providers
npm run import-therapists
```

### **Firebase Development**
```bash
# Start Firebase emulators
firebase emulators:start

# Deploy to Firebase
firebase deploy

# Deploy specific service
firebase deploy --only firestore
firebase deploy --only functions
```

### **Deployment**

#### **Frontend (Vercel)**
```bash
# Automatic deployment (on git push to main)
git push origin main

# Manual deployment  
vercel --prod

# Or manual build + deploy
npm run build && vercel deploy --prod
```

#### **Backend (Firebase)**
```bash
# Deploy Firebase services
firebase deploy

# Deploy specific services
firebase deploy --only firestore
firebase deploy --only functions
firebase deploy --only storage
```

## 🔧 **Environment Variables**

### **Required Variables (.env.local)**
```bash
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyBcNkjQym4bj7uZ3t9EXR11k7qm3rBidjs
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=health-app-62653.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=health-app-62653
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=health-app-62653.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=477821374149
NEXT_PUBLIC_FIREBASE_APP_ID=1:477821374149:web:ac8ebc27a4abc55ca5eaac
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G-MHZKGMYP96

# Notion API
NOTION_TOKEN=your_notion_token

# OpenAI for AI processing
OPENAI_API_KEY=your_openai_key
```

## 📊 **Data Flow & Architecture**

```mermaid
graph TD
    A[Medical Records/PDFs] --> B[AI Processing]
    B --> C[Notion Database]
    C --> D[Firebase Firestore]
    D --> E[Next.js App on Vercel]
    E --> F[User Browser]
    
    G[User Input] --> E
    E --> D
    D --> H[Real-time Updates]
    H --> E
    
    I[Git Push] --> J[Vercel Auto-Deploy]
    J --> E
    
    subgraph "Vercel (Frontend)"
        E
        K[API Routes]
        L[Static Assets]
    end
    
    subgraph "Firebase (Backend)"
        D
        M[Firebase Auth]
        N[Firebase Storage]
        O[Firebase Functions]
    end
```

## 🎨 **Design System**

### **Design Tokens**
- Custom design tokens from Figma
- CSS variables for colors, spacing, typography
- Responsive breakpoints
- Component-specific tokens

### **Component Library**
- Consistent UI components
- Accessibility-first approach
- Mobile-responsive design
- Medical-specific components

## 🔒 **Security & Privacy**

### **Data Protection**
- HIPAA-compliant data handling practices
- Client-side encryption for sensitive data
- Secure file upload and storage
- User authentication and authorization

### **Firebase Security**
- Firestore security rules
- Authentication-based access control
- Storage bucket permissions
- Function-level security

## 📈 **Performance Optimization**

### **Frontend**
- Next.js App Router for optimal performance
- Image optimization with Sharp
- Code splitting and lazy loading
- Caching strategies

### **Database**
- Optimized Firestore queries
- Proper indexing
- Real-time updates where needed
- Pagination for large datasets

## 🧪 **Testing Strategy**

### **Current Testing**
- TypeScript type checking
- ESLint code quality
- Build verification
- Manual testing

### **Future Testing Plans**
- Unit tests for utilities and services
- Integration tests for Firebase services
- E2E tests for critical user flows
- Automated accessibility testing

## 📝 **Documentation**

- ✅ Tech stack documentation (this file)
- ✅ Cleanup summary (CLEANUP_SUMMARY.md)
- ✅ Landing page README (LANDING_PAGE_README.md)
- ✅ API documentation for data processing

## 🔄 **Maintenance & Updates**

### **Regular Tasks**
- Dependency updates
- Security patches
- Data backup verification
- Performance monitoring

### **Monitoring**
- Firebase Analytics
- Vercel deployment metrics
- Error tracking
- User feedback collection

---

**Last Updated**: June 28, 2025  
**Version**: 1.0.0  
**Maintainer**: Beth Cartrette 