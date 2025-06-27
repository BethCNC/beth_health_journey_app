'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

// Mock symptom data
const SYMPTOMS = [
  {
    id: 1,
    name: 'Joint Hypermobility',
    description: 'Excessive range of motion in joints beyond normal limits.',
    firstObserved: '2010-03-15',
    status: 'active',
    severity: 8,
    frequency: 'constant',
    triggers: ['Physical activity', 'Cold weather'],
    alleviatingFactors: ['Rest', 'Heat therapy', 'Bracing'],
    affectedAreas: ['Shoulders', 'Knees', 'Fingers', 'Hips'],
    relatedConditions: [
      { id: 1, name: 'Ehlers-Danlos Syndrome (hEDS)' }
    ]
  },
  {
    id: 2,
    name: 'Skin Elasticity',
    description: 'Skin that stretches more than normal and may appear loose or doughy.',
    firstObserved: '2010-05-20',
    status: 'active',
    severity: 6,
    frequency: 'constant',
    triggers: [],
    alleviatingFactors: ['Moisturizing'],
    affectedAreas: ['Face', 'Hands', 'Arms'],
    relatedConditions: [
      { id: 1, name: 'Ehlers-Danlos Syndrome (hEDS)' }
    ]
  },
  {
    id: 3,
    name: 'Chronic Joint Pain',
    description: 'Persistent pain in multiple joints lasting for extended periods.',
    firstObserved: '2015-08-10',
    status: 'active',
    severity: 8,
    frequency: 'daily',
    triggers: ['Weather changes', 'Physical activity', 'Stress'],
    alleviatingFactors: ['Rest', 'Anti-inflammatory medication', 'Physical therapy'],
    affectedAreas: ['Shoulders', 'Back', 'Knees', 'Wrists'],
    relatedConditions: [
      { id: 1, name: 'Ehlers-Danlos Syndrome (hEDS)' }
    ]
  },
  {
    id: 4, 
    name: 'Easy Bruising',
    description: 'Tendency to bruise easily with minimal trauma or pressure.',
    firstObserved: '2012-02-25',
    status: 'active',
    severity: 6, 
    frequency: 'frequent',
    triggers: ['Minor impact', 'Pressure'],
    alleviatingFactors: [],
    affectedAreas: ['Arms', 'Legs'],
    relatedConditions: [
      { id: 1, name: 'Ehlers-Danlos Syndrome (hEDS)' }
    ]
  },
  {
    id: 5,
    name: 'Throbbing Headache',
    description: 'Pulsating or throbbing pain, often on one side of the head.',
    firstObserved: '2018-04-10',
    status: 'active', 
    severity: 9,
    frequency: 'weekly',
    triggers: ['Bright lights', 'Loud noises', 'Stress', 'Weather changes', 'Certain foods'],
    alleviatingFactors: ['Darkness', 'Silence', 'Pain medication', 'Cold compress'],
    affectedAreas: ['Head', 'Eyes'],
    relatedConditions: [
      { id: 2, name: 'Chronic Migraine' }
    ]
  },
  {
    id: 6,
    name: 'Visual Aura',
    description: 'Visual disturbances preceding a migraine, including flashing lights, zigzag lines, or blind spots.',
    firstObserved: '2018-04-10',
    status: 'active',
    severity: 7,
    frequency: 'weekly',
    triggers: ['Bright lights', 'Screen time', 'Stress'],
    alleviatingFactors: ['Darkness', 'Closing eyes'],
    affectedAreas: ['Vision'],
    relatedConditions: [
      { id: 2, name: 'Chronic Migraine' }
    ]
  },
  {
    id: 7,
    name: 'Nausea',
    description: 'Feeling of sickness with an inclination to vomit.',
    firstObserved: '2018-05-15',
    status: 'active',
    severity: 6,
    frequency: 'weekly',
    triggers: ['Migraines', 'Food triggers', 'Motion'],
    alleviatingFactors: ['Anti-nausea medication', 'Ginger', 'Rest'],
    affectedAreas: ['Stomach'],
    relatedConditions: [
      { id: 2, name: 'Chronic Migraine' },
      { id: 4, name: 'IBS' }
    ]
  },
  {
    id: 8,
    name: 'Light Sensitivity',
    description: 'Discomfort or pain in the eyes due to exposure to light.',
    firstObserved: '2018-04-10',
    status: 'active',
    severity: 8,
    frequency: 'weekly',
    triggers: ['Bright lights', 'Sunlight', 'Screens'],
    alleviatingFactors: ['Darkness', 'Sunglasses', 'Tinted lenses'],
    affectedAreas: ['Eyes'],
    relatedConditions: [
      { id: 2, name: 'Chronic Migraine' }
    ]
  },
  {
    id: 9,
    name: 'Tachycardia',
    description: 'Abnormally rapid heart rate, especially upon standing.',
    firstObserved: '2022-01-10',
    status: 'active',
    severity: 7,
    frequency: 'daily',
    triggers: ['Standing', 'Heat', 'Exercise', 'Dehydration'],
    alleviatingFactors: ['Sitting', 'Lying down', 'Hydration', 'Salt intake'],
    affectedAreas: ['Heart'],
    relatedConditions: [
      { id: 3, name: 'POTS' }
    ]
  },
  {
    id: 10,
    name: 'Lightheadedness',
    description: 'Feeling faint, dizzy, or as if about to lose consciousness.',
    firstObserved: '2022-01-15',
    status: 'active',
    severity: 8,
    frequency: 'daily',
    triggers: ['Standing', 'Hot environments', 'Prolonged standing'],
    alleviatingFactors: ['Sitting', 'Lying down', 'Cooling off', 'Hydration'],
    affectedAreas: ['Head'],
    relatedConditions: [
      { id: 3, name: 'POTS' }
    ]
  },
  {
    id: 11,
    name: 'Fatigue',
    description: 'Extreme tiredness or exhaustion that doesn\'t improve with rest.',
    firstObserved: '2015-05-10',
    status: 'active',
    severity: 8,
    frequency: 'daily',
    triggers: ['Physical exertion', 'Mental exertion', 'Stress', 'Poor sleep'],
    alleviatingFactors: ['Rest', 'Pacing activities', 'Sleep hygiene'],
    affectedAreas: ['Whole body'],
    relatedConditions: [
      { id: 1, name: 'Ehlers-Danlos Syndrome (hEDS)' },
      { id: 3, name: 'POTS' }
    ]
  },
  {
    id: 12,
    name: 'Brain Fog',
    description: 'Cognitive difficulties including trouble concentrating, memory issues, and mental confusion.',
    firstObserved: '2022-01-20',
    status: 'active',
    severity: 6,
    frequency: 'daily',
    triggers: ['Standing', 'Fatigue', 'Stress'],
    alleviatingFactors: ['Rest', 'Hydration', 'Mental exercises'],
    affectedAreas: ['Brain'],
    relatedConditions: [
      { id: 3, name: 'POTS' }
    ]
  },
  {
    id: 13,
    name: 'Abdominal Pain',
    description: 'Pain in the stomach or intestinal area, ranging from mild discomfort to severe cramping.',
    firstObserved: '2020-06-15',
    status: 'active',
    severity: 7,
    frequency: 'intermittent',
    triggers: ['Certain foods', 'Stress', 'Meal timing'],
    alleviatingFactors: ['Heat', 'Bowel movement', 'Anti-spasmodics'],
    affectedAreas: ['Abdomen'],
    relatedConditions: [
      { id: 4, name: 'IBS' }
    ]
  },
  {
    id: 14,
    name: 'Bloating',
    description: 'Swelling or distension of the abdomen caused by gas or fluid.',
    firstObserved: '2020-06-20',
    status: 'active',
    severity: 6,
    frequency: 'frequent',
    triggers: ['Meals', 'Certain foods', 'Stress'],
    alleviatingFactors: ['Digestive enzymes', 'Diet modification', 'Heat'],
    affectedAreas: ['Abdomen'],
    relatedConditions: [
      { id: 4, name: 'IBS' }
    ]
  },
  {
    id: 15,
    name: 'Diarrhea',
    description: 'Loose, watery stools occurring more frequently than normal.',
    firstObserved: '2020-07-05',
    status: 'active',
    severity: 7,
    frequency: 'intermittent',
    triggers: ['Certain foods', 'Stress', 'Caffeine'],
    alleviatingFactors: ['Diet modification', 'Anti-diarrheal medication'],
    affectedAreas: ['Intestines'],
    relatedConditions: [
      { id: 4, name: 'IBS' }
    ]
  },
  {
    id: 16,
    name: 'Constipation',
    description: 'Infrequent bowel movements, difficulty passing stool, or incomplete evacuation.',
    firstObserved: '2020-08-10',
    status: 'active',
    severity: 5,
    frequency: 'intermittent',
    triggers: ['Diet changes', 'Dehydration', 'Stress'],
    alleviatingFactors: ['Increased fiber', 'Hydration', 'Exercise'],
    affectedAreas: ['Intestines'],
    relatedConditions: [
      { id: 4, name: 'IBS' }
    ]
  },
  {
    id: 17,
    name: 'Cold Fingers and Toes',
    description: 'Extremities becoming abnormally cold when exposed to temperature changes or stress.',
    firstObserved: '2021-01-10',
    status: 'active',
    severity: 6,
    frequency: 'frequent',
    triggers: ['Cold temperatures', 'Stress', 'Anxiety'],
    alleviatingFactors: ['Warmth', 'Gloves/socks', 'Movement'],
    affectedAreas: ['Fingers', 'Toes'],
    relatedConditions: [
      { id: 5, name: 'Raynaud\'s Phenomenon' }
    ]
  },
  {
    id: 18,
    name: 'Color Changes in Skin',
    description: 'Triphasic color changes (white, blue, red) in fingers or toes in response to cold or stress.',
    firstObserved: '2021-01-15',
    status: 'active',
    severity: 7,
    frequency: 'frequent',
    triggers: ['Cold exposure', 'Stress', 'Holding cold objects'],
    alleviatingFactors: ['Warming affected areas', 'Stress reduction'],
    affectedAreas: ['Fingers', 'Toes'],
    relatedConditions: [
      { id: 5, name: 'Raynaud\'s Phenomenon' }
    ]
  },
  {
    id: 19,
    name: 'Numbness',
    description: 'Loss of sensation in extremities, particularly fingers and toes.',
    firstObserved: '2021-01-15',
    status: 'active',
    severity: 5,
    frequency: 'frequent',
    triggers: ['Cold exposure', 'Raynaud\'s attacks'],
    alleviatingFactors: ['Warming affected areas', 'Movement'],
    affectedAreas: ['Fingers', 'Toes'],
    relatedConditions: [
      { id: 5, name: 'Raynaud\'s Phenomenon' }
    ]
  }
];

// Status options for filtering
const STATUSES = [
  { value: 'active', label: 'Active' },
  { value: 'resolved', label: 'Resolved' },
  { value: 'intermittent', label: 'Intermittent' }
];

// Severity ranges for filtering
const SEVERITY_RANGES = [
  { value: 'mild', label: 'Mild (1-3)', min: 1, max: 3 },
  { value: 'moderate', label: 'Moderate (4-6)', min: 4, max: 6 },
  { value: 'severe', label: 'Severe (7-10)', min: 7, max: 10 }
];

// Areas affected (for filtering)
const AREAS = [
  'Head', 'Brain', 'Eyes', 'Vision', 'Heart', 'Stomach', 'Abdomen', 'Intestines', 
  'Shoulders', 'Back', 'Arms', 'Hands', 'Fingers', 'Hips', 'Legs', 'Knees', 'Feet', 'Toes',
  'Whole body'
];

// Format date
const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

// Get severity indicator color
const getSeverityColor = (severity: number) => {
  if (severity >= 8) return 'bg-red-500';
  if (severity >= 5) return 'bg-amber-500';
  return 'bg-green-500';
};

export default function SymptomsPage() {
  const searchParams = useSearchParams();
  const conditionId = searchParams.get('condition') ? Number(searchParams.get('condition')) : null;
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string[]>([]);
  const [selectedSeverity, setSelectedSeverity] = useState<string[]>([]);
  const [selectedAreas, setSelectedAreas] = useState<string[]>([]);
  const [expandedSymptomId, setExpandedSymptomId] = useState<number | null>(null);
  const [filteredSymptoms, setFilteredSymptoms] = useState(SYMPTOMS);
  
  // Filter symptoms based on selected filters and search query
  useEffect(() => {
    let result = [...SYMPTOMS];
    
    // Filter by condition if specified
    if (conditionId) {
      result = result.filter(symptom => 
        symptom.relatedConditions.some(condition => condition.id === conditionId)
      );
    }
    
    // Apply search query filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(symptom => 
        symptom.name.toLowerCase().includes(query) || 
        symptom.description.toLowerCase().includes(query)
      );
    }
    
    // Apply status filter
    if (selectedStatus.length > 0) {
      result = result.filter(symptom => 
        selectedStatus.includes(symptom.status)
      );
    }
    
    // Apply severity filter
    if (selectedSeverity.length > 0) {
      result = result.filter(symptom => {
        return selectedSeverity.some(range => {
          const severityRange = SEVERITY_RANGES.find(sr => sr.value === range);
          if (severityRange) {
            return symptom.severity >= severityRange.min && symptom.severity <= severityRange.max;
          }
          return false;
        });
      });
    }
    
    // Apply area filter
    if (selectedAreas.length > 0) {
      result = result.filter(symptom => 
        symptom.affectedAreas.some(area => selectedAreas.includes(area))
      );
    }
    
    setFilteredSymptoms(result);
  }, [searchQuery, selectedStatus, selectedSeverity, selectedAreas, conditionId]);
  
  // Toggle selected filter values
  const toggleFilter = (type: string, value: string) => {
    switch (type) {
      case 'status':
        setSelectedStatus(prev => 
          prev.includes(value) 
            ? prev.filter(item => item !== value) 
            : [...prev, value]
        );
        break;
      case 'severity':
        setSelectedSeverity(prev => 
          prev.includes(value) 
            ? prev.filter(item => item !== value) 
            : [...prev, value]
        );
        break;
      case 'area':
        setSelectedAreas(prev => 
          prev.includes(value) 
            ? prev.filter(item => item !== value) 
            : [...prev, value]
        );
        break;
    }
  };
  
  // Clear all filters
  const clearFilters = () => {
    setSearchQuery('');
    setSelectedStatus([]);
    setSelectedSeverity([]);
    setSelectedAreas([]);
  };
  
  // Toggle symptom details expansion
  const toggleSymptomDetails = (id: number) => {
    setExpandedSymptomId(expandedSymptomId === id ? null : id);
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Symptoms</h1>
      
      {/* Search and filters */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4 mb-8">
        <div className="mb-4">
          <input
            type="text"
            placeholder="Search symptoms..."
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          {/* Status filter */}
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-2">Status</h3>
            <div className="flex flex-wrap gap-2">
              {STATUSES.map(status => (
                <button
                  key={status.value}
                  onClick={() => toggleFilter('status', status.value)}
                  className={`px-3 py-1 text-xs font-medium rounded-full ${
                    selectedStatus.includes(status.value)
                      ? 'bg-indigo-100 text-indigo-800'
                      : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                  }`}
                >
                  {status.label}
                </button>
              ))}
            </div>
          </div>
          
          {/* Severity filter */}
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-2">Severity</h3>
            <div className="flex flex-wrap gap-2">
              {SEVERITY_RANGES.map(range => (
                <button
                  key={range.value}
                  onClick={() => toggleFilter('severity', range.value)}
                  className={`px-3 py-1 text-xs font-medium rounded-full ${
                    selectedSeverity.includes(range.value)
                      ? 'bg-indigo-100 text-indigo-800'
                      : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                  }`}
                >
                  {range.label}
                </button>
              ))}
            </div>
          </div>
          
          {/* Areas filter - dropdown because there are many */}
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-2">Areas Affected</h3>
            <select
              className="w-full p-2 border border-gray-300 rounded-md"
              onChange={(e) => toggleFilter('area', e.target.value)}
              value=""
            >
              <option value="" disabled>Select area</option>
              {AREAS.map(area => (
                <option key={area} value={area}>{area}</option>
              ))}
            </select>
            {/* Display selected areas with remove option */}
            {selectedAreas.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {selectedAreas.map(area => (
                  <span 
                    key={area} 
                    className="bg-indigo-100 text-indigo-800 text-xs font-medium rounded-full px-3 py-1 flex items-center"
                  >
                    {area}
                    <button 
                      onClick={() => toggleFilter('area', area)}
                      className="ml-1 text-indigo-600 hover:text-indigo-800"
                    >
                      &times;
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
        
        {/* Active filters and clear button */}
        <div className="flex justify-between items-center">
          <div className="text-sm text-gray-600">
            {filteredSymptoms.length} symptoms found
            {conditionId && (
              <span> for selected condition</span>
            )}
          </div>
          {(searchQuery || selectedStatus.length > 0 || selectedSeverity.length > 0 || selectedAreas.length > 0) && (
            <button
              onClick={clearFilters}
              className="text-sm text-indigo-600 hover:text-indigo-800"
            >
              Clear all filters
            </button>
          )}
        </div>
      </div>
      
      {/* Symptoms list */}
      {filteredSymptoms.length > 0 ? (
        <div className="space-y-4">
          {filteredSymptoms.map((symptom) => (
            <div 
              key={symptom.id} 
              className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden"
            >
              {/* Symptom header - always visible */}
              <div 
                className="p-4 cursor-pointer hover:bg-gray-50"
                onClick={() => toggleSymptomDetails(symptom.id)}
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                  <div className="flex items-start gap-3">
                    <div className={`w-3 h-3 rounded-full mt-1.5 ${getSeverityColor(symptom.severity)}`}></div>
                    <div>
                      <h2 className="text-lg font-medium text-gray-900">{symptom.name}</h2>
                      <p className="text-gray-600">{symptom.description}</p>
                    </div>
                  </div>
                  <div className="flex flex-col items-start md:items-end">
                    <span className="text-sm text-gray-500">
                      First observed: {formatDate(symptom.firstObserved)}
                    </span>
                    <span className="text-sm text-gray-500 capitalize">
                      Status: {symptom.status}
                    </span>
                  </div>
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  {symptom.relatedConditions.map(condition => (
                    <Link 
                      href={`/conditions/${condition.id}`}
                      key={condition.id}
                      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {condition.name}
                    </Link>
                  ))}
                </div>
              </div>
              
              {/* Expanded details */}
              {expandedSymptomId === symptom.id && (
                <div className="p-4 bg-gray-50 border-t border-gray-200">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="text-sm font-medium text-gray-900 mb-2">Details</h3>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Severity:</span>
                          <span className="font-medium">{symptom.severity}/10</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Frequency:</span>
                          <span className="font-medium capitalize">{symptom.frequency}</span>
                        </div>
                        <div>
                          <span className="text-gray-600">Areas Affected:</span>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {symptom.affectedAreas.map(area => (
                              <span 
                                key={area} 
                                className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
                              >
                                {area}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <div className="mb-4">
                        <h3 className="text-sm font-medium text-gray-900 mb-2">Triggers</h3>
                        {symptom.triggers.length > 0 ? (
                          <ul className="list-disc pl-5 space-y-1">
                            {symptom.triggers.map((trigger, index) => (
                              <li key={index} className="text-sm">{trigger}</li>
                            ))}
                          </ul>
                        ) : (
                          <p className="text-sm text-gray-500">No specific triggers identified</p>
                        )}
                      </div>
                      
                      <div>
                        <h3 className="text-sm font-medium text-gray-900 mb-2">Alleviating Factors</h3>
                        {symptom.alleviatingFactors.length > 0 ? (
                          <ul className="list-disc pl-5 space-y-1">
                            {symptom.alleviatingFactors.map((factor, index) => (
                              <li key={index} className="text-sm">{factor}</li>
                            ))}
                          </ul>
                        ) : (
                          <p className="text-sm text-gray-500">No alleviating factors identified</p>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-6 flex justify-center">
                    <Link
                      href={`/symptoms/${symptom.id}`}
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200"
                    >
                      View Full Details
                    </Link>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
          <p className="text-gray-500">No symptoms match your filters.</p>
          <button
            onClick={clearFilters}
            className="mt-4 inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
          >
            Clear Filters
          </button>
        </div>
      )}
      
      {/* Add symptom button */}
      <div className="mt-8 flex justify-center">
        <Link
          href="/symptoms/new"
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
        >
          Add New Symptom
        </Link>
      </div>
    </div>
  );
} 