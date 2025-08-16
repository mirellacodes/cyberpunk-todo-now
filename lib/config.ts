// Configuration management for environment variables
export const config = {
  // App Configuration
  app: {
    name: process.env.NEXT_PUBLIC_APP_NAME || "Cyberpunk Todo Now",
    version: process.env.NEXT_PUBLIC_APP_VERSION || "1.0.0",
    url: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
  },

  // Feature Flags
  features: {
    animations: process.env.NEXT_PUBLIC_ENABLE_ANIMATIONS === "true",
    soundEffects: process.env.NEXT_PUBLIC_ENABLE_SOUND_EFFECTS === "true",
    analytics: process.env.NEXT_PUBLIC_ENABLE_ANALYTICS === "true",
  },

  // Environment
  env: {
    isDevelopment: process.env.NODE_ENV === "development",
    isProduction: process.env.NODE_ENV === "production",
    debugMode: process.env.NEXT_PUBLIC_DEBUG_MODE === "true",
  },

  // API Configuration (for future database integration)
  api: {
    databaseUrl: process.env.DATABASE_URL,
    supabaseUrl: process.env.SUPABASE_URL,
    supabaseAnonKey: process.env.SUPABASE_ANON_KEY,
  },

  // Authentication (for future features)
  auth: {
    nextAuthSecret: process.env.NEXTAUTH_SECRET,
    nextAuthUrl: process.env.NEXTAUTH_URL,
  },

  // External Services (for future integrations)
  services: {
    openaiApiKey: process.env.OPENAI_API_KEY,
    stripeSecretKey: process.env.STRIPE_SECRET_KEY,
  },

  // Performance & Monitoring
  monitoring: {
    performanceMonitoring: process.env.NEXT_PUBLIC_ENABLE_PERFORMANCE_MONITORING === "true",
    sentryDsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  },
} as const

// Type for the config object
export type Config = typeof config

// Helper function to validate required environment variables
export function validateEnvironment() {
  const requiredVars: string[] = []
  
  // Add validation logic here when you add required variables
  // Example: if (!config.api.databaseUrl) requiredVars.push('DATABASE_URL')
  
  if (requiredVars.length > 0) {
    throw new Error(`Missing required environment variables: ${requiredVars.join(', ')}`)
  }
  
  return true
}

// Export individual config sections for easier imports
export const { app, features, env, api, auth, services, monitoring } = config
