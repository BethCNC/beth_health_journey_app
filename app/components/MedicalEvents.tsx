'use client';

import { useState } from 'react';
import { format } from 'date-fns';
import Card from '../../components/ui/Card';
import { Badge } from './ui/Badge';

interface MedicalEvent {
  id: string;
  title: string;
  description?: string;
  event_type: string;
  date: string;
  location?: string;
  provider_name?: string;
  provider_specialty?: string;
  condition_name?: string;
  treatment_name?: string;
  notes?: string;
}

export default function MedicalEvents() {
  const [eventType, setEventType] = useState<string>('all');
  const [sortOrder, setSortOrder] = useState<'desc' | 'asc'>('desc');
  
  // Placeholder data - will be replaced with Firebase data later
  const events: MedicalEvent[] = [];

  const eventTypeColors: Record<string, string> = {
    appointment: 'bg-blue-100 text-blue-800',
    hospitalization: 'bg-red-100 text-red-800',
    procedure: 'bg-purple-100 text-purple-800',
    test: 'bg-green-100 text-green-800',
    other: 'bg-gray-100 text-gray-800',
  };

  return (
    <div className="space-y-6">
      <div className="flex gap-4">
        <select
          value={eventType}
          onChange={(e) => setEventType(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">All Events</option>
          <option value="appointment">Appointments</option>
          <option value="hospitalization">Hospitalizations</option>
          <option value="procedure">Procedures</option>
          <option value="test">Tests</option>
          <option value="other">Other</option>
        </select>

        <select
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value as 'asc' | 'desc')}
          className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="desc">Newest First</option>
          <option value="asc">Oldest First</option>
        </select>
      </div>

      <div className="space-y-4">
        {events.map((event) => (
          <Card key={event.id}>
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold">
                {event.title}
              </h3>
              <Badge 
                variant="default"
                className={eventTypeColors[event.event_type || 'other']}
              >
                {event.event_type}
              </Badge>
            </div>
            <p className="text-sm text-gray-600">
              {format(new Date(event.date), 'PPP')}
              {event.location && ` • ${event.location}`}
            </p>
            <div className="space-y-2">
              {event.description && (
                <p className="text-sm text-gray-600">{event.description}</p>
              )}
              {event.provider_name && (
                <p className="text-sm">
                  <span className="font-medium">Provider:</span>{' '}
                  {event.provider_name}
                  {event.provider_specialty && ` (${event.provider_specialty})`}
                </p>
              )}
              {event.condition_name && (
                <p className="text-sm">
                  <span className="font-medium">Related Condition:</span>{' '}
                  {event.condition_name}
                </p>
              )}
              {event.treatment_name && (
                <p className="text-sm">
                  <span className="font-medium">Related Treatment:</span>{' '}
                  {event.treatment_name}
                </p>
              )}
              {event.notes && (
                <p className="text-sm mt-2 italic">{event.notes}</p>
              )}
            </div>
          </Card>
        ))}

        {events.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-500 mb-4">No medical events found</p>
            <p className="text-sm text-gray-400">
              Medical events will be loaded from Firebase once the integration is complete.
            </p>
          </div>
        )}
      </div>
    </div>
  );
} 