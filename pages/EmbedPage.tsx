import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Copy, Check, Code, ExternalLink, Loader } from 'lucide-react';
import { Layout } from '../components/Layout';
import { apiGet } from '../utils/api';

interface EventType {
  id: string;
  name: string;
  slug: string;
  description: string;
}

export default function EmbedPage() {
  const navigate = useNavigate();
  const [events, setEvents] = useState<EventType[]>([]);
  const [loading, setLoading] = useState(true);
  const [copiedSlug, setCopiedSlug] = useState<string | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<string | null>(null);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await apiGet('/events');

      if (!response.ok) throw new Error('Failed to fetch events');

      const data = await response.json();
      setEvents(data.events);
      if (data.events.length > 0) {
        setSelectedEvent(data.events[0].slug);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const getEmbedCode = (slug: string) => {
    const baseUrl = window.location.origin;
    return `<!-- Amromeet Booking Widget -->
<div id="amromeet-booking" data-username="${slug}"></div>
<script src="${baseUrl}/embed.js" async></script>
<style>
  #amromeet-booking {
    max-width: 600px;
    margin: 0 auto;
  }
</style>`;
  };

  const getBookingUrl = (slug: string) => {
    return `${window.location.origin}/#/book/${slug}`;
  };

  const copyToClipboard = (text: string, slug: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSlug(slug);
    setTimeout(() => setCopiedSlug(null), 2000);
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

  const currentEvent = events.find(e => e.slug === selectedEvent);
  const embedCode = selectedEvent ? getEmbedCode(selectedEvent) : '';
  const bookingUrl = selectedEvent ? getBookingUrl(selectedEvent) : '';

  return (
    <Layout>
      <div className="min-h-screen bg-background">
        {/* Header */}
        <div className="bg-card border-b border-border">
          <div className="max-w-7xl mx-auto px-6 py-8">
            <h1 className="text-3xl font-bold gradient-text">Embed & Integration</h1>
            <p className="text-foreground/60 mt-2">Get embed code and share your booking page</p>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-7xl mx-auto px-6 py-8">
          {events.length === 0 ? (
            <div className="text-center py-12 bg-card border border-border rounded-lg">
              <Code className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
              <p className="text-muted-foreground">No event types found</p>
              <button
                onClick={() => navigate('/dashboard/events')}
                className="mt-4 text-primary hover:underline text-sm font-medium"
              >
                Create an event type first
              </button>
            </div>
          ) : (
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Event Type Selector */}
              <div className="lg:col-span-1">
                <div className="bg-card border border-border rounded-lg p-6 sticky top-6">
                  <h2 className="text-lg font-bold text-foreground mb-4">Event Types</h2>
                  <div className="space-y-2">
                    {events.map((event) => (
                      <button
                        key={event.slug}
                        onClick={() => setSelectedEvent(event.slug)}
                        className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
                          selectedEvent === event.slug
                            ? 'bg-primary text-white'
                            : 'bg-background border border-border text-foreground hover:bg-secondary'
                        }`}
                      >
                        <p className="font-medium">{event.name}</p>
                        <p className="text-xs opacity-70">{event.slug}</p>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Embed Code Section */}
              <div className="lg:col-span-2 space-y-6">
                {/* Booking URL */}
                <div className="bg-card border border-border rounded-lg p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <ExternalLink className="w-5 h-5 text-primary" />
                    <h3 className="text-lg font-bold text-foreground">Booking Link</h3>
                  </div>
                  <p className="text-sm text-muted-foreground mb-4">
                    Share this direct link to your booking page
                  </p>
                  <div className="bg-background border border-border rounded-lg p-4 font-mono text-sm text-foreground/80 break-all mb-3">
                    {bookingUrl}
                  </div>
                  <button
                    onClick={() => copyToClipboard(bookingUrl, 'url')}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                      copiedSlug === 'url'
                        ? 'bg-primary/10 text-primary'
                        : 'bg-primary text-white hover:opacity-90'
                    }`}
                  >
                    {copiedSlug === 'url' ? (
                      <>
                        <Check className="w-4 h-4" />
                        Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4" />
                        Copy Link
                      </>
                    )}
                  </button>
                </div>

                {/* Embed Code */}
                <div className="bg-card border border-border rounded-lg p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <Code className="w-5 h-5 text-primary" />
                    <h3 className="text-lg font-bold text-foreground">Embed Code</h3>
                  </div>
                  <p className="text-sm text-muted-foreground mb-4">
                    Add this code to your website to embed the booking widget
                  </p>
                  <div className="bg-background border border-border rounded-lg p-4 font-mono text-xs text-foreground/80 overflow-x-auto mb-3">
                    <pre className="whitespace-pre-wrap break-words">{embedCode}</pre>
                  </div>
                  <button
                    onClick={() => copyToClipboard(embedCode, selectedEvent || '')}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                      copiedSlug === selectedEvent
                        ? 'bg-primary/10 text-primary'
                        : 'bg-primary text-white hover:opacity-90'
                    }`}
                  >
                    {copiedSlug === selectedEvent ? (
                      <>
                        <Check className="w-4 h-4" />
                        Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4" />
                        Copy Code
                      </>
                    )}
                  </button>
                </div>

                {/* Instructions */}
                <div className="bg-card border border-border rounded-lg p-6">
                  <h3 className="text-lg font-bold text-foreground mb-4">📋 Installation Instructions</h3>
                  <div className="space-y-4 text-sm text-foreground/80">
                    <div>
                      <p className="font-semibold text-foreground mb-2">1. Copy the Embed Code</p>
                      <p>Click the "Copy Code" button above to copy the embed code to your clipboard.</p>
                    </div>
                    <div>
                      <p className="font-semibold text-foreground mb-2">2. Paste into Your Website</p>
                      <p>Paste the code into your website's HTML where you want the booking widget to appear. This can be in a page, section, or modal.</p>
                    </div>
                    <div>
                      <p className="font-semibold text-foreground mb-2">3. That's It!</p>
                      <p>The booking widget will automatically load and display on your website. Visitors can click to book a consultation.</p>
                    </div>

                    <div className="bg-primary/10 border border-primary/20 rounded-lg p-4 mt-4">
                      <p className="text-primary font-semibold mb-2">💡 Tips:</p>
                      <ul className="list-disc list-inside space-y-1 text-xs">
                        <li>The widget automatically adapts to different screen sizes</li>
                        <li>Customize colors in your Event Type settings</li>
                        <li>The booking link works on its own too (no embed needed)</li>
                        <li>Keep your booking page URL handy for social media</li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Preview */}
                <div className="bg-card border border-border rounded-lg p-6">
                  <h3 className="text-lg font-bold text-foreground mb-4">👀 Preview</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    This is how your booking widget will look when embedded
                  </p>
                  <div className="bg-background border border-border rounded-lg p-4 text-center text-muted-foreground">
                    <p className="mb-4">Your booking widget will appear here</p>
                    <a
                      href={bookingUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-primary hover:underline font-medium"
                    >
                      Open Live Preview
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
