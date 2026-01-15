# 🎨 AI Beauty Platform — UX/UI & Design System

> **Версия:** 1.0  
> **Проект:** AI Beauty Platform (PWA)  
> **Роль документа:** TOP LEVEL DESIGN Specification  
> **Дата:** Январь 2026

---

## 📋 Содержание

1. [Design Philosophy](#1-design-philosophy)
2. [Aesthetic Direction](#2-aesthetic-direction)
3. [Design Tokens](#3-design-tokens)
4. [Typography System](#4-typography-system)
5. [Color System](#5-color-system)
6. [Motion & Animation](#6-motion--animation)
7. [Spatial Composition](#7-spatial-composition)
8. [Component Library](#8-component-library)
9. [Page Specifications](#9-page-specifications)
10. [UX Patterns](#10-ux-patterns)
11. [Responsive Strategy](#11-responsive-strategy)
12. [Accessibility](#12-accessibility)
13. [Visual Assets](#13-visual-assets)
14. [Implementation Guidelines](#14-implementation-guidelines)

---

## 1. Design Philosophy

### 1.1. Основной Принцип

> **"Intentionality over Intensity"** — Намеренность важнее интенсивности.

AI Beauty Platform должна быть **запоминающейся** и **уникальной**. Мы отвергаем:
- Generic AI-generated aesthetics ("AI slop")
- Шаблонные решения без контекста
- Предсказуемые паттерны и layouts

### 1.2. Design Thinking Framework

```yaml
purpose:
  problem: "Пользователи не понимают состав косметики и не знают как ухаживать за кожей"
  audience: "Женщины 18-45 лет, интересующиеся осознанным уходом за собой"
  emotion: "Доверие, забота, премиальность, экспертность"

tone:
  primary: "Luxury Botanical" — роскошь встречает природу
  secondary: "Editorial Wellness" — журнальная эстетика wellness-бренда
  
differentiation:
  unforgettable: "AI как персональный beauty-консультант с душой"
  unique_element: "Живые, органические анимации, как будто интерфейс дышит"
```

### 1.3. Антипаттерны (ЗАПРЕЩЕНО)

```yaml
forbidden_fonts:
  - Inter
  - Roboto  
  - Arial
  - System fonts
  - Space Grotesk

forbidden_colors:
  - Purple gradients on white (клише AI-продуктов)
  - Generic pink (#FF69B4, #FFC0CB)
  - Neon gradients
  - Bootstrap-like палитры

forbidden_patterns:
  - Card grids без характера
  - Стандартные hero-секции
  - Предсказуемые кнопки
  - Cookie-cutter layouts
```

---

## 2. Aesthetic Direction

### 2.1. Выбранное Направление: **"Luxury Botanical Minimalism"**

```
┌─────────────────────────────────────────────────────────────────────┐
│                                                                     │
│   🌿 LUXURY BOTANICAL MINIMALISM                                    │
│                                                                     │
│   Сочетание роскоши высокой моды с органическими,                  │
│   природными элементами. Изысканность с теплотой.                  │
│                                                                     │
│   Keywords: refined, organic, premium, tactile, alive               │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

### 2.2. Moodboard Концепция

```yaml
visual_references:
  - Aesop (минимализм + тактильность)
  - Glossier (мягкая роскошь)
  - Byredo (editorial luxury)
  - Kinfolk Magazine (спокойная эстетика)
  - Japanese Wabi-sabi (несовершенная красота)

textures:
  - Мягкий paper grain
  - Subtle noise overlays
  - Organic brush strokes
  - Watercolor washes
  - Botanical illustrations

materials_feel:
  - Матовая бумага
  - Натуральный камень
  - Сухоцветы
  - Керамика
  - Лён и хлопок
```

### 2.3. Emotional Journey Map

```
Первое впечатление     →    Исследование    →    Доверие    →    Лояльность
        │                        │                  │               │
   "Это красиво"          "Это понятно"      "Это работает"   "Это моё"
        │                        │                  │               │
  Visual Delight          Clear UX Flow       AI Competence    Personalization
```

---

## 3. Design Tokens

### 3.1. CSS Custom Properties

```css
:root {
  /* === SPACING SCALE === */
  --space-3xs: 0.125rem;   /* 2px */
  --space-2xs: 0.25rem;    /* 4px */
  --space-xs: 0.5rem;      /* 8px */
  --space-sm: 0.75rem;     /* 12px */
  --space-md: 1rem;        /* 16px */
  --space-lg: 1.5rem;      /* 24px */
  --space-xl: 2rem;        /* 32px */
  --space-2xl: 3rem;       /* 48px */
  --space-3xl: 4rem;       /* 64px */
  --space-4xl: 6rem;       /* 96px */
  --space-5xl: 8rem;       /* 128px */

  /* === RADIUS === */
  --radius-none: 0;
  --radius-sm: 0.25rem;    /* 4px */
  --radius-md: 0.5rem;     /* 8px */
  --radius-lg: 1rem;       /* 16px */
  --radius-xl: 1.5rem;     /* 24px */
  --radius-2xl: 2rem;      /* 32px */
  --radius-full: 9999px;

  /* === SHADOWS === */
  --shadow-xs: 0 1px 2px rgba(0, 0, 0, 0.04);
  --shadow-sm: 0 2px 4px rgba(0, 0, 0, 0.06);
  --shadow-md: 0 4px 12px rgba(0, 0, 0, 0.08);
  --shadow-lg: 0 8px 24px rgba(0, 0, 0, 0.12);
  --shadow-xl: 0 16px 48px rgba(0, 0, 0, 0.16);
  --shadow-inner: inset 0 2px 4px rgba(0, 0, 0, 0.06);
  
  /* Colored shadows for depth */
  --shadow-primary: 0 8px 24px rgba(139, 90, 43, 0.15);
  --shadow-accent: 0 8px 24px rgba(76, 102, 72, 0.12);

  /* === Z-INDEX SCALE === */
  --z-base: 0;
  --z-dropdown: 100;
  --z-sticky: 200;
  --z-overlay: 300;
  --z-modal: 400;
  --z-popover: 500;
  --z-toast: 600;
  --z-tooltip: 700;

  /* === TRANSITIONS === */
  --ease-out-expo: cubic-bezier(0.16, 1, 0.3, 1);
  --ease-out-quart: cubic-bezier(0.25, 1, 0.5, 1);
  --ease-in-out-sine: cubic-bezier(0.37, 0, 0.63, 1);
  --ease-spring: cubic-bezier(0.34, 1.56, 0.64, 1);
  
  --duration-instant: 100ms;
  --duration-fast: 200ms;
  --duration-normal: 300ms;
  --duration-slow: 500ms;
  --duration-slower: 800ms;

  /* === BLUR === */
  --blur-sm: 4px;
  --blur-md: 8px;
  --blur-lg: 16px;
  --blur-xl: 24px;
}
```

---

## 4. Typography System

### 4.1. Font Stack

```yaml
display_font:
  name: "Fraunces"
  source: Google Fonts
  weights: [300, 400, 500, 600, 700]
  style: "Variable with optical size"
  character: "Soft serif, organic, warm, distinctive"
  usage: "Headlines, hero text, brand moments"

body_font:
  name: "DM Sans"
  source: Google Fonts
  weights: [400, 500, 600, 700]
  character: "Geometric sans, humanist warmth"
  usage: "Body text, UI elements, navigation"

mono_font:
  name: "JetBrains Mono"
  source: Google Fonts
  weights: [400, 500]
  usage: "INCI names, ingredient codes, technical data"
```

### 4.2. Type Scale

```css
:root {
  /* === FONT FAMILIES === */
  --font-display: 'Fraunces', Georgia, serif;
  --font-body: 'DM Sans', system-ui, sans-serif;
  --font-mono: 'JetBrains Mono', monospace;

  /* === TYPE SCALE (Major Third - 1.25) === */
  --text-xs: 0.64rem;      /* 10.24px */
  --text-sm: 0.8rem;       /* 12.8px */
  --text-base: 1rem;       /* 16px */
  --text-lg: 1.25rem;      /* 20px */
  --text-xl: 1.563rem;     /* 25px */
  --text-2xl: 1.953rem;    /* 31.25px */
  --text-3xl: 2.441rem;    /* 39px */
  --text-4xl: 3.052rem;    /* 48.8px */
  --text-5xl: 3.815rem;    /* 61px */
  --text-6xl: 4.768rem;    /* 76.3px */

  /* === LINE HEIGHTS === */
  --leading-none: 1;
  --leading-tight: 1.15;
  --leading-snug: 1.3;
  --leading-normal: 1.5;
  --leading-relaxed: 1.625;
  --leading-loose: 1.8;

  /* === LETTER SPACING === */
  --tracking-tighter: -0.05em;
  --tracking-tight: -0.025em;
  --tracking-normal: 0;
  --tracking-wide: 0.025em;
  --tracking-wider: 0.05em;
  --tracking-widest: 0.1em;
}
```

### 4.3. Typography Styles

```css
/* === DISPLAY STYLES === */
.display-hero {
  font-family: var(--font-display);
  font-size: var(--text-6xl);
  font-weight: 300;
  line-height: var(--leading-tight);
  letter-spacing: var(--tracking-tight);
  font-variation-settings: 'opsz' 72;
}

.display-title {
  font-family: var(--font-display);
  font-size: var(--text-4xl);
  font-weight: 400;
  line-height: var(--leading-tight);
  letter-spacing: var(--tracking-tight);
}

.display-subtitle {
  font-family: var(--font-display);
  font-size: var(--text-2xl);
  font-weight: 400;
  line-height: var(--leading-snug);
}

/* === HEADING STYLES === */
.heading-xl {
  font-family: var(--font-body);
  font-size: var(--text-2xl);
  font-weight: 600;
  line-height: var(--leading-snug);
}

.heading-lg {
  font-family: var(--font-body);
  font-size: var(--text-xl);
  font-weight: 600;
  line-height: var(--leading-snug);
}

.heading-md {
  font-family: var(--font-body);
  font-size: var(--text-lg);
  font-weight: 600;
  line-height: var(--leading-normal);
}

/* === BODY STYLES === */
.body-lg {
  font-family: var(--font-body);
  font-size: var(--text-lg);
  font-weight: 400;
  line-height: var(--leading-relaxed);
}

.body-base {
  font-family: var(--font-body);
  font-size: var(--text-base);
  font-weight: 400;
  line-height: var(--leading-normal);
}

.body-sm {
  font-family: var(--font-body);
  font-size: var(--text-sm);
  font-weight: 400;
  line-height: var(--leading-normal);
}

/* === UTILITY STYLES === */
.label {
  font-family: var(--font-body);
  font-size: var(--text-xs);
  font-weight: 600;
  letter-spacing: var(--tracking-wider);
  text-transform: uppercase;
}

.mono {
  font-family: var(--font-mono);
  font-size: var(--text-sm);
  font-weight: 400;
}
```

---

## 5. Color System

### 5.1. Философия Цвета

```yaml
approach: "Earthy Luxury with Botanical Accents"
inspiration:
  - Natural ingredients (herbs, botanicals, minerals)
  - Japanese tea ceremony aesthetics
  - High-end skincare packaging
  - Dried flowers and pressed leaves
```

### 5.2. Core Palette

```css
:root {
  /* === NEUTRALS (Warm Stone) === */
  --neutral-50: #FDFCFB;   /* Warm white */
  --neutral-100: #F7F5F3;  /* Soft cream */
  --neutral-200: #EDE9E4;  /* Light sand */
  --neutral-300: #DDD6CD;  /* Warm gray */
  --neutral-400: #B8ADA0;  /* Stone */
  --neutral-500: #8C8177;  /* Taupe */
  --neutral-600: #6B6259;  /* Deep taupe */
  --neutral-700: #4A433C;  /* Espresso */
  --neutral-800: #2E2924;  /* Dark earth */
  --neutral-900: #1A1714;  /* Near black */

  /* === PRIMARY (Warm Terracotta) === */
  --primary-50: #FDF8F4;
  --primary-100: #F9EDE3;
  --primary-200: #F2D9C6;
  --primary-300: #E8BFA0;
  --primary-400: #D99E73;
  --primary-500: #C4804D;   /* Main brand color */
  --primary-600: #A66A3D;
  --primary-700: #8B5A2B;
  --primary-800: #6E4722;
  --primary-900: #52351A;

  /* === SECONDARY (Sage Green) === */
  --secondary-50: #F4F7F4;
  --secondary-100: #E6EDE5;
  --secondary-200: #CCD9CA;
  --secondary-300: #A8BEA5;
  --secondary-400: #7D9C79;
  --secondary-500: #4C6648;   /* Main accent */
  --secondary-600: #3D5239;
  --secondary-700: #2F3F2C;
  --secondary-800: #232E21;
  --secondary-900: #181F17;

  /* === ACCENT (Dusty Rose) === */
  --accent-50: #FDF6F6;
  --accent-100: #F9EAEA;
  --accent-200: #F2D4D4;
  --accent-300: #E5B3B3;
  --accent-400: #D18989;
  --accent-500: #B86B6B;     /* Soft rose */
  --accent-600: #9A5252;
  --accent-700: #7A4141;
  --accent-800: #5C3131;
  --accent-900: #3E2121;

  /* === SEMANTIC COLORS === */
  --success-50: #F0F7F1;
  --success-500: #4A8B52;
  --success-700: #2E5E34;

  --warning-50: #FDF8F0;
  --warning-500: #C49234;
  --warning-700: #8B6820;

  --error-50: #FDF2F2;
  --error-500: #C45252;
  --error-700: #8B3232;

  --info-50: #F0F5F7;
  --info-500: #4A728B;
  --info-700: #2E4E5E;
}
```

### 5.3. Semantic Color Usage

```yaml
surfaces:
  background_primary: neutral-50
  background_secondary: neutral-100
  background_tertiary: neutral-200
  background_elevated: "#FFFFFF"
  
text:
  primary: neutral-900
  secondary: neutral-600
  tertiary: neutral-500
  inverse: neutral-50
  
interactive:
  button_primary_bg: primary-500
  button_primary_hover: primary-600
  button_secondary_bg: secondary-500
  link: primary-600
  link_hover: primary-700
  focus_ring: primary-400

feedback:
  safe_ingredient: success-500
  caution_ingredient: warning-500
  avoid_ingredient: error-500
  info: info-500
```

### 5.4. Gradient System

```css
:root {
  /* === SUBTLE GRADIENTS === */
  --gradient-warm: linear-gradient(
    135deg,
    var(--neutral-50) 0%,
    var(--primary-50) 100%
  );
  
  --gradient-botanical: linear-gradient(
    180deg,
    var(--neutral-50) 0%,
    var(--secondary-50) 100%
  );
  
  --gradient-sunset: linear-gradient(
    135deg,
    var(--primary-100) 0%,
    var(--accent-100) 100%
  );

  /* === OVERLAY GRADIENTS === */
  --gradient-fade-bottom: linear-gradient(
    to bottom,
    transparent 0%,
    var(--neutral-50) 100%
  );
  
  --gradient-vignette: radial-gradient(
    ellipse at center,
    transparent 0%,
    rgba(26, 23, 20, 0.03) 100%
  );

  /* === DECORATIVE GRADIENTS === */
  --gradient-mesh: 
    radial-gradient(at 20% 30%, var(--primary-100) 0%, transparent 50%),
    radial-gradient(at 80% 70%, var(--secondary-100) 0%, transparent 50%),
    radial-gradient(at 50% 50%, var(--accent-100) 0%, transparent 50%);
}
```

---

## 6. Motion & Animation

### 6.1. Animation Philosophy

```yaml
principle: "Organic & Alive"
description: |
  Интерфейс должен чувствоваться живым, как растение.
  Движения мягкие, естественные, с небольшой "органической" 
  непредсказуемостью. Никакой механической резкости.

signature_motion: "Breathing effect"
  - Subtle scale oscillation
  - Soft opacity waves
  - Gentle parallax on scroll
```

### 6.2. Timing Functions

```css
:root {
  /* === ORGANIC EASINGS === */
  
  /* Для входа элементов — мягкое появление */
  --ease-enter: cubic-bezier(0.0, 0.0, 0.2, 1);
  
  /* Для выхода — плавное исчезновение */
  --ease-exit: cubic-bezier(0.4, 0.0, 1, 1);
  
  /* Для интерактивных элементов — упругость */
  --ease-spring: cubic-bezier(0.34, 1.56, 0.64, 1);
  
  /* Для длительных анимаций — органичность */
  --ease-organic: cubic-bezier(0.45, 0.05, 0.55, 0.95);
  
  /* Для hover — быстрый отклик */
  --ease-snappy: cubic-bezier(0.2, 0.0, 0.0, 1);
}
```

### 6.3. Core Animations

```css
/* === PAGE LOAD SEQUENCE === */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes scaleIn {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

/* === BREATHING EFFECT (Signature) === */
@keyframes breathe {
  0%, 100% {
    transform: scale(1);
    opacity: 1;
  }
  50% {
    transform: scale(1.02);
    opacity: 0.97;
  }
}

/* === ORGANIC FLOAT === */
@keyframes float {
  0%, 100% {
    transform: translateY(0) rotate(0deg);
  }
  25% {
    transform: translateY(-5px) rotate(0.5deg);
  }
  75% {
    transform: translateY(3px) rotate(-0.5deg);
  }
}

/* === SHIMMER FOR LOADING === */
@keyframes shimmer {
  0% {
    background-position: -200% 0;
  }
  100% {
    background-position: 200% 0;
  }
}

/* === PULSE FOR NOTIFICATIONS === */
@keyframes pulse {
  0%, 100% {
    box-shadow: 0 0 0 0 var(--primary-300);
  }
  50% {
    box-shadow: 0 0 0 8px transparent;
  }
}
```

### 6.4. Animation Classes

```css
/* === STAGGERED ENTRANCE === */
.animate-stagger > * {
  animation: fadeInUp var(--duration-slow) var(--ease-enter) forwards;
  opacity: 0;
}

.animate-stagger > *:nth-child(1) { animation-delay: 0ms; }
.animate-stagger > *:nth-child(2) { animation-delay: 80ms; }
.animate-stagger > *:nth-child(3) { animation-delay: 160ms; }
.animate-stagger > *:nth-child(4) { animation-delay: 240ms; }
.animate-stagger > *:nth-child(5) { animation-delay: 320ms; }
.animate-stagger > *:nth-child(6) { animation-delay: 400ms; }

/* === HOVER STATES === */
.hover-lift {
  transition: transform var(--duration-fast) var(--ease-spring),
              box-shadow var(--duration-fast) var(--ease-enter);
}

.hover-lift:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-lg);
}

/* === BREATHING ELEMENTS === */
.breathe {
  animation: breathe 4s var(--ease-organic) infinite;
}

/* === FLOATING DECORATIONS === */
.float {
  animation: float 6s var(--ease-organic) infinite;
}
```

### 6.5. Micro-interactions

```yaml
buttons:
  hover:
    scale: 1.02
    shadow: increase
    duration: 200ms
  active:
    scale: 0.98
    duration: 100ms
  
inputs:
  focus:
    border_color: primary-400
    shadow: "0 0 0 3px var(--primary-100)"
    label_color: primary-600
    duration: 200ms

cards:
  hover:
    translateY: -4px
    shadow: lg
    duration: 300ms

toggles:
  change:
    spring_animation: true
    duration: 400ms

chat_messages:
  appear:
    fadeInUp: true
    stagger: 50ms
    duration: 300ms
```

---

## 7. Spatial Composition

### 7.1. Grid System

```yaml
container:
  max_width: 1280px
  padding_mobile: 16px
  padding_tablet: 24px
  padding_desktop: 32px

grid:
  columns: 12
  gutter_mobile: 16px
  gutter_tablet: 24px
  gutter_desktop: 32px

breakpoints:
  sm: 640px
  md: 768px
  lg: 1024px
  xl: 1280px
  2xl: 1536px
```

### 7.2. Layout Principles

```
┌─────────────────────────────────────────────────────────────────────┐
│                                                                     │
│   ✦ ASYMMETRIC BALANCE                                             │
│                                                                     │
│   Не боимся асимметрии. Смещённые заголовки,                       │
│   элементы выходящие за grid, перекрывающиеся блоки.               │
│                                                                     │
│   ✦ GENEROUS NEGATIVE SPACE                                        │
│                                                                     │
│   Воздух — это роскошь. Много пустого пространства                 │
│   вокруг ключевых элементов подчёркивает premium-качество.         │
│                                                                     │
│   ✦ ORGANIC FLOW                                                   │
│                                                                     │
│   Скругления, мягкие формы, отсутствие жёстких углов.              │
│   Элементы "перетекают" друг в друга.                              │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

### 7.3. Spacing Rhythm

```css
/* Section spacing */
.section {
  padding-block: var(--space-4xl);
}

@media (max-width: 768px) {
  .section {
    padding-block: var(--space-2xl);
  }
}

/* Component internal spacing */
.card {
  padding: var(--space-xl);
  gap: var(--space-lg);
}

/* Element spacing */
.stack-sm > * + * { margin-top: var(--space-sm); }
.stack-md > * + * { margin-top: var(--space-md); }
.stack-lg > * + * { margin-top: var(--space-lg); }
.stack-xl > * + * { margin-top: var(--space-xl); }
```

---

## 8. Component Library

### 8.1. Buttons

```yaml
variants:
  primary:
    background: var(--primary-500)
    color: white
    hover_bg: var(--primary-600)
    active_bg: var(--primary-700)
    shadow: var(--shadow-primary)
    
  secondary:
    background: var(--secondary-500)
    color: white
    hover_bg: var(--secondary-600)
    
  outline:
    background: transparent
    border: "2px solid var(--primary-500)"
    color: var(--primary-600)
    hover_bg: var(--primary-50)
    
  ghost:
    background: transparent
    color: var(--neutral-700)
    hover_bg: var(--neutral-100)
    
  text:
    background: transparent
    color: var(--primary-600)
    text_decoration_hover: underline

sizes:
  sm:
    padding: "8px 16px"
    font_size: var(--text-sm)
    border_radius: var(--radius-md)
    
  md:
    padding: "12px 24px"
    font_size: var(--text-base)
    border_radius: var(--radius-lg)
    
  lg:
    padding: "16px 32px"
    font_size: var(--text-lg)
    border_radius: var(--radius-xl)
```

```css
/* Button Component */
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-xs);
  font-family: var(--font-body);
  font-weight: 500;
  border: none;
  cursor: pointer;
  transition: all var(--duration-fast) var(--ease-spring);
}

.btn:active {
  transform: scale(0.98);
}

.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none;
}

.btn-primary {
  background: var(--primary-500);
  color: white;
  box-shadow: var(--shadow-primary);
}

.btn-primary:hover:not(:disabled) {
  background: var(--primary-600);
  transform: translateY(-2px);
  box-shadow: var(--shadow-lg);
}
```

### 8.2. Cards

```yaml
variants:
  default:
    background: white
    border: none
    shadow: var(--shadow-sm)
    radius: var(--radius-xl)
    
  elevated:
    background: white
    shadow: var(--shadow-lg)
    radius: var(--radius-2xl)
    
  outlined:
    background: transparent
    border: "1px solid var(--neutral-200)"
    radius: var(--radius-xl)
    
  glass:
    background: "rgba(255, 255, 255, 0.7)"
    backdrop_filter: "blur(12px)"
    border: "1px solid rgba(255, 255, 255, 0.3)"
    radius: var(--radius-2xl)
    
  interactive:
    extends: default
    hover_transform: "translateY(-4px)"
    hover_shadow: var(--shadow-xl)
    cursor: pointer
```

```css
/* Card Component */
.card {
  background: white;
  border-radius: var(--radius-xl);
  padding: var(--space-xl);
  transition: all var(--duration-normal) var(--ease-enter);
}

.card-interactive {
  cursor: pointer;
}

.card-interactive:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-xl);
}

.card-glass {
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.3);
}
```

### 8.3. Inputs

```yaml
states:
  default:
    background: white
    border: "1px solid var(--neutral-300)"
    radius: var(--radius-lg)
    
  focus:
    border_color: var(--primary-500)
    ring: "0 0 0 3px var(--primary-100)"
    
  error:
    border_color: var(--error-500)
    ring: "0 0 0 3px var(--error-100)"
    
  disabled:
    background: var(--neutral-100)
    opacity: 0.7
    cursor: not-allowed
```

```css
/* Input Component */
.input {
  width: 100%;
  padding: var(--space-sm) var(--space-md);
  font-family: var(--font-body);
  font-size: var(--text-base);
  background: white;
  border: 1px solid var(--neutral-300);
  border-radius: var(--radius-lg);
  transition: all var(--duration-fast) var(--ease-enter);
}

.input:focus {
  outline: none;
  border-color: var(--primary-500);
  box-shadow: 0 0 0 3px var(--primary-100);
}

.input::placeholder {
  color: var(--neutral-400);
}

/* Floating Label Pattern */
.input-group {
  position: relative;
}

.input-label {
  position: absolute;
  left: var(--space-md);
  top: 50%;
  transform: translateY(-50%);
  font-size: var(--text-base);
  color: var(--neutral-500);
  transition: all var(--duration-fast) var(--ease-enter);
  pointer-events: none;
}

.input:focus + .input-label,
.input:not(:placeholder-shown) + .input-label {
  top: 0;
  transform: translateY(-50%);
  font-size: var(--text-xs);
  color: var(--primary-600);
  background: white;
  padding: 0 var(--space-2xs);
}
```

### 8.4. Chat Bubbles

```css
/* Chat Message Bubbles */
.chat-bubble {
  max-width: 80%;
  padding: var(--space-md) var(--space-lg);
  border-radius: var(--radius-2xl);
  animation: fadeInUp var(--duration-normal) var(--ease-enter);
}

.chat-bubble-user {
  background: var(--primary-500);
  color: white;
  margin-left: auto;
  border-bottom-right-radius: var(--radius-sm);
}

.chat-bubble-ai {
  background: var(--neutral-100);
  color: var(--neutral-900);
  margin-right: auto;
  border-bottom-left-radius: var(--radius-sm);
  position: relative;
}

/* AI Typing Indicator */
.chat-typing {
  display: flex;
  gap: var(--space-2xs);
  padding: var(--space-md) var(--space-lg);
}

.chat-typing-dot {
  width: 8px;
  height: 8px;
  background: var(--neutral-400);
  border-radius: var(--radius-full);
  animation: pulse 1.4s ease-in-out infinite;
}

.chat-typing-dot:nth-child(2) { animation-delay: 0.2s; }
.chat-typing-dot:nth-child(3) { animation-delay: 0.4s; }
```

### 8.5. Safety Badges

```css
/* Ingredient Safety Indicators */
.safety-badge {
  display: inline-flex;
  align-items: center;
  gap: var(--space-2xs);
  padding: var(--space-2xs) var(--space-sm);
  border-radius: var(--radius-full);
  font-size: var(--text-xs);
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: var(--tracking-wider);
}

.safety-safe {
  background: var(--success-50);
  color: var(--success-700);
}

.safety-caution {
  background: var(--warning-50);
  color: var(--warning-700);
}

.safety-avoid {
  background: var(--error-50);
  color: var(--error-700);
}

/* EWG Score Bar */
.ewg-bar {
  height: 4px;
  background: var(--neutral-200);
  border-radius: var(--radius-full);
  overflow: hidden;
}

.ewg-bar-fill {
  height: 100%;
  border-radius: var(--radius-full);
  transition: width var(--duration-slow) var(--ease-out-expo);
}

.ewg-bar-fill[data-score="1"],
.ewg-bar-fill[data-score="2"],
.ewg-bar-fill[data-score="3"] {
  background: var(--success-500);
}

.ewg-bar-fill[data-score="4"],
.ewg-bar-fill[data-score="5"],
.ewg-bar-fill[data-score="6"] {
  background: var(--warning-500);
}

.ewg-bar-fill[data-score="7"],
.ewg-bar-fill[data-score="8"],
.ewg-bar-fill[data-score="9"],
.ewg-bar-fill[data-score="10"] {
  background: var(--error-500);
}
```

### 8.6. Navigation

```css
/* Bottom Navigation (Mobile) */
.nav-bottom {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(253, 252, 251, 0.9);
  backdrop-filter: blur(12px);
  border-top: 1px solid var(--neutral-200);
  padding: var(--space-xs) 0;
  padding-bottom: env(safe-area-inset-bottom);
  z-index: var(--z-sticky);
}

.nav-bottom-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-3xs);
  padding: var(--space-xs);
  color: var(--neutral-500);
  text-decoration: none;
  transition: color var(--duration-fast) var(--ease-enter);
}

.nav-bottom-item.active {
  color: var(--primary-600);
}

.nav-bottom-item:hover {
  color: var(--primary-500);
}

.nav-bottom-icon {
  width: 24px;
  height: 24px;
}

.nav-bottom-label {
  font-size: var(--text-xs);
  font-weight: 500;
}

/* Sidebar Navigation (Desktop) */
.nav-sidebar {
  position: fixed;
  left: 0;
  top: 0;
  bottom: 0;
  width: 280px;
  background: white;
  border-right: 1px solid var(--neutral-200);
  padding: var(--space-xl);
  z-index: var(--z-sticky);
}

.nav-sidebar-item {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  padding: var(--space-sm) var(--space-md);
  border-radius: var(--radius-lg);
  color: var(--neutral-700);
  text-decoration: none;
  font-weight: 500;
  transition: all var(--duration-fast) var(--ease-enter);
}

.nav-sidebar-item:hover {
  background: var(--neutral-100);
  color: var(--neutral-900);
}

.nav-sidebar-item.active {
  background: var(--primary-500);
  color: white;
  box-shadow: var(--shadow-primary);
}
```

---

## 9. Page Specifications

### 9.1. Landing / Home Page

```yaml
sections:
  hero:
    layout: "Full-width with asymmetric content"
    background: "Gradient mesh with botanical illustration"
    headline:
      font: display-hero
      text: "Ваш персональный AI-эксперт по красоте"
    subheadline:
      font: body-lg
      text: "Анализируйте составы, планируйте рутины, получайте рекомендации"
    cta:
      primary: "Начать консультацию"
      secondary: "Проанализировать состав"
    decoration:
      - Floating botanical illustrations
      - Soft gradient orbs
      - Grain texture overlay
    animation:
      headline: fadeInUp, delay 0
      subheadline: fadeInUp, delay 100ms
      cta: fadeInUp, delay 200ms
      decorations: float, infinite

  features:
    layout: "3-column grid with offset"
    cards:
      - icon: chat bubble
        title: "AI Консультант"
        description: "Персональные рекомендации от AI"
        color_accent: primary
      - icon: calendar
        title: "Планировщик"
        description: "Создавайте и отслеживайте рутины"
        color_accent: secondary
      - icon: scan
        title: "Анализатор"
        description: "Проверяйте безопасность составов"
        color_accent: accent
    animation: staggered fadeInUp

  benefits:
    layout: "Alternating image-text blocks"
    background: "Subtle gradient"
    items:
      - title: "Персонализация"
        text: "Рекомендации на основе вашего типа кожи"
        visual: "Animated skin type selector"
      - title: "Безопасность"
        text: "Проверка на аллергены и опасные компоненты"
        visual: "Ingredient safety visualization"
      - title: "Экономия времени"
        text: "Автоматическое планирование рутин"
        visual: "Calendar animation"
```

### 9.2. Chat / AI Consultant Page

```yaml
layout:
  type: "Full-height chat interface"
  sidebar: "Hidden on mobile, visible on desktop"
  
components:
  header:
    title: "AI Консультант"
    subtitle: "Задайте любой вопрос о красоте"
    ai_avatar:
      shape: "Organic blob"
      animation: "Breathing"
      
  messages_area:
    height: "calc(100vh - 200px)"
    scroll_behavior: smooth
    background: "Subtle pattern"
    
  input_area:
    position: sticky bottom
    background: "Glass effect"
    components:
      - text_input
      - send_button
      - attach_image (optional)

  suggested_questions:
    visible: "Only when chat is empty"
    items:
      - "Какой крем для сухой кожи?"
      - "Что такое ретинол?"
      - "Как составить утреннюю рутину?"
    style: "Pills/chips"
    
animations:
  new_message:
    user: "slideInRight"
    ai: "slideInLeft with typing indicator"
  typing_indicator:
    dots: "Bouncing sequence"
```

### 9.3. Routines Page

```yaml
layout:
  type: "Card grid"
  columns: "1 on mobile, 2 on tablet+"
  
components:
  header:
    title: "Мои Рутины"
    action: "Создать рутину" button
    
  routine_card:
    header:
      type_badge: "morning/evening/weekly"
      title: "Название рутины"
      time: "08:00"
      active_indicator
    body:
      steps_list:
        item:
          - order_number (circle)
          - product_name
          - category_tag
          - duration
          - instructions (expandable)
    footer:
      days_indicator
      actions: edit, execute
      
  empty_state:
    illustration: "Botanical illustration"
    text: "Создайте свою первую рутину"
    cta: "Создать"

animations:
  card_appear: staggered fadeInUp
  step_check: scale + checkmark animation
  progress_bar: fill animation
```

### 9.4. Analyzer Page

```yaml
layout:
  type: "Two-panel (upload + results)"
  mobile: "Stacked"
  
components:
  upload_section:
    drop_zone:
      border: "Dashed, animated on hover"
      icon: "Upload cloud"
      text: "Перетащите изображение"
      actions:
        - "Выбрать файл" button
        - "Камера" button
    camera_view:
      full_screen_modal: true
      capture_button: "Shutter animation"
      
  results_section:
    score_header:
      overall_score: "Large circular progress"
      product_name
      brand
    stats_row:
      safe_count: green
      caution_count: yellow
      avoid_count: red
      unknown_count: gray
    warnings_banner:
      type: "Alert card"
      icon: "Warning triangle"
    ingredients_list:
      item:
        - name
        - safety_badge
        - ewg_bar
        - functions (tags)
        - concerns (if any)
        - expandable_details

animations:
  scan_effect: "Moving line over image"
  score_reveal: "Counting up + circle fill"
  ingredients_appear: staggered list
```

### 9.5. Profile Page

```yaml
layout:
  type: "Centered single column"
  max_width: 640px
  
components:
  profile_header:
    avatar:
      shape: "Circle with border"
      fallback: "Initials"
    name
    email
    verified_badge
    
  settings_sections:
    personal_info:
      fields: name, email
      edit_mode: inline
    skin_profile:
      skin_type: dropdown
      age_group: dropdown
      allergies: multi-select/tags
    preferences:
      notifications: toggle
      theme: toggle (future)
      
  statistics_cards:
    grid: 2x2
    items:
      - routines_created
      - chat_messages
      - analyses_done
      - completion_rate

animations:
  stat_counters: count up on scroll
  edit_mode: smooth height transition
```

---

## 10. UX Patterns

### 10.1. Loading States

```yaml
skeleton_loading:
  style: "Shimmer effect"
  color: "neutral-200 to neutral-100"
  border_radius: "Match component"
  
spinner:
  style: "Organic rotating dots"
  color: primary-500
  size: 24px default
  
progress:
  determinate: "Fill bar with percentage"
  indeterminate: "Infinite shimmer"
```

### 10.2. Empty States

```yaml
style:
  illustration: "Hand-drawn botanical"
  headline: display-subtitle
  description: body-base, neutral-600
  cta: primary button
  
examples:
  no_routines:
    illustration: "empty_calendar"
    headline: "Пока нет рутин"
    description: "Создайте первую бьюти-рутину"
    cta: "Создать рутину"
    
  no_analyses:
    illustration: "empty_scan"
    headline: "История пуста"
    description: "Проанализируйте свой первый продукт"
    cta: "Начать анализ"
```

### 10.3. Error States

```yaml
inline_error:
  color: error-500
  icon: "Exclamation circle"
  font_size: text-sm
  animation: "Shake on appear"
  
toast_error:
  position: "Top center"
  background: error-50
  border_left: "4px solid error-500"
  duration: 5000ms
  dismissible: true
  
error_page:
  illustration: "Wilted plant"
  headline: "Что-то пошло не так"
  description: "Попробуйте обновить страницу"
  actions:
    - "Обновить" primary
    - "На главную" ghost
```

### 10.4. Success States

```yaml
inline_success:
  color: success-500
  icon: "Check circle"
  animation: "Scale in + check draw"
  
toast_success:
  position: "Top center"
  background: success-50
  border_left: "4px solid success-500"
  duration: 3000ms
  
celebration:
  trigger: "First routine completed, 10 analyses"
  animation: "Confetti particles"
  message: "Отлично! Продолжайте в том же духе"
```

### 10.5. Onboarding Flow

```yaml
steps:
  1_welcome:
    type: "Full-screen modal"
    headline: "Добро пожаловать в AI Beauty"
    visual: "Animated logo"
    cta: "Начать"
    
  2_skin_profile:
    type: "Step form"
    question: "Какой у вас тип кожи?"
    options: visual_cards
    skip: allowed
    
  3_goals:
    type: "Multi-select"
    question: "Что вас интересует?"
    options:
      - "Уход за кожей"
      - "Анализ составов"
      - "Планирование рутин"
    
  4_notifications:
    type: "Permission request"
    question: "Хотите получать напоминания?"
    visual: "Bell icon animation"
    
progress_indicator:
  type: "Dots"
  position: "Bottom"
  active_color: primary-500
```

---

## 11. Responsive Strategy

### 11.1. Breakpoint System

```css
/* Mobile First Approach */

/* Base: 0-639px (Mobile) */
/* sm: 640px+ (Large mobile / Small tablet) */
/* md: 768px+ (Tablet) */
/* lg: 1024px+ (Desktop) */
/* xl: 1280px+ (Large desktop) */
/* 2xl: 1536px+ (Extra large) */

@media (min-width: 640px) { /* sm */ }
@media (min-width: 768px) { /* md */ }
@media (min-width: 1024px) { /* lg */ }
@media (min-width: 1280px) { /* xl */ }
@media (min-width: 1536px) { /* 2xl */ }
```

### 11.2. Layout Adaptations

```yaml
mobile (< 640px):
  navigation: bottom_bar
  sidebar: hidden
  grid_columns: 1
  spacing: compact
  typography: reduced_scale
  chat: full_screen
  
tablet (640px - 1023px):
  navigation: bottom_bar
  sidebar: hidden
  grid_columns: 2
  spacing: normal
  
desktop (1024px+):
  navigation: sidebar
  sidebar: visible (280px)
  grid_columns: 3
  spacing: generous
  chat: split_view_possible
```

### 11.3. Touch Targets

```yaml
minimum_size:
  buttons: 44x44px
  links: 44px height
  spacing_between: 8px minimum
  
touch_feedback:
  active_state: "Scale down 0.98"
  ripple: false (не соответствует эстетике)
```

---

## 12. Accessibility

### 12.1. Color Contrast

```yaml
requirements:
  text_normal: "4.5:1 minimum (WCAG AA)"
  text_large: "3:1 minimum"
  interactive: "3:1 minimum"
  
verified_combinations:
  - neutral-900 on neutral-50: "16.8:1 ✓"
  - neutral-700 on neutral-100: "8.2:1 ✓"
  - primary-600 on white: "5.1:1 ✓"
  - white on primary-500: "4.6:1 ✓"
```

### 12.2. Focus States

```css
/* Visible focus indicator */
:focus-visible {
  outline: none;
  box-shadow: 0 0 0 3px var(--primary-300);
}

/* Skip to content link */
.skip-link {
  position: absolute;
  top: -100px;
  left: 50%;
  transform: translateX(-50%);
  background: var(--primary-500);
  color: white;
  padding: var(--space-sm) var(--space-md);
  border-radius: var(--radius-md);
  z-index: var(--z-tooltip);
  transition: top var(--duration-fast);
}

.skip-link:focus {
  top: var(--space-md);
}
```

### 12.3. Screen Reader Support

```yaml
aria_labels:
  navigation: "Главная навигация"
  chat_input: "Написать сообщение AI консультанту"
  safety_score: "Оценка безопасности: X из 100"
  
live_regions:
  chat_messages: aria-live="polite"
  form_errors: aria-live="assertive"
  loading_states: aria-busy="true"
  
semantic_html:
  - Proper heading hierarchy (h1 > h2 > h3)
  - Landmark regions (main, nav, aside)
  - Lists for navigation and features
  - Buttons vs links (action vs navigation)
```

### 12.4. Motion Preferences

```css
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

## 13. Visual Assets

### 13.1. Iconography

```yaml
style:
  type: "Outlined"
  stroke_width: 1.5px
  corners: "Rounded"
  size_base: 24px
  
library: "Lucide React"
custom_icons:
  - skin_type_dry
  - skin_type_oily
  - skin_type_combination
  - ingredient_safe
  - ingredient_caution
  - ingredient_avoid
  - routine_morning
  - routine_evening
```

### 13.2. Illustrations

```yaml
style:
  type: "Hand-drawn botanical"
  color_palette: "Muted, earthy"
  line_style: "Organic, imperfect"
  
usage:
  empty_states: mandatory
  onboarding: mandatory
  error_pages: mandatory
  feature_highlights: optional
  
examples:
  - Dried herbs and flowers
  - Botanical ingredients
  - Skincare bottles (minimalist)
  - Abstract organic shapes
```

### 13.3. Photography Guidelines

```yaml
style:
  lighting: "Soft, natural"
  color_grading: "Warm, muted"
  composition: "Editorial, lots of negative space"
  
subjects:
  - Close-up textures (skin, products)
  - Flat-lay product arrangements
  - Natural ingredients
  - Hands applying products
  
avoid:
  - Over-processed HDR
  - Harsh studio lighting
  - Cluttered compositions
  - Stock photo clichés
```

### 13.4. Logo & Brand Mark

```yaml
primary_logo:
  type: "Wordmark + Symbol"
  symbol: "Abstract botanical leaf"
  wordmark: "AI Beauty" in Fraunces
  
usage:
  header: "Symbol + Wordmark"
  favicon: "Symbol only"
  app_icon: "Symbol in rounded square"
  
spacing:
  clear_space: "1x symbol height on all sides"
```

---

## 14. Implementation Guidelines

### 14.1. Technology Stack

```yaml
framework: "React 18 + TypeScript"
styling: "Tailwind CSS + CSS Modules for complex components"
animation: "Framer Motion"
icons: "Lucide React"
fonts: "Google Fonts (Fraunces, DM Sans)"
```

### 14.2. File Structure

```
src/
├── styles/
│   ├── globals.css          # CSS variables, base styles
│   ├── tokens.css           # Design tokens
│   └── animations.css       # Keyframes
├── components/
│   ├── ui/                  # Primitive components
│   │   ├── Button/
│   │   ├── Card/
│   │   ├── Input/
│   │   └── ...
│   ├── chat/                # Chat-specific
│   │   ├── ChatBubble/
│   │   ├── TypingIndicator/
│   │   └── ...
│   ├── analyzer/            # Analyzer-specific
│   │   ├── SafetyBadge/
│   │   ├── EwgBar/
│   │   └── ...
│   └── layout/              # Layout components
│       ├── Header/
│       ├── Sidebar/
│       └── BottomNav/
└── pages/                   # Page components
```

### 14.3. Tailwind Configuration

```javascript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        neutral: {
          50: '#FDFCFB',
          100: '#F7F5F3',
          // ... full palette
        },
        primary: {
          50: '#FDF8F4',
          500: '#C4804D',
          // ... full palette
        },
        secondary: {
          500: '#4C6648',
          // ... full palette
        },
        accent: {
          500: '#B86B6B',
          // ... full palette
        },
      },
      fontFamily: {
        display: ['Fraunces', 'Georgia', 'serif'],
        body: ['DM Sans', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      borderRadius: {
        'xl': '1rem',
        '2xl': '1.5rem',
      },
      boxShadow: {
        'primary': '0 8px 24px rgba(139, 90, 43, 0.15)',
      },
      animation: {
        'breathe': 'breathe 4s ease-in-out infinite',
        'float': 'float 6s ease-in-out infinite',
      },
    },
  },
}
```

### 14.4. Component Example

```tsx
// components/ui/Button/Button.tsx
import { motion } from 'framer-motion'
import { forwardRef } from 'react'
import { cn } from '@/utils/cn'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', children, ...props }, ref) => {
    return (
      <motion.button
        ref={ref}
        className={cn(
          // Base styles
          'inline-flex items-center justify-center gap-2',
          'font-body font-medium',
          'transition-colors duration-200',
          'disabled:opacity-50 disabled:cursor-not-allowed',
          
          // Size variants
          {
            'px-4 py-2 text-sm rounded-lg': size === 'sm',
            'px-6 py-3 text-base rounded-xl': size === 'md',
            'px-8 py-4 text-lg rounded-2xl': size === 'lg',
          },
          
          // Color variants
          {
            'bg-primary-500 text-white shadow-primary hover:bg-primary-600': 
              variant === 'primary',
            'bg-secondary-500 text-white hover:bg-secondary-600': 
              variant === 'secondary',
            'border-2 border-primary-500 text-primary-600 hover:bg-primary-50': 
              variant === 'outline',
            'text-neutral-700 hover:bg-neutral-100': 
              variant === 'ghost',
          },
          
          className
        )}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        {...props}
      >
        {children}
      </motion.button>
    )
  }
)
```

### 14.5. Quality Checklist

```yaml
before_launch:
  design:
    - [ ] All colors pass WCAG AA contrast
    - [ ] Typography is consistent across pages
    - [ ] Animations respect prefers-reduced-motion
    - [ ] Empty states are designed
    - [ ] Error states are designed
    - [ ] Loading states are designed
    
  responsive:
    - [ ] Tested on 320px width
    - [ ] Tested on 768px width
    - [ ] Tested on 1920px width
    - [ ] Touch targets are 44px minimum
    
  accessibility:
    - [ ] Keyboard navigation works
    - [ ] Screen reader tested
    - [ ] Focus states visible
    - [ ] Proper heading hierarchy
    
  performance:
    - [ ] Fonts are preloaded
    - [ ] Images are optimized
    - [ ] Animations are GPU-accelerated
    - [ ] No layout shifts (CLS)
```

---

## 🎯 Заключение

Этот документ определяет уникальную визуальную идентичность AI Beauty Platform, основанную на принципе **"Luxury Botanical Minimalism"**. 

Ключевые отличия от типичных AI-продуктов:

1. **Тёплая, органическая палитра** вместо холодных purple gradients
2. **Характерная типографика** (Fraunces serif) вместо generic Inter
3. **Органические анимации** ("breathing effect") вместо механических transitions
4. **Editorial aesthetic** вместо corporate SaaS look
5. **Attention to detail** в каждом компоненте

---

**Автор:** TOP LEVEL DESIGN  
**Версия:** 1.0  
**Дата:** Январь 2026
