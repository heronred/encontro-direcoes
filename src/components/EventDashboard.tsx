import React, { useEffect, useState } from 'react';
import { MapPin, User as UserIcon, Calendar as CalendarIcon, Clock } from 'lucide-react';
import { format, isAfter, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { motion, AnimatePresence } from 'motion/react';
import { ConferenceEvent } from '../types';
import { cn } from '../lib/utils';

interface EventListProps {
  events: ConferenceEvent[];
}

export default function EventDashboard({ events }: EventListProps) {
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 60000); // Update every minute
    return () => clearInterval(timer);
  }, []);

  // Filter unique dates from events
  const availableDates = Array.from(new Set(events.map(e => e.dateTime.split('T')[0]))).sort();

  useEffect(() => {
    if (availableDates.length > 0 && !selectedDate) {
      setSelectedDate(availableDates[0]);
    }
  }, [availableDates]);

  const filteredEvents = events.filter(e => e.dateTime.startsWith(selectedDate));

  // Determine highlights (top 3 upcoming events)
  const upcomingEvents = [...events]
    .filter(e => isAfter(parseISO(e.dateTime), now))
    .sort((a, b) => parseISO(a.dateTime).getTime() - parseISO(b.dateTime).getTime())
    .slice(0, 3);

  const getStatusLabel = (dateTime: string, location: string) => {
    const eventTime = parseISO(dateTime);
    const diffInMinutes = (eventTime.getTime() - now.getTime()) / 60000;

    if (diffInMinutes <= 0 && diffInMinutes > -60) { // Assuming typical event length 60m
      return `Agora no ${location}`;
    }
    if (diffInMinutes > 0 && diffInMinutes <= 60) {
      return `Em ${Math.round(diffInMinutes)} minutos`;
    }
    
    // Check if it's many days away
    const daysDiff = Math.ceil(diffInMinutes / (60 * 24));
    if (daysDiff === 1) {
      return `Amanhã às ${format(eventTime, "HH:mm")}`;
    }
    if (daysDiff > 1) {
      return `daqui a ${daysDiff} dias`;
    }
    
    return format(eventTime, "'as' HH:mm", { locale: ptBR });
  };

  return (
    <div className="min-h-screen bg-[#F3F4F6]">
      {/* Banner Header */}
      <div className="bg-[#003366] text-white pt-12 pb-16 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <p className="text-[#EAB308] font-semibold uppercase tracking-widest text-sm mb-2">Regional São Paulo</p>
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight">Encontro de Direções</h1>
              <p className="mt-4 text-blue-100/80 max-w-xl">
                Acompanhe a programação completa, palestras e localizações do evento Marista.
              </p>
            </div>
            <div className="flex flex-col items-center gap-4">
              <div className="hidden md:block">
                <img 
                  src="https://www.marista.org.br/wp-content/themes/marista-brasil/assets/img/logo-marista-brasil-branco.svg" 
                  alt="Marista Brasil"
                  className="h-10 opacity-60"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 -mt-10 pb-20">
        {/* Highlighted Events */}
        {upcomingEvents.length > 0 && (
          <section className="mb-12">
            <h2 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
              <span className="w-2 h-2 bg-[#EAB308] rounded-full animate-pulse" />
              EM DESTAQUE
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {upcomingEvents.map((event, idx) => (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="bg-white rounded-2xl p-6 shadow-xl border border-blue-50 relative overflow-hidden group hover:border-[#EAB308]/30 transition-colors"
                >
                  <div className="absolute top-0 right-0 p-3">
                    <Clock className="w-5 h-5 text-gray-200 group-hover:text-[#EAB308]/20 transition-colors" />
                  </div>
                  <div className="text-[10px] uppercase font-bold text-[#EAB308] mb-2 tracking-wider">
                    {getStatusLabel(event.dateTime, event.location)}
                  </div>
                  <h3 className="font-bold text-gray-900 leading-snug mb-3 line-clamp-2">
                    {event.title}
                  </h3>
                  <div className="flex items-start gap-2 text-xs text-gray-500">
                    <MapPin className="w-3.5 h-3.5 text-[#EAB308] shrink-0 mt-0.5" />
                    <span className="line-clamp-2">{event.location}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </section>
        )}

        {/* Full Schedule */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <CalendarIcon className="w-5 h-5 text-[#003366]" />
              Cronograma
            </h2>
            
            {/* Simple Date Filter */}
            <div className="flex gap-2">
              {availableDates.map(date => (
                <button
                  key={date}
                  onClick={() => setSelectedDate(date)}
                  className={cn(
                    "px-4 py-2 rounded-full text-xs font-bold transition-all",
                    selectedDate === date 
                      ? "bg-[#003366] text-white shadow-md" 
                      : "bg-white text-gray-500 hover:bg-gray-100"
                  )}
                >
                  {format(parseISO(date), "dd MMM", { locale: ptBR })}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <AnimatePresence mode="popLayout">
              {filteredEvents.map((event, idx) => (
                <motion.div
                  key={event.id}
                  layout
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: idx * 0.05 }}
                  className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 flex gap-4 md:gap-6 hover:shadow-md transition-shadow"
                >
                  <div className="flex flex-col items-center justify-center min-w-[70px] border-r border-gray-100 pr-4">
                    <span className="text-xl font-black text-[#003366]">
                      {format(parseISO(event.dateTime), "HH:mm")}
                    </span>
                    <span className="text-[10px] uppercase font-bold text-gray-400">
                      {format(parseISO(event.dateTime), "eee", { locale: ptBR })}
                    </span>
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-bold text-gray-900 truncate">
                        {event.title}
                      </h3>
                    </div>
                    
                    {event.speaker && (
                      <div className="flex items-center gap-1.5 text-sm text-gray-600 mb-2">
                        <UserIcon className="w-3.5 h-3.5 text-[#EAB308]" />
                        <span>{event.speaker}</span>
                      </div>
                    )}
                    
                    <div className="flex items-start gap-1.5 text-sm text-gray-500">
                      <MapPin className="w-3.5 h-3.5 text-[#EAB308] shrink-0 mt-0.5" />
                      <span className="leading-tight">{event.location}</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
            
            {filteredEvents.length === 0 && (
              <div className="text-center py-20 bg-white rounded-xl border border-dashed border-gray-200">
                <CalendarIcon className="w-12 h-12 text-gray-200 mx-auto mb-4" />
                <p className="text-gray-400">Nenhum evento agendado para este dia.</p>
              </div>
            )}
          </div>
        </section>
      </div>
      
      {/* Sticky Footer with Marista Logo */}
      <footer className="fixed bottom-0 left-0 right-0 p-4 bg-white/80 backdrop-blur-md border-t border-gray-100 flex justify-center items-center gap-4 z-50">
        <img 
          src="https://www.marista.org.br/wp-content/themes/marista-brasil/assets/img/logo-marista-brasil-azul.svg" 
          alt="Marista Brasil"
          className="h-8"
        />
        <div className="h-4 w-[1px] bg-gray-200" />
        <span className="text-[10px] text-gray-400 font-bold tracking-widest uppercase">
          Regional São Paulo
        </span>
      </footer>
    </div>
  );
}
