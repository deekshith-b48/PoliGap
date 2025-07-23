# 🔐 Authentication System Setup Guide

Welcome to your authentication system setup for POLIGAP! This guide walks you through integrating Google OAuth with Supabase.

## ✅ What's Already Implemented

Your application now includes a complete, secure, and modern authentication stack with:

- 🔐 **Google OAuth** — one-click secure sign-in
- 📧 **Email Authentication** — traditional email/password with password reset
- 👤 **User profile management**
- 🛠️ **Admin dashboard** for user control
- 🔒 **Row-Level Security (RLS)** for data protection
- 📡 **Real-time subscriptions**
- 🚫 **Protected routes** and authentication-aware navigation

## ⚡ Quick Setup Instructions

### 1. Configure Google OAuth

Go to [Google Cloud Console](https://console.cloud.google.com/)

- Create or select a project.
- Navigate to: **APIs & Services > Credentials**
- Click **Create Credentials > OAuth Client ID**
- Select **Web Application** as the type.
- Set **Authorized JavaScript Origins**:
  - Development: `http://localhost:5173`
  - Production: `https://yourdomain.com`
- Set **Authorized Redirect URIs**:
  - Dev: `http://localhost:5173/auth/callback`
  - Prod: `https://yourdomain.com/auth/callback`
- Copy the **Client ID** and **Client Secret**.

### 2. Configure Supabase Authentication

Go to [Supabase Dashboard](https://supabase.com/dashboard)

- Open your project or create one.
- Go to **Authentication > Providers**
- **Email** is enabled by default ✅
- Enable **Google** for OAuth:
  - Paste the **Client ID** and **Client Secret**
  - Set **Redirect URL**: `https://your-project.supabase.co/auth/v1/callback`

### 3. Set Up Database & RLS

- Open the **SQL Editor** in Supabase
- Run `src/lib/database-setup.sql`
- This creates:
  - `profiles`, `user_activities`, `policy_analyses`, `document_uploads`
  - Required RLS policies
  - Triggers for automatic profile creation

### 4. Configure Environment Variables

Create or update your `.env`:

```env
# Supabase
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key

# Optional: Gemini API
VITE_GEMINI_API_KEY=your-gemini-api-key
```

### 5. Set Admin Role

- Sign in via Google OAuth
- Go to **Table Editor > profiles**
- Change your user's `role` from `user` to `admin`

## 🎯 Key Features

### User
- 🔐 **Google Sign-In** — quick OAuth authentication
- 📧 **Email Sign-In/Sign-Up** — traditional authentication with password reset
- 📊 **Dashboard** with activity tracking
- ✏️ **Profile editing**
- 🔄 **Session persistence**

### Admin
- 📋 **Admin dashboard**
- 🚀 **Promote users** to admin
- 📈 **System usage** analytics
- 🛡️ **Security monitoring**

### Security
- 🔒 **RLS** on all tables
- ✅ **OAuth 2.0** compliance
- 🌐 **GDPR-ready**
- 🔁 **Secure token/session** handling

## 🧭 Application Structure

```
src/
├── contexts/
│   └── AuthContext.jsx           # Auth state provider
├── components/
│   ├── auth/
│   │   ├── AuthModal.jsx        # Sign-in modal
│   │   ├── GoogleSignIn.jsx     # Sign-in button
│   │   └── AuthCallback.jsx     # Handles OAuth redirect
│   ├── dashboard/
│   │   └── UserDashboard.jsx    # Regular user dashboard
│   ├── admin/
│   │   └── AdminDashboard.jsx   # Admin panel
│   ├── profile/
│   │   └── UserProfile.jsx      # Profile management
│   └── Navigation.jsx           # Route-aware navigation
├── lib/
│   ├── supabase.js              # Supabase client
│   ├── supabaseHelpers.js       # DB utilities
│   └── database-setup.sql       # SQL schema and RLS
└── hooks/
    └── useAuth.js               # Auth hook
```

## 🌐 Available Routes

| Route | Access | Description |
|-------|--------|-------------|
| `/` | Public | Landing page |
| `/dashboard` | Authenticated users | User dashboard |
| `/profile` | Authenticated users | Profile editor |
| `/admin` | Admins only | Admin control panel |
| `/auth/callback` | Internal | OAuth handler |
| `/auth/reset-password` | Internal | Password reset handler |
| `/analyzer` | Public | Policy analyzer |
| `/generator` | Public | Policy generator |
| `/compliances` | Public | Compliance viewer |
| `/assessment` | Public | Risk assessment |

## 🛡️ Security Best Practices

- ✅ **RLS Enabled** on all tables
- ✅ **OAuth 2.0** Authentication
- ✅ **.env Variables** for sensitive configs
- ✅ **HTTPS Only** for production
- ✅ **Token Refresh** via Supabase
- ✅ **Role-Based Access Control**

## 🧪 Testing the Setup

1. Run your dev server: `npm run dev`
2. Visit: `http://localhost:5173`
3. Click **Sign In** and use Google OAuth
4. Check `/profile` to confirm your data
5. Make yourself admin in Supabase and test `/admin`

## 🐞 Troubleshooting

**"Invalid redirect URI"**
- Make sure redirect URIs match exactly
- No trailing slashes

**"User not found in profiles"**
- Ensure trigger ran correctly
- Run `handle_new_user()` manually if needed

**"RLS policy error"**
- Confirm all policies are created
- Check roles in the profiles table

**Session not persisting**
- Recheck your `.env` variables
- Verify Supabase keys and URL

## 📚 Next Steps

- 🔧 Customize profiles with more fields
- 🧩 Extend admin dashboard
- 🔗 Link user data to analysis features
- 📬 Add transactional email alerts
- 📊 Integrate user analytics

## 🤝 Need Help?

- Check browser console errors
- View Supabase logs
- Reverify Google Cloud setup
- Double-check `.env` values

---

Your authentication system is now ready to use! 🎉
