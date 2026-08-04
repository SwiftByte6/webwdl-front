/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        darkorange: {
          950: '#120600', // Main deep dark background
          900: '#1a0a02', // Card background
          850: '#260f03', // Elevated card
          800: '#361605', // Hover / borders
          750: '#4a1e07', // Borders
          700: '#632809', // Muted borders
          400: '#fdba74', // Muted orange text
          300: '#ffedd5', // Body light text
        },
        brand: {
          orange: '#ff5722',
          'orange-hover': '#e64a19',
          glow: 'rgba(255, 87, 34, 0.35)',
        },
        status: {
          green: '#10b981',
          'green-bg': 'rgba(16, 185, 129, 0.15)',
          'green-border': 'rgba(16, 185, 129, 0.4)',
          yellow: '#f59e0b',
          'yellow-bg': 'rgba(245, 158, 11, 0.15)',
          'yellow-border': 'rgba(245, 158, 11, 0.4)',
          red: '#ef4444',
          'red-bg': 'rgba(239, 68, 68, 0.15)',
          'red-border': 'rgba(239, 68, 68, 0.4)',
        },
      },
      boxShadow: {
        card: '0 4px 24px -2px rgba(0, 0, 0, 0.5), 0 2px 6px -1px rgba(0, 0, 0, 0.3)',
        'card-hover': '0 12px 36px -4px rgba(0, 0, 0, 0.7), 0 4px 14px -2px rgba(255, 87, 34, 0.25)',
        glow: '0 0 30px rgba(255, 87, 34, 0.35)',
        'glow-lg': '0 0 50px rgba(255, 87, 34, 0.5)',
      },
      borderRadius: {
        card: '1rem',
        badge: '0.375rem',
        btn: '0.625rem',
        panel: '1.5rem',
      },
    },
  },
  plugins: [],
};
