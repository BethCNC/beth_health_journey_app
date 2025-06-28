'use client';

import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useState, useEffect, Suspense } from 'react';

// Mock data for timeline events
const MOCK_TIMELINE_EVENTS = [
  {
    id: 1,
    title: 'Ehlers-Danlos Syndrome Diagnosis',
    description: 'Diagnosed with hypermobile Ehlers-Danlos Syndrome (hEDS) after evaluation of joint hypermobility, skin elasticity, and family history.',
    date: '2020-06-15',
    category: 'diagnosis',
    provider: 'Dr. Emily Williams',
    facility: 'University Medical Center',
    relatedCondition: {
      id: 1,
      name: 'Ehlers-Danlos Syndrome (hEDS)'
    }
  },
  {
    id: 2,
    title: 'Physical Therapy Evaluation',
    description: 'Initial evaluation for joint stabilization program. Custom protocol designed for hypermobility.',
    date: '2020-07-10',
    category: 'appointment',
    provider: 'Dr. Michael Chen',
    facility: 'Riverdale Physical Therapy',
    relatedCondition: {
      id: 1,
      name: 'Ehlers-Danlos Syndrome (hEDS)'
    }
  },
  {
    id: 3,
    title: 'Genetic Testing Results',
    description: 'Comprehensive genetic panel to rule out vascular and classical EDS variants.',
    date: '2020-08-05',
    category: 'test',
    provider: 'Dr. Sarah Johnson',
    facility: 'Genetics Laboratory',
    relatedCondition: {
      id: 1,
      name: 'Ehlers-Danlos Syndrome (hEDS)'
    },
    results: 'No pathogenic variants identified in COL3A1, COL5A1, or COL5A2 genes.'
  },
  {
    id: 4,
    title: 'Pain Management Consultation',
    description: 'Evaluation for chronic joint pain management strategies.',
    date: '2021-01-20',
    category: 'appointment',
    provider: 'Dr. Robert Garcia',
    facility: 'Pain Management Center',
    relatedCondition: {
      id: 1,
      name: 'Ehlers-Danlos Syndrome (hEDS)'
    }
  },
  {
    id: 5,
    title: 'Started Pregabalin',
    description: 'Began pregabalin 75mg twice daily for neuropathic pain management.',
    date: '2021-03-15',
    category: 'treatment',
    provider: 'Dr. Robert Garcia',
    facility: 'Pain Management Center',
    relatedCondition: {
      id: 1,
      name: 'Ehlers-Danlos Syndrome (hEDS)'
    }
  },
  {
    id: 6,
    title: 'Migraine Diagnosis',
    description: 'Diagnosed with chronic migraine with aura after persistent episodes of visual disturbances and severe headaches.',
    date: '2021-05-10',
    category: 'diagnosis',
    provider: 'Dr. Lisa Wong',
    facility: 'Neurology Associates',
    relatedCondition: {
      id: 2,
      name: 'Chronic Migraine'
    }
  },
  {
    id: 7,
    title: 'Started Topiramate',
    description: 'Began topiramate 50mg daily as migraine prophylaxis.',
    date: '2021-05-25',
    category: 'treatment',
    provider: 'Dr. Lisa Wong',
    facility: 'Neurology Associates',
    relatedCondition: {
      id: 2,
      name: 'Chronic Migraine'
    }
  },
  {
    id: 8,
    title: 'ER Visit for Shoulder Dislocation',
    description: 'Emergency treatment for right shoulder dislocation after reaching overhead.',
    date: '2021-08-12',
    category: 'emergency',
    provider: 'Dr. James Miller',
    facility: 'Memorial Hospital Emergency Department',
    relatedCondition: {
      id: 1,
      name: 'Ehlers-Danlos Syndrome (hEDS)'
    }
  },
  {
    id: 9,
    title: 'MRI of Right Shoulder',
    description: 'MRI to evaluate recurring shoulder instability and potential labral tear.',
    date: '2021-09-03',
    category: 'test',
    provider: 'Dr. Amanda Taylor',
    facility: 'Advanced Imaging Center',
    relatedCondition: {
      id: 1,
      name: 'Ehlers-Danlos Syndrome (hEDS)'
    },
    results: 'Anterior labral tear and mild joint effusion. Increased joint laxity consistent with hypermobility disorder.'
  },
  {
    id: 10,
    title: 'Orthopedic Consultation',
    description: 'Evaluation for shoulder instability and discussion of surgical vs. conservative management options.',
    date: '2021-09-20',
    category: 'appointment',
    provider: 'Dr. Thomas Wilson',
    facility: 'Orthopedic Specialists',
    relatedCondition: {
      id: 1,
      name: 'Ehlers-Danlos Syndrome (hEDS)'
    }
  },
  {
    id: 11,
    title: 'POTS Diagnosis',
    description: 'Diagnosed with Postural Orthostatic Tachycardia Syndrome after tilt table test.',
    date: '2022-02-15',
    category: 'diagnosis',
    provider: 'Dr. Rebecca Chang',
    facility: 'Autonomic Disorders Clinic',
    relatedCondition: {
      id: 3,
      name: 'POTS'
    }
  },
  {
    id: 12,
    title: 'Started Salt Tablets and Compression Garments',
    description: 'Began treatment with increased salt intake, compression stockings, and structured fluid intake for POTS management.',
    date: '2022-03-01',
    category: 'treatment',
    provider: 'Dr. Rebecca Chang',
    facility: 'Autonomic Disorders Clinic',
    relatedCondition: {
      id: 3,
      name: 'POTS'
    }
  }
];



// Group events by year
const groupEventsByYear = (events: typeof MOCK_TIMELINE_EVENTS) => {
  const grouped: Record<string, typeof MOCK_TIMELINE_EVENTS> = {};
  
  events.forEach(event => {
    const year = new Date(event.date).getFullYear().toString();
    if (!grouped[year]) {
      grouped[year] = [];
    }
    grouped[year].push(event);
  });
  
  // Sort years in descending order
  return Object.keys(grouped)
    .sort((a, b) => Number(b) - Number(a))
    .reduce((acc, year) => {
      acc[year] = grouped[year];
      return acc;
    }, {} as Record<string, typeof MOCK_TIMELINE_EVENTS>);
};

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

const getCategoryColor = (category: string) => {
  switch (category) {
    case 'diagnosis':
      return 'bg-purple-100 text-purple-800';
    case 'appointment':
      return 'bg-blue-100 text-blue-800';
    case 'test':
      return 'bg-green-100 text-green-800';
    case 'treatment':
      return 'bg-teal-100 text-teal-800';
    case 'emergency':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

function TimelineContent() {
  const searchParams = useSearchParams();
  const [groupedEvents, setGroupedEvents] = useState<Record<string, typeof MOCK_TIMELINE_EVENTS>>({});
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedCondition, setSelectedCondition] = useState<number | null>(null);
  const [highlightedEvent, setHighlightedEvent] = useState<number | null>(null);
  
  // Get all unique conditions from events
  const conditions = Array.from(
    new Set(
      MOCK_TIMELINE_EVENTS
        .filter(event => event.relatedCondition)
        .map(event => JSON.stringify(event.relatedCondition))
    )
  ).map(conditionStr => JSON.parse(conditionStr));
  
  // Get all unique categories from events
  const categories = Array.from(
    new Set(MOCK_TIMELINE_EVENTS.map(event => event.category))
  );
  
  useEffect(() => {
    // Filter events based on selected category and condition
    let filteredEvents = [...MOCK_TIMELINE_EVENTS];
    
    if (selectedCategory) {
      filteredEvents = filteredEvents.filter(event => event.category === selectedCategory);
    }
    
    if (selectedCondition) {
      filteredEvents = filteredEvents.filter(
        event => event.relatedCondition && event.relatedCondition.id === selectedCondition
      );
    }
    
    // Sort by date (newest first)
    filteredEvents.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    
    // Group by year
    setGroupedEvents(groupEventsByYear(filteredEvents));
    
    // Check for event parameter in URL
    const eventId = searchParams?.get('event');
    if (eventId) {
      setHighlightedEvent(Number(eventId));
      // Scroll to highlighted event after a short delay
      setTimeout(() => {
        const element = document.getElementById(`event-${eventId}`);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 500);
    }
  }, [selectedCategory, selectedCondition, searchParams]);
  
  const handleCategoryChange = (category: string | null) => {
    setSelectedCategory(category === selectedCategory ? null : category);
  };
  
  const handleConditionChange = (conditionId: number | null) => {
    setSelectedCondition(conditionId === selectedCondition ? null : conditionId);
  };

  // Initialize with all events grouped by year
  useEffect(() => {
    setGroupedEvents(groupEventsByYear(MOCK_TIMELINE_EVENTS));
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Medical Timeline</h1>
      <p className="text-gray-600 mb-8">
        A chronological history of diagnoses, treatments, and medical events.
      </p>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm p-4 mb-8">
        <h2 className="text-lg font-semibold mb-4">Filter Timeline</h2>
        
        <div className="mb-4">
          <h3 className="text-sm font-medium text-gray-700 mb-2">By Category:</h3>
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => handleCategoryChange(category)}
                className={`px-3 py-1 rounded-full text-xs font-medium ${
                  selectedCategory === category
                    ? getCategoryColor(category)
                    : 'bg-gray-100 text-gray-600'
                }`}
              >
                {category.charAt(0).toUpperCase() + category.slice(1)}
                {selectedCategory === category && ' ✓'}
              </button>
            ))}
            {selectedCategory && (
              <button
                onClick={() => setSelectedCategory(null)}
                className="px-3 py-1 rounded-full text-xs font-medium bg-gray-200 text-gray-700"
              >
                Clear
              </button>
            )}
          </div>
        </div>
        
        <div>
          <h3 className="text-sm font-medium text-gray-700 mb-2">By Condition:</h3>
          <div className="flex flex-wrap gap-2">
            {conditions.map((condition) => (
              <button
                key={condition.id}
                onClick={() => handleConditionChange(condition.id)}
                className={`px-3 py-1 rounded-full text-xs font-medium ${
                  selectedCondition === condition.id
                    ? 'bg-indigo-100 text-indigo-800'
                    : 'bg-gray-100 text-gray-600'
                }`}
              >
                {condition.name}
                {selectedCondition === condition.id && ' ✓'}
              </button>
            ))}
            {selectedCondition && (
              <button
                onClick={() => setSelectedCondition(null)}
                className="px-3 py-1 rounded-full text-xs font-medium bg-gray-200 text-gray-700"
              >
                Clear
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Timeline */}
      <div className="relative">
        {Object.keys(groupedEvents).length > 0 ? (
          Object.entries(groupedEvents).map(([year, events]) => (
            <div key={year} className="mb-12">
              <div className="sticky top-0 bg-white z-10 py-2 mb-4">
                <h2 className="text-2xl font-bold text-gray-800">{year}</h2>
                <div className="w-16 h-1 bg-indigo-500 mt-1"></div>
              </div>
              
              <div className="relative ml-4">
                {/* Timeline vertical line */}
                <div className="absolute top-0 left-0 h-full w-0.5 bg-gray-200"></div>
                
                {/* Events */}
                {events.map((event) => (
                  <div 
                    key={event.id}
                    id={`event-${event.id}`}
                    className={`relative pl-8 pb-8 ${
                      highlightedEvent === event.id 
                        ? 'bg-yellow-50 -ml-4 pl-12 py-4 rounded-lg border-l-4 border-yellow-400'
                        : ''
                    }`}
                  >
                    {/* Timeline dot */}
                    <div className={`absolute left-0 top-2 w-4 h-4 rounded-full border-2 border-white ${
                      getCategoryColor(event.category).includes('bg-') 
                        ? getCategoryColor(event.category).replace('bg-', 'bg-').replace('text-', '')
                        : 'bg-gray-400'
                    }`}></div>
                    
                    <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
                      <div className="flex flex-wrap justify-between items-start mb-2">
                        <h3 className="text-lg font-semibold">{event.title}</h3>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getCategoryColor(event.category)}`}>
                          {event.category.charAt(0).toUpperCase() + event.category.slice(1)}
                        </span>
                      </div>
                      
                      <p className="text-sm text-gray-500 mb-3">
                        {formatDate(event.date)} • {event.provider} • {event.facility}
                      </p>
                      
                      <p className="text-gray-700 mb-4">{event.description}</p>
                      
                      {event.results && (
                        <div className="bg-gray-50 p-3 rounded-md mb-4">
                          <h4 className="text-sm font-medium text-gray-700 mb-1">Results:</h4>
                          <p className="text-sm text-gray-600">{event.results}</p>
                        </div>
                      )}
                      
                      <div className="flex flex-wrap items-center justify-between mt-2">
                        {event.relatedCondition && (
                          <Link 
                            href={`/conditions/${event.relatedCondition.id}`}
                            className="text-sm text-indigo-600 hover:text-indigo-800 inline-flex items-center"
                          >
                            <span className="mr-1">Related to:</span>
                            <span className="font-medium">{event.relatedCondition.name}</span>
                          </Link>
                        )}
                        
                        {event.category === 'treatment' && (
                          <Link 
                            href={`/treatments?related=${event.id}`}
                            className="text-sm text-teal-600 hover:text-teal-800"
                          >
                            View treatment details &rarr;
                          </Link>
                        )}
                        
                        {event.category === 'test' && (
                          <Link 
                            href={`/lab-results?test=${event.id}`}
                            className="text-sm text-green-600 hover:text-green-800"
                          >
                            View full lab results &rarr;
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))
        ) : (
          <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
            <p className="text-gray-500">No events match your current filters.</p>
            <button
              onClick={() => {
                setSelectedCategory(null);
                setSelectedCondition(null);
              }}
              className="mt-4 text-indigo-600 hover:text-indigo-800 font-medium"
            >
              Clear all filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default function TimelinePage() {
  return (
    <Suspense fallback={<div>Loading timeline...</div>}>
      <TimelineContent />
    </Suspense>
  );
} 