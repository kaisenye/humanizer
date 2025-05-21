# Humanizer

Humanizer is an AI-powered text transformation tool that helps users enhance their writing by making it sound more human and natural. It offers various customization options for tone, style, and length to fit different communication needs.

## Features

- **Text Humanization**: Transform AI-generated or formal text into more natural, human-like writing
- **Multiple Humanization Modes**: Choose from standard, casual, academic, or creative modes
- **Customizable Settings**:
  - Adjust humanization strength
  - Select personality (neutral, friendly, professional, casual)
  - Control output length (maintain, shorter, longer)
- **Project Management**: Save, edit, and manage your humanized text projects
- **User Accounts**: Personal dashboard with subscription tiers and usage tracking

## Tech Stack

- **Frontend**: React, TypeScript, Tailwind CSS, Framer Motion
- **Backend**: Supabase (Authentication, Database, Storage)
- **API**: Custom AI integration for text humanization
- **State Management**: Zustand
- **Routing**: React Router

## Getting Started

### Prerequisites

- Node.js (v16 or later)
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/humanizer.git
   cd humanizer
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn
   ```

3. Create a `.env.local` file in the root directory with the following variables:
   ```
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   VITE_APP_HUMANIZER_API_KEY=your_api_key
   ```

4. Start the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

### Database Setup

The application uses Supabase as its backend. You'll need to set up the following tables:

1. **Profiles**: Stores user information and subscription details
2. **Projects**: Stores user's humanization projects

Migration files for these tables are available in the `supabase/migrations` directory.

## Usage

1. **Create an account** or log in to your existing account
2. **Create a new project** from the dashboard
3. **Input your text** that needs humanization
4. **Configure settings** based on your preferences:
   - Select the humanization mode
   - Adjust the humanization strength
   - Choose personality type
   - Set length preference
5. **Generate** the humanized text
6. **Save** your project to access it later

## Subscription Tiers

- **Free**: Limited number of credits for basic usage
- **Basic**: More credits with standard features
- **Premium**: Increased credits with all features
- **Enterprise**: Custom solutions for business needs

## Development

### Available Scripts

- `npm run dev`: Start the development server
- `npm run build`: Build the application for production
- `npm run lint`: Run ESLint to check for code issues
- `npm run preview`: Preview the production build locally

### Project Structure

```
humanizer/
├── public/            # Static assets
├── src/
│   ├── components/    # Reusable UI components
│   ├── lib/           # Utility functions and helpers
│   ├── pages/         # Page components
│   ├── services/      # API and service integrations
│   ├── store/         # Zustand state management
│   ├── types/         # TypeScript type definitions
│   ├── App.tsx        # Main application component
│   └── main.tsx       # Application entry point
├── supabase/
│   └── migrations/    # Database migration files
└── ...configuration files
```