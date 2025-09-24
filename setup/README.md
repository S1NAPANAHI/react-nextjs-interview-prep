# Supabase Setup Instructions

This guide will help you set up the complete React Interview Prep platform with Supabase backend.

## 🚀 Quick Start

### 1. Create Supabase Project

1. Go to [supabase.com](https://supabase.com) and create a free account
2. Click "New Project" and fill in the details:
   - **Name**: `react-interview-prep`
   - **Password**: Choose a secure password
   - **Region**: Select closest to your users

### 2. Configure Your Project

1. Once your project is ready, go to **Settings → API**
2. Copy your project credentials:
   - **Project URL**
   - **Anon (public) key**

### 3. Update Configuration

1. Edit `config/supabase.js` in your repository
2. Replace the placeholder values:
```javascript
const SUPABASE_URL = 'YOUR_SUPABASE_URL'; // Replace with your Project URL
const SUPABASE_ANON_KEY = 'YOUR_SUPABASE_ANON_KEY'; // Replace with your Anon key
```

### 4. Run Database Migrations

In your Supabase dashboard, go to **SQL Editor** and run these migrations in order:

1. **001_initial_schema.sql** - Creates core tables
2. **002_progress_tracking.sql** - Adds progress tracking
3. **003_advanced_features.sql** - Adds advanced features
4. **004_security_and_functions.sql** - Sets up security and functions
5. **005_sample_data.sql** - Populates with sample data

Copy and paste each migration file content into the SQL editor and click "Run".

### 5. Configure Authentication

1. Go to **Authentication → Settings**
2. Enable **Email** provider (enabled by default)
3. Optional: Configure additional providers (Google, GitHub, etc.)
4. Set up email templates if desired

### 6. Deploy Your Application

#### Option 1: GitHub Pages (Static)
1. Go to your repository **Settings → Pages**
2. Select "Deploy from a branch"
3. Choose "main" branch and "/ (root)" folder
4. Your app will be live at: `https://yourusername.github.io/react-nextjs-interview-prep/`

#### Option 2: Vercel (Recommended)
1. Go to [vercel.com](https://vercel.com) and connect your GitHub account
2. Import your repository
3. Deploy with default settings
4. Your app will get a custom domain like `your-app.vercel.app`

#### Option 3: Netlify
1. Go to [netlify.com](https://netlify.com)
2. Drag and drop your repository files or connect via GitHub
3. Deploy with default settings

## 🔧 Advanced Configuration

### Email Templates

Customize authentication emails in **Authentication → Email Templates**:

- **Confirmation email**: Sent when user signs up
- **Magic link email**: For passwordless login
- **Password recovery**: For password resets

### Row Level Security

The migrations automatically set up RLS policies. Users can only access their own data, while content (flashcards, challenges) is publicly readable.

### Realtime Features

Realtime subscriptions are automatically enabled for:
- User progress updates
- Study session tracking
- Performance analytics

### Spaced Repetition Algorithm

The platform implements the SM-2 spaced repetition algorithm:
- Cards are scheduled for review based on difficulty
- Success rate affects next review interval
- Failed cards are reviewed more frequently

## 📊 Features Overview

### 🔑 Authentication
- Email/password signup and login
- Email verification
- Password recovery
- User profiles with progress tracking

### 🎯 Smart Learning
- **Spaced Repetition**: Optimized review scheduling
- **Progress Tracking**: Real-time sync across devices
- **Performance Analytics**: Study insights and metrics
- **Study Sessions**: Time tracking and performance scoring

### 📚 Content Management
- **150+ Flashcards** across 6 categories
- **Coding Challenges** with solutions and test cases
- **Study Checklist** with 4-week roadmap
- **Performance Analytics** for data-driven learning

### 🔄 Real-time Features
- Progress sync across devices
- Live study session tracking
- Real-time performance updates
- Collaborative features (future)

## 🛠️ Development

### Local Development

1. Clone the repository:
```bash
git clone https://github.com/yourusername/react-nextjs-interview-prep.git
cd react-nextjs-interview-prep
```

2. Serve locally:
```bash
# Using Python
python -m http.server 8000

# Using Node.js
npx serve .

# Using PHP
php -S localhost:8000
```

3. Open `http://localhost:8000` in your browser

### Database Management

Use Supabase dashboard for:
- **Table Editor**: View and edit data
- **SQL Editor**: Run custom queries
- **Auth**: Manage users
- **Storage**: File uploads (future feature)
- **Edge Functions**: Custom API endpoints (future feature)

### Backup and Migration

Regularly backup your database:
1. Go to **Settings → Database**
2. Use backup/restore features
3. Export data via SQL Editor if needed

## 🚑 Troubleshooting

### Common Issues

**"Invalid API key" error**:
- Check that you've updated `config/supabase.js` with correct credentials
- Ensure you're using the anon key, not the service_role key

**Authentication not working**:
- Verify email provider is enabled in Authentication settings
- Check browser console for CORS errors
- Ensure your domain is added to allowed origins

**Data not loading**:
- Check that migrations ran successfully
- Verify RLS policies are set correctly
- Check browser network tab for failed requests

**Real-time updates not working**:
- Ensure you're authenticated
- Check subscription setup in browser console
- Verify Realtime is enabled in project settings

### Getting Help

- **Supabase Docs**: [docs.supabase.com](https://docs.supabase.com)
- **Community**: [github.com/supabase/supabase/discussions](https://github.com/supabase/supabase/discussions)
- **Discord**: [discord.supabase.com](https://discord.supabase.com)
- **Project Issues**: [Your repository issues page]

## 🔮 Future Enhancements

- **Mobile App**: React Native version
- **AI Tutoring**: GPT-powered explanations
- **Collaborative Study**: Study groups and sharing
- **Video Content**: Embedded explanations
- **Progress Gamification**: Achievements and streaks
- **Interview Scheduling**: Calendar integration
- **Mock Interviews**: Peer-to-peer practice

---

**Ready to ace your React interviews? Start studying now! 🚀**