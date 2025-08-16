# Cyberpunk Todo App

A futuristic, cyberpunk-themed todo application built with Next.js, TypeScript, and Tailwind CSS.

## Features

- ✨ **Cyberpunk Aesthetic**: Dark theme with neon accents and futuristic UI
- 📱 **Mobile-First Design**: Responsive design that works on all devices
- 🔄 **Drag & Drop**: Reorder tasks with intuitive drag and drop
- 🎯 **Priority System**: High, medium, and low priority levels
- 🔍 **Search & Filter**: Find tasks quickly with search functionality
- 💾 **Local Storage**: Tasks persist in your browser
- 🌙 **Dark Theme**: Easy on the eyes in any lighting condition

## Mobile Swipe Feature

For mobile users, the app includes a **swipe-to-reveal** feature:

- **Swipe left** on any task to reveal edit and delete buttons
- **Tap anywhere** on the task to close the swipe menu
- **Smooth animations** with haptic feedback
- **Touch-optimized** for mobile devices

### How it works:

1. **Mobile Detection**: Automatically detects mobile devices (screen width < 768px)
2. **Swipe Gesture**: Swipe left on a task to reveal action buttons
3. **Action Buttons**: Edit (blue) and Delete (red) buttons appear
4. **Auto-close**: Actions automatically close the swipe menu
5. **Desktop Fallback**: Desktop users see always-visible action buttons

## Getting Started

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd cyberpunk-todo-now
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Run the development server**:
   ```bash
   npm run dev
   ```

4. **Open your browser** and navigate to `http://localhost:3000`

## Tech Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS with custom animations
- **Drag & Drop**: @dnd-kit
- **Icons**: Lucide React
- **Toast Notifications**: React Hot Toast

## Project Structure

```
cyberpunk-todo-now/
├── app/                    # Next.js app directory
├── components/            # React components
│   ├── ui/               # Reusable UI components
│   ├── todo-item.tsx     # Desktop todo item
│   └── swipeable-todo-item.tsx  # Mobile swipeable todo item
├── hooks/                # Custom React hooks
├── lib/                  # Utility functions
└── public/               # Static assets
```

## Contributing

Feel free to submit issues and enhancement requests!

## License

This project is open source and available under the [MIT License](LICENSE).
