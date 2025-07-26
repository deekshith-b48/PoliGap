import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { 
  HiOutlineUser,
  HiOutlineCamera,
  HiOutlinePencil,
  HiOutlineCheck,
  HiOutlineX,
  HiOutlineCog,
  HiOutlineBell,
  HiOutlineShieldCheck,
  HiOutlineKey,
  HiOutlineDownload,
  HiOutlineTrash,
  HiOutlineEye,
  HiOutlineEyeOff,
  HiOutlineExclamation
} from 'react-icons/hi';
import { 
  MdSecurity,
  MdNotifications,
  MdPrivacyTip,
  MdVerified,
  MdBadge,
  MdAnalytics
} from 'react-icons/md';

function ModernDashboardProfile() {
  const { user, updateProfile } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', content: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [profileData, setProfileData] = useState({
    full_name: '',
    company: '',
    role: '',
    phone: '',
    bio: '',
    website: '',
    location: '',
    timezone: '',
    notification_preferences: {
      email_updates: true,
      analysis_alerts: true,
      weekly_reports: false,
      security_alerts: true,
      marketing_emails: false,
      mobile_notifications: true
    },
    privacy_settings: {
      profile_visibility: 'private',
      data_sharing: false,
      analytics_tracking: true,
      third_party_integrations: false,
      data_export_notifications: true
    },
    security_settings: {
      two_factor_enabled: false,
      session_timeout: '24h',
      login_notifications: true,
      suspicious_activity_alerts: true
    }
  });

  useEffect(() => {
    if (user) {
      setProfileData({
        full_name: user.user_metadata?.full_name || '',
        company: user.user_metadata?.company || '',
        role: user.user_metadata?.role || '',
        phone: user.user_metadata?.phone || '',
        bio: user.user_metadata?.bio || '',
        website: user.user_metadata?.website || '',
        location: user.user_metadata?.location || '',
        timezone: user.user_metadata?.timezone || 'UTC',
        notification_preferences: user.user_metadata?.notification_preferences || {
          email_updates: true,
          analysis_alerts: true,
          weekly_reports: false,
          security_alerts: true,
          marketing_emails: false,
          mobile_notifications: true
        },
        privacy_settings: user.user_metadata?.privacy_settings || {
          profile_visibility: 'private',
          data_sharing: false,
          analytics_tracking: true,
          third_party_integrations: false,
          data_export_notifications: true
        },
        security_settings: user.user_metadata?.security_settings || {
          two_factor_enabled: false,
          session_timeout: '24h',
          login_notifications: true,
          suspicious_activity_alerts: true
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
        setTimeout(() => setMessage({ type: '', content: '' }), 3000);
      }
    } catch (error) {
      setMessage({ type: 'error', content: 'An unexpected error occurred.' });
    } finally {
      setLoading(false);
    }
  };

  const accountStats = {
    memberSince: user?.created_at ? new Date(user.created_at).toLocaleDateString() : 'N/A',
    totalAnalyses: 24,
    avgScore: 87,
    lastLogin: new Date().toLocaleDateString(),
    dataProcessed: '2.4 GB',
    sessionsActive: 3
  };

  const tabs = [
    { id: 'profile', label: 'Profile', icon: HiOutlineUser, color: 'blue' },
    { id: 'notifications', label: 'Notifications', icon: MdNotifications, color: 'green' },
    { id: 'privacy', label: 'Privacy', icon: MdPrivacyTip, color: 'purple' },
    { id: 'security', label: 'Security', icon: MdSecurity, color: 'red' }
  ];

  const ToggleSwitch = ({ enabled, onChange, size = 'default' }) => {
    const sizeClasses = size === 'small' ? 'h-5 w-9' : 'h-6 w-11';
    const dotClasses = size === 'small' ? 'h-4 w-4' : 'h-5 w-5';
    const translateClasses = size === 'small' ? 'translate-x-4' : 'translate-x-5';
    
    return (
      <button
        onClick={onChange}
        className={`${sizeClasses} ${enabled ? 'bg-blue-600' : 'bg-gray-200'} relative inline-flex items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}
      >
        <span
          className={`${dotClasses} ${enabled ? translateClasses : 'translate-x-0'} inline-block rounded-full bg-white shadow transform transition-transform`}
        />
      </button>
    );
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-600 rounded-2xl p-8 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative flex items-center justify-between">
          <div className="flex items-center space-x-6">
            <div className="relative">
              <div className="w-24 h-24 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                <span className="text-3xl font-bold">
                  {user?.user_metadata?.full_name?.[0] || user?.email[0].toUpperCase()}
                </span>
              </div>
              <button className="absolute -bottom-2 -right-2 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all transform hover:scale-105">
                <HiOutlineCamera className="w-4 h-4 text-gray-600" />
              </button>
            </div>
            <div>
              <h1 className="text-3xl font-bold mb-2">
                {user?.user_metadata?.full_name || 'User Profile'}
              </h1>
              <p className="text-blue-100 mb-1">{user?.email}</p>
              {user?.user_metadata?.company && (
                <p className="text-blue-200 text-sm flex items-center">
                  <MdBadge className="w-4 h-4 mr-1" />
                  {user.user_metadata.company}
                </p>
              )}
            </div>
          </div>
          
          <div className="text-right">
            <div className="flex items-center space-x-2 mb-2">
              <MdVerified className="w-5 h-5 text-green-300" />
              <span className="text-sm">Verified Account</span>
            </div>
            <div className="text-2xl font-bold">{accountStats.avgScore}%</div>
            <div className="text-blue-200 text-sm">Avg. Compliance Score</div>
          </div>
        </div>
      </div>

      {/* Message Display */}
      {message.content && (
        <div className={`p-4 rounded-xl border-l-4 ${
          message.type === 'success' 
            ? 'bg-green-50 text-green-800 border-green-500' 
            : 'bg-red-50 text-red-800 border-red-500'
        }`}>
          <div className="flex items-center">
            {message.type === 'success' ? (
              <HiOutlineCheck className="w-5 h-5 mr-2" />
            ) : (
              <HiOutlineExclamation className="w-5 h-5 mr-2" />
            )}
            {message.content}
          </div>
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
        {Object.entries(accountStats).map(([key, value], index) => (
          <div key={key} className="bg-white rounded-xl p-4 border border-gray-200 text-center hover:shadow-md transition-all">
            <div className="text-lg font-bold text-gray-900">{value}</div>
            <div className="text-xs text-gray-600 capitalize">
              {key.replace(/([A-Z])/g, ' $1').trim()}
            </div>
          </div>
        ))}
      </div>

      {/* Tab Navigation */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-0">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-3 px-6 py-4 font-medium text-sm transition-all duration-200 relative ${
                  activeTab === tab.id
                    ? `text-${tab.color}-600 bg-${tab.color}-50`
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                }`}
              >
                <tab.icon className="w-5 h-5" />
                <span>{tab.label}</span>
                {activeTab === tab.id && (
                  <div className={`absolute bottom-0 left-0 right-0 h-0.5 bg-${tab.color}-600`}></div>
                )}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-8">
          {/* Profile Tab */}
          {activeTab === 'profile' && (
            <div className="space-y-8">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-gray-900">Profile Information</h3>
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className={`inline-flex items-center px-4 py-2 rounded-xl font-medium transition-all ${
                    isEditing
                      ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                  }`}
                >
                  {isEditing ? (
                    <>
                      <HiOutlineX className="w-4 h-4 mr-2" />
                      Cancel
                    </>
                  ) : (
                    <>
                      <HiOutlinePencil className="w-4 h-4 mr-2" />
                      Edit Profile
                    </>
                  )}
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Personal Information */}
                <div className="space-y-4">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">Personal Information</h4>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={profileData.full_name}
                        onChange={(e) => setProfileData({...profileData, full_name: e.target.value})}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
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
                    <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                    {isEditing ? (
                      <input
                        type="tel"
                        value={profileData.phone}
                        onChange={(e) => setProfileData({...profileData, phone: e.target.value})}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                      />
                    ) : (
                      <div className="px-4 py-3 bg-gray-50 rounded-xl text-gray-900">
                        {profileData.phone || 'Not set'}
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Bio</label>
                    {isEditing ? (
                      <textarea
                        value={profileData.bio}
                        onChange={(e) => setProfileData({...profileData, bio: e.target.value})}
                        rows={3}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                        placeholder="Tell us about yourself..."
                      />
                    ) : (
                      <div className="px-4 py-3 bg-gray-50 rounded-xl text-gray-900 min-h-[80px]">
                        {profileData.bio || 'No bio added'}
                      </div>
                    )}
                  </div>
                </div>

                {/* Professional Information */}
                <div className="space-y-4">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">Professional Information</h4>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Company</label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={profileData.company}
                        onChange={(e) => setProfileData({...profileData, company: e.target.value})}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
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
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                      />
                    ) : (
                      <div className="px-4 py-3 bg-gray-50 rounded-xl text-gray-900">
                        {profileData.role || 'Not set'}
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Website</label>
                    {isEditing ? (
                      <input
                        type="url"
                        value={profileData.website}
                        onChange={(e) => setProfileData({...profileData, website: e.target.value})}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                        placeholder="https://"
                      />
                    ) : (
                      <div className="px-4 py-3 bg-gray-50 rounded-xl text-gray-900">
                        {profileData.website ? (
                          <a href={profileData.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                            {profileData.website}
                          </a>
                        ) : (
                          'Not set'
                        )}
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={profileData.location}
                        onChange={(e) => setProfileData({...profileData, location: e.target.value})}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                        placeholder="City, Country"
                      />
                    ) : (
                      <div className="px-4 py-3 bg-gray-50 rounded-xl text-gray-900">
                        {profileData.location || 'Not set'}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {isEditing && (
                <div className="flex space-x-4 pt-6 border-t border-gray-200">
                  <button
                    onClick={handleSave}
                    disabled={loading}
                    className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 disabled:opacity-50 flex items-center"
                  >
                    {loading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Saving...
                      </>
                    ) : (
                      <>
                        <HiOutlineCheck className="w-5 h-5 mr-2" />
                        Save Changes
                      </>
                    )}
                  </button>
                  <button
                    onClick={() => setIsEditing(false)}
                    className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Notifications Tab */}
          {activeTab === 'notifications' && (
            <div className="space-y-6">
              <h3 className="text-xl font-bold text-gray-900">Notification Preferences</h3>
              
              <div className="space-y-6">
                {Object.entries(profileData.notification_preferences).map(([key, value]) => (
                  <div key={key} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                    <div>
                      <h4 className="font-medium text-gray-900">
                        {key.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                      </h4>
                      <p className="text-sm text-gray-600 mt-1">
                        {key === 'email_updates' && 'Receive email updates about new features and improvements'}
                        {key === 'analysis_alerts' && 'Get notified when analysis is complete'}
                        {key === 'weekly_reports' && 'Receive weekly compliance reports'}
                        {key === 'security_alerts' && 'Important security and account alerts'}
                        {key === 'marketing_emails' && 'Product updates and promotional content'}
                        {key === 'mobile_notifications' && 'Push notifications on mobile devices'}
                      </p>
                    </div>
                    <ToggleSwitch
                      enabled={value}
                      onChange={() => setProfileData({
                        ...profileData,
                        notification_preferences: {
                          ...profileData.notification_preferences,
                          [key]: !value
                        }
                      })}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Privacy Tab */}
          {activeTab === 'privacy' && (
            <div className="space-y-6">
              <h3 className="text-xl font-bold text-gray-900">Privacy Settings</h3>
              
              <div className="space-y-6">
                <div className="p-4 bg-gray-50 rounded-xl">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-gray-900">Profile Visibility</h4>
                      <p className="text-sm text-gray-600 mt-1">Control who can see your profile information</p>
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
                </div>

                {Object.entries(profileData.privacy_settings).filter(([key]) => key !== 'profile_visibility').map(([key, value]) => (
                  <div key={key} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                    <div>
                      <h4 className="font-medium text-gray-900">
                        {key.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                      </h4>
                      <p className="text-sm text-gray-600 mt-1">
                        {key === 'data_sharing' && 'Allow anonymized data to improve our services'}
                        {key === 'analytics_tracking' && 'Help us understand how you use our platform'}
                        {key === 'third_party_integrations' && 'Enable integrations with third-party services'}
                        {key === 'data_export_notifications' && 'Notify when your data is exported'}
                      </p>
                    </div>
                    <ToggleSwitch
                      enabled={value}
                      onChange={() => setProfileData({
                        ...profileData,
                        privacy_settings: {
                          ...profileData.privacy_settings,
                          [key]: !value
                        }
                      })}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Security Tab */}
          {activeTab === 'security' && (
            <div className="space-y-6">
              <h3 className="text-xl font-bold text-gray-900">Security Settings</h3>
              
              <div className="space-y-6">
                <div className="p-6 bg-gradient-to-r from-red-50 to-orange-50 rounded-xl border border-red-200">
                  <div className="flex items-center space-x-3 mb-4">
                    <MdSecurity className="w-6 h-6 text-red-600" />
                    <h4 className="font-semibold text-red-900">Two-Factor Authentication</h4>
                  </div>
                  <p className="text-red-800 text-sm mb-4">
                    Add an extra layer of security to your account with two-factor authentication.
                  </p>
                  <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium">
                    {profileData.security_settings.two_factor_enabled ? 'Disable 2FA' : 'Enable 2FA'}
                  </button>
                </div>

                {Object.entries(profileData.security_settings).filter(([key]) => key !== 'two_factor_enabled').map(([key, value]) => (
                  <div key={key} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                    <div>
                      <h4 className="font-medium text-gray-900">
                        {key.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                      </h4>
                      <p className="text-sm text-gray-600 mt-1">
                        {key === 'session_timeout' && 'Automatically log out after inactivity'}
                        {key === 'login_notifications' && 'Get notified of new login attempts'}
                        {key === 'suspicious_activity_alerts' && 'Alert on suspicious account activity'}
                      </p>
                    </div>
                    {key === 'session_timeout' ? (
                      <select
                        value={value}
                        onChange={(e) => setProfileData({
                          ...profileData,
                          security_settings: {
                            ...profileData.security_settings,
                            [key]: e.target.value
                          }
                        })}
                        className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
                      >
                        <option value="1h">1 Hour</option>
                        <option value="8h">8 Hours</option>
                        <option value="24h">24 Hours</option>
                        <option value="never">Never</option>
                      </select>
                    ) : (
                      <ToggleSwitch
                        enabled={value}
                        onChange={() => setProfileData({
                          ...profileData,
                          security_settings: {
                            ...profileData.security_settings,
                            [key]: !value
                          }
                        })}
                      />
                    )}
                  </div>
                ))}
              </div>

              {/* Account Actions */}
              <div className="space-y-4 pt-6 border-t border-gray-200">
                <h4 className="font-semibold text-gray-900">Account Actions</h4>
                
                <button className="w-full flex items-center justify-between p-4 bg-blue-50 text-blue-700 rounded-xl hover:bg-blue-100 transition-colors">
                  <div className="flex items-center">
                    <HiOutlineDownload className="w-5 h-5 mr-3" />
                    <div className="text-left">
                      <div className="font-medium">Download My Data</div>
                      <div className="text-sm text-blue-600">Get a copy of all your analysis data</div>
                    </div>
                  </div>
                  <span className="text-blue-500">→</span>
                </button>

                <button className="w-full flex items-center justify-between p-4 bg-yellow-50 text-yellow-700 rounded-xl hover:bg-yellow-100 transition-colors">
                  <div className="flex items-center">
                    <HiOutlineKey className="w-5 h-5 mr-3" />
                    <div className="text-left">
                      <div className="font-medium">Change Password</div>
                      <div className="text-sm text-yellow-600">Update your account password</div>
                    </div>
                  </div>
                  <span className="text-yellow-500">→</span>
                </button>

                <button className="w-full flex items-center justify-between p-4 bg-red-50 text-red-700 rounded-xl hover:bg-red-100 transition-colors">
                  <div className="flex items-center">
                    <HiOutlineTrash className="w-5 h-5 mr-3" />
                    <div className="text-left">
                      <div className="font-medium">Delete Account</div>
                      <div className="text-sm text-red-600">Permanently delete your account and all data</div>
                    </div>
                  </div>
                  <span className="text-red-500">→</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ModernDashboardProfile;
