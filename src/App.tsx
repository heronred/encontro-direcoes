/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import { fetchEvents } from './services/eventService';
import { ConferenceEvent } from './types';
import EventDashboard from './components/EventDashboard';

export default function App() {
  const [events, setEvents] = useState<ConferenceEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const data = await fetchEvents();
        setEvents(data);
      } catch (error) {
        console.error("Error fetching events:", error);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  if (loading && events.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#003366]">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[#EAB308] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-white font-bold opacity-80 animate-pulse">MARISTA BRASIL</p>
        </div>
      </div>
    );
  }

  return (
    <div className="antialiased">
      <EventDashboard events={events} />
    </div>
  );
}
