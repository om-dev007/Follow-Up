# Follow-Up Application

A modern lead capture form built with React, TypeScript, Tailwind CSS, and Supabase.

## Features

- ✅ Lead form with validation using React Hook Form and Zod
- ✅ Supabase integration for data storage
- ✅ Success message with smooth animations
- ✅ Responsive design with Tailwind CSS
- ✅ Dark mode support

## Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Environment Variables

Create a `.env` file in the root directory with your Supabase credentials:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

**To get your Supabase credentials:**
1. Go to [Supabase Dashboard](https://app.supabase.com)
2. Select your project (or create a new one)
3. Go to Settings → API
4. Copy the "Project URL" and "anon/public" key

### 3. Create Supabase Table

Create a table named `leads` in your Supabase database with the following schema:

```sql
CREATE TABLE leads (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  source TEXT NOT NULL CHECK (source IN ('Google', 'Referral', 'Other')),
  interest TEXT,
  note TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### 4. Run the Development Server

```bash
npm run dev
```

The app will be available at `http://localhost:5173`

## Tech Stack

- **React 19** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **React Hook Form** - Form management
- **Zod** - Schema validation
- **Supabase** - Backend and database
