import { useState, useEffect } from 'react';
import { useNavigate, useLocation, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import {
  HiOutlineHome,
  HiOutlineChartBar,
  HiOutlineBookOpen,
  HiOutlineCog,
  HiOutlineUser,
  HiOutlineLogout,
  HiOutlineMenu,
  HiOutlinePlus,
  HiOutlineDownload
} from 'react-icons/hi';
import {
  MdDashboard,
  MdAnalytics,
  MdLibraryBooks,
  MdSettings,
  MdPerson,
  MdExitToApp
} from 'react-icons/md';

function DashboardLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, signOut, loading } = useAuth();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  // Check if user is admin
  const isAdmin = user?.email === 'bdeekshith412@gmail.com' || user?.user_metadata?.role === 'admin';

  // Handle responsive sidebar
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (mobile) {
        setSidebarCollapsed(true);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Redirect if not authenticated
  useEffect(() => {
    if (!loading && !user) {
      navigate('/', { replace: true });
    }
  }, [user, loading, navigate]);

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/', { replace: true });
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect in useEffect
  }

  const sidebarItems = [
    {
      id: 'overview',
      label: 'Overview',
      icon: MdDashboard,
      path: '/dashboard',
      description: 'Analysis summary & quick actions',
      color: 'text-blue-600'
    },
    {
      id: 'analytics',
      label: 'Analytics',
      icon: MdAnalytics,
      path: '/dashboard/analytics',
      description: 'Trends & performance metrics',
      color: 'text-green-600'
    },
    {
      id: 'resources',
      label: 'Resources',
      icon: MdLibraryBooks,
      path: '/dashboard/resources',
      description: 'Documentation & guides',
      color: 'text-purple-600'
    },
    ...(isAdmin ? [{
      id: 'admin',
      label: 'Admin Panel',
      icon: MdSettings,
      path: '/dashboard/admin',
      description: 'User management & system settings',
      color: 'text-orange-600'
    }] : []),
    {
      id: 'profile',
      label: 'Profile',
      icon: MdPerson,
      path: '/dashboard/profile',
      description: 'Account settings & preferences',
      color: 'text-gray-600'
    }
  ];

  const isActiveRoute = (path) => {
    if (path === '/dashboard') {
      return location.pathname === '/dashboard';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className={`bg-white border-r border-gray-200 transition-all duration-300 ${
        sidebarCollapsed ? 'w-16' : 'w-64'
      } ${isMobile ? 'fixed z-50 h-full' : 'relative'}`}>
        
        {/* Logo Area */}
        <div className="h-16 flex items-center px-4 border-b border-gray-200 bg-gradient-to-r from-slate-50 to-gray-50">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-600 rounded-2xl flex items-center justify-center shadow-xl transform transition-all duration-300 hover:scale-105">
              <svg className="w-5 h-5 text-white font-bold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            {!sidebarCollapsed && (
              <div>
                <h1 className="text-xl font-black text-gray-900 tracking-tight">POLIGAP</h1>
                <p className="text-xs text-gray-500 font-medium">Professional Dashboard</p>
              </div>
            )}
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="mt-6 px-2">
          <div className="space-y-2">
            {sidebarItems.map((item) => (
              <button
                key={item.id}
                onClick={() => navigate(item.path)}
                className={`w-full flex items-center px-3 py-3 text-left rounded-xl transition-all duration-200 group ${
                  isActiveRoute(item.path)
                    ? 'bg-blue-50 text-blue-700 border border-blue-200'
                    : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                }`}
                title={sidebarCollapsed ? item.label : undefined}
              >
                <item.icon className={`w-5 h-5 mr-3 flex-shrink-0 ${isActiveRoute(item.path) ? item.color : 'text-gray-500'} transition-colors duration-200`} />
                {!sidebarCollapsed && (
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-sm">{item.label}</div>
                    <div className="text-xs text-gray-500 mt-0.5 truncate">{item.description}</div>
                  </div>
                )}
                {!sidebarCollapsed && isActiveRoute(item.path) && (
                  <div className="w-2 h-2 bg-blue-600 rounded-full flex-shrink-0"></div>
                )}
              </button>
            ))}
          </div>
        </nav>

        {/* User Info & Logout */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200">
          {!sidebarCollapsed && (
            <div className="bg-gray-50 rounded-xl p-3 mb-3">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-bold">
                    {user.user_metadata?.full_name?.[0] || user.email[0].toUpperCase()}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-gray-900 truncate">
                    {user.user_metadata?.full_name || 'User'}
                  </div>
                  <div className="text-xs text-gray-500 truncate">{user.email}</div>
                  {isAdmin && (
                    <div className="text-xs text-orange-600 font-medium">Admin</div>
                  )}
                </div>
              </div>
            </div>
          )}
          
          <button
            onClick={handleSignOut}
            className={`w-full flex items-center px-3 py-3 text-red-600 hover:bg-red-50 rounded-xl transition-all duration-200 group hover:shadow-md ${
              sidebarCollapsed ? 'justify-center' : 'justify-start space-x-3'
            }`}
            title={sidebarCollapsed ? 'Sign Out' : undefined}
          >
            <MdExitToApp className="w-5 h-5 group-hover:scale-110 transition-transform" />
            {!sidebarCollapsed && <span className="text-sm font-medium">Sign Out</span>}
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Top Bar */}
        <header className="bg-white/80 backdrop-blur-xl border-b border-gray-200/50 h-16 flex items-center justify-between px-6 shadow-sm">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="p-2.5 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-xl transition-all duration-200 hover:scale-105"
            >
              <HiOutlineMenu className="w-5 h-5" />
            </button>

            <div>
              <h2 className="text-xl font-bold text-gray-900">
                {location.pathname === '/dashboard' && 'Overview'}
                {location.pathname === '/dashboard/analytics' && 'Analytics'}
                {location.pathname === '/dashboard/resources' && 'Resources'}
                {location.pathname === '/dashboard/admin' && 'Admin Panel'}
                {location.pathname === '/dashboard/profile' && 'Profile'}
              </h2>
              <p className="text-sm text-gray-600 font-medium">
                Welcome back, {user.user_metadata?.full_name || 'User'}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            {/* Quick Actions */}
            <button
              onClick={() => navigate('/analyzer')}
              className="inline-flex items-center px-4 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold text-sm hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              <HiOutlinePlus className="w-4 h-4 mr-2" />
              New Analysis
            </button>

            <button className="p-2.5 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-xl transition-all duration-200 hover:scale-105">
              <HiOutlineDownload className="w-5 h-5" />
            </button>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 p-6 overflow-y-auto">
          <Outlet />
        </main>
      </div>

      {/* Mobile Overlay */}
      {isMobile && !sidebarCollapsed && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setSidebarCollapsed(true)}
        />
      )}
    </div>
  );
}

export default DashboardLayout;
