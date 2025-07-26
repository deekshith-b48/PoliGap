import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

const AuthContext = createContext({});

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session with comprehensive error handling
    const initializeAuth = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();

        if (error) {
          // Handle specific refresh token errors
          if (error.message?.includes('refresh_token_not_found') ||
              error.message?.includes('Invalid Refresh Token')) {
            console.warn('Invalid refresh token detected, clearing session');
            await supabase.auth.signOut();
            setUser(null);
          } else {
            console.warn('Auth session error:', error);
            setUser(null);
          }
        } else {
          setUser(session?.user ?? null);
        }
      } catch (error) {
        console.warn('Auth initialization error:', error);
        // Clear any corrupted session
        try {
          await supabase.auth.signOut();
        } catch (signOutError) {
          console.warn('Error clearing session:', signOutError);
        }
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();

    // Listen for auth changes with enhanced error handling
    let subscription;
    try {
      const { data } = supabase.auth.onAuthStateChange(async (event, session) => {
        // Handle token refresh errors
        if (event === 'TOKEN_REFRESHED' && !session) {
          console.warn('Token refresh failed, clearing session');
          setUser(null);
          return;
        }

        // Handle sign out events
        if (event === 'SIGNED_OUT') {
          setUser(null);
          setLoading(false);
          return;
        }

        // Handle sign in events
        if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
          setUser(session?.user ?? null);
          setLoading(false);
          return;
        }

        // Default handling
        setUser(session?.user ?? null);
        setLoading(false);
      });
      subscription = data.subscription;
    } catch (error) {
      console.warn('Auth state change listener error:', error);
      setLoading(false);
    }

    return () => {
      if (subscription?.unsubscribe) {
        subscription.unsubscribe();
      }
    };
  }, []);

  const signUp = async (email, password, userData = {}) => {
    // Add admin role for specific email
    const enhancedUserData = email === 'bdeekshith412@gmail.com'
      ? { ...userData, role: 'admin' }
      : userData;

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: enhancedUserData
      }
    });
    return { data, error };
  };

  const signIn = async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    // Assign admin role for specific email
    if (!error && data.user && email === 'bdeekshith412@gmail.com') {
      try {
        await supabase.auth.updateUser({
          data: {
            role: 'admin',
            ...data.user.user_metadata
          }
        });
      } catch (updateError) {
        console.warn('Failed to update admin role:', updateError);
      }
    }

    return { data, error };
  };

  const clearSession = () => {
    // Clear any stored auth tokens from localStorage
    try {
      const keys = Object.keys(localStorage);
      keys.forEach(key => {
        if (key.startsWith('sb-') || key.includes('supabase')) {
          localStorage.removeItem(key);
        }
      });
    } catch (error) {
      console.warn('Error clearing localStorage:', error);
    }

    setUser(null);
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      clearSession();
      return { error };
    } catch (error) {
      // Even if signOut fails, clear local session
      clearSession();
      return { error };
    }
  };

  const signInWithProvider = async (provider) => {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: window.location.origin
      }
    });
    return { data, error };
  };

  const resetPassword = async (email) => {
    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`
    });
    return { data, error };
  };

  const updateProfile = async (updates) => {
    const { data, error } = await supabase.auth.updateUser({
      data: updates
    });
    return { data, error };
  };

  const value = {
    user,
    loading,
    signUp,
    signIn,
    signOut,
    signInWithProvider,
    resetPassword,
    updateProfile
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
