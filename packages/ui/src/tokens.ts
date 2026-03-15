export const tokens = {
  colors: {
    background: "#f8fafb",
    foreground: "#1a2332",
    card: "#ffffff",
    primary: "#4F46E5",
    secondary: "#E0E7FF",
    muted: "#f1f5f9",
    accent: "#D1FAE5",
    border: "#e2e8f0",
    danger: "#ef4444",
    success: "#10B981",
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
  },
  radii: {
    sm: 8,
    md: 12,
    lg: 16,
    xl: 20,
  },
  typography: {
    h1: 32,
    h2: 24,
    h3: 20,
    body: 16,
    caption: 14,
  },
};

export type DesignTokens = typeof tokens;
