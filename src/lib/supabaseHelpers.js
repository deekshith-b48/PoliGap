import { supabase } from './supabase';

/**
 * User Profile Management
 */
export const getUserProfile = async (userId) => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error && error.code !== 'PGRST116') {
      throw error;
    }

    return { data, error: null };
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return { data: null, error };
  }
};

export const updateUserProfile = async (userId, updates) => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq('id', userId)
      .select()
      .single();

    if (error) {
      throw error;
    }

    return { data, error: null };
  } catch (error) {
    console.error('Error updating user profile:', error);
    return { data: null, error };
  }
};

export const createUserProfile = async (userId, profileData) => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .insert({
        id: userId,
        ...profileData,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) {
      throw error;
    }

    return { data, error: null };
  } catch (error) {
    console.error('Error creating user profile:', error);
    return { data: null, error };
  }
};

/**
 * User Activity Tracking
 */
export const logUserActivity = async (userId, activityType, description, metadata = {}) => {
  try {
    const { data, error } = await supabase
      .from('user_activities')
      .insert({
        user_id: userId,
        activity_type: activityType,
        description,
        metadata,
        created_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) {
      throw error;
    }

    return { data, error: null };
  } catch (error) {
    console.error('Error logging user activity:', error);
    return { data: null, error };
  }
};

export const getUserActivities = async (userId, limit = 10) => {
  try {
    const { data, error } = await supabase
      .from('user_activities')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) {
      throw error;
    }

    return { data, error: null };
  } catch (error) {
    console.error('Error fetching user activities:', error);
    return { data: null, error };
  }
};

/**
 * Policy Analysis Management
 */
export const savePolicyAnalysis = async (userId, analysisData) => {
  try {
    const { data, error } = await supabase
      .from('policy_analyses')
      .insert({
        user_id: userId,
        ...analysisData,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) {
      throw error;
    }

    return { data, error: null };
  } catch (error) {
    console.error('Error saving policy analysis:', error);
    return { data: null, error };
  }
};

export const getUserPolicyAnalyses = async (userId, limit = 20) => {
  try {
    const { data, error } = await supabase
      .from('policy_analyses')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) {
      throw error;
    }

    return { data, error: null };
  } catch (error) {
    console.error('Error fetching user policy analyses:', error);
    return { data: null, error };
  }
};

/**
 * Document Upload Management
 */
export const saveDocumentUpload = async (userId, documentData) => {
  try {
    const { data, error } = await supabase
      .from('document_uploads')
      .insert({
        user_id: userId,
        ...documentData,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) {
      throw error;
    }

    return { data, error: null };
  } catch (error) {
    console.error('Error saving document upload:', error);
    return { data: null, error };
  }
};

export const updateDocumentStatus = async (documentId, status, processedContent = null) => {
  try {
    const updateData = {
      processing_status: status,
      updated_at: new Date().toISOString(),
    };

    if (processedContent) {
      updateData.processed_content = processedContent;
    }

    const { data, error } = await supabase
      .from('document_uploads')
      .update(updateData)
      .eq('id', documentId)
      .select()
      .single();

    if (error) {
      throw error;
    }

    return { data, error: null };
  } catch (error) {
    console.error('Error updating document status:', error);
    return { data: null, error };
  }
};

export const getUserDocuments = async (userId, limit = 20) => {
  try {
    const { data, error } = await supabase
      .from('document_uploads')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) {
      throw error;
    }

    return { data, error: null };
  } catch (error) {
    console.error('Error fetching user documents:', error);
    return { data: null, error };
  }
};

/**
 * Admin Functions
 */
export const getAllUsers = async (limit = 50) => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) {
      throw error;
    }

    return { data, error: null };
  } catch (error) {
    console.error('Error fetching all users:', error);
    return { data: null, error };
  }
};

export const updateUserRole = async (userId, newRole) => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .update({
        role: newRole,
        updated_at: new Date().toISOString(),
      })
      .eq('id', userId)
      .select()
      .single();

    if (error) {
      throw error;
    }

    return { data, error: null };
  } catch (error) {
    console.error('Error updating user role:', error);
    return { data: null, error };
  }
};

export const getAdminStats = async () => {
  try {
    const { data, error } = await supabase
      .from('admin_stats')
      .select('*')
      .single();

    if (error) {
      throw error;
    }

    return { data, error: null };
  } catch (error) {
    console.error('Error fetching admin stats:', error);
    return { data: null, error };
  }
};

export const getAllActivities = async (limit = 50) => {
  try {
    const { data, error } = await supabase
      .from('user_activities')
      .select(`
        *,
        profiles!user_activities_user_id_fkey (
          email,
          full_name
        )
      `)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) {
      throw error;
    }

    return { data, error: null };
  } catch (error) {
    console.error('Error fetching all activities:', error);
    return { data: null, error };
  }
};

/**
 * Utility Functions
 */
export const isUserAdmin = async (userId) => {
  try {
    const { data, error } = await supabase
      .rpc('is_admin', { user_uuid: userId });

    if (error) {
      throw error;
    }

    return { data, error: null };
  } catch (error) {
    console.error('Error checking admin status:', error);
    return { data: false, error };
  }
};

export const uploadFile = async (bucket, filePath, file) => {
  try {
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false,
      });

    if (error) {
      throw error;
    }

    return { data, error: null };
  } catch (error) {
    console.error('Error uploading file:', error);
    return { data: null, error };
  }
};

export const getFileUrl = async (bucket, filePath) => {
  try {
    const { data } = supabase.storage
      .from(bucket)
      .getPublicUrl(filePath);

    return { data, error: null };
  } catch (error) {
    console.error('Error getting file URL:', error);
    return { data: null, error };
  }
};

/**
 * Real-time Subscriptions
 */
export const subscribeToUserActivities = (userId, callback) => {
  return supabase
    .channel('user-activities')
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'user_activities',
        filter: `user_id=eq.${userId}`,
      },
      callback
    )
    .subscribe();
};

export const subscribeToAllActivities = (callback) => {
  return supabase
    .channel('all-activities')
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'user_activities',
      },
      callback
    )
    .subscribe();
};

export const subscribeToProfileChanges = (userId, callback) => {
  return supabase
    .channel('profile-changes')
    .on(
      'postgres_changes',
      {
        event: 'UPDATE',
        schema: 'public',
        table: 'profiles',
        filter: `id=eq.${userId}`,
      },
      callback
    )
    .subscribe();
};
