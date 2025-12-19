import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Bell, Palette, Loader, Save, AlertCircle } from 'lucide-react';
import { Layout } from '../components/Layout';
import { apiGet, apiPut } from '../utils/api';

export default function SettingsPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'profile' | 'preferences' | 'branding'>('profile');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const [profile, setProfile] = useState({
    firstName: '',
    lastName: '',
    email: '',
    companyName: '',
    phone: '',
    bio: '',
    website: '',
    timezone: 'UTC'
  });

  const [preferences, setPreferences] = useState({
    theme: 'light',
    notificationEmail: true,
    notificationSms: false,
    notificationPush: true,
    defaultMeetingDuration: 30
  });

  const [branding, setBranding] = useState({
    title: '',
    description: '',
    primaryColor: '#14b8a6',
    secondaryColor: '#1e293b',
    showPoweredBy: true
  });

  useEffect(() => {
    fetchProfile();
    fetchSettings();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await apiGet('/users/profile');

      if (!response.ok) throw new Error('Failed to fetch profile');

      const data = await response.json();
      const user = data.user;
      setProfile({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        companyName: user.companyName || '',
        phone: user.phone || '',
        bio: user.bio || '',
        website: user.website || '',
        timezone: user.timezone || 'UTC'
      });
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to load profile' });
    }
  };

  const fetchSettings = async () => {
    try {
      const response = await apiGet('/users/settings');

      if (!response.ok) throw new Error('Failed to fetch settings');

      const data = await response.json();
      const settings = data.settings;
      setPreferences({
        theme: settings.theme || 'light',
        notificationEmail: settings.notificationEmail !== false,
        notificationSms: settings.notificationSms === true,
        notificationPush: settings.notificationPush !== false,
        defaultMeetingDuration: settings.defaultMeetingDuration || 30
      });
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to load settings' });
    }
  };

  const saveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const response = await apiPut('/users/profile', {
        firstName: profile.firstName,
        lastName: profile.lastName,
        companyName: profile.companyName,
        phone: profile.phone,
        bio: profile.bio,
        website: profile.website,
        timezone: profile.timezone
      });

      if (!response.ok) throw new Error('Failed to save profile');

      setMessage({ type: 'success', text: 'Profile updated successfully!' });
    } catch (error) {
      setMessage({ type: 'error', text: error instanceof Error ? error.message : 'An error occurred' });
    } finally {
      setLoading(false);
    }
  };

  const savePreferences = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const response = await apiPut('/users/settings', {
        theme: preferences.theme,
        notification_email: preferences.notificationEmail,
        notification_sms: preferences.notificationSms,
        notification_push: preferences.notificationPush,
        default_meeting_duration: preferences.defaultMeetingDuration
      });

      if (!response.ok) throw new Error('Failed to save preferences');

      setMessage({ type: 'success', text: 'Preferences updated successfully!' });
    } catch (error) {
      setMessage({ type: 'error', text: error instanceof Error ? error.message : 'An error occurred' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="min-h-screen bg-background">
        {/* Header */}
        <div className="bg-card border-b border-border">
          <div className="max-width: 7xl mx-auto px-6 py-8">
            <h1 className="text-3xl font-bold gradient-text">Settings</h1>
            <p className="text-foreground/60 mt-2">Manage your account and preferences</p>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-7xl mx-auto px-6 py-8">
          {/* Tabs */}
          <div className="flex gap-4 mb-8 border-b border-border">
            {(['profile', 'preferences', 'branding'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-4 font-medium border-b-2 transition-colors ${
                  activeTab === tab
                    ? 'border-primary text-primary'
                    : 'border-transparent text-foreground/60 hover:text-foreground'
                }`}
              >
                {tab === 'profile' && <User className="w-4 h-4 inline mr-2" />}
                {tab === 'preferences' && <Bell className="w-4 h-4 inline mr-2" />}
                {tab === 'branding' && <Palette className="w-4 h-4 inline mr-2" />}
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>

          {/* Message */}
          {message && (
            <div
              className={`p-4 rounded-lg mb-8 flex gap-3 ${
                message.type === 'success'
                  ? 'bg-primary/10 border border-primary/20'
                  : 'bg-destructive/10 border border-destructive/20'
              }`}
            >
              <AlertCircle
                className={`w-5 h-5 flex-shrink-0 ${
                  message.type === 'success' ? 'text-primary' : 'text-destructive'
                }`}
              />
              <p className={message.type === 'success' ? 'text-primary' : 'text-destructive'}>
                {message.text}
              </p>
            </div>
          )}

          {/* Profile Tab */}
          {activeTab === 'profile' && (
            <div className="bg-card border border-border rounded-lg p-8 max-w-2xl">
              <form onSubmit={saveProfile} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">First Name</label>
                    <input
                      type="text"
                      value={profile.firstName}
                      onChange={(e) => setProfile({ ...profile, firstName: e.target.value })}
                      className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Last Name</label>
                    <input
                      type="text"
                      value={profile.lastName}
                      onChange={(e) => setProfile({ ...profile, lastName: e.target.value })}
                      className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Email</label>
                  <input
                    type="email"
                    value={profile.email}
                    disabled
                    className="w-full px-4 py-2 bg-background border border-border rounded-lg opacity-50 cursor-not-allowed"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Company</label>
                  <input
                    type="text"
                    value={profile.companyName}
                    onChange={(e) => setProfile({ ...profile, companyName: e.target.value })}
                    className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Phone</label>
                    <input
                      type="tel"
                      value={profile.phone}
                      onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                      className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Timezone</label>
                    <select
                      value={profile.timezone}
                      onChange={(e) => setProfile({ ...profile, timezone: e.target.value })}
                      className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      <option>UTC</option>
                      <option>EST</option>
                      <option>CST</option>
                      <option>MST</option>
                      <option>PST</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Bio</label>
                  <textarea
                    value={profile.bio}
                    onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                    placeholder="Tell your guests about yourself"
                    className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                    rows={3}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Website</label>
                  <input
                    type="url"
                    value={profile.website}
                    onChange={(e) => setProfile({ ...profile, website: e.target.value })}
                    placeholder="https://example.com"
                    className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-lg hover:opacity-90 disabled:opacity-50 font-semibold"
                >
                  {loading ? (
                    <>
                      <Loader className="w-4 h-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      Save Changes
                    </>
                  )}
                </button>
              </form>
            </div>
          )}

          {/* Preferences Tab */}
          {activeTab === 'preferences' && (
            <div className="bg-card border border-border rounded-lg p-8 max-w-2xl">
              <form onSubmit={savePreferences} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-4">
                    Theme
                  </label>
                  <select
                    value={preferences.theme}
                    onChange={(e) => setPreferences({ ...preferences, theme: e.target.value })}
                    className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="light">Light</option>
                    <option value="dark">Dark</option>
                  </select>
                </div>

                <div className="space-y-4">
                  <label className="block text-sm font-medium text-foreground">Notifications</label>

                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={preferences.notificationEmail}
                      onChange={(e) => setPreferences({ ...preferences, notificationEmail: e.target.checked })}
                      className="w-4 h-4 rounded"
                    />
                    <span className="text-sm text-foreground">Email notifications</span>
                  </label>

                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={preferences.notificationPush}
                      onChange={(e) => setPreferences({ ...preferences, notificationPush: e.target.checked })}
                      className="w-4 h-4 rounded"
                    />
                    <span className="text-sm text-foreground">Push notifications</span>
                  </label>

                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={preferences.notificationSms}
                      onChange={(e) => setPreferences({ ...preferences, notificationSms: e.target.checked })}
                      className="w-4 h-4 rounded"
                    />
                    <span className="text-sm text-foreground">SMS notifications</span>
                  </label>
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Default Meeting Duration
                  </label>
                  <input
                    type="number"
                    value={preferences.defaultMeetingDuration}
                    onChange={(e) => setPreferences({ ...preferences, defaultMeetingDuration: parseInt(e.target.value) })}
                    min={15}
                    max={480}
                    className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                  <p className="text-xs text-muted-foreground mt-2">minutes</p>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-lg hover:opacity-90 disabled:opacity-50 font-semibold"
                >
                  {loading ? (
                    <>
                      <Loader className="w-4 h-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      Save Changes
                    </>
                  )}
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
