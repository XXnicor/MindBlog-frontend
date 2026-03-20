/** @type {import('tailwindcss').Config} */
module.exports = {
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
        "primary":                   "#9b3100",
        "primary-container":         "#c1440e",
        "on-primary":                "#ffffff",
        "on-primary-container":      "#ffeee9",
        "secondary":                 "#5f5e5e",
        "on-secondary-container":    "#656464",
        "tertiary":                  "#3a5b5d",
        "surface":                   "#f9f9f7",
        "surface-bright":            "#f9f9f7",
        "surface-container":         "#eeeeec",
        "surface-container-low":     "#f4f4f2",
        "surface-container-high":    "#e8e8e6",
        "surface-container-highest": "#e2e3e1",
        "surface-container-lowest":  "#ffffff",
        "on-surface":                "#1a1c1b",
        "on-surface-variant":        "#59413a",
        "outline":                   "#8d7168",
        "outline-variant":           "#e1bfb5",
        "background":                "#f9f9f7",
        "on-background":             "#1a1c1b",
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
