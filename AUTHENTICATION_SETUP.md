# 🔐 Authentication System Setup Guide

Welcome to your new authentication system! This guide will help you set up Google OAuth authentication with Supabase for your POLIGAP application.

## ✅ What's Been Implemented

Your application now includes a **complete modern authentication system** with:

- **Google-only OAuth authentication** (secure, no passwords needed)
- **User profile management** with detailed profiles
- **Admin dashboard** with user management capabilities
- **Row-Level Security (RLS)** policies for data protection
- **Real-time subscriptions** for live updates
- **Protected routes** and authentication-aware navigation

## 🚀 Quick Setup Steps

### 1. Set Up Google OAuth in Google Cloud Console

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Navigate to **APIs & Services > Credentials**
4. Click **Create Credentials > OAuth Client ID**
5. Select **Web Application** as the type
6. Add your **Authorized JavaScript Origins**:
   - Development: `http://localhost:5173` (or your dev port)
   - Production: `https://yourdomain.com`
7. Add **Authorized Redirect URIs**:
   - Development: `http://localhost:5173/auth/callback`
   - Production: `https://yourdomain.com/auth/callback`
8. Copy the **Client ID** and **Client Secret**

### 2. Configure Supabase Project

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Create a new project or select your existing one
3. Navigate to **Authentication > Providers**
4. Enable **Google OAuth**
5. Paste your Google **Client ID** and **Client Secret**
6. Set the **Redirect URL**: `https://your-project.supabase.co/auth/v1/callback`

### 3. Set Up Database Tables & RLS

1. Open the **SQL Editor** in your Supabase dashboard
2. Copy and run the entire contents of `src/lib/database-setup.sql`
3. This will create:
   - `profiles` table for user data
   - `user_activities` table for activity tracking
   - `policy_analyses` table for analysis results
   - `document_uploads` table for file management
   - All necessary RLS policies
   - Triggers for automatic profile creation

### 4. Configure Environment Variables

Update your `.env` file (create if it doesn't exist):

```env
# Supabase Configuration
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key

# Optional: Gemini API Key (already configured)
VITE_GEMINI_API_KEY=your-gemini-api-key
```

### 5. Create Your First Admin User

1. Sign in to your application using Google OAuth
2. Go to your Supabase dashboard > **Table Editor > profiles**
3. Find your user record and update the `role` field from `user` to `admin`
4. You now have admin access!

## 🎯 Key Features

### User Features
- **Google Sign-In**: One-click authentication
- **User Dashboard**: Activity tracking and quick actions
- **Profile Management**: Complete profile editing
- **Secure Sessions**: Automatic session management

### Admin Features
- **Admin Dashboard**: User management and system overview
- **User Role Management**: Promote users to admin
- **System Analytics**: Track platform usage
- **Security Controls**: Monitor compliance activities

### Security Features
- **Row-Level Security (RLS)**: Users only see their own data
- **OAuth 2.0**: Industry-standard authentication
- **GDPR Compliant**: Privacy-first data handling
- **Session Management**: Secure token handling

## 🧩 Application Structure

```
src/
├── contexts/
│   └── AuthContext.jsx          # Authentication state management
├── components/
│   ├── auth/
│   │   ├── AuthModal.jsx        # Sign-in modal
│   │   ├── GoogleSignIn.jsx     # Google sign-in button
│   │   └── AuthCallback.jsx     # OAuth callback handler
│   ├── dashboard/
│   │   └── UserDashboard.jsx    # User dashboard
│   ├── admin/
│   │   └── AdminDashboard.jsx   # Admin panel
│   ├── profile/
│   │   └── UserProfile.jsx      # Profile management
│   └── Navigation.jsx           # Auth-aware navigation
├── lib/
│   ├── supabase.js              # Supabase client
│   ├── supabaseHelpers.js       # Database helpers
│   └── database-setup.sql       # Database schema & RLS
└── hooks/
    └── useAuth.js               # Authentication hook
```

## 🔄 Navigation Routes

Your application now supports these routes:

- `/` - Landing page
- `/dashboard` - User dashboard (authenticated users)
- `/profile` - User profile management (authenticated users)
- `/admin` - Admin panel (admin users only)
- `/auth/callback` - OAuth callback handler
- `/analyzer` - Policy analyzer (public)
- `/generator` - Policy generator (public)
- `/compliances` - Compliance information (public)
- `/assessment` - Risk assessment (public)

## 🛡️ Security Best Practices

✅ **Row-Level Security**: Enabled on all tables
✅ **OAuth 2.0**: Secure Google authentication
✅ **Environment Variables**: Sensitive data protection
✅ **HTTPS Only**: Production redirects (configure in Supabase)
✅ **Session Management**: Automatic token refresh
✅ **Admin Controls**: Role-based access control

## 🔧 Testing Your Setup

1. **Start your development server**: `npm run dev`
2. **Visit your application**: Usually `http://localhost:5173`
3. **Click "Sign In"** in the navigation
4. **Sign in with Google** - you should be redirected back to the app
5. **Check your profile** - navigate to the profile page
6. **Test admin features** - make yourself admin and check the admin panel

## 🐛 Troubleshooting

### Common Issues:

**"Invalid redirect URI"**
- Check your Google Cloud Console redirect URIs match exactly
- Ensure no trailing slashes in URLs

**"User not found in profiles table"**
- Check if the trigger is working in Supabase
- Manually run the `handle_new_user()` function if needed

**"RLS policy error"**
- Verify all RLS policies are created
- Check user roles in the profiles table

**Authentication not persisting**
- Check your environment variables
- Verify Supabase URL and keys are correct

## 📚 Next Steps

1. **Customize User Profiles**: Add more fields to the profiles table
2. **Extend Admin Features**: Add more management capabilities
3. **Integrate with Existing Features**: Connect user data to policy analysis
4. **Add Email Notifications**: Set up transactional emails
5. **Implement Analytics**: Track user behavior and engagement

## 🤝 Support

If you encounter any issues:

1. Check the browser console for error messages
2. Review the Supabase logs in your dashboard
3. Verify your Google Cloud Console settings
4. Ensure all environment variables are set correctly

Your authentication system is now ready to use! 🎉
