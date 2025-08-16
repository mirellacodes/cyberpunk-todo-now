# 🚀 Cyberpunk Todo Now

A futuristic, cyberpunk-themed todo application built with Next.js, TypeScript, and Tailwind CSS.

## ✨ Features

- 🎨 **Cyberpunk UI**: Neon effects, glow borders, and futuristic design
- 📱 **Responsive Design**: Works perfectly on all devices
- 🎯 **Priority Management**: High, medium, and low priority tasks
- 🔍 **Search & Filter**: Find tasks quickly
- 🎭 **Drag & Drop**: Reorder tasks with intuitive gestures
- 🌙 **Dark Theme**: Easy on the eyes, perfect for night coding
- ⚡ **Real-time Updates**: Instant feedback and smooth animations

## 🛠️ Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4
- **UI Components**: Radix UI + Custom Components
- **State Management**: React Hooks
- **Deployment**: Vercel (optimized)

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- npm, yarn, or pnpm

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/YOUR_USERNAME/cyberpunk-todo-now.git
   cd cyberpunk-todo-now
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Set up environment variables**
   ```bash
   # Copy the example file
   cp env.example .env.local
   
   # Edit .env.local with your values
   nano .env.local
   ```

4. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🔧 Environment Variables

### Required Variables

Create a `.env.local` file in the root directory:

```bash
# App Configuration
NEXT_PUBLIC_APP_NAME="Cyberpunk Todo Now"
NEXT_PUBLIC_APP_VERSION="1.0.0"
NEXT_PUBLIC_APP_URL="http://localhost:3000"

# Feature Flags
NEXT_PUBLIC_ENABLE_ANIMATIONS=true
NEXT_PUBLIC_ENABLE_SOUND_EFFECTS=false
NEXT_PUBLIC_ENABLE_ANALYTICS=false

# Development
NEXT_PUBLIC_DEBUG_MODE=true
```

### Optional Variables (for future features)

```bash
# Database (when you add one)
DATABASE_URL="your_database_connection_string"
SUPABASE_URL="your_supabase_url"
SUPABASE_ANON_KEY="your_supabase_anon_key"

# Authentication
NEXTAUTH_SECRET="your_nextauth_secret"
NEXTAUTH_URL="http://localhost:3000"

# External Services
OPENAI_API_KEY="your_openai_api_key"
STRIPE_SECRET_KEY="your_stripe_secret_key"
```

## 🚀 Deployment

### Deploy to Vercel (Recommended)

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Deploy to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Vercel will auto-detect Next.js and configure everything
   - Your app will be live at `https://your-app.vercel.app`

### Environment Variables on Vercel

1. **Go to your Vercel project dashboard**
2. **Navigate to Settings → Environment Variables**
3. **Add your production environment variables**
4. **Redeploy** to apply changes

## 📁 Project Structure

```
cyberpunk-todo-now/
├── app/                    # Next.js App Router
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Main page
├── components/             # React components
│   ├── ui/                # Reusable UI components
│   ├── header.tsx         # App header
│   ├── todo-input.tsx     # Todo input form
│   ├── todo-item.tsx      # Individual todo item
│   ├── todo-list.tsx      # Todo list container
│   └── sortable-todo-item.tsx # Draggable todo item
├── lib/                    # Utilities
│   ├── config.ts          # Environment configuration
│   └── utils.ts           # Helper functions
├── hooks/                  # Custom React hooks
├── public/                 # Static assets
├── vercel.json            # Vercel configuration
└── package.json           # Dependencies
```

## 🎨 Customization

### Theme Colors

Edit `app/globals.css` to customize the cyberpunk theme:

```css
:root {
  --primary: oklch(0.205 0 0);        /* Main purple */
  --accent: oklch(0.97 0 0);          /* Accent color */
  --background: oklch(1 0 0);          /* Background */
  /* ... more variables */
}
```

### Feature Flags

Control app features via environment variables:

```bash
NEXT_PUBLIC_ENABLE_ANIMATIONS=true     # Enable/disable animations
NEXT_PUBLIC_ENABLE_SOUND_EFFECTS=false # Enable/disable sound
NEXT_PUBLIC_DEBUG_MODE=true           # Show debug info
```

## 🔮 Future Features

- [ ] **Database Integration**: Persistent storage with Supabase/PlanetScale
- [ ] **User Authentication**: Login/signup system
- [ ] **Real-time Sync**: Collaborative todo lists
- [ ] **Mobile App**: React Native version
- [ ] **AI Integration**: Smart task suggestions
- [ ] **Offline Support**: PWA capabilities

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Next.js Team** for the amazing framework
- **Tailwind CSS** for the utility-first CSS framework
- **Radix UI** for accessible component primitives
- **Vercel** for seamless deployment

---

**Built with ❤️ and lots of ☕ in the cyberpunk future**
