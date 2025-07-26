import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

console.log('Supabase URL:', supabaseUrl ? 'configured' : 'not configured');
console.log('Supabase Key:', supabaseAnonKey ? 'configured' : 'not configured');

// Create a mock client if Supabase is not configured
const createMockSupabaseClient = () => ({
  auth: {
    getSession: async () => ({
      data: { session: null },
      error: null
    }),
    onAuthStateChange: (callback) => {
      // Mock subscription object
      return {
        data: {
          subscription: {
            unsubscribe: () => {}
          }
        }
      };
    },
    signUp: async (credentials) => ({
      data: { user: null, session: null },
      error: new Error('Supabase not configured. Please add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to your environment variables.')
    }),
    signInWithPassword: async (credentials) => ({
      data: { user: null, session: null },
      error: new Error('Supabase not configured. Please add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to your environment variables.')
    }),
    signInWithOAuth: async (options) => ({
      data: null,
      error: new Error('Supabase not configured. Please add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to your environment variables.')
    }),
    signOut: async () => ({
      error: null
    }),
    resetPasswordForEmail: async (email, options) => ({
      data: null,
      error: new Error('Supabase not configured. Please add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to your environment variables.')
    }),
    updateUser: async (updates) => ({
      data: { user: null },
      error: new Error('Supabase not configured. Please add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to your environment variables.')
    })
  },
  storage: {
    from: () => ({
      upload: async () => ({
        data: { path: 'mock/path' },
        error: null
      })
    })
  },
  from: () => ({
    insert: async () => ({
      data: null,
      error: null
    })
  })
});

let supabase;

try {
  supabase = (supabaseUrl && supabaseAnonKey) 
    ? createClient(supabaseUrl, supabaseAnonKey, {
        auth: {
          persistSession: true,
        },
      })
    : createMockSupabaseClient();
} catch (error) {
  console.error('Failed to create Supabase client:', error);
  supabase = createMockSupabaseClient();
}

export { supabase };
