import { Component } from 'react';

class AuthErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    // Check if it's a Supabase auth error
    if (error?.message?.includes('Invalid Refresh Token') ||
        error?.message?.includes('refresh_token_not_found') ||
        error?.message?.includes('AuthApiError')) {
      
      // Clear any corrupted session data
      try {
        const keys = Object.keys(localStorage);
        keys.forEach(key => {
          if (key.startsWith('sb-') || key.includes('supabase')) {
            localStorage.removeItem(key);
          }
        });
      } catch (storageError) {
        console.warn('Error clearing localStorage:', storageError);
      }
      
      // Reload the page to reset auth state
      window.location.reload();
      return { hasError: true, error };
    }
    
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Auth Error Boundary caught an error:', error, errorInfo);
    
    // Log auth-specific errors
    if (error?.message?.includes('AuthApiError') || 
        error?.message?.includes('Invalid Refresh Token')) {
      console.warn('Authentication error detected, clearing session and reloading');
    }
  }

  render() {
    if (this.state.hasError) {
      // For auth errors, show a simple loading state while page reloads
      if (this.state.error?.message?.includes('AuthApiError') || 
          this.state.error?.message?.includes('Invalid Refresh Token')) {
        return (
          <div className="min-h-screen bg-gray-50 flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Refreshing session...</p>
            </div>
          </div>
        );
      }
      
      // For other errors, show error state
      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center max-w-md mx-auto p-6">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-red-600 text-2xl">⚠️</span>
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Something went wrong</h2>
            <p className="text-gray-600 mb-4">
              An error occurred while loading the application.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
            >
              Refresh Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default AuthErrorBoundary;
