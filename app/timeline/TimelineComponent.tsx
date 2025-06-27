'use client';

import { useState } from 'react';

// Mock timeline events data
const MOCK_TIMELINE_EVENTS = [
  {
    id: 1,
    title: 'Diagnosed with EDS (Ehlers-Danlos Syndrome)',
    date: '2020-06-15',
    type: 'diagnosis',
    description: 'Diagnosed with hypermobile EDS after years of unexplained symptoms. Genetic testing confirmed hEDS subtype.',
    provider: 'Dr. Emily Williams',
    location: 'Genetic Disorders Clinic',
  },
  {
    id: 2,
    title: 'Physical Therapy Started',
    date: '2020-07-10',
    type: 'treatment',
    description: 'Started targeted physical therapy for joint stabilization and pain management. Focus on proprioception and avoiding hyperextension.',
    provider: 'Sarah Thompson, DPT',
    location: 'Rehabilitation Center',
  },
  {
    id: 3,
    title: 'Recurrent Shoulder Dislocation',
    date: '2020-09-05',
    type: 'symptom',
    description: 'Right shoulder dislocated while reaching overhead. Third occurrence this year. Required manual reduction.',
    provider: 'Dr. Robert Chen',
    location: 'Emergency Department',
  },
  {
    id: 4,
    title: 'Prescribed Custom Wrist Braces',
    date: '2020-11-20',
    type: 'treatment',
    description: 'Fitted for custom wrist braces to prevent hyperextension during typing and daily activities.',
    provider: 'Dr. Emily Williams',
    location: 'Orthopedic Supply Center',
  },
  {
    id: 5,
    title: 'POTS Diagnosis',
    date: '2021-02-18',
    type: 'diagnosis',
    description: 'Diagnosed with Postural Orthostatic Tachycardia Syndrome following tilt-table test. Revealed connection to EDS.',
    provider: 'Dr. James Martinez',
    location: 'Cardiology Department',
  },
  {
    id: 6,
    title: 'Started Compression Stockings',
    date: '2021-03-05',
    type: 'treatment',
    description: 'Started using medical-grade compression stockings to manage POTS symptoms, particularly when standing for long periods.',
    provider: 'Dr. James Martinez',
    location: 'Cardiology Department',
  },
  {
    id: 7,
    title: 'Increased Salt/Fluid Intake Protocol',
    date: '2021-03-10',
    type: 'treatment',
    description: 'Began structured protocol for increased sodium and fluid intake to manage blood volume and POTS symptoms.',
    provider: 'Dr. James Martinez',
    location: 'Cardiology Department',
  },
  {
    id: 8,
    title: 'MRI - Cervical Spine',
    date: '2021-05-25',
    type: 'procedure',
    description: 'MRI showed mild CCI (Craniocervical Instability) with intermittent brainstem compression. No surgical intervention recommended at this time.',
    provider: 'Dr. Michelle Park',
    location: 'Imaging Center',
  },
  {
    id: 9,
    title: 'Improved POTS Symptoms',
    date: '2021-08-12',
    type: 'victory',
    description: 'Significant improvement in POTS symptoms after 6 months of treatment protocol. Reduced episodes of tachycardia and near-syncope.',
    provider: 'Dr. James Martinez',
    location: 'Cardiology Department',
  },
  {
    id: 10,
    title: 'Jaw Subluxation Incident',
    date: '2021-10-30',
    type: 'setback',
    description: 'Experienced jaw subluxation while yawning. Resulted in TMJ pain and difficulty chewing for several weeks.',
    provider: 'Dr. Lisa Wong',
    location: 'Oral & Maxillofacial Clinic',
  },
  {
    id: 11,
    title: 'Started MCAS Treatment Protocol',
    date: '2022-01-15',
    type: 'treatment',
    description: 'Began treatment for suspected Mast Cell Activation Syndrome with H1/H2 blockers and mast cell stabilizers.',
    provider: 'Dr. Sarah Johnson',
    location: 'Allergy & Immunology Clinic',
  },
  {
    id: 12,
    title: 'Sleep Study',
    date: '2022-03-20',
    type: 'procedure',
    description: 'Sleep study revealed mild sleep apnea and periodic limb movement disorder, possibly related to EDS/dysautonomia.',
    provider: 'Dr. Michael Roberts',
    location: 'Sleep Disorders Center',
  },
  {
    id: 13,
    title: 'CPAP Therapy Started',
    date: '2022-04-10',
    type: 'treatment',
    description: 'Began CPAP therapy for sleep apnea. Initial adjustment period with custom mask fitting to accommodate facial hypermobility.',
    provider: 'Dr. Michael Roberts',
    location: 'Sleep Disorders Center',
  },
  {
    id: 14,
    title: 'Significantly Improved Sleep Quality',
    date: '2022-06-05',
    type: 'victory',
    description: 'Marked improvement in sleep quality, daytime fatigue, and cognitive function after 8 weeks of consistent CPAP use.',
    provider: 'Dr. Michael Roberts',
    location: 'Sleep Disorders Center',
  },
  {
    id: 15,
    title: 'Full Genetic Panel',
    date: '2022-09-12',
    type: 'procedure',
    description: 'Comprehensive genetic testing to investigate comorbid conditions and rule out other connective tissue disorders.',
    provider: 'Dr. Emily Williams',
    location: 'Genetic Disorders Clinic',
  },
  {
    id: 16,
    title: 'New Medication Reaction',
    date: '2022-11-05',
    type: 'setback',
    description: 'Adverse reaction to new migraine medication, triggering severe MCAS flare with hives and facial angioedema.',
    provider: 'Dr. Sarah Johnson',
    location: 'Emergency Department',
  },
  {
    id: 17,
    title: 'Updated MCAS Protocol',
    date: '2022-11-18',
    type: 'treatment',
    description: 'Revised MCAS treatment protocol following medication reaction. Added Ketotifen and adjusted antihistamine dosages.',
    provider: 'Dr. Sarah Johnson',
    location: 'Allergy & Immunology Clinic',
  },
  {
    id: 18,
    title: 'GI Workup',
    date: '2023-02-10',
    type: 'procedure',
    description: 'Comprehensive GI evaluation for chronic digestive issues. Identified delayed gastric emptying and possible EDS-related GI hypermobility.',
    provider: 'Dr. Jessica Patel',
    location: 'Gastroenterology Department',
  },
  {
    id: 19,
    title: 'Modified Diet Plan',
    date: '2023-02-28',
    type: 'treatment',
    description: 'Implemented low-FODMAP diet in conjunction with motility-supporting supplements to address GI symptoms.',
    provider: 'Nina Rodriguez, RD',
    location: 'Nutrition Services',
  },
  {
    id: 20,
    title: 'Autonomic Function Testing',
    date: '2023-05-15',
    type: 'procedure',
    description: 'Comprehensive autonomic testing to evaluate progression of dysautonomia and treatment efficacy.',
    provider: 'Dr. James Martinez',
    location: 'Autonomic Disorders Laboratory',
  },
];

export default function TimelineComponent() {
  const [filter, setFilter] = useState('all');

  // Filter events based on selected filter
  const filteredEvents = filter === 'all' 
    ? MOCK_TIMELINE_EVENTS 
    : MOCK_TIMELINE_EVENTS.filter(event => event.type === filter);

  // Get event type styles and icon
  const getEventTypeStyles = (type: string) => {
    switch(type) {
      case 'diagnosis':
        return {
          color: 'bg-yellow-100 text-yellow-800',
          icon: (
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          ),
          border: 'border-yellow-500',
        };
      case 'treatment':
        return {
          color: 'bg-blue-100 text-blue-800',
          icon: (
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
            </svg>
          ),
          border: 'border-blue-500',
        };
      case 'symptom':
        return {
          color: 'bg-orange-100 text-orange-800',
          icon: (
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          ),
          border: 'border-orange-500',
        };
      case 'procedure':
        return {
          color: 'bg-purple-100 text-purple-800',
          icon: (
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          ),
          border: 'border-purple-500',
        };
      case 'victory':
        return {
          color: 'bg-green-100 text-green-800',
          icon: (
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          ),
          border: 'border-green-500',
        };
      case 'setback':
        return {
          color: 'bg-red-100 text-red-800',
          icon: (
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          ),
          border: 'border-red-500',
        };
      default:
        return {
          color: 'bg-gray-100 text-gray-800',
          icon: (
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          ),
          border: 'border-gray-500',
        };
    }
  };

  const filters = [
    { value: 'all', label: 'All Events' },
    { value: 'diagnosis', label: 'Diagnoses' },
    { value: 'treatment', label: 'Treatments' },
    { value: 'symptom', label: 'Symptoms' },
    { value: 'procedure', label: 'Procedures' },
    { value: 'victory', label: 'Victories' },
    { value: 'setback', label: 'Setbacks' },
  ];

  return (
    <div>
      {/* Filter controls */}
      <div className="mb-6 flex flex-wrap gap-2">
        {filters.map((filterOption) => (
          <button
            key={filterOption.value}
            onClick={() => setFilter(filterOption.value)}
            className={`px-4 py-2 rounded-full text-sm font-medium ${
              filter === filterOption.value
                ? 'bg-indigo-600 text-white'
                : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
            }`}
          >
            {filterOption.label}
          </button>
        ))}
      </div>

      {/* Timeline */}
      <div className="flow-root">
        <ul role="list" className="-mb-8">
          {filteredEvents.map((event, eventIdx) => {
            const { color, icon, border } = getEventTypeStyles(event.type);
            const formattedDate = new Date(event.date).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            });

            return (
              <li key={event.id}>
                <div className="relative pb-8">
                  {eventIdx !== filteredEvents.length - 1 ? (
                    <span
                      className="absolute top-5 left-5 -ml-px h-full w-0.5 bg-gray-200"
                      aria-hidden="true"
                    />
                  ) : null}
                  <div className="relative flex items-start space-x-3">
                    <div>
                      <div className={`relative px-1 ${color} h-10 w-10 rounded-full flex items-center justify-center ring-8 ring-white ${border}`}>
                        {icon}
                      </div>
                    </div>
                    <div className="flex-1 min-w-0 card mb-8">
                      <div>
                        <div className="text-sm">
                          <span className="font-medium text-gray-900">{event.title}</span>
                        </div>
                        <p className="mt-0.5 text-sm text-gray-500">
                          {formattedDate} • <span className="font-medium">{event.provider}</span> • {event.location}
                        </p>
                      </div>
                      <div className="mt-2 text-sm text-gray-700">
                        <p>{event.description}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
} 