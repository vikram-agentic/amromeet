import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Edit2, Trash2, Copy, Loader } from 'lucide-react';
import { Layout } from '../components/Layout';
import { apiGet, apiPost } from '../utils/api';

interface EventType {
  id: string;
  name: string;
  description: string;
  slug: string;
  durationMinutes: number;
  color: string;
  locationType: string;
  isActive: boolean;
  createdAt: string;
}

export default function EventsPage() {
  const navigate = useNavigate();
  const [events, setEvents] = useState<EventType[]>([]);
  const [loading, setLoading] = useState(true);
  const [showNewForm, setShowNewForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    duration_minutes: 30,
    color: '#14b8a6',
    location_type: 'google_meet'
  });
  const [errors, setErrors] = useState<{[key: string]: string}>({});

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await apiGet('/events');

      if (!response.ok) throw new Error('Failed to fetch events');

      const data = await response.json();
      setEvents(data.events);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    console.log('Form data being sent:', formData);

    try {
      const response = await apiPost('/events', formData);

      const data = await response.json();
      console.log('Backend response:', data);

      if (!response.ok) {
        // Handle validation errors from backend
        if (data.errors && Array.isArray(data.errors)) {
          const errorMap: {[key: string]: string} = {};
          data.errors.forEach((err: any) => {
            errorMap[err.field] = err.message;
          });
          setErrors(errorMap);
          const errorMessages = data.errors.map((e: any) => `${e.field}: ${e.message}`).join('\n');
          alert(`Validation Errors:\n\n${errorMessages}`);
        } else {
          const errorMsg = data.error || 'Failed to create event';
          setErrors({ general: errorMsg });
          alert(`Error: ${errorMsg}`);
        }
        return;
      }

      alert('Event type created successfully!');
      setFormData({
        name: '',
        description: '',
        duration_minutes: 30,
        color: '#14b8a6',
        location_type: 'google_meet'
      });
      setShowNewForm(false);
      fetchEvents();
    } catch (error) {
      console.error('Error:', error);
      const errorMsg = error instanceof Error ? error.message : 'Network error. Please try again.';
      setErrors({ general: errorMsg });
      alert(`Error: ${errorMsg}`);
    }
  };

  const handleDelete = async (eventId: string) => {
    if (!window.confirm('Are you sure you want to delete this event type?')) return;

    const token = localStorage.getItem('token');

    try {
      const response = await fetch(`/api/events/${eventId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });

      if (!response.ok) throw new Error('Failed to delete event');

      fetchEvents();
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const copyBookingLink = (slug: string) => {
    const link = `${window.location.origin}/#/book/${slug}`;
    navigator.clipboard.writeText(link);
    alert('Booking link copied to clipboard!');
  };

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <Loader className="w-8 h-8 animate-spin text-primary" />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-background">
        {/* Header */}
        <div className="bg-card border-b border-border">
          <div className="max-w-7xl mx-auto px-6 py-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold gradient-text">Event Types</h1>
                <p className="text-foreground/60 mt-2">Create and manage your booking event types</p>
              </div>
              <button
                onClick={() => setShowNewForm(!showNewForm)}
                className="flex items-center gap-2 bg-gradient-hero text-white px-6 py-3 rounded-lg hover:opacity-90 font-semibold"
              >
                <Plus className="w-5 h-5" />
                New Event Type
              </button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-7xl mx-auto px-6 py-8">
          {/* New Form */}
          {showNewForm && (
            <div className="bg-card border border-border rounded-lg p-6 mb-8">
              <h2 className="text-xl font-bold text-foreground mb-6">Create New Event Type</h2>
              {errors.general && (
                <div className="mb-4 p-3 bg-destructive/10 border border-destructive/20 text-destructive rounded-lg text-sm">
                  {errors.general}
                </div>
              )}
              <form onSubmit={handleCreate} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Event Name
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g., Strategy Call"
                    className={`w-full px-4 py-2 bg-background border rounded-lg focus:outline-none focus:ring-2 ${
                      errors.name ? 'border-destructive focus:ring-destructive' : 'border-border focus:ring-primary'
                    }`}
                    required
                  />
                  {errors.name && <p className="text-destructive text-sm mt-1">{errors.name}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Describe what this event is about"
                    className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                    rows={3}
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Duration (minutes)
                    </label>
                    <input
                      type="number"
                      value={formData.duration_minutes}
                      onChange={(e) => setFormData({ ...formData, duration_minutes: parseInt(e.target.value) })}
                      className={`w-full px-4 py-2 bg-background border rounded-lg focus:outline-none focus:ring-2 ${
                        errors.duration_minutes ? 'border-destructive focus:ring-destructive' : 'border-border focus:ring-primary'
                      }`}
                      min={15}
                      max={480}
                    />
                    {errors.duration_minutes && <p className="text-destructive text-sm mt-1">{errors.duration_minutes}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Color
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="color"
                        value={formData.color}
                        onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                        className="w-12 h-10 rounded border border-border cursor-pointer"
                      />
                      <input
                        type="text"
                        value={formData.color}
                        readOnly
                        className={`flex-1 px-4 py-2 bg-background border rounded-lg text-sm ${
                          errors.color ? 'border-destructive' : 'border-border'
                        }`}
                      />
                    </div>
                    {errors.color && <p className="text-destructive text-sm mt-1">{errors.color}</p>}
                  </div>
                </div>

                <div className="flex gap-2 pt-4">
                  <button
                    type="submit"
                    className="bg-primary text-white px-6 py-2 rounded-lg hover:opacity-90 font-medium"
                  >
                    Create Event Type
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowNewForm(false)}
                    className="bg-secondary text-foreground px-6 py-2 rounded-lg hover:opacity-80 font-medium border border-border"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Events List */}
          {events.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {events.map((event) => (
                <div key={event.id} className="bg-card border border-border rounded-lg p-6 hover:shadow-lg transition-shadow">
                  <div className="flex items-center gap-3 mb-3">
                    <div
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: event.color }}
                    ></div>
                    <h3 className="text-lg font-bold text-foreground">{event.name}</h3>
                  </div>

                  <p className="text-sm text-foreground/60 mb-4">{event.description}</p>

                  <div className="space-y-2 mb-6">
                    <p className="text-sm text-muted-foreground">
                      <strong>Duration:</strong> {event.durationMinutes} min
                    </p>
                    <p className="text-sm text-muted-foreground">
                      <strong>Type:</strong> {event.locationType}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      <strong>Slug:</strong> {event.slug}
                    </p>
                  </div>

                  <div className="flex gap-2 pt-4 border-t border-border">
                    <button
                      onClick={() => copyBookingLink(event.slug)}
                      className="flex-1 flex items-center justify-center gap-2 bg-primary/10 text-primary px-3 py-2 rounded hover:bg-primary/20 text-sm font-medium transition-colors"
                    >
                      <Copy className="w-4 h-4" />
                      Copy Link
                    </button>
                    <button
                      onClick={() => navigate(`/dashboard/events/${event.id}/edit`)}
                      className="flex-1 flex items-center justify-center gap-2 bg-secondary text-foreground px-3 py-2 rounded hover:opacity-80 text-sm font-medium border border-border"
                    >
                      <Edit2 className="w-4 h-4" />
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(event.id)}
                      className="px-3 py-2 bg-destructive/10 text-destructive rounded hover:bg-destructive/20"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Plus className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
              <p className="text-muted-foreground">No event types yet</p>
              <button
                onClick={() => setShowNewForm(true)}
                className="mt-4 text-primary hover:underline text-sm font-medium"
              >
                Create your first event type
              </button>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
