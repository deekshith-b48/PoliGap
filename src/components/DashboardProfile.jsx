import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';

function DashboardProfile() {
  const { user, updateProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', content: '' });
  const [profileData, setProfileData] = useState({
    full_name: '',
    company: '',
    role: '',
    phone: '',
    notification_preferences: {
      email_updates: true,
      analysis_alerts: true,
      weekly_reports: false,
      security_alerts: true
    },
    privacy_settings: {
      profile_visibility: 'private',
      data_sharing: false,
      analytics_tracking: true
    }
  });

  useEffect(() => {
    if (user) {
      setProfileData({
        full_name: user.user_metadata?.full_name || '',
        company: user.user_metadata?.company || '',
        role: user.user_metadata?.role || '',
        phone: user.user_metadata?.phone || '',
        notification_preferences: user.user_metadata?.notification_preferences || {
          email_updates: true,
          analysis_alerts: true,
          weekly_reports: false,
          security_alerts: true
        },
        privacy_settings: user.user_metadata?.privacy_settings || {
          profile_visibility: 'private',
          data_sharing: false,
          analytics_tracking: true
        }
      });
    }
  }, [user]);

  const handleSave = async () => {
    setLoading(true);
    setMessage({ type: '', content: '' });

    try {
      const { error } = await updateProfile(profileData);
      
      if (error) {
        setMessage({ type: 'error', content: 'Failed to update profile. Please try again.' });
      } else {
        setMessage({ type: 'success', content: 'Profile updated successfully!' });
        setIsEditing(false);
      }
    } catch (error) {
      setMessage({ type: 'error', content: 'An unexpected error occurred.' });
    } finally {
      setLoading(false);
    }
  };

  const accountStats = {
    memberSince: user?.created_at ? new Date(user.created_at).toLocaleDateString() : 'N/A',
    totalAnalyses: 12,
    avgScore: 85,
    lastLogin: new Date().toLocaleDateString()
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-6 text-white">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
            <span className="text-2xl font-bold">
              {user?.user_metadata?.full_name?.[0] || user?.email[0].toUpperCase()}
            </span>
          </div>
          <div>
            <h1 className="text-2xl font-bold">
              {user?.user_metadata?.full_name || 'User Profile'}
            </h1>
            <p className="text-blue-100">{user?.email}</p>
            {user?.user_metadata?.company && (
              <p className="text-blue-200 text-sm">{user.user_metadata.company}</p>
            )}
          </div>
        </div>
      </div>

      {/* Message Display */}
      {message.content && (
        <div className={`p-4 rounded-xl ${
          message.type === 'success' 
            ? 'bg-green-50 text-green-800 border border-green-200' 
            : 'bg-red-50 text-red-800 border border-red-200'
        }`}>
          {message.content}
        </div>
      )}

      {/* Account Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">{accountStats.totalAnalyses}</div>
            <div className="text-sm text-gray-600">Total Analyses</div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">{accountStats.avgScore}%</div>
            <div className="text-sm text-gray-600">Average Score</div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="text-center">
            <div className="text-sm font-bold text-gray-900">{accountStats.memberSince}</div>
            <div className="text-sm text-gray-600">Member Since</div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="text-center">
            <div className="text-sm font-bold text-gray-900">{accountStats.lastLogin}</div>
            <div className="text-sm text-gray-600">Last Login</div>
          </div>
        </div>
      </div>

      {/* Profile Information */}
      <div className="bg-white rounded-xl border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">Profile Information</h3>
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors text-sm font-medium"
          >
            {isEditing ? 'Cancel' : 'Edit Profile'}
          </button>
        </div>
        
        <div className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
              {isEditing ? (
                <input
                  type="text"
                  value={profileData.full_name}
                  onChange={(e) => setProfileData({...profileData, full_name: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              ) : (
                <div className="px-4 py-3 bg-gray-50 rounded-xl text-gray-900">
                  {profileData.full_name || 'Not set'}
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
              <div className="px-4 py-3 bg-gray-100 rounded-xl text-gray-500">
                {user?.email} (cannot be changed)
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Company</label>
              {isEditing ? (
                <input
                  type="text"
                  value={profileData.company}
                  onChange={(e) => setProfileData({...profileData, company: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              ) : (
                <div className="px-4 py-3 bg-gray-50 rounded-xl text-gray-900">
                  {profileData.company || 'Not set'}
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Job Role</label>
              {isEditing ? (
                <input
                  type="text"
                  value={profileData.role}
                  onChange={(e) => setProfileData({...profileData, role: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              ) : (
                <div className="px-4 py-3 bg-gray-50 rounded-xl text-gray-900">
                  {profileData.role || 'Not set'}
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
              {isEditing ? (
                <input
                  type="tel"
                  value={profileData.phone}
                  onChange={(e) => setProfileData({...profileData, phone: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              ) : (
                <div className="px-4 py-3 bg-gray-50 rounded-xl text-gray-900">
                  {profileData.phone || 'Not set'}
                </div>
              )}
            </div>
          </div>

          {isEditing && (
            <div className="flex space-x-4 pt-4">
              <button
                onClick={handleSave}
                disabled={loading}
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-medium hover:from-blue-700 hover:to-purple-700 transition-all duration-300 disabled:opacity-50"
              >
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
              <button
                onClick={() => setIsEditing(false)}
                className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Notification Preferences */}
      <div className="bg-white rounded-xl border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Notification Preferences</h3>
        </div>
        <div className="p-6 space-y-4">
          {Object.entries(profileData.notification_preferences).map(([key, value]) => (
            <div key={key} className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-medium text-gray-900">
                  {key.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                </h4>
                <p className="text-sm text-gray-600">
                  {key === 'email_updates' && 'Receive email updates about new features and improvements'}
                  {key === 'analysis_alerts' && 'Get notified when analysis is complete'}
                  {key === 'weekly_reports' && 'Receive weekly compliance reports'}
                  {key === 'security_alerts' && 'Important security and account alerts'}
                </p>
              </div>
              <button
                onClick={() => setProfileData({
                  ...profileData,
                  notification_preferences: {
                    ...profileData.notification_preferences,
                    [key]: !value
                  }
                })}
                className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                  value ? 'bg-blue-600' : 'bg-gray-200'
                }`}
              >
                <span className={`${
                  value ? 'translate-x-5' : 'translate-x-0'
                } pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out`} />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Privacy Settings */}
      <div className="bg-white rounded-xl border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Privacy Settings</h3>
        </div>
        <div className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-medium text-gray-900">Profile Visibility</h4>
              <p className="text-sm text-gray-600">Control who can see your profile information</p>
            </div>
            <select
              value={profileData.privacy_settings.profile_visibility}
              onChange={(e) => setProfileData({
                ...profileData,
                privacy_settings: {
                  ...profileData.privacy_settings,
                  profile_visibility: e.target.value
                }
              })}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
            >
              <option value="private">Private</option>
              <option value="company">Company Only</option>
              <option value="public">Public</option>
            </select>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-medium text-gray-900">Data Sharing</h4>
              <p className="text-sm text-gray-600">Allow anonymized data to improve our services</p>
            </div>
            <button
              onClick={() => setProfileData({
                ...profileData,
                privacy_settings: {
                  ...profileData.privacy_settings,
                  data_sharing: !profileData.privacy_settings.data_sharing
                }
              })}
              className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                profileData.privacy_settings.data_sharing ? 'bg-blue-600' : 'bg-gray-200'
              }`}
            >
              <span className={`${
                profileData.privacy_settings.data_sharing ? 'translate-x-5' : 'translate-x-0'
              } pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out`} />
            </button>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-medium text-gray-900">Analytics Tracking</h4>
              <p className="text-sm text-gray-600">Help us understand how you use our platform</p>
            </div>
            <button
              onClick={() => setProfileData({
                ...profileData,
                privacy_settings: {
                  ...profileData.privacy_settings,
                  analytics_tracking: !profileData.privacy_settings.analytics_tracking
                }
              })}
              className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                profileData.privacy_settings.analytics_tracking ? 'bg-blue-600' : 'bg-gray-200'
              }`}
            >
              <span className={`${
                profileData.privacy_settings.analytics_tracking ? 'translate-x-5' : 'translate-x-0'
              } pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out`} />
            </button>
          </div>
        </div>
      </div>

      {/* Account Actions */}
      <div className="bg-white rounded-xl border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Account Actions</h3>
        </div>
        <div className="p-6 space-y-4">
          <button className="w-full px-4 py-3 bg-blue-50 text-blue-700 rounded-xl hover:bg-blue-100 transition-colors text-left">
            <div className="font-medium">Download My Data</div>
            <div className="text-sm text-blue-600">Get a copy of all your analysis data</div>
          </button>

          <button className="w-full px-4 py-3 bg-yellow-50 text-yellow-700 rounded-xl hover:bg-yellow-100 transition-colors text-left">
            <div className="font-medium">Change Password</div>
            <div className="text-sm text-yellow-600">Update your account password</div>
          </button>

          <button className="w-full px-4 py-3 bg-red-50 text-red-700 rounded-xl hover:bg-red-100 transition-colors text-left">
            <div className="font-medium">Delete Account</div>
            <div className="text-sm text-red-600">Permanently delete your account and all data</div>
          </button>
        </div>
      </div>
    </div>
  );
}

export default DashboardProfile;
