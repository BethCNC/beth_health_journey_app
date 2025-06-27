'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { format, parseISO } from 'date-fns';

// Mock medical events data
const MEDICAL_EVENTS = [
  {
    id: 1,
    title: 'Initial EDS Diagnosis',
    date: '2020-03-15T10:00:00Z',
    description: 'First official diagnosis of Ehlers-Danlos Syndrome after years of symptoms.',
    eventType: 'diagnosis',
    location: 'Cleveland Clinic Genetics Department',
    provider: { id: 1, name: 'Dr. Smith', specialty: 'Genetics' },
    conditionId: 1,
    documents: [
      { id: 1, title: 'Genetic Test Results', fileType: 'pdf' },
      { id: 2, title: 'Clinical Assessment', fileType: 'pdf' }
    ],
    notes: 'Hypermobility type confirmed. Beighton score of 9/9. Referred to PT for joint stabilization protocol.'
  },
  {
    id: 2,
    title: 'Cardiology Consultation',
    date: '2021-11-10T14:30:00Z',
    description: 'Assessment for POTS and dysautonomia symptoms.',
    eventType: 'appointment',
    location: 'University Hospital Cardiology Dept',
    provider: { id: 2, name: 'Dr. Johnson', specialty: 'Cardiology' },
    conditionId: 3,
    documents: [
      { id: 3, title: 'Tilt Table Test Results', fileType: 'pdf' },
      { id: 4, title: 'ECG Report', fileType: 'pdf' }
    ],
    notes: 'Tilt table test positive for POTS. Heart rate increased by over 40bpm upon standing. Started on beta blocker and increased salt/fluids.'
  },
  {
    id: 3,
    title: 'Physical Therapy Evaluation',
    date: '2020-04-20T09:15:00Z',
    description: 'Initial PT assessment for joint hypermobility and pain management.',
    eventType: 'appointment',
    location: 'Restore Physical Therapy Clinic',
    provider: { id: 3, name: 'Sarah Thompson', specialty: 'Physical Therapy' },
    conditionId: 1,
    documents: [
      { id: 5, title: 'PT Initial Assessment', fileType: 'pdf' }
    ],
    notes: 'Joint stabilization exercises prescribed. Focus on proprioception and core strength. Twice weekly sessions recommended for 12 weeks.'
  },
  {
    id: 4,
    title: 'MRI Brain w/ and w/o Contrast',
    date: '2022-06-15T11:00:00Z',
    description: 'MRI to evaluate chronic migraines and rule out structural causes.',
    eventType: 'test',
    location: 'Advanced Imaging Center',
    provider: { id: 4, name: 'Dr. Patel', specialty: 'Radiology' },
    conditionId: 2,
    documents: [
      { id: 6, title: 'MRI Report', fileType: 'pdf' },
      { id: 7, title: 'MRI Images', fileType: 'dicom' }
    ],
    notes: 'No significant findings. Brain structure normal. Small incidental venous angioma noted in right temporal lobe, deemed benign and not related to migraines.'
  },
  {
    id: 5,
    title: 'Emergency Room Visit',
    date: '2022-01-25T22:45:00Z',
    description: 'Severe migraine with visual aura, vomiting, and right-sided weakness.',
    eventType: 'emergency',
    location: 'Memorial Hospital Emergency Department',
    provider: { id: 5, name: 'Dr. Roberts', specialty: 'Emergency Medicine' },
    conditionId: 2,
    documents: [
      { id: 8, title: 'Emergency Dept Records', fileType: 'pdf' },
      { id: 9, title: 'Discharge Instructions', fileType: 'pdf' }
    ],
    notes: 'Hemiplegic migraine. IV fluids, Toradol, and Zofran administered. CT scan negative for stroke. Discharged with Neurology follow-up.'
  },
  {
    id: 6,
    title: 'Gastroenterology Consultation',
    date: '2023-03-10T13:00:00Z',
    description: 'Evaluation for chronic digestive issues and suspected IBS.',
    eventType: 'appointment',
    location: 'Digestive Health Center',
    provider: { id: 6, name: 'Dr. Greene', specialty: 'Gastroenterology' },
    conditionId: 4,
    documents: [
      { id: 10, title: 'Gastro Consultation Notes', fileType: 'pdf' }
    ],
    notes: 'Diagnosed with IBS-Mixed type. Recommended FODMAP elimination diet and trial of antispasmodics. Discussed connection between hEDS and gastrointestinal manifestations.'
  },
  {
    id: 7,
    title: 'Knee Subluxation Event',
    date: '2021-08-05T16:20:00Z',
    description: 'Right knee subluxation while walking down stairs.',
    eventType: 'injury',
    location: 'Home',
    provider: null,
    conditionId: 1,
    documents: [],
    notes: 'Sudden pain and instability in right knee. Joint slipped partially out of place but returned on its own. Significant swelling and pain for 1 week. Used knee brace and crutches. Reinforced need for PT compliance.'
  },
  {
    id: 8,
    title: 'Colonoscopy',
    date: '2023-04-15T08:00:00Z',
    description: 'Screening colonoscopy to rule out inflammatory bowel disease.',
    eventType: 'procedure',
    location: 'Digestive Health Center',
    provider: { id: 6, name: 'Dr. Greene', specialty: 'Gastroenterology' },
    conditionId: 4,
    documents: [
      { id: 11, title: 'Colonoscopy Report', fileType: 'pdf' },
      { id: 12, title: 'Biopsy Results', fileType: 'pdf' }
    ],
    notes: 'Procedure completed without complications. No evidence of inflammatory bowel disease. Mild increased mucosal sensitivity noted. Biopsies negative for microscopic colitis.'
  },
  {
    id: 9,
    title: 'Autonomic Testing Panel',
    date: '2022-12-12T13:30:00Z',
    description: 'Comprehensive autonomic function testing for POTS management.',
    eventType: 'test',
    location: 'University Hospital Dysautonomia Center',
    provider: { id: 7, name: 'Dr. Williams', specialty: 'Neurology/Autonomic Disorders' },
    conditionId: 3,
    documents: [
      { id: 13, title: 'Autonomic Function Test Results', fileType: 'pdf' }
    ],
    notes: 'Confirmed hyperadrenergic POTS subtype. Valsalva ratio abnormal. Heart rate variability decreased. Treatment plan adjusted with addition of Florinef and compression garments.'
  },
  {
    id: 10,
    title: 'Rheumatology Follow-up',
    date: '2021-05-20T15:45:00Z',
    description: 'Six-month follow-up for EDS and related connective tissue issues.',
    eventType: 'appointment',
    location: 'Arthritis & Rheumatology Center',
    provider: { id: 8, name: 'Dr. Chen', specialty: 'Rheumatology' },
    conditionId: 1,
    documents: [
      { id: 14, title: 'Rheumatology Follow-up Notes', fileType: 'pdf' }
    ],
    notes: 'Joint pain stable with current regimen. Discussed long-term management strategies. No signs of inflammatory arthritis. Continue current pain management protocol.'
  },
  {
    id: 11,
    title: 'Migraine Botox Treatment',
    date: '2022-08-10T09:00:00Z',
    description: 'First round of Botox injections for chronic migraine prevention.',
    eventType: 'procedure',
    location: 'Headache Center',
    provider: { id: 9, name: 'Dr. Nelson', specialty: 'Neurology' },
    conditionId: 2,
    documents: [
      { id: 15, title: 'Botox Treatment Record', fileType: 'pdf' }
    ],
    notes: '31 injection sites across forehead, temples, back of head, neck, and shoulders. Tolerated well with minimal discomfort. Response to be evaluated at 4-6 weeks.'
  },
  {
    id: 12,
    title: 'Hospitalization for Severe Dehydration',
    date: '2023-07-22T14:00:00Z',
    description: 'Admitted for IV fluids following severe POTS flare with dehydration.',
    eventType: 'hospitalization',
    location: 'Memorial Hospital',
    provider: { id: 2, name: 'Dr. Johnson', specialty: 'Cardiology' },
    conditionId: 3,
    documents: [
      { id: 16, title: 'Hospital Admission Records', fileType: 'pdf' },
      { id: 17, title: 'Discharge Summary', fileType: 'pdf' }
    ],
    notes: 'Three-day hospitalization for IV saline. Triggered by high temperatures and respiratory infection. Significant orthostatic intolerance and tachycardia. Discharged with increased salt tablets and fluid protocol.'
  },
  {
    id: 13,
    title: 'Hand Surgery Consultation',
    date: '2023-09-05T10:30:00Z',
    description: 'Evaluation for recurring finger dislocations and joint instability.',
    eventType: 'appointment',
    location: 'Hand & Upper Extremity Center',
    provider: { id: 10, name: 'Dr. Martin', specialty: 'Orthopedic Surgery - Hand' },
    conditionId: 1,
    documents: [
      { id: 18, title: 'Hand Consultation Notes', fileType: 'pdf' },
      { id: 19, title: 'Hand X-rays', fileType: 'dicom' }
    ],
    notes: 'Discussed silver ring splints for PIP and DIP joint stabilization. Surgery not recommended due to poor tissue healing in EDS patients. Hand therapy referral provided.'
  },
  {
    id: 14,
    title: 'Vaccination Record: Flu + COVID',
    date: '2023-10-15T14:15:00Z',
    description: 'Annual flu vaccine and COVID-19 booster.',
    eventType: 'preventive',
    location: 'Primary Care Office',
    provider: { id: 11, name: 'Dr. Howard', specialty: 'Internal Medicine' },
    conditionId: null,
    documents: [
      { id: 20, title: 'Vaccination Record', fileType: 'pdf' }
    ],
    notes: 'Both vaccines administered in left deltoid. No immediate adverse reactions. Discussed importance of preventive care in chronic illness patients.'
  },
  {
    id: 15,
    title: 'Raynaud\'s Phenomenon Diagnosis',
    date: '2021-01-20T11:00:00Z',
    description: 'Evaluation for cold sensitivity and color changes in fingers and toes.',
    eventType: 'diagnosis',
    location: 'Rheumatology Clinic',
    provider: { id: 8, name: 'Dr. Chen', specialty: 'Rheumatology' },
    conditionId: 5,
    documents: [
      { id: 21, title: 'Diagnostic Assessment', fileType: 'pdf' },
      { id: 22, title: 'Cold Challenge Test Results', fileType: 'pdf' }
    ],
    notes: 'Primary Raynaud\'s diagnosed. Triphasic color changes observed during examination. No indications of underlying connective tissue disease beyond EDS. Calcium channel blockers prescribed for severe episodes.'
  }
];

// Event type options for filtering
const EVENT_TYPES = [
  { value: 'appointment', label: 'Appointment' },
  { value: 'diagnosis', label: 'Diagnosis' },
  { value: 'emergency', label: 'Emergency' },
  { value: 'hospitalization', label: 'Hospitalization' },
  { value: 'injury', label: 'Injury' },
  { value: 'preventive', label: 'Preventive Care' },
  { value: 'procedure', label: 'Procedure' },
  { value: 'test', label: 'Test/Imaging' }
];

// Mock conditions for filtering
const CONDITIONS = [
  { id: 1, name: 'Ehlers-Danlos Syndrome (hEDS)' },
  { id: 2, name: 'Chronic Migraine' },
  { id: 3, name: 'POTS' },
  { id: 4, name: 'IBS' },
  { id: 5, name: 'Raynaud\'s Phenomenon' }
];

// Mock providers for filtering
const PROVIDERS = [
  { id: 1, name: 'Dr. Smith', specialty: 'Genetics' },
  { id: 2, name: 'Dr. Johnson', specialty: 'Cardiology' },
  { id: 3, name: 'Sarah Thompson', specialty: 'Physical Therapy' },
  { id: 4, name: 'Dr. Patel', specialty: 'Radiology' },
  { id: 5, name: 'Dr. Roberts', specialty: 'Emergency Medicine' },
  { id: 6, name: 'Dr. Greene', specialty: 'Gastroenterology' },
  { id: 7, name: 'Dr. Williams', specialty: 'Neurology/Autonomic Disorders' },
  { id: 8, name: 'Dr. Chen', specialty: 'Rheumatology' },
  { id: 9, name: 'Dr. Nelson', specialty: 'Neurology' },
  { id: 10, name: 'Dr. Martin', specialty: 'Orthopedic Surgery - Hand' },
  { id: 11, name: 'Dr. Howard', specialty: 'Internal Medicine' }
];

// Format date
const formatDate = (dateString: string) => {
  const date = parseISO(dateString);
  return format(date, 'PPP'); // e.g., "April 29, 2023"
};

// Format time
const formatTime = (dateString: string) => {
  const date = parseISO(dateString);
  return format(date, 'p'); // e.g., "12:00 PM"
};

// Get event type badge color
const getEventTypeColor = (eventType: string) => {
  switch (eventType) {
    case 'appointment': return 'bg-blue-100 text-blue-800';
    case 'diagnosis': return 'bg-purple-100 text-purple-800';
    case 'emergency': return 'bg-red-100 text-red-800';
    case 'hospitalization': return 'bg-pink-100 text-pink-800';
    case 'injury': return 'bg-amber-100 text-amber-800';
    case 'preventive': return 'bg-green-100 text-green-800';
    case 'procedure': return 'bg-indigo-100 text-indigo-800';
    case 'test': return 'bg-cyan-100 text-cyan-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

export default function MedicalEventsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [selectedCondition, setSelectedCondition] = useState<number | null>(null);
  const [selectedProvider, setSelectedProvider] = useState<number | null>(null);
  const [selectedYear, setSelectedYear] = useState<string>('');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [expandedEventId, setExpandedEventId] = useState<number | null>(null);
  const [filteredEvents, setFilteredEvents] = useState(MEDICAL_EVENTS);
  
  // Get unique years from events for the year filter
  const years = [...new Set(MEDICAL_EVENTS.map(event => 
    format(parseISO(event.date), 'yyyy')
  ))].sort((a, b) => parseInt(b) - parseInt(a)); // Sort years descending
  
  // Filter events based on selected filters and search query
  useEffect(() => {
    let result = [...MEDICAL_EVENTS];
    
    // Apply search query filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(event => 
        event.title.toLowerCase().includes(query) || 
        event.description.toLowerCase().includes(query) ||
        event.notes?.toLowerCase().includes(query) ||
        event.location?.toLowerCase().includes(query) ||
        event.provider?.name.toLowerCase().includes(query)
      );
    }
    
    // Apply event type filter
    if (selectedTypes.length > 0) {
      result = result.filter(event => 
        selectedTypes.includes(event.eventType)
      );
    }
    
    // Apply condition filter
    if (selectedCondition !== null) {
      result = result.filter(event => 
        event.conditionId === selectedCondition
      );
    }
    
    // Apply provider filter
    if (selectedProvider !== null) {
      result = result.filter(event => 
        event.provider?.id === selectedProvider
      );
    }
    
    // Apply year filter
    if (selectedYear) {
      result = result.filter(event => 
        format(parseISO(event.date), 'yyyy') === selectedYear
      );
    }
    
    // Apply sorting
    result.sort((a, b) => {
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();
      return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
    });
    
    setFilteredEvents(result);
  }, [searchQuery, selectedTypes, selectedCondition, selectedProvider, selectedYear, sortOrder]);
  
  // Toggle event type filter
  const toggleEventType = (type: string) => {
    setSelectedTypes(prev => 
      prev.includes(type) 
        ? prev.filter(item => item !== type) 
        : [...prev, type]
    );
  };
  
  // Clear all filters
  const clearFilters = () => {
    setSearchQuery('');
    setSelectedTypes([]);
    setSelectedCondition(null);
    setSelectedProvider(null);
    setSelectedYear('');
  };
  
  // Toggle event details expansion
  const toggleEventDetails = (id: number) => {
    setExpandedEventId(expandedEventId === id ? null : id);
  };
  
  // Get the label for an event type
  const getEventTypeLabel = (type: string) => {
    return EVENT_TYPES.find(t => t.value === type)?.label || type;
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Medical Events</h1>
      
      {/* Search and filter controls */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4 mb-8">
        <div className="mb-4">
          <input
            type="text"
            placeholder="Search events, doctors, locations..."
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
          {/* Event Type Filter */}
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-2">Event Type</h3>
            <div className="flex flex-wrap gap-2">
              {EVENT_TYPES.map(type => (
                <button
                  key={type.value}
                  onClick={() => toggleEventType(type.value)}
                  className={`px-2.5 py-1 text-xs font-medium rounded-full ${
                    selectedTypes.includes(type.value)
                      ? 'bg-indigo-100 text-indigo-800'
                      : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                  }`}
                >
                  {type.label}
                </button>
              ))}
            </div>
          </div>
          
          {/* Condition Filter */}
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-2">Related Condition</h3>
            <select
              className="w-full p-2 border border-gray-300 rounded-md"
              value={selectedCondition !== null ? selectedCondition : ''}
              onChange={(e) => setSelectedCondition(e.target.value ? parseInt(e.target.value) : null)}
            >
              <option value="">All Conditions</option>
              {CONDITIONS.map(condition => (
                <option key={condition.id} value={condition.id}>
                  {condition.name}
                </option>
              ))}
            </select>
          </div>
          
          {/* Provider Filter */}
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-2">Provider</h3>
            <select
              className="w-full p-2 border border-gray-300 rounded-md"
              value={selectedProvider !== null ? selectedProvider : ''}
              onChange={(e) => setSelectedProvider(e.target.value ? parseInt(e.target.value) : null)}
            >
              <option value="">All Providers</option>
              {PROVIDERS.map(provider => (
                <option key={provider.id} value={provider.id}>
                  {provider.name} ({provider.specialty})
                </option>
              ))}
            </select>
          </div>
          
          {/* Year Filter */}
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-2">Year</h3>
            <select
              className="w-full p-2 border border-gray-300 rounded-md"
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
            >
              <option value="">All Years</option>
              {years.map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
          </div>
        </div>
        
        {/* Sorting and Filter Controls */}
        <div className="flex flex-wrap justify-between items-center">
          <div className="flex items-center mb-2 md:mb-0">
            <span className="text-sm text-gray-600 mr-2">Sort by date:</span>
            <select
              className="p-1 border border-gray-300 rounded-md text-sm"
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value as 'asc' | 'desc')}
            >
              <option value="desc">Newest first</option>
              <option value="asc">Oldest first</option>
            </select>
          </div>
          
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm text-gray-600">
              {filteredEvents.length} events found
            </span>
            {(searchQuery || selectedTypes.length > 0 || selectedCondition !== null || 
              selectedProvider !== null || selectedYear) && (
              <button
                onClick={clearFilters}
                className="text-sm text-indigo-600 hover:text-indigo-800"
              >
                Clear all filters
              </button>
            )}
          </div>
        </div>
      </div>
      
      {/* Events Timeline */}
      {filteredEvents.length > 0 ? (
        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-0 md:left-24 top-0 bottom-0 w-0.5 bg-gray-200 ml-4 md:ml-0"></div>
          
          {/* Events list */}
          <div className="space-y-6">
            {filteredEvents.map((event) => (
              <div key={event.id} className="relative">
                {/* Timeline dot */}
                <div className="absolute left-0 md:left-24 w-9 h-9 rounded-full bg-white border-4 border-indigo-500 ml-0 md:ml-0 z-10"></div>
                
                {/* Event card */}
                <div className="ml-12 md:ml-36">
                  <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
                    {/* Event header - always visible */}
                    <div 
                      className="p-4 cursor-pointer hover:bg-gray-50"
                      onClick={() => toggleEventDetails(event.id)}
                    >
                      <div className="mb-3">
                        <span className="text-sm text-gray-500">
                          {formatDate(event.date)} at {formatTime(event.date)}
                        </span>
                      </div>
                      <div className="flex flex-col md:flex-row md:items-start justify-between gap-3">
                        <div>
                          <h2 className="text-lg font-medium text-gray-900">{event.title}</h2>
                          <p className="text-gray-600 text-sm mt-1">{event.description}</p>
                          <div className="mt-2 flex flex-wrap gap-2">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getEventTypeColor(event.eventType)}`}>
                              {getEventTypeLabel(event.eventType)}
                            </span>
                            {event.conditionId && (
                              <Link 
                                href={`/conditions/${event.conditionId}`}
                                className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                                onClick={(e) => e.stopPropagation()}
                              >
                                {CONDITIONS.find(c => c.id === event.conditionId)?.name}
                              </Link>
                            )}
                          </div>
                        </div>
                        <div className="flex flex-col text-right text-sm text-gray-500">
                          {event.location && (
                            <span>{event.location}</span>
                          )}
                          {event.provider && (
                            <span>{event.provider.name} ({event.provider.specialty})</span>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    {/* Expanded details */}
                    {expandedEventId === event.id && (
                      <div className="p-4 bg-gray-50 border-t border-gray-200">
                        {/* Notes section */}
                        {event.notes && (
                          <div className="mb-4">
                            <h3 className="text-sm font-medium text-gray-900 mb-2">Notes</h3>
                            <p className="text-gray-600 text-sm whitespace-pre-line">{event.notes}</p>
                          </div>
                        )}
                        
                        {/* Documents section */}
                        {event.documents && event.documents.length > 0 && (
                          <div className="mb-4">
                            <h3 className="text-sm font-medium text-gray-900 mb-2">Documents</h3>
                            <div className="flex flex-wrap gap-2">
                              {event.documents.map(doc => (
                                <Link 
                                  key={doc.id}
                                  href={`/documents/${doc.id}`}
                                  className="inline-flex items-center px-3 py-1.5 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                  </svg>
                                  {doc.title} ({doc.fileType.toUpperCase()})
                                </Link>
                              ))}
                            </div>
                          </div>
                        )}
                        
                        {/* Action buttons */}
                        <div className="flex justify-end gap-3">
                          <Link
                            href={`/medical-events/${event.id}`}
                            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200"
                            onClick={(e) => e.stopPropagation()}
                          >
                            View Full Details
                          </Link>
                          <Link
                            href={`/medical-events/${event.id}/edit`}
                            className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                            onClick={(e) => e.stopPropagation()}
                          >
                            Edit
                          </Link>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
          <p className="text-gray-500">No medical events match your filters.</p>
          <button
            onClick={clearFilters}
            className="mt-4 inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
          >
            Clear Filters
          </button>
        </div>
      )}
      
      {/* Add event button */}
      <div className="mt-8 flex justify-center">
        <Link
          href="/medical-events/new"
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
        >
          Add New Medical Event
        </Link>
      </div>
    </div>
  );
} 