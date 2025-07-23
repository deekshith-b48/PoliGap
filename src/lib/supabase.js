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
    onAuthStateChange: (callback) => ({
      data: { subscription: { unsubscribe: () => {} } }
    }),
    signInWithOAuth: async (config) => ({
      data: null,
      error: new Error('Supabase not configured. Please add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to your environment variables.')
    }),
    signInWithPassword: async (credentials) => ({
      data: null,
      error: new Error('Supabase not configured. Email authentication disabled.')
    }),
    signUp: async (credentials) => ({
      data: null,
      error: new Error('Supabase not configured. Email registration disabled.')
    }),
    resetPasswordForEmail: async (email, options) => ({
      data: null,
      error: new Error('Supabase not configured. Password reset disabled.')
    }),
    signOut: async () => ({
      error: null
    }),
    getUser: async () => ({
      data: { user: null },
      error: null
    })
  },
  storage: {
    from: () => ({
      upload: async () => ({
        data: { path: 'mock/path' },
        error: null
      }),
      getPublicUrl: () => ({
        data: { publicUrl: 'mock-url' }
      })
    })
  },
  from: (table) => ({
    select: () => ({
      eq: () => ({
        single: async () => ({
          data: null,
          error: { code: 'PGRST116', message: 'Mock: No rows returned' }
        }),
        limit: () => ({
          then: async (callback) => callback({ data: [], error: null })
        })
      }),
      order: () => ({
        limit: () => ({
          then: async (callback) => callback({ data: [], error: null })
        })
      }),
      then: async (callback) => callback({ data: [], error: null })
    }),
    insert: () => ({
      select: () => ({
        single: async () => ({
          data: null,
          error: new Error('Supabase not configured. Database operations disabled.')
        })
      }),
      then: async (callback) => callback({
        data: null,
        error: new Error('Supabase not configured. Database operations disabled.')
      })
    }),
    update: () => ({
      eq: () => ({
        select: () => ({
          single: async () => ({
            data: null,
            error: new Error('Supabase not configured. Database operations disabled.')
          })
        })
      })
    }),
    delete: () => ({
      eq: async () => ({
        data: null,
        error: new Error('Supabase not configured. Database operations disabled.')
      })
    })
  }),
  channel: () => ({
    on: () => ({
      subscribe: () => ({ unsubscribe: () => {} })
    })
  }),
  rpc: async () => ({
    data: false,
    error: new Error('Supabase not configured. RPC calls disabled.')
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
