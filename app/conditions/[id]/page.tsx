'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';

// Mock conditions data (same as in the conditions list page)
const CONDITIONS = [
  {
    id: 1,
    name: 'Ehlers-Danlos Syndrome (hEDS)',
    description: 'A connective tissue disorder causing hypermobility, skin elasticity, and tissue fragility.',
    status: 'active',
    dateAdded: '2020-06-15',
    category: 'genetic',
    severity: 7,
    provider: {
      id: 3,
      name: 'Dr. Emily Martinez',
      specialty: 'Geneticist'
    },
    relatedSymptoms: [
      { id: 1, name: 'Joint Hypermobility' },
      { id: 2, name: 'Skin Elasticity' },
      { id: 3, name: 'Chronic Joint Pain' },
      { id: 4, name: 'Easy Bruising' }
    ],
    treatments: [
      { id: 1, name: 'Physical Therapy', type: 'therapy' },
      { id: 2, name: 'Pain Management', type: 'medication' }
    ],
    notes: "Suspected for several years before formal diagnosis. Joint hypermobility noted since childhood. Multiple joint dislocations starting in teenage years. Formal diagnosis made after genetic counseling and clinical evaluation using 2017 criteria.",
    history: "First symptoms appeared around age 12 with increased flexibility noted during sports activities. Multiple ankle sprains and shoulder instability started at 15. Skin hyperextensibility and easy bruising were present but not recognized as connected. Diagnosis confirmed at age 28 after seeing multiple specialists.",
    diagnosisDetails: {
      criteria: "Beighton score of 7/9, confirmed family history, skin hyperextensibility, recurrent joint dislocations, and positive response to collagen testing.",
      confirmedBy: "Clinical evaluation by geneticist with EDS specialty experience.",
      additionalTests: "Skin biopsy showing irregular collagen fibrils, echocardiogram to rule out vascular involvement."
    }
  },
  {
    id: 2,
    name: 'Chronic Migraine',
    description: 'Recurrent headaches with associated symptoms like nausea, sensitivity to light and sound, and aura.',
    status: 'active',
    dateAdded: '2021-05-10',
    category: 'neurological',
    severity: 8,
    provider: {
      id: 1,
      name: 'Dr. Jonathan Lee',
      specialty: 'Neurologist'
    },
    relatedSymptoms: [
      { id: 5, name: 'Throbbing Headache' },
      { id: 6, name: 'Visual Aura' },
      { id: 7, name: 'Nausea' },
      { id: 8, name: 'Light Sensitivity' }
    ],
    treatments: [
      { id: 3, name: 'Sumatriptan', type: 'medication' },
      { id: 4, name: 'Topiramate', type: 'medication' },
      { id: 5, name: 'Botox Injections', type: 'procedure' }
    ],
    notes: "Migraine with aura, typically preceded by visual disturbances lasting 20-30 minutes. Headaches usually last 24-72 hours if untreated. Frequency increased from occasional to chronic (15+ days/month) over the past two years.",
    history: "First migraine experienced at age 19, initially occurring 1-2 times per month. Gradually increased in frequency and severity through 20s. Became chronic at age 32 following period of high stress. Various medication trials with partial success.",
    diagnosisDetails: {
      criteria: "International Classification of Headache Disorders criteria for chronic migraine with aura.",
      confirmedBy: "Neurologist evaluation and headache diary review.",
      additionalTests: "MRI to rule out structural causes, EEG to evaluate for seizure activity (negative)."
    }
  },
  {
    id: 3,
    name: 'POTS',
    description: 'Postural Orthostatic Tachycardia Syndrome, an autonomic nervous system disorder causing increased heart rate on standing.',
    status: 'active',
    dateAdded: '2022-02-15',
    category: 'cardiovascular',
    severity: 6,
    provider: {
      id: 2,
      name: 'Dr. Rebecca Chang',
      specialty: 'Cardiologist'
    },
    relatedSymptoms: [
      { id: 9, name: 'Tachycardia' },
      { id: 10, name: 'Lightheadedness' },
      { id: 11, name: 'Fatigue' },
      { id: 12, name: 'Brain Fog' }
    ],
    treatments: [
      { id: 6, name: 'Salt Tablets', type: 'medication' },
      { id: 7, name: 'Compression Garments', type: 'lifestyle' },
      { id: 8, name: 'Increased Fluid Intake', type: 'lifestyle' }
    ],
    notes: "Diagnosed after poor man's tilt table test showing heart rate increase of 35+ bpm when standing. Symptoms worsen in hot weather and after prolonged standing. Improved with increased salt and fluid intake, compression stockings.",
    history: "Symptoms began gradually after viral illness in 2021. Initially attributed to deconditioning but persisted and worsened. Triggered further evaluation when patient experienced near-syncope episodes at work.",
    diagnosisDetails: {
      criteria: "Heart rate increase of >30 bpm within 10 minutes of standing without orthostatic hypotension.",
      confirmedBy: "Cardiologist evaluation with active stand test and 24-hour heart monitor.",
      additionalTests: "Echocardiogram (normal), blood volume assessment (low), autonomic function tests."
    }
  },
  {
    id: 4,
    name: 'IBS',
    description: 'Irritable Bowel Syndrome, a chronic gastrointestinal disorder causing abdominal pain, bloating, and altered bowel habits.',
    status: 'active',
    dateAdded: '2021-08-05',
    category: 'gastrointestinal',
    severity: 5,
    provider: {
      id: 4,
      name: 'Dr. Sarah Patel',
      specialty: 'Gastroenterologist'
    },
    relatedSymptoms: [
      { id: 13, name: 'Abdominal Pain' },
      { id: 14, name: 'Bloating' },
      { id: 15, name: 'Diarrhea' },
      { id: 16, name: 'Constipation' }
    ],
    treatments: [
      { id: 9, name: 'Low FODMAP Diet', type: 'lifestyle' },
      { id: 10, name: 'Digestive Enzymes', type: 'medication' },
      { id: 11, name: 'Stress Management', type: 'therapy' }
    ],
    notes: "Mixed IBS with both diarrhea and constipation presentations. Significant symptom improvement noted with low FODMAP diet. Flares typically associated with stress and certain food triggers.",
    history: "Digestive issues present since early 20s but became significantly worse at age 29. Multiple food sensitivities developed over time. Diagnosis confirmed after ruling out inflammatory bowel disease, celiac disease, and other structural issues.",
    diagnosisDetails: {
      criteria: "Rome IV criteria for IBS with mixed bowel habits.",
      confirmedBy: "Gastroenterologist evaluation after symptom diary review.",
      additionalTests: "Colonoscopy (normal), celiac testing (negative), stool studies for infection and inflammation (negative)."
    }
  },
  {
    id: 5,
    name: 'Raynaud\'s Phenomenon',
    description: 'A condition causing decreased blood flow to extremities when exposed to cold or stress.',
    status: 'active',
    dateAdded: '2021-01-20',
    category: 'vascular',
    severity: 4,
    provider: {
      id: 5,
      name: 'Dr. Michael Wright',
      specialty: 'Rheumatologist'
    },
    relatedSymptoms: [
      { id: 17, name: 'Cold Fingers and Toes' },
      { id: 18, name: 'Color Changes in Skin' },
      { id: 19, name: 'Numbness' }
    ],
    treatments: [
      { id: 12, name: 'Calcium Channel Blockers', type: 'medication' },
      { id: 13, name: 'Keeping Extremities Warm', type: 'lifestyle' }
    ],
    notes: "Primary Raynaud's phenomenon with classic triphasic color changes. Most pronounced in fingers and toes. Triggered by cold exposure and sometimes emotional stress.",
    history: "First noticed in college during winter months. Initially thought to be normal cold sensitivity but diagnosed after documenting classic color changes and symptoms. Family history positive for similar symptoms in maternal aunt.",
    diagnosisDetails: {
      criteria: "Clinical observation of color changes (white, blue, red) with cold exposure.",
      confirmedBy: "Rheumatologist clinical evaluation with cold challenge test.",
      additionalTests: "ANA and other autoimmune markers to rule out secondary causes (negative)."
    }
  }
];

// Mock timeline data related to conditions
const TIMELINE_EVENTS = [
  {
    id: 101,
    conditionId: 1,
    title: 'Initial EDS Evaluation',
    date: '2020-05-20',
    type: 'appointment',
    provider: {
      id: 3,
      name: 'Dr. Emily Martinez',
      specialty: 'Geneticist'
    },
    notes: 'Initial evaluation for suspected EDS. Beighton score assessment performed.',
    location: 'University Medical Center'
  },
  {
    id: 102,
    conditionId: 1,
    title: 'EDS Diagnosis Confirmed',
    date: '2020-06-15',
    type: 'diagnosis',
    provider: {
      id: 3,
      name: 'Dr. Emily Martinez',
      specialty: 'Geneticist'
    },
    notes: 'Diagnosis of hypermobile EDS confirmed after clinical evaluation and ruling out other types.',
    location: 'University Medical Center'
  },
  {
    id: 103,
    conditionId: 1,
    title: 'Physical Therapy Assessment',
    date: '2020-07-10',
    type: 'appointment',
    provider: {
      id: 6,
      name: 'Maria Wilson',
      specialty: 'Physical Therapist'
    },
    notes: 'Initial PT evaluation for joint stabilization exercises. Custom program developed.',
    location: 'City Rehabilitation Center'
  },
  {
    id: 104,
    conditionId: 2,
    title: 'Neurology Consultation',
    date: '2021-04-25',
    type: 'appointment',
    provider: {
      id: 1,
      name: 'Dr. Jonathan Lee',
      specialty: 'Neurologist'
    },
    notes: 'Consultation for chronic headaches. Discussed possible migraine diagnosis and triggers.',
    location: 'Neurology Associates'
  },
  {
    id: 105,
    conditionId: 2,
    title: 'Migraine Diagnosis',
    date: '2021-05-10',
    type: 'diagnosis',
    provider: {
      id: 1,
      name: 'Dr. Jonathan Lee',
      specialty: 'Neurologist'
    },
    notes: 'Diagnosed with chronic migraine with aura after reviewing headache diary and symptom patterns.',
    location: 'Neurology Associates'
  },
  {
    id: 106,
    conditionId: 2,
    title: 'Botox Treatment for Migraines',
    date: '2021-08-15',
    type: 'treatment',
    provider: {
      id: 1,
      name: 'Dr. Jonathan Lee',
      specialty: 'Neurologist'
    },
    notes: 'First round of Botox injections for migraine prevention. 31 injection sites.',
    location: 'Neurology Associates'
  }
];

// Mock related lab results
const RELATED_LABS = [
  {
    id: 201,
    conditionId: 1,
    title: 'Genetic Panel - EDS',
    date: '2020-06-01',
    results: [
      { name: 'COL5A1 Mutation', value: 'Negative', referenceRange: 'Negative', isAbnormal: false },
      { name: 'COL5A2 Mutation', value: 'Negative', referenceRange: 'Negative', isAbnormal: false },
      { name: 'TNXB Mutation', value: 'Negative', referenceRange: 'Negative', isAbnormal: false }
    ],
    provider: {
      id: 3,
      name: 'Dr. Emily Martinez',
      specialty: 'Geneticist'
    },
    summary: 'Genetic testing for known EDS mutations negative, supporting clinical diagnosis of hypermobile type EDS.',
    location: 'University Medical Center Lab'
  },
  {
    id: 202,
    conditionId: 3,
    title: 'Autonomic Function Tests',
    date: '2022-02-10',
    results: [
      { name: 'Resting Heart Rate', value: '72 bpm', referenceRange: '60-100 bpm', isAbnormal: false },
      { name: 'Standing Heart Rate (2 min)', value: '122 bpm', referenceRange: '<120 bpm', isAbnormal: true },
      { name: 'Blood Pressure Supine', value: '110/70 mmHg', referenceRange: '90-140/60-90 mmHg', isAbnormal: false },
      { name: 'Blood Pressure Standing', value: '115/75 mmHg', referenceRange: 'No significant drop', isAbnormal: false }
    ],
    provider: {
      id: 2,
      name: 'Dr. Rebecca Chang',
      specialty: 'Cardiologist'
    },
    summary: 'Results consistent with POTS - significant heart rate increase on standing without orthostatic hypotension.',
    location: 'Heart & Vascular Institute'
  },
  {
    id: 203,
    conditionId: 4,
    title: 'Comprehensive GI Panel',
    date: '2021-07-28',
    results: [
      { name: 'Celiac Antibodies', value: 'Negative', referenceRange: 'Negative', isAbnormal: false },
      { name: 'Fecal Calprotectin', value: '35 μg/g', referenceRange: '<50 μg/g', isAbnormal: false },
      { name: 'H. Pylori Antigen', value: 'Negative', referenceRange: 'Negative', isAbnormal: false },
      { name: 'Inflammatory Markers', value: 'Within normal limits', referenceRange: 'Normal', isAbnormal: false }
    ],
    provider: {
      id: 4,
      name: 'Dr. Sarah Patel',
      specialty: 'Gastroenterologist'
    },
    summary: 'No evidence of inflammatory bowel disease, celiac disease, or infection. Findings support functional diagnosis of IBS.',
    location: 'Digestive Health Center'
  }
];

// Get status badge color
const getStatusColor = (status: string) => {
  switch (status) {
    case 'active':
      return 'bg-green-100 text-green-800';
    case 'resolved':
      return 'bg-blue-100 text-blue-800';
    case 'in_remission':
      return 'bg-purple-100 text-purple-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

// Format date to readable string
const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

// Get severity indicator
const getSeverityIndicator = (severity: number) => {
  let color;
  if (severity >= 8) {
    color = 'bg-red-500';
  } else if (severity >= 5) {
    color = 'bg-amber-500';
  } else {
    color = 'bg-green-500';
  }
  
  return (
    <div className="flex items-center gap-2">
      <div className={`w-3 h-3 rounded-full ${color}`}></div>
      <span className="text-gray-700">Severity: {severity}/10</span>
    </div>
  );
};

export default function ConditionPage() {
  const params = useParams();
  const id = params?.id as string;
  const [activeTab, setActiveTab] = useState('overview');
  const [condition, setCondition] = useState<any>(null);
  const [relatedTimeline, setRelatedTimeline] = useState<any[]>([]);
  const [relatedLabs, setRelatedLabs] = useState<any[]>([]);
  
  useEffect(() => {
    if (!id) return;
    
    // Find the condition based on the ID from the URL
    const conditionId = Number(id);
    const foundCondition = CONDITIONS.find(c => c.id === conditionId);
    
    if (foundCondition) {
      setCondition(foundCondition);
      
      // Filter related timeline events
      const timelineEvents = TIMELINE_EVENTS.filter(event => event.conditionId === conditionId);
      setRelatedTimeline(timelineEvents);
      
      // Filter related lab results
      const labResults = RELATED_LABS.filter(lab => lab.conditionId === conditionId);
      setRelatedLabs(labResults);
    }
  }, [id]);
  
  if (!condition) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mx-auto mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto mb-8"></div>
          <div className="h-64 bg-gray-200 rounded mb-4"></div>
        </div>
      </div>
    );
  }
  
  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'history', label: 'History & Notes' },
    { id: 'timeline', label: 'Timeline' },
    { id: 'tests', label: 'Lab Results' },
    { id: 'treatments', label: 'Treatments' }
  ];
  
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Back button */}
      <div className="mb-6">
        <Link 
          href="/conditions" 
          className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900"
        >
          <svg className="mr-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Conditions
        </Link>
      </div>
      
      {/* Condition header */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6 mb-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(condition.status)}`}>
                {condition.status.charAt(0).toUpperCase() + condition.status.slice(1)}
              </span>
              <span className="text-sm text-gray-500">
                Since {formatDate(condition.dateAdded)}
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">{condition.name}</h1>
            <p className="text-gray-700">{condition.description}</p>
          </div>
          <div className="flex flex-col items-start md:items-end gap-2">
            {getSeverityIndicator(condition.severity)}
            <span className="text-sm text-gray-600 capitalize">
              Category: {condition.category}
            </span>
          </div>
        </div>
      </div>
      
      {/* Tabs */}
      <div className="mb-6 border-b border-gray-200">
        <nav className="flex overflow-x-auto">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-3 text-sm font-medium border-b-2 whitespace-nowrap ${
                activeTab === tab.id
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>
      
      {/* Tab content */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Provider Information */}
              <div>
                <h2 className="text-lg font-medium text-gray-900 mb-4">Diagnosed By</h2>
                <div className="flex items-start">
                  <div className="bg-indigo-100 text-indigo-600 rounded-full h-12 w-12 flex items-center justify-center">
                    <span className="font-medium text-lg">
                      {condition.provider.name.split(' ')[0][0]}{condition.provider.name.split(' ')[1][0]}
                    </span>
                  </div>
                  <div className="ml-4">
                    <p className="font-medium text-gray-900">{condition.provider.name}</p>
                    <p className="text-gray-500">{condition.provider.specialty}</p>
                    <button className="mt-2 text-sm text-indigo-600 hover:text-indigo-800">
                      View Provider Details
                    </button>
                  </div>
                </div>
              </div>
              
              {/* Diagnosis Details */}
              <div className="lg:col-span-2">
                <h2 className="text-lg font-medium text-gray-900 mb-4">Diagnosis Details</h2>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Diagnostic Criteria</h3>
                    <p className="mt-1">{condition.diagnosisDetails?.criteria || "No criteria information available."}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Confirmed By</h3>
                    <p className="mt-1">{condition.diagnosisDetails?.confirmedBy || "Information not available."}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Additional Tests</h3>
                    <p className="mt-1">{condition.diagnosisDetails?.additionalTests || "No additional tests recorded."}</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Related Symptoms */}
            <div className="mt-8">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Related Symptoms</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {condition.relatedSymptoms.map((symptom: any) => (
                  <div key={symptom.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                    <Link href={`/symptoms/${symptom.id}`} className="block">
                      <h3 className="font-medium text-gray-900">{symptom.name}</h3>
                      <div className="mt-2 flex justify-between items-center">
                        <span className="text-sm text-gray-500">View Details</span>
                        <svg className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
        
        {/* History & Notes Tab */}
        {activeTab === 'history' && (
          <div>
            <div className="mb-8">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Condition History</h2>
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <p className="whitespace-pre-line">{condition.history || "No detailed history available."}</p>
              </div>
            </div>
            
            <div>
              <h2 className="text-lg font-medium text-gray-900 mb-4">Clinical Notes</h2>
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <p className="whitespace-pre-line">{condition.notes || "No clinical notes available."}</p>
              </div>
            </div>
          </div>
        )}
        
        {/* Timeline Tab */}
        {activeTab === 'timeline' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-medium text-gray-900">Condition Timeline</h2>
              <Link 
                href={`/timeline?condition=${condition.id}`}
                className="text-sm text-indigo-600 hover:text-indigo-800"
              >
                View in Full Timeline
              </Link>
            </div>
            
            {relatedTimeline.length > 0 ? (
              <div className="relative">
                {/* Timeline line */}
                <div className="absolute top-0 bottom-0 left-6 md:left-7 w-0.5 bg-gray-200"></div>
                
                {/* Timeline events */}
                <div className="space-y-6">
                  {relatedTimeline.map((event) => (
                    <div key={event.id} className="relative">
                      <div className="flex items-start">
                        {/* Timeline dot */}
                        <div className={`absolute mt-1.5 rounded-full h-3 w-3 border-2 border-white ${
                          event.type === 'diagnosis' ? 'bg-green-500' : 
                          event.type === 'treatment' ? 'bg-purple-500' : 
                          'bg-blue-500'
                        }`}></div>
                        
                        {/* Event content */}
                        <div className="ml-10 md:ml-12">
                          <div className="flex flex-col md:flex-row md:items-center mb-1 gap-2">
                            <span className="text-sm font-medium text-gray-900">{formatDate(event.date)}</span>
                            <span className={`md:ml-2 inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${
                              event.type === 'diagnosis' ? 'bg-green-100 text-green-800' : 
                              event.type === 'treatment' ? 'bg-purple-100 text-purple-800' : 
                              'bg-blue-100 text-blue-800'
                            }`}>
                              {event.type.charAt(0).toUpperCase() + event.type.slice(1)}
                            </span>
                          </div>
                          <h3 className="text-base font-medium text-gray-900">{event.title}</h3>
                          <p className="mt-1 text-sm text-gray-600">{event.notes}</p>
                          <div className="mt-2 text-sm text-gray-500">
                            <span>Provider: {event.provider.name}</span>
                            <span className="mx-2">•</span>
                            <span>Location: {event.location}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center py-8 bg-gray-50 rounded-lg border border-gray-200">
                <p className="text-gray-500">No timeline events found for this condition.</p>
              </div>
            )}
          </div>
        )}
        
        {/* Lab Results Tab */}
        {activeTab === 'tests' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-medium text-gray-900">Related Lab Results</h2>
              <Link 
                href="/labs"
                className="text-sm text-indigo-600 hover:text-indigo-800"
              >
                View All Lab Results
              </Link>
            </div>
            
            {relatedLabs.length > 0 ? (
              <div className="space-y-6">
                {relatedLabs.map((lab) => (
                  <div key={lab.id} className="border border-gray-200 rounded-lg overflow-hidden">
                    <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                        <h3 className="text-base font-medium text-gray-900">{lab.title}</h3>
                        <div className="text-sm text-gray-500">
                          <span>{formatDate(lab.date)}</span>
                          <span className="mx-2">•</span>
                          <span>{lab.provider.name}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="px-4 py-3">
                      <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                          <thead>
                            <tr>
                              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Test</th>
                              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Result</th>
                              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reference Range</th>
                              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-200">
                            {lab.results.map((result: any, index: number) => (
                              <tr key={index}>
                                <td className="px-3 py-2 whitespace-nowrap text-sm font-medium text-gray-900">{result.name}</td>
                                <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500">{result.value}</td>
                                <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500">{result.referenceRange}</td>
                                <td className="px-3 py-2 whitespace-nowrap text-sm">
                                  {result.isAbnormal ? (
                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                      Abnormal
                                    </span>
                                  ) : (
                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                      Normal
                                    </span>
                                  )}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                      
                      <div className="mt-4">
                        <h4 className="text-sm font-medium text-gray-900">Summary</h4>
                        <p className="mt-1 text-sm text-gray-600">{lab.summary}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 bg-gray-50 rounded-lg border border-gray-200">
                <p className="text-gray-500">No lab results found for this condition.</p>
              </div>
            )}
          </div>
        )}
        
        {/* Treatments Tab */}
        {activeTab === 'treatments' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-medium text-gray-900">Current Treatments</h2>
              <Link 
                href="/treatments"
                className="text-sm text-indigo-600 hover:text-indigo-800"
              >
                View All Treatments
              </Link>
            </div>
            
            {condition.treatments.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {condition.treatments.map((treatment: any) => (
                  <div key={treatment.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex items-start">
                      <div className="mr-4 mt-1">
                        <span className="text-xl">
                          {treatment.type === 'medication' ? '💊' : 
                           treatment.type === 'therapy' ? '👨‍⚕️' : 
                           treatment.type === 'procedure' ? '🏥' : '🍎'}
                        </span>
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900">{treatment.name}</h3>
                        <p className="text-sm text-gray-500 mt-1 capitalize">{treatment.type}</p>
                        <div className="mt-4 flex justify-end">
                          <Link 
                            href={`/treatments/${treatment.id}`}
                            className="text-sm text-indigo-600 hover:text-indigo-800"
                          >
                            View Details
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 bg-gray-50 rounded-lg border border-gray-200">
                <p className="text-gray-500">No treatments recorded for this condition.</p>
              </div>
            )}
            
            <div className="mt-8 text-center">
              <Link
                href={`/treatments/new?condition=${condition.id}`}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 transition-colors"
              >
                Add New Treatment
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 