import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

function ProtectedRoute({ children, requireAdmin = false }) {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        // Redirect to landing page if not authenticated
        navigate('/', { replace: true });
        return;
      }

      if (requireAdmin) {
        const isAdmin = user.email === 'bdeekshith412@gmail.com' || user.user_metadata?.role === 'admin';
        if (!isAdmin) {
          // Redirect to regular dashboard if not admin
          navigate('/dashboard', { replace: true });
          return;
        }
      }
    }
  }, [user, loading, navigate, requireAdmin]);

  // Show loading spinner while checking auth
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Don't render anything if not authenticated (will redirect)
  if (!user) {
    return null;
  }

  // Check admin access if required
  if (requireAdmin) {
    const isAdmin = user.email === 'bdeekshith412@gmail.com' || user.user_metadata?.role === 'admin';
    if (!isAdmin) {
      return null; // Will redirect
    }
  }

  return children;
}

export default ProtectedRoute;
