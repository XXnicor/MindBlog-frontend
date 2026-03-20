/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ['class', '[data-theme="dark"]'],
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        ink: {
          DEFAULT: 'var(--color-ink)',
          light: 'var(--color-ink-light)',
          muted: 'var(--color-ink-muted)',
        },
        paper: {
          DEFAULT: 'var(--color-paper)',
          alt: 'var(--color-paper-alt)',
        },
        border: 'var(--color-border)',
        accent: {
          DEFAULT: 'var(--color-accent)',
          hover: 'var(--color-accent-hover)',
        },
        "primary":                   "rgb(var(--color-primary) / <alpha-value>)",
        "primary-container":         "rgb(var(--color-primary-container) / <alpha-value>)",
        "on-primary":                "rgb(var(--color-on-primary) / <alpha-value>)",
        "on-primary-container":      "rgb(var(--color-on-primary-container) / <alpha-value>)",
        "secondary":                 "rgb(var(--color-secondary) / <alpha-value>)",
        "on-secondary-container":    "rgb(var(--color-on-secondary-container) / <alpha-value>)",
        "tertiary":                  "rgb(var(--color-tertiary) / <alpha-value>)",
        "surface":                   "rgb(var(--color-surface) / <alpha-value>)",
        "surface-bright":            "rgb(var(--color-surface) / <alpha-value>)",
        "surface-container":         "rgb(var(--color-surface-container) / <alpha-value>)",
        "surface-container-low":     "rgb(var(--color-surface-container-low) / <alpha-value>)",
        "surface-container-high":    "rgb(var(--color-surface-container-high) / <alpha-value>)",
        "surface-container-highest": "rgb(var(--color-surface-container-high) / <alpha-value>)",
        "surface-container-lowest":  "rgb(var(--color-surface) / <alpha-value>)",
        "on-surface":                "rgb(var(--color-on-surface) / <alpha-value>)",
        "on-surface-variant":        "rgb(var(--color-on-surface-variant) / <alpha-value>)",
        "outline":                   "rgb(var(--color-outline-variant) / <alpha-value>)",
        "outline-variant":           "rgb(var(--color-outline-variant) / <alpha-value>)",
        "inverse-surface":           "rgb(var(--color-inverse-surface) / <alpha-value>)",
        "background":                "rgb(var(--color-surface) / <alpha-value>)",
        "on-background":             "rgb(var(--color-on-surface) / <alpha-value>)",
      },
      fontFamily: {
        display: ['var(--font-display)'],
        reading: ['var(--font-reading)'],
        "headline": ["Newsreader", "Georgia", "serif"],
        "body":     ["Noto Serif", "Georgia", "serif"],
        "label":    ["Space Grotesk", "system-ui", "sans-serif"],
      },
      transitionTimingFunction: {
        fast: 'var(--transition-fast)',
        base: 'var(--transition-base)',
        slow: 'var(--transition-slow)',
        spring: 'var(--transition-spring)',
      },
      transitionDuration: {
        fast: '150ms',
        base: '250ms',
        slow: '400ms',
        spring: '500ms',
      }
    },
  },
  plugins: [
    require('@tailwindcss/line-clamp')
  ],
}
