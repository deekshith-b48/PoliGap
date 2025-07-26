/**
 * Utility functions for authentication and authorization
 */

/**
 * Check if user has admin privileges
 * @param {Object} user - User object from Supabase auth
 * @returns {boolean} - True if user is admin
 */
export const isAdmin = (user) => {
  if (!user) return false;
  
  // Check if user email is the admin email or has admin role in metadata
  return user.email === 'bdeekshith412@gmail.com' || user.user_metadata?.role === 'admin';
};

/**
 * Get user role
 * @param {Object} user - User object from Supabase auth
 * @returns {string} - User role ('admin' or 'user')
 */
export const getUserRole = (user) => {
  return isAdmin(user) ? 'admin' : 'user';
};

/**
 * Check if user can access admin features
 * @param {Object} user - User object from Supabase auth
 * @returns {boolean} - True if user can access admin features
 */
export const canAccessAdmin = (user) => {
  return isAdmin(user);
};

/**
 * Get user display name
 * @param {Object} user - User object from Supabase auth
 * @returns {string} - User display name
 */
export const getUserDisplayName = (user) => {
  if (!user) return 'Unknown User';
  
  return user.user_metadata?.full_name || 
         user.email?.split('@')[0] || 
         'User';
};

/**
 * Get user initials for avatar
 * @param {Object} user - User object from Supabase auth
 * @returns {string} - User initials
 */
export const getUserInitials = (user) => {
  if (!user) return 'U';
  
  if (user.user_metadata?.full_name) {
    return user.user_metadata.full_name
      .split(' ')
      .map(name => name[0])
      .join('')
      .substring(0, 2)
      .toUpperCase();
  }
  
  return user.email[0].toUpperCase();
};
