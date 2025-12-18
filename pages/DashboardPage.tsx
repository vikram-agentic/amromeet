import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, BookOpen, Users, TrendingUp, Plus, Settings, LogOut, Code } from 'lucide-react';
import { Layout } from '../components/Layout';

interface AnalyticsData {
  bookings: {
    total: number;
    confirmed: number;
    cancelled: number;
  };
  eventTypes: {
    total: number;
  };
  upcoming: number;
  recentBookings: Array<{
    id: string;
    eventTypeId: string;
    guestName: string;
    guestEmail: string;
    scheduledAt: string;
    status: string;
  }>;
}

export default function DashboardPage() {
  const navigate = useNavigate();
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    // Check authentication
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');

    if (!token) {
      navigate('/login');
      return;
    }

    if (userData) {
      setUser(JSON.parse(userData));
    }

    // Fetch analytics
    fetchAnalytics(token);
  }, [navigate]);

  const fetchAnalytics = async (token: string) => {
    try {
      const response = await fetch('/api/analytics/dashboard', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (!response.ok) throw new Error('Failed to fetch analytics');

      const data = await response.json();
      setAnalytics(data.analytics);
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    navigate('/login');
  };

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-foreground/60">Loading your dashboard...</p>
          </div>
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
                <h1 className="text-4xl font-bold gradient-text">Dashboard</h1>
                <p className="text-foreground/60 mt-2">Welcome back, {user?.firstName || 'User'}</p>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-7xl mx-auto px-6 py-8">
          {/* Quick Actions */}
          <div className="grid md:grid-cols-4 gap-4 mb-8">
            <button
              onClick={() => navigate('/dashboard/events')}
              className="flex items-center gap-3 bg-gradient-hero text-white px-6 py-4 rounded-lg hover:opacity-90 transition-all font-semibold"
            >
              <Plus className="w-5 h-5" />
              New Event Type
            </button>
            <button
              onClick={() => navigate('/dashboard/bookings')}
              className="flex items-center gap-3 bg-primary/10 text-primary px-6 py-4 rounded-lg hover:bg-primary/20 transition-all font-semibold border border-primary/20"
            >
              <Calendar className="w-5 h-5" />
              View All Bookings
            </button>
            <button
              onClick={() => navigate('/dashboard/embed')}
              className="flex items-center gap-3 bg-secondary/50 text-foreground px-6 py-4 rounded-lg hover:opacity-80 transition-all font-semibold border border-border"
            >
              <Code className="w-5 h-5" />
              Get Embed Code
            </button>
            <button
              onClick={() => navigate('/dashboard/settings')}
              className="flex items-center gap-3 bg-secondary text-foreground px-6 py-4 rounded-lg hover:opacity-80 transition-all font-semibold border border-border"
            >
              <Settings className="w-5 h-5" />
              Settings
            </button>
          </div>

          {/* Analytics Cards */}
          <div className="grid md:grid-cols-4 gap-4 mb-8">
            <div className="bg-card border border-border rounded-lg p-6">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-muted-foreground">Total Bookings</p>
                <Calendar className="w-5 h-5 text-primary" />
              </div>
              <p className="text-3xl font-bold text-foreground">{analytics?.bookings.total || 0}</p>
              <p className="text-xs text-muted-foreground mt-2">
                {analytics?.bookings.confirmed || 0} confirmed
              </p>
            </div>

            <div className="bg-card border border-border rounded-lg p-6">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-muted-foreground">Upcoming</p>
                <TrendingUp className="w-5 h-5 text-primary" />
              </div>
              <p className="text-3xl font-bold text-foreground">{analytics?.upcoming || 0}</p>
              <p className="text-xs text-muted-foreground mt-2">Scheduled consultations</p>
            </div>

            <div className="bg-card border border-border rounded-lg p-6">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-muted-foreground">Event Types</p>
                <BookOpen className="w-5 h-5 text-primary" />
              </div>
              <p className="text-3xl font-bold text-foreground">{analytics?.eventTypes.total || 0}</p>
              <p className="text-xs text-muted-foreground mt-2">Active event types</p>
            </div>

            <div className="bg-card border border-border rounded-lg p-6">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-muted-foreground">Cancellations</p>
                <Users className="w-5 h-5 text-primary" />
              </div>
              <p className="text-3xl font-bold text-foreground">{analytics?.bookings.cancelled || 0}</p>
              <p className="text-xs text-muted-foreground mt-2">Cancelled bookings</p>
            </div>
          </div>

          {/* Recent Bookings */}
          <div className="bg-card border border-border rounded-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-foreground">Recent Bookings</h2>
              <button
                onClick={() => navigate('/dashboard/bookings')}
                className="text-primary text-sm hover:underline"
              >
                View All →
              </button>
            </div>

            {analytics?.recentBookings && analytics.recentBookings.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-3 px-4 text-sm font-semibold text-foreground">Guest</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-foreground">Email</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-foreground">Scheduled</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-foreground">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {analytics.recentBookings.map((booking) => (
                      <tr key={booking.id} className="border-b border-border/50 hover:bg-background/50">
                        <td className="py-3 px-4 text-sm text-foreground">{booking.guestName}</td>
                        <td className="py-3 px-4 text-sm text-foreground/60">{booking.guestEmail}</td>
                        <td className="py-3 px-4 text-sm text-foreground/60">
                          {new Date(booking.scheduledAt).toLocaleDateString()}
                        </td>
                        <td className="py-3 px-4 text-sm">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-medium ${
                              booking.status === 'confirmed'
                                ? 'bg-primary/10 text-primary'
                                : 'bg-destructive/10 text-destructive'
                            }`}
                          >
                            {booking.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-12">
                <Calendar className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
                <p className="text-muted-foreground">No bookings yet</p>
                <button
                  onClick={() => navigate('/dashboard/events/new')}
                  className="mt-4 text-primary hover:underline text-sm font-medium"
                >
                  Create your first event type
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
