'use client';

import { useState } from 'react';
import Link from 'next/link';
import { format, parseISO } from 'date-fns';

// Mock data for conditions
const CONDITIONS = [
  { 
    id: 1, 
    name: 'Ehlers-Danlos Syndrome (hEDS)', 
    description: 'A connective tissue disorder that affects the skin, joints, and blood vessel walls.',
    diagnosisDate: '2020-03-15T10:00:00Z', 
    status: 'active',
    severity: 8,
    category: 'Genetic',
    symptoms: [1, 2, 4, 5],
    treatments: [3, 4],
    provider: 'Dr. Maria Alvarez',
    notes: 'Patient exhibits classic signs of hypermobility spectrum disorder with joint hypermobility, skin hyperextensibility, and tissue fragility. Beighton score of 8/9. Patient reports chronic joint pain, frequent subluxations, and easy bruising.',
  },
  { 
    id: 2, 
    name: 'Chronic Migraine', 
    description: 'Headache disorder characterized by recurring attacks of moderate to severe pain, typically on one side of the head.',
    diagnosisDate: '2019-05-10T09:00:00Z', 
    status: 'active',
    severity: 7,
    category: 'Neurological',
    symptoms: [3, 5],
    treatments: [2, 5],
    provider: 'Dr. James Chen',
    notes: 'Patient experiences migraines with aura 15+ days per month. Triggers include stress, weather changes, and certain foods. Current preventive measures include medication, stress management, and lifestyle modifications.',
  },
  { 
    id: 3, 
    name: 'POTS (Postural Orthostatic Tachycardia Syndrome)', 
    description: 'A condition affecting blood flow that causes heart rate to increase upon standing.',
    diagnosisDate: '2021-11-10T14:30:00Z', 
    status: 'active',
    severity: 6,
    category: 'Autonomic',
    symptoms: [4, 5],
    treatments: [1, 3, 4],
    provider: 'Dr. Sarah Johnson',
    notes: 'Diagnosed by tilt-table test with heart rate increase >30bpm upon standing. Patient reports lightheadedness, fatigue, and exercise intolerance. Management includes increased fluid/salt intake, compression garments, and beta-blockers.',
  },
  { 
    id: 4, 
    name: 'IBS (Irritable Bowel Syndrome)', 
    description: 'A common intestinal disorder that affects the large intestine causing abdominal pain, bloating, and altered bowel habits.',
    diagnosisDate: '2023-03-10T13:00:00Z', 
    status: 'active',
    severity: 5,
    category: 'Gastrointestinal',
    symptoms: [6],
    treatments: [],
    provider: 'Dr. Michael Smith',
    notes: 'Patient has IBS-Mixed type with alternating constipation and diarrhea. Symptoms exacerbated by stress and certain foods. Currently managing with diet modifications and stress reduction techniques.',
  },
  { 
    id: 5, 
    name: 'Raynaud\'s Phenomenon', 
    description: 'A condition causing decreased blood flow to the fingers and toes when exposed to cold or stress.',
    diagnosisDate: '2021-01-20T11:00:00Z', 
    status: 'active',
    severity: 4,
    category: 'Vascular',
    symptoms: [7],
    treatments: [],
    provider: 'Dr. Maria Alvarez',
    notes: 'Secondary to EDS. Patient experiences color changes (white, blue, then red) in fingers and toes when exposed to cold. Advised to keep extremities warm and avoid sudden temperature changes.',
  },
  { 
    id: 6, 
    name: 'Asthma', 
    description: 'A condition in which airways narrow and swell and may produce extra mucus, causing breathing difficulty.',
    diagnosisDate: '2015-08-05T15:45:00Z', 
    status: 'in_remission',
    severity: 3,
    category: 'Respiratory',
    symptoms: [],
    treatments: [],
    provider: 'Dr. Robert Williams',
    notes: 'Childhood asthma, primarily exercise-induced. Significantly improved in adulthood. Patient keeps rescue inhaler for rare occasions when symptoms flare.',
  },
];

// Mock data for related information
const SYMPTOMS = [
  { id: 1, name: 'Joint Hypermobility', severity: 8 },
  { id: 2, name: 'Chronic Fatigue', severity: 7 },
  { id: 3, name: 'Migraines', severity: 7 },
  { id: 4, name: 'Tachycardia', severity: 6 },
  { id: 5, name: 'Brain Fog', severity: 6 },
  { id: 6, name: 'Abdominal Pain/Bloating', severity: 5 },
  { id: 7, name: 'Raynaud\'s Episodes', severity: 4 },
];

const TREATMENTS = [
  { id: 1, name: 'Propranolol', type: 'medication', dosage: '10mg twice daily' },
  { id: 2, name: 'Sumatriptan', type: 'medication', dosage: '50mg as needed' },
  { id: 3, name: 'Salt Tablets', type: 'medication', dosage: '1g three times daily' },
  { id: 4, name: 'Compression Garments', type: 'therapy', dosage: 'Worn during daytime' },
  { id: 5, name: 'Nortriptyline', type: 'medication', dosage: '25mg at bedtime' },
];

// Helper functions
const formatDate = (dateString: string) => {
  const date = parseISO(dateString);
  return format(date, 'PPP'); // e.g., "April 29, 2023"
};

// Get severity color
const getSeverityColor = (severity: number) => {
  if (severity >= 8) return 'bg-red-100 text-red-800';
  if (severity >= 6) return 'bg-orange-100 text-orange-800';
  if (severity >= 4) return 'bg-amber-100 text-amber-800';
  if (severity >= 2) return 'bg-yellow-100 text-yellow-800';
  return 'bg-green-100 text-green-800';
};

// Get status badge
const getStatusBadge = (status: string) => {
  switch (status) {
    case 'active': 
      return 'bg-green-100 text-green-800';
    case 'in_remission': 
      return 'bg-blue-100 text-blue-800';
    case 'resolved': 
      return 'bg-gray-100 text-gray-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

// Format status text
const formatStatus = (status: string) => {
  return status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
};

type ViewMode = 'cards' | 'list' | 'detailed';

export default function ConditionsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
  const [severityFilter, setSeverityFilter] = useState<number | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('cards');
  const [sortBy, setSortBy] = useState<'name' | 'date' | 'severity'>('name');
  
  // Get unique categories for filter
  const categories = Array.from(new Set(CONDITIONS.map(condition => condition.category)));
  
  // Get unique statuses for filter
  const statuses = Array.from(new Set(CONDITIONS.map(condition => condition.status)));
  
  // Filter conditions based on search and filters
  const filteredConditions = CONDITIONS.filter(condition => {
    // Search filter
    if (searchQuery && !condition.name.toLowerCase().includes(searchQuery.toLowerCase()) && 
        !condition.description.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    
    // Category filter
    if (selectedCategory && condition.category !== selectedCategory) {
      return false;
    }
    
    // Status filter
    if (selectedStatus && condition.status !== selectedStatus) {
      return false;
    }
    
    // Severity filter
    if (severityFilter !== null && condition.severity < severityFilter) {
      return false;
    }
    
    return true;
  });
  
  // Sort conditions
  const sortedConditions = [...filteredConditions].sort((a, b) => {
    if (sortBy === 'name') {
      return a.name.localeCompare(b.name);
    } else if (sortBy === 'date') {
      return new Date(b.diagnosisDate).getTime() - new Date(a.diagnosisDate).getTime();
    } else if (sortBy === 'severity') {
      return b.severity - a.severity;
    }
    return 0;
  });
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Medical Conditions</h1>
        
        <div className="flex items-center gap-2 mt-4 md:mt-0">
          <Link 
            href="/conditions/new"
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
          >
            Add Condition
          </Link>
        </div>
      </div>
      
      {/* Search and Filter Bar */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm mb-6 p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {/* Search */}
          <div>
            <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">Search</label>
            <input
              type="text"
              id="search"
              className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
              placeholder="Search conditions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          {/* Category Filter */}
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">Category</label>
            <select
              id="category"
              className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
              value={selectedCategory || ''}
              onChange={(e) => setSelectedCategory(e.target.value || null)}
            >
              <option value="">All Categories</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>
          
          {/* Status Filter */}
          <div>
            <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select
              id="status"
              className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
              value={selectedStatus || ''}
              onChange={(e) => setSelectedStatus(e.target.value || null)}
            >
              <option value="">All Statuses</option>
              {statuses.map(status => (
                <option key={status} value={status}>{formatStatus(status)}</option>
              ))}
            </select>
          </div>
          
          {/* Severity Filter */}
          <div>
            <label htmlFor="severity" className="block text-sm font-medium text-gray-700 mb-1">Min Severity</label>
            <select
              id="severity"
              className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
              value={severityFilter === null ? '' : severityFilter}
              onChange={(e) => setSeverityFilter(e.target.value ? parseInt(e.target.value, 10) : null)}
            >
              <option value="">Any Severity</option>
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(level => (
                <option key={level} value={level}>{level}</option>
              ))}
            </select>
          </div>
        </div>
        
        {/* Sort and View Controls */}
        <div className="flex flex-col sm:flex-row justify-between items-center mt-4 pt-4 border-t border-gray-200">
          <div className="flex items-center gap-2 mb-4 sm:mb-0">
            <label htmlFor="sort" className="text-sm font-medium text-gray-700">Sort by:</label>
            <select
              id="sort"
              className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm border-gray-300 rounded-md"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'name' | 'date' | 'severity')}
            >
              <option value="name">Name</option>
              <option value="date">Diagnosis Date</option>
              <option value="severity">Severity</option>
            </select>
          </div>
          
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium text-gray-700">View:</span>
            <div className="inline-flex rounded-md shadow-sm" role="group">
              <button
                type="button"
                onClick={() => setViewMode('cards')}
                className={`py-2 px-3 text-sm font-medium rounded-l-lg ${
                  viewMode === 'cards' 
                    ? 'bg-indigo-600 text-white' 
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                } border border-gray-300`}
              >
                Cards
              </button>
              <button
                type="button"
                onClick={() => setViewMode('list')}
                className={`py-2 px-3 text-sm font-medium ${
                  viewMode === 'list' 
                    ? 'bg-indigo-600 text-white' 
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                } border-t border-b border-gray-300`}
              >
                List
              </button>
              <button
                type="button"
                onClick={() => setViewMode('detailed')}
                className={`py-2 px-3 text-sm font-medium rounded-r-lg ${
                  viewMode === 'detailed' 
                    ? 'bg-indigo-600 text-white' 
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                } border border-gray-300`}
              >
                Detailed
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Results Count */}
      <div className="mb-6">
        <p className="text-sm text-gray-500">
          Showing {sortedConditions.length} of {CONDITIONS.length} conditions
        </p>
      </div>
      
      {/* Card View */}
      {viewMode === 'cards' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedConditions.map(condition => (
            <div 
              key={condition.id}
              className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden hover:shadow-md transition-shadow"
            >
              <div className="p-6">
                <div className="flex justify-between items-start mb-3">
                  <h2 className="text-lg font-medium text-gray-900 mb-1">
                    <Link href={`/conditions/${condition.id}`} className="hover:text-indigo-600">
                      {condition.name}
                    </Link>
                  </h2>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadge(condition.status)}`}>
                    {formatStatus(condition.status)}
                  </span>
                </div>
                
                <p className="text-sm text-gray-500 mb-4">{condition.description}</p>
                
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800`}>
                    {condition.category}
                  </span>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getSeverityColor(condition.severity)}`}>
                    Severity: {condition.severity}/10
                  </span>
                </div>
                
                <div className="text-sm text-gray-500 mb-4">
                  <div><span className="font-medium">Diagnosed:</span> {formatDate(condition.diagnosisDate)}</div>
                  <div><span className="font-medium">Provider:</span> {condition.provider}</div>
                </div>
                
                {condition.symptoms.length > 0 && (
                  <div className="mb-4">
                    <h3 className="text-sm font-medium text-gray-700 mb-1">Related Symptoms:</h3>
                    <div className="flex flex-wrap gap-1">
                      {condition.symptoms.map(symptomId => {
                        const symptom = SYMPTOMS.find(s => s.id === symptomId);
                        return symptom ? (
                          <span key={symptomId} className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-purple-50 text-purple-700">
                            {symptom.name}
                          </span>
                        ) : null;
                      })}
                    </div>
                  </div>
                )}
                
                <Link 
                  href={`/conditions/${condition.id}`}
                  className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-xs font-medium rounded text-indigo-700 bg-white hover:bg-gray-50"
                >
                  View Details
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
      
      {/* List View */}
      {viewMode === 'list' && (
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
          <ul className="divide-y divide-gray-200">
            {sortedConditions.map(condition => (
              <li key={condition.id} className="p-4 hover:bg-gray-50">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h2 className="text-lg font-medium text-gray-900">
                        <Link href={`/conditions/${condition.id}`} className="hover:text-indigo-600">
                          {condition.name}
                        </Link>
                      </h2>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadge(condition.status)}`}>
                        {formatStatus(condition.status)}
                      </span>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getSeverityColor(condition.severity)}`}>
                        {condition.severity}/10
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-3 text-sm text-gray-500">
                      <span>{condition.category}</span>
                      <span>•</span>
                      <span>Diagnosed: {formatDate(condition.diagnosisDate)}</span>
                      <span>•</span>
                      <span>{condition.provider}</span>
                    </div>
                  </div>
                  
                  <div className="mt-2 md:mt-0">
                    <Link
                      href={`/conditions/${condition.id}`}
                      className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-xs font-medium rounded text-indigo-700 bg-white hover:bg-gray-50"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
      
      {/* Detailed View */}
      {viewMode === 'detailed' && (
        <div className="space-y-6">
          {sortedConditions.map(condition => (
            <div 
              key={condition.id}
              className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden"
            >
              <div className="border-b border-gray-200 bg-gray-50 px-6 py-4">
                <div className="flex flex-wrap justify-between items-center">
                  <h2 className="text-xl font-medium text-gray-900">
                    <Link href={`/conditions/${condition.id}`} className="hover:text-indigo-600">
                      {condition.name}
                    </Link>
                  </h2>
                  <div className="flex items-center gap-2">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadge(condition.status)}`}>
                      {formatStatus(condition.status)}
                    </span>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getSeverityColor(condition.severity)}`}>
                      Severity: {condition.severity}/10
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="p-6">
                <div className="mb-6">
                  <h3 className="text-sm font-medium text-gray-700 mb-2">Description</h3>
                  <p className="text-gray-600">{condition.description}</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <h3 className="text-sm font-medium text-gray-700 mb-2">Condition Details</h3>
                    <dl className="grid grid-cols-1 gap-x-4 gap-y-2 sm:grid-cols-2">
                      <div className="sm:col-span-1">
                        <dt className="text-sm font-medium text-gray-500">Category</dt>
                        <dd className="mt-1 text-sm text-gray-900">{condition.category}</dd>
                      </div>
                      <div className="sm:col-span-1">
                        <dt className="text-sm font-medium text-gray-500">Diagnosis Date</dt>
                        <dd className="mt-1 text-sm text-gray-900">{formatDate(condition.diagnosisDate)}</dd>
                      </div>
                      <div className="sm:col-span-1">
                        <dt className="text-sm font-medium text-gray-500">Provider</dt>
                        <dd className="mt-1 text-sm text-gray-900">{condition.provider}</dd>
                      </div>
                      <div className="sm:col-span-1">
                        <dt className="text-sm font-medium text-gray-500">Status</dt>
                        <dd className="mt-1 text-sm text-gray-900">{formatStatus(condition.status)}</dd>
                      </div>
                    </dl>
                  </div>
                  
                  <div>
                    {condition.symptoms.length > 0 ? (
                      <div>
                        <h3 className="text-sm font-medium text-gray-700 mb-2">Related Symptoms</h3>
                        <ul className="space-y-2">
                          {condition.symptoms.map(symptomId => {
                            const symptom = SYMPTOMS.find(s => s.id === symptomId);
                            return symptom ? (
                              <li key={symptomId} className="flex justify-between items-center text-sm">
                                <span>{symptom.name}</span>
                                <span className={`${getSeverityColor(symptom.severity)} px-2 py-0.5 rounded-full text-xs font-medium`}>
                                  {symptom.severity}/10
                                </span>
                              </li>
                            ) : null;
                          })}
                        </ul>
                      </div>
                    ) : (
                      <div>
                        <h3 className="text-sm font-medium text-gray-700 mb-2">Related Symptoms</h3>
                        <p className="text-sm text-gray-500">No symptoms recorded for this condition</p>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="mb-6">
                  <h3 className="text-sm font-medium text-gray-700 mb-2">Treatments</h3>
                  {condition.treatments.length > 0 ? (
                    <ul className="space-y-2">
                      {condition.treatments.map(treatmentId => {
                        const treatment = TREATMENTS.find(t => t.id === treatmentId);
                        return treatment ? (
                          <li key={treatmentId} className="flex justify-between items-center text-sm">
                            <div>
                              <span className="font-medium">{treatment.name}</span>
                              <span className="text-gray-500"> ({treatment.type})</span>
                            </div>
                            <span className="text-gray-500">{treatment.dosage}</span>
                          </li>
                        ) : null;
                      })}
                    </ul>
                  ) : (
                    <p className="text-sm text-gray-500">No treatments recorded for this condition</p>
                  )}
                </div>
                
                <div className="mb-6">
                  <h3 className="text-sm font-medium text-gray-700 mb-2">Notes</h3>
                  <p className="text-sm text-gray-600">{condition.notes}</p>
                </div>
                
                <div className="border-t border-gray-200 pt-4 flex justify-end">
                  <div className="flex space-x-3">
                    <Link
                      href={`/medical-events?condition=${condition.id}`}
                      className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50"
                    >
                      View History
                    </Link>
                    <Link
                      href={`/conditions/${condition.id}`}
                      className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded text-white bg-indigo-600 hover:bg-indigo-700"
                    >
                      Full Details
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      
      {/* No Results */}
      {sortedConditions.length === 0 && (
        <div className="text-center py-12">
          <h3 className="text-lg font-medium text-gray-900 mb-2">No conditions found</h3>
          <p className="text-gray-500 mb-6">Try adjusting your search or filters</p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory(null);
              setSelectedStatus(null);
              setSeverityFilter(null);
            }}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
          >
            Clear Filters
          </button>
        </div>
      )}
    </div>
  );
} 