# WebLab / Deanonymizer — Design System & Theme Guidelines

This document specifies the visual identity, UI components, typography, color palette, and layout guidelines for the **WebLab / Deanonymizer** application. All new components, pages, and features MUST adhere strictly to these guidelines.

---

## 🎨 Color Palette

### 1. Brand Accent & Glow
- **Brand Primary**: `#ff5722` (`bg-brand-orange`, `text-brand-orange`, `border-brand-orange`)
- **Brand Hover**: `#e64a19` (`bg-brand-orange-hover`)
- **Brand Glow**: `rgba(255, 87, 34, 0.35)` (`shadow-glow`, `shadow-glow-lg`)

### 2. Dark Orange Theme (Hero & Dark Sections)
- **Background Primary**: `#120600` (`bg-darkorange-950`)
- **Card / Surface Background**: `#1a0a02` (`bg-darkorange-900`)
- **Elevated Card**: `#260f03` (`bg-darkorange-850`)
- **Hover & Active Surface**: `#361605` (`bg-darkorange-800`)
- **Border Accents**: `#4a1e07` (`border-darkorange-750`), `#632809` (`border-darkorange-700`), `border-orange-900/60`
- **Muted Orange Text**: `#fdba74` (`text-darkorange-400`, `text-orange-300`)
- **Body Light Text**: `#ffedd5` (`text-darkorange-300`, `text-orange-100/90`)

### 3. Light Theme (Dashboard & Workflow Sections)
- **Background**: `#ffffff` (`bg-white`)
- **Card / Panel Background**: `#f8fafc` (`bg-slate-50`)
- **Borders**: `#e2e8f0` (`border-slate-200`)
- **Headings & Body Text**: `#0f172a` (`text-slate-900`), `#475569` (`text-slate-600`)

### 4. Risk Status Colors
- **High Risk**: Rose/Red (`text-rose-600`, `bg-rose-50`, `border-rose-200`)
- **Moderate Risk**: Amber/Yellow (`text-amber-600`, `bg-amber-50`, `border-amber-200`)
- **Low Risk**: Emerald/Green (`text-emerald-600`, `bg-emerald-50`, `border-emerald-200`)

---

## 📐 Typography & Badges

- **Headings**: `font-extrabold`, `tracking-tight`, crisp text with strong drop shadows where applicable.
- **Monospace Accents**: `font-mono` for handles (`@username`), technical codes, UTC timestamps, and data parameters.
- **Pill Badges**: `rounded-full` or `rounded-badge` (`px-3.5 py-1 rounded-full text-xs font-mono font-bold bg-orange-950/80 text-orange-300 border border-orange-700/60`).

---

## 🧱 Component Design Patterns

### 1. Search Bar & Forms
- Prominent white rounded pill input container: `rounded-full bg-white border-2 border-orange-300 focus-within:border-orange-500 shadow-2xl p-1.5`.
- Submit Button: `rounded-full bg-brand-orange text-white font-bold hover:bg-brand-orange-hover shadow-md`.

### 2. Cards & Panels
- White/Slate surface: `rounded-3xl bg-slate-50 border border-slate-200 shadow-sm hover:shadow-xl hover:border-brand-orange/60 transition-all`.
- Top border gradient accent on hover: `h-[2px] bg-gradient-to-r from-transparent via-brand-orange/50 to-transparent`.

### 3. Header & Navigation
- Fixed / Sticky Header with dynamic blur effect: `backdrop-blur-md transition-all duration-200`.
- Brand Logo with "Academic v1.0" badge and Vidyalankar Institute of Technology institutional tag.

---

## ⚡ 3D Visual Effects
- **Beams Background**: `components/Beams.js` WebGL interactive particles with glowing orange light (`#ff5722`).
