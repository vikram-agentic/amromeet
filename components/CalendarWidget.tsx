import React, { useState, useEffect } from 'react';
import {
  format,
  addMonths,
  subMonths,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  isSameMonth,
  isSameDay,
  addDays,
  eachDayOfInterval,
  isToday,
  isBefore
} from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Clock, Video, CheckCircle, Loader2, AlertCircle, Copy } from 'lucide-react';
import { getAvailableSlots } from '../services/meetService';
import { apiPost } from '../utils/api';
import { useParams } from 'react-router-dom';

interface CalendarWidgetProps {
  embedded?: boolean;
}

interface EventType {
  id: string;
  name: string;
  description: string;
  durationMinutes: number;
  slug: string;
}

export const CalendarWidget: React.FC<CalendarWidgetProps> = ({ embedded = false }) => {
  const params = useParams();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [view, setView] = useState<'calendar' | 'form' | 'success' | 'error'>('calendar');
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', reason: '' });
  const [meetingLink, setMeetingLink] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [event, setEvent] = useState<EventType | null>(null);
  const [eventLoading, setEventLoading] = useState(true);

  // Extract username from route params or window location
  // Remove UUID suffix if present (e.g., "agentic-ai-amro-4b0dab37" -> "agentic-ai-amro")
  let rawUsername = params.username || window.location.pathname.split('/').pop() || '';
  const username = rawUsername.lastIndexOf('-') > 0 && rawUsername.split('-').pop()?.length === 8
    ? rawUsername.substring(0, rawUsername.lastIndexOf('-'))
    : rawUsername;

  // Fetch event details when component mounts
  useEffect(() => {
    if (username) {
      fetchEvent();
    }
  }, [username]);

  const fetchEvent = async () => {
    if (!username) {
      console.error('No username provided');
      setErrorMessage('Username not found');
      setEventLoading(false);
      return;
    }

    try {
      setEventLoading(true);
      console.log('Fetching event for username:', username);

      // Determine the API base URL
      const isProduction = window.location.hostname !== 'localhost' && !window.location.hostname.startsWith('127.');
      const apiBaseUrl = isProduction
        ? 'https://amromeet-backend.vercel.app'
        : '';

      // The /api/embed/:username endpoint returns public event data - no auth needed
      const url = `${apiBaseUrl}/api/embed/${username}`;
      console.log('Fetching from:', url);

      const response = await fetch(url);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Failed to fetch event (${response.status})`);
      }

      const data = await response.json();
      console.log('Event data received:', data);

      if (data.event) {
        setEvent(data.event);
      } else {
        throw new Error('No event data in response');
      }
    } catch (error) {
      console.error('Error fetching event:', error);
      setErrorMessage(error instanceof Error ? error.message : 'Could not load event details');
    } finally {
      setEventLoading(false);
    }
  };

  // Calendar Logic
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart);
  const endDate = endOfWeek(monthEnd);
  const calendarDays = eachDayOfInterval({ start: startDate, end: endDate });

  const nextMonth = () => setCurrentDate(addMonths(currentDate, 1));
  const prevMonth = () => setCurrentDate(subMonths(currentDate, 1));

  const handleDateClick = (day: Date) => {
    // Prevent selecting past dates
    if (isBefore(day, new Date()) && !isToday(day)) return;
    
    setSelectedDate(day);
    setSelectedSlot(null);
  };

  const handleBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage('');

    if (selectedDate && selectedSlot && event) {
      try {
        // Combine date and time slot
        const [hours, minutes] = selectedSlot.split(':').map(Number);
        const scheduledAt = new Date(selectedDate);
        scheduledAt.setHours(hours, minutes, 0, 0);

        // Call backend API to create booking
        // This will trigger Google Meet creation and email sending on the backend
        const response = await apiPost('/bookings', {
          eventTypeId: event.id,
          guestName: formData.name,
          guestEmail: formData.email,
          guestTimezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
          scheduledAt: scheduledAt.toISOString(),
          endTime: new Date(scheduledAt.getTime() + event.durationMinutes * 60000).toISOString(),
          description: formData.reason
        });

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.error || 'Booking failed');
        }

        const data = await response.json();
        setMeetingLink(data.booking.googleMeetLink || 'https://meet.google.com');
        setView('success');
      } catch (error) {
        setErrorMessage(error instanceof Error ? error.message : 'An error occurred');
        setView('error');
      }
    }
    setLoading(false);
  };

  const copyLink = () => {
    navigator.clipboard.writeText(meetingLink);
    alert('Link copied to clipboard');
  };

  // Show loading state
  if (eventLoading) {
    return (
      <div className={`w-full max-w-5xl mx-auto ${embedded ? 'h-full' : 'min-h-[600px]'} flex flex-col items-center justify-center bg-white dark:bg-slate-900 rounded-3xl overflow-hidden shadow-2xl border border-slate-200 dark:border-slate-800`}>
        <Loader2 size={48} className="text-amro-500 mb-4 animate-spin" />
        <p className="text-slate-600 dark:text-slate-400">Loading event details...</p>
      </div>
    );
  }

  // Show error if loading failed
  if (errorMessage && !event) {
    return (
      <div className={`w-full max-w-5xl mx-auto ${embedded ? 'h-full' : 'min-h-[600px]'} flex flex-col items-center justify-center bg-white dark:bg-slate-900 rounded-3xl overflow-hidden shadow-2xl border border-slate-200 dark:border-slate-800 p-8`}>
        <AlertCircle size={48} className="text-red-500 mb-4" />
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Error Loading Event</h2>
        <p className="text-slate-600 dark:text-slate-400 text-center">{errorMessage}</p>
      </div>
    );
  }

  return (
    <div className={`w-full max-w-5xl mx-auto ${embedded ? 'h-full' : 'min-h-[600px]'} flex flex-col md:flex-row bg-white dark:bg-slate-900 rounded-3xl overflow-hidden shadow-2xl border border-slate-200 dark:border-slate-800`}>
      {/* Left Sidebar - Meeting Info */}
      <div className="w-full md:w-1/3 bg-slate-50 dark:bg-slate-950 p-8 border-r border-slate-200 dark:border-slate-800 flex flex-col justify-between relative overflow-hidden">
        {/* Decorative Blob */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-amro-500/10 rounded-full blur-3xl -z-0 pointer-events-none" />
        
        <div className="z-10">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amro-500 to-purple-600 mb-6 flex items-center justify-center text-white shadow-lg shadow-amro-500/20">
             <Video size={24} />
          </div>
          <h3 className="text-slate-500 dark:text-slate-400 font-medium text-sm uppercase tracking-wider mb-2">Amromeet</h3>
          <h1 className="text-3xl font-display font-bold text-slate-900 dark:text-white mb-6 leading-tight">
            {eventLoading ? 'Loading...' : event?.name || 'Event'}
          </h1>

          <div className="space-y-4">
            <div className="flex items-center gap-3 text-slate-600 dark:text-slate-300">
              <Clock className="text-amro-500" size={20} />
              <span className="font-medium">{event?.durationMinutes || 30} Minutes</span>
            </div>
            <div className="flex items-center gap-3 text-slate-600 dark:text-slate-300">
              <Video className="text-amro-500" size={20} />
              <span className="font-medium">Google Meet</span>
            </div>
          </div>

          <p className="mt-8 text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
            {event?.description || 'Book a consultation slot. A Google Meet link will be generated automatically.'}
          </p>
        </div>
        
        {selectedDate && selectedSlot && view === 'calendar' && (
           <div className="mt-8 p-4 bg-amro-50 dark:bg-amro-900/20 rounded-xl border border-amro-100 dark:border-amro-900/50 relative z-10">
             <p className="text-xs text-amro-600 dark:text-amro-400 uppercase font-bold mb-1">Selected Time</p>
             <p className="text-lg font-semibold dark:text-white">
               {format(selectedDate, 'EEEE, MMMM d')}
             </p>
             <p className="text-amro-600 dark:text-amro-400 font-mono">
               {selectedSlot}
             </p>
           </div>
        )}
      </div>

      {/* Right Content - Calendar / Form */}
      <div className="w-full md:w-2/3 p-8 relative overflow-hidden bg-white dark:bg-[#0B1121]">
        <AnimatePresence mode='wait'>
          {view === 'calendar' && (
            <motion.div 
              key="calendar"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="flex flex-col h-full"
            >
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-xl font-bold dark:text-white font-display tracking-tight">
                  {format(currentDate, 'MMMM yyyy')}
                </h2>
                <div className="flex gap-2">
                  <button onClick={prevMonth} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors dark:text-white"><ChevronLeft size={20}/></button>
                  <button onClick={nextMonth} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors dark:text-white"><ChevronRight size={20}/></button>
                </div>
              </div>

              <div className="flex-grow flex flex-col md:flex-row gap-8">
                {/* Grid */}
                <div className="flex-1">
                  <div className="grid grid-cols-7 gap-2 mb-4">
                    {['S','M','T','W','T','F','S'].map((d, idx) => (
                      <div key={`day-${idx}`} className="text-center text-xs font-bold text-slate-400 tracking-wider">{d}</div>
                    ))}
                  </div>
                  <div className="grid grid-cols-7 gap-2">
                    {calendarDays.map((day, dayIdx) => {
                      const isDisabled = isBefore(day, new Date()) && !isToday(day);
                      const isSelected = selectedDate && isSameDay(day, selectedDate);
                      return (
                        <button
                          key={day.toString()}
                          onClick={() => !isDisabled && handleDateClick(day)}
                          disabled={isDisabled}
                          className={`
                            aspect-square rounded-full flex items-center justify-center text-sm font-medium transition-all relative duration-300
                            ${!isSameMonth(day, currentDate) ? 'text-slate-300 dark:text-slate-700' : 'text-slate-700 dark:text-slate-300'}
                            ${isSelected ? 'bg-amro-500 text-white shadow-lg shadow-amro-500/40 scale-110 z-10' : 'hover:bg-slate-100 dark:hover:bg-slate-800'}
                            ${isDisabled ? 'opacity-30 cursor-not-allowed hover:bg-transparent' : ''}
                            ${isToday(day) && !isSelected ? 'ring-1 ring-amro-500 text-amro-600 dark:text-amro-400' : ''}
                          `}
                        >
                          {format(day, 'd')}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Slots - Visible when date selected */}
                <AnimatePresence>
                  {selectedDate && (
                    <motion.div 
                      initial={{ opacity: 0, width: 0 }}
                      animate={{ opacity: 1, width: '160px' }}
                      exit={{ opacity: 0, width: 0 }}
                      className="border-l border-slate-100 dark:border-slate-800 pl-4 md:pl-8 flex flex-col gap-2 overflow-y-auto max-h-[400px]"
                    >
                      <h3 className="text-sm font-bold text-slate-400 mb-2 sticky top-0 bg-white dark:bg-[#0B1121] py-2">Available Times</h3>
                      {getAvailableSlots(selectedDate).map((slot) => (
                        <motion.button
                          key={slot}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => setSelectedSlot(slot)}
                          className={`
                            w-full py-2.5 px-4 rounded-lg text-sm font-medium border transition-all duration-300
                            ${selectedSlot === slot 
                              ? 'bg-slate-900 text-white dark:bg-white dark:text-black border-slate-900 dark:border-white shadow-lg' 
                              : 'border-slate-200 dark:border-slate-700 text-amro-500 hover:border-amro-500 dark:hover:border-amro-500'}
                          `}
                        >
                          {slot}
                        </motion.button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              
              <div className="mt-6 flex justify-end">
                <button
                  onClick={() => setView('form')}
                  disabled={!selectedDate || !selectedSlot}
                  className="px-8 py-3 bg-amro-500 text-white rounded-xl font-bold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-amro-600 transition-colors shadow-lg shadow-amro-500/25 flex items-center gap-2"
                >
                  Next Details <ArrowRight size={18} />
                </button>
              </div>
            </motion.div>
          )}

          {view === 'form' && (
            <motion.div 
              key="form"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="h-full flex flex-col"
            >
              <button onClick={() => setView('calendar')} className="text-sm text-slate-400 hover:text-slate-600 mb-6 flex items-center gap-1 w-fit">
                <ChevronLeft size={16} /> Back to Calendar
              </button>
              
              <h2 className="text-2xl font-display font-bold dark:text-white mb-6">Final Details</h2>
              
              <form onSubmit={handleBooking} className="space-y-4 flex-grow">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Full Name</label>
                  <input 
                    required
                    type="text" 
                    value={formData.name}
                    onChange={e => setFormData({...formData, name: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 focus:ring-2 focus:ring-amro-500 focus:border-transparent outline-none transition-all dark:text-white"
                    placeholder="John Doe"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Email Address</label>
                  <input 
                    required
                    type="email" 
                    value={formData.email}
                    onChange={e => setFormData({...formData, email: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 focus:ring-2 focus:ring-amro-500 focus:border-transparent outline-none transition-all dark:text-white"
                    placeholder="john@example.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Notes for the team</label>
                  <textarea 
                    value={formData.reason}
                    onChange={e => setFormData({...formData, reason: e.target.value})}
                    rows={4}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 focus:ring-2 focus:ring-amro-500 focus:border-transparent outline-none transition-all dark:text-white resize-none"
                    placeholder="Describe your project needs..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 bg-slate-900 dark:bg-white text-white dark:text-black rounded-xl font-bold text-lg hover:opacity-90 transition-opacity mt-4 flex items-center justify-center gap-2 shadow-lg"
                >
                  {loading ? <Loader2 className="animate-spin" /> : 'Confirm Booking'}
                </button>
              </form>
            </motion.div>
          )}

          {view === 'success' && (
            <motion.div 
              key="success"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="h-full flex flex-col items-center justify-center text-center p-4"
            >
              <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center text-green-500 mb-6 shadow-lg shadow-green-500/20">
                <CheckCircle size={40} />
              </div>
              <h2 className="text-3xl font-display font-bold dark:text-white mb-2">You're Booked!</h2>
              <p className="text-slate-500 dark:text-slate-400 mb-8 max-w-md">
                A calendar invitation with the Google Meet link has been sent to <strong>{formData.email}</strong>.
              </p>
              
              <div className="w-full max-w-md bg-slate-50 dark:bg-slate-900/50 p-6 rounded-xl border border-slate-200 dark:border-slate-800 mb-8 flex items-center justify-between gap-4">
                 <div className="text-left overflow-hidden flex-1">
                    <p className="text-xs text-slate-400 uppercase font-bold mb-1">Google Meet Link</p>
                    <a href={meetingLink} target="_blank" rel="noreferrer" className="text-amro-600 dark:text-amro-400 font-mono text-sm underline truncate block">
                        {meetingLink}
                    </a>
                 </div>
                 <button onClick={copyLink} className="p-2 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-lg transition-colors text-slate-500">
                    <Copy size={20} />
                 </button>
              </div>

              <button 
                onClick={() => {
                  setView('calendar');
                  setSelectedDate(null);
                  setSelectedSlot(null);
                  setFormData({ name: '', email: '', reason: '' });
                }}
                className="text-slate-900 dark:text-white font-medium hover:underline"
              >
                Book Another Meeting
              </button>
            </motion.div>
          )}

          {view === 'error' && (
            <motion.div 
              key="error"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="h-full flex flex-col items-center justify-center text-center p-4"
            >
              <div className="w-20 h-20 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center text-red-500 mb-6">
                <AlertCircle size={40} />
              </div>
              <h2 className="text-2xl font-bold dark:text-white mb-2">Booking Failed</h2>
              <p className="text-slate-500 dark:text-slate-400 mb-8 max-w-md">
                {errorMessage}
              </p>
              
              <button 
                onClick={() => setView('form')}
                className="px-6 py-3 bg-slate-900 dark:bg-white text-white dark:text-black rounded-lg font-bold"
              >
                Try Again
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

// Helper for icon
const ArrowRight = ({ size }: { size: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="5" y1="12" x2="19" y2="12"></line>
    <polyline points="12 5 19 12 12 19"></polyline>
  </svg>
);