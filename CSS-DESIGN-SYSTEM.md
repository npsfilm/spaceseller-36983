# **Studio Design System Documentation**

## **Table of Contents**

1. [Overview](https://www.google.com/search?q=%23overview)  
2. [Color System](https://www.google.com/search?q=%23color-system)  
3. [Typography](https://www.google.com/search?q=%23typography)  
4. [Spacing & Layout](https://www.google.com/search?q=%23spacing--layout)  
5. [Shadows & Elevation](https://www.google.com/search?q=%23shadows--elevation)  
6. [Transitions & Micro-interactions](https://www.google.com/search?q=%23transitions--micro-interactions)  
7. [Border Radius](https://www.google.com/search?q=%23border-radius)  
8. [Button Variants](https://www.google.com/search?q=%23button-variants)  
9. [Component Patterns](https://www.google.com/search?q=%23component-patterns)  
10. [Responsive Design](https://www.google.com/search?q=%23responsive-design)  
11. [Dark Mode](https://www.google.com/search?q=%23dark-mode)  
12. [Utility Classes](https://www.google.com/search?q=%23utility-classes)  
13. [Usage Guidelines](https://www.google.com/search?q=%23usage-guidelines)

## **Overview**

The Studio design system is built on a token-based approach using **HSL color format** for maximum flexibility and maintainability. All colors, shadows, and transitions are defined as CSS custom properties in `src/index.css` and extended through `tailwind.config.ts`.

### **Design Principles**

* **Intentional & Token-based**: All design decisions use semantic tokens, never hard-coded values.  
* **Warm, Earthy Palette**: Colors are sophisticated, warm, and natural, creating a premium, comfortable feel.  
* **Mobile-first**: Responsive design starts with mobile and scales up with consideration.  
* **Considered & Accessible**: WCAG AA compliant color contrasts and semantic HTML are priorities.  
* **Refined & Responsive**: The system is designed to be performant, with subtle interactions.

## **Color System**

All colors are defined in HSL format for both light and dark modes. **Never use direct color values** like `text-white`, `bg-black` in components \- always use semantic tokens.

### **Core Palette**

#### **Light Mode**

```
/* Brand Colors */
--primary: 140 30% 30%;           /* Deep, earthy green - premium, calm */
--primary-foreground: 40 30% 98%; /* Warm cream text on primary */
--primary-glow: 140 30% 40%;      /* Lighter green for hover states */

--accent: 50 90% 55%;             /* Warm, energetic yellow - for CTAs */
--accent-foreground: 140 30% 30%; /* Earthy green text on accent (like Mode) */
--accent-glow: 50 90% 65%;        /* Lighter yellow for hover */
```

#### **Dark Mode**

```
/* Brand Colors */
--primary: 140 35% 45%;           /* Brighter green for dark backgrounds */
--primary-foreground: 40 30% 98%; /* Warm cream text on primary */
--primary-glow: 140 35% 55%;      /* Lighter green for dark mode glows */

--accent: 50 90% 55%;             /* Same vibrant yellow */
--accent-foreground: 140 30% 30%; /* Earthy green text on accent */
--accent-glow: 50 90% 65%;        /* Lighter yellow for hover */
```

**Usage:**

```
// ✅ CORRECT
<Button variant="cta">Click me</Button>
<div className="bg-primary text-primary-foreground">Content</div>

// ❌ WRONG
<Button className="bg-yellow-500 text-green-800">Click me</Button>
```

### **Background & Foreground**

#### **Light Mode**

```
--background: 40 30% 98%;          /* Warm cream (like warm-50) */
--foreground: 0 0% 10%;            /* Near-black (like Mode's text) */
```

#### **Dark Mode**

```
--background: 0 0% 10%;            /* Near-black (like Mode's dark bg) */
--foreground: 40 30% 98%;          /* Warm cream text */
```

### **Semantic Colors**

#### **Cards & Surfaces**

```
/* Light Mode */
--card: 0 0% 100%;                 /* Pure white cards */
--card-foreground: 0 0% 10%;       /* Dark text on cards */

/* Dark Mode */
--card: 0 0% 15%;                  /* Dark gray cards (like warm-700) */
--card-foreground: 40 30% 98%;     /* Light text on cards */
```

#### **Secondary Colors**

```
/* Light Mode */
--secondary: 40 20% 94%;           /* Light warm gray (like warm-250) */
--secondary-foreground: 0 0% 20%;  /* Dark gray text */

/* Dark Mode */
--secondary: 0 0% 20%;             /* Darker gray */
--secondary-foreground: 40 30% 98%;/* Light text */
```

#### **Muted Colors**

```
/* Light Mode */
--muted: 40 10% 90%;               /* Very light warm gray */
--muted-foreground: 0 0% 45%;      /* Medium gray text */

/* Dark Mode */
--muted: 0 0% 20%;                 /* Dark gray */
--muted-foreground: 40 10% 65%;    /* Light gray text */
```

#### **Destructive Colors**

```
/* Light Mode */
--destructive: 0 84% 60%;          /* Bright red */
--destructive-foreground: 0 0% 100%; /* White text */

/* Dark Mode */
--destructive: 0 62% 50%;          /* Deeper red */
--destructive-foreground: 0 0% 100%; /* White text */
```

### **Border & Input Colors**

```
/* Light Mode */
--border: 40 10% 85%;              /* Light warm gray borders */
--input: 40 10% 85%;               /* Input field borders */
--ring: 140 30% 30%;               /* Focus ring color (green) */

/* Dark Mode */
--border: 0 0% 25%;                /* Dark borders */
--input: 0 0% 25%;                 /* Dark input borders */
--ring: 140 35% 45%;               /* Brighter green focus ring */
```

### **Tailwind Color Classes**

All HSL colors are available as Tailwind classes:

```
// Background colors
className="bg-primary bg-accent bg-secondary bg-muted bg-background"

// Text colors
className="text-foreground text-primary text-accent text-muted-foreground"

// Border colors
className="border-border border-primary border-accent"

// With variants
className="hover:bg-primary-glow hover:bg-accent-glow"
```

## **Typography**

### **Gilroy Font Family**

The Studio design system uses **Gilroy** as the primary typeface for its clean, purposeful, and modern aesthetic. (Per request, this font is retained).

#### **Font Weights Available**

```
font-weight: 300;  /* Light */
font-weight: 400;  /* Regular */
font-weight: 500;  /* Medium */
font-weight: 600;  /* SemiBold */
font-weight: 700;  /* Bold */
font-weight: 800;  /* ExtraBold */
```

### **Monospace Font**

The system pairs Gilroy with a **monospaced font** for technical details, captions, and code snippets, adding a touch of engineered precision (inspired by the Mode site's `font-mono`).

```
font-family: 'SF Mono', 'Menlo', 'monospace';
```

**Usage:**

```
<p className="font-mono text-sm text-muted-foreground">
  65% Layout / 7.0° Angle
</p>
```

### **Typography Scale**

```
// Headings
<h1 className="text-4xl md:text-5xl lg:text-6xl font-bold">
  Main Headline
</h1>

<h2 className="text-3xl md:text-4xl font-semibold">
  Section Headline
</h2>

<h3 className="text-2xl md:text-3xl font-semibold">
  Subsection
</h3>

<h4 className="text-xl md:text-2xl font-medium">
  Card Title
</h4>

// Body Text
<p className="text-base text-muted-foreground">
  Standard paragraph text
</p>

<p className="text-lg text-foreground">
  Large body text
</p>

<p className="text-sm text-muted-foreground font-mono">
  Small text / captions / specs
</p>
```

### **Typography Guidelines**

1. **Headlines**: Use bold (700) or extra-bold (800) weights.  
2. **Subheadings**: Use semi-bold (600) weight.  
3. **Body Text**: Use regular (400) or medium (500) weight.  
4. **Captions/Specs**: Use `font-mono` in regular (400) weight with muted foreground color.

## **Spacing & Layout**

### **Container System**

```
// Max width container with responsive padding
<div className="container mx-auto px-4 sm:px-6 lg:px-8">
  {/* Content */}
</div>

// Alternative: max-w-7xl
<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
  {/* Content */}
</div>
```

### **Section Spacing**

```
// Standard section spacing
<section className="py-20">
  {/* Content */}
</section>

// Large section spacing
<section className="py-24 md:py-32">
  {/* Content */}
</section>

// Section with background
<section className="py-20 bg-muted">
  {/* Content */}
</section>
```

## **Shadows & Elevation**

Shadows are subtle and used to create a sense of physical depth and elevation, not for flashy effects.

### **Shadow Card**

Subtle depth for component layering.

```
/* Light Mode */
--shadow-card: 0 4px 20px -4px hsl(40 10% 50% / 0.1);

/* Dark Mode */
--shadow-card: 0 4px 20px -4px hsl(0 0% 0% / 0.3);
```

**Usage:**

```
<div className="shadow-card rounded-lg p-6">
  {/* Component with subtle depth */}
</div>
```

### **Shadow Large**

A more pronounced shadow for modals or elevated active states.

```
/* Light Mode */
--shadow-lg: 0 10px 40px -10px hsl(40 10% 40% / 0.2);

/* Dark Mode */
--shadow-lg: 0 10px 40px -10px hsl(0 0% 0% / 0.5);
```

**Usage:**

```
<Card className="hover:shadow-lg transition-shadow">
  {/* Elevated card */}
</Card>
```

## **Transitions & Micro-interactions**

Animations are purposeful and subtle, focusing on smooth state transitions (hover, focus) rather than flashy page loads.

### **Custom Easing Function**

```
--transition-base: all 0.2s ease-out;
```

**Usage:**

```
<div className="transition-all duration-200 ease-out hover:scale-105">
  {/* Smooth hover effect */}
</div>

<Button variant="default">
  {/* Uses --transition-base on colors and shadow */}
</Button>
```

### **Guidelines**

* **Use:** `opacity`, `transform`, `background-color`, `color`, `border-color`.  
* **Avoid:** Animating layout properties like `width`, `height`, or `margin`, which are less performant.

## **Border Radius**

A subtle radius is used to create a refined, engineered feel.

```
--radius: 0.5rem;  /* 8px base */
```

### **Radius Variants**

```
// Large radius (base)
<div className="rounded-lg">  /* 8px */

// Medium radius
<div className="rounded-md">  /* 6px (base - 2px) */

// Small radius
<div className="rounded-sm">  /* 4px (base - 4px) */

// Full rounded (pills)
<div className="rounded-full">
```

**Guidelines:**

* Cards and containers: `rounded-lg`  
* Buttons: `rounded-md`  
* Small elements (badges): `rounded-full` or `rounded-md`  
* Images: `rounded-lg`

## **Button Variants**

Complete documentation of all button variants from `src/components/ui/button.tsx`.

### **Default Variant**

The primary "Build Yours" style button.

```
<Button variant="default">
  Build Yours
</Button>
```

**Styling:**

* Background: `bg-foreground` (Black)  
* Text: `text-background` (Cream)  
* Hover: `hover:bg-foreground/90`

### **CTA Variant**

Conversion-focused button with accent color (like Mode's "Sign Up").

```
<Button variant="cta" size="lg">
  Sign Up
</Button>
```

**Styling:**

* Background: `bg-accent` (Yellow)  
* Text: `text-accent-foreground` (Green)  
* Font: `font-semibold`  
* Hover: `hover:bg-accent-glow`

### **Outline Variant**

Secondary actions with border and transparent background.

```
<Button variant="outline">
  Learn More
</Button>
```

**Styling:**

* Border: `border border-border`  
* Background: `bg-background` (Transparent/Cream)  
* Hover: `hover:bg-secondary hover:text-secondary-foreground`

### **Secondary Variant**

Subtle secondary actions on warm gray.

```
<Button variant="secondary">
  Cancel
</Button>
```

**Styling:**

* Background: `bg-secondary` (Warm Gray)  
* Text: `text-secondary-foreground`  
* Hover: `hover:bg-secondary/80`

### **Ghost Variant**

Minimal button for navigation and subtle interactions.

```
<Button variant="ghost">
  Skip
</Button>
```

**Styling:**

* Background: Transparent  
* Hover: `hover:bg-secondary`

### **Destructive Variant**

Delete, remove, or destructive actions.

```
<Button variant="destructive">
  Delete Account
</Button>
```

**Styling:**

* Background: `bg-destructive`  
* Text: `text-destructive-foreground`  
* Hover: `hover:bg-destructive/90`

### **Link Variant**

Text-based navigation button.

```
<Button variant="link">
  Read Documentation
</Button>
```

**Styling:**

* Text: `text-primary` (Green)  
* Decoration: `underline-offset-4 hover:underline`

### **Size Variants**

```
// Small
<Button size="sm">Small Button</Button>     // h-9, px-3

// Default
<Button size="default">Default</Button>     // h-10, px-4

// Large
<Button size="lg">Large Button</Button>     // h-11, px-8

// Icon only
<Button size="icon">
  <Icon />
</Button>                                    // h-10, w-10
```

## **Component Patterns**

### **Card Pattern**

```
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";

<Card className="shadow-card hover:shadow-lg transition-shadow duration-200 ease-out">
  <CardHeader>
    <CardTitle>Card Title</CardTitle>
    <CardDescription>Supporting description</CardDescription>
  </CardHeader>
  <CardContent>
    {/* Main content */}
  </CardContent>
  <CardFooter>
    <Button variant="default">Action</Button>
  </CardFooter>
</Card>
```

### **Form Pattern**

```
<form className="space-y-4">
  <div className="space-y-2">
    <label className="text-sm font-medium text-foreground">
      Label
    </label>
    <input 
      className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground focus:ring-2 focus:ring-ring"
      type="text"
    />
  </div>
  <Button variant="default" size="lg" className="w-full">
    Submit
  </Button>
</form>
```

### **Navigation Pattern**

```
<nav className="flex items-center gap-6">
  <Button variant="ghost">Home</Button>
  <Button variant="ghost">Products</Button>
  <Button variant="ghost">About</Button>
  <Button variant="cta">Sign Up</Button>
</nav>
```

## **Responsive Design**

### **Breakpoint System**

```
// Tailwind default breakpoints
sm: 640px   // Small tablets
md: 768px   // Tablets
lg: 1024px  // Laptops
xl: 1280px  // Desktops
2xl: 1536px // Large desktops
```

### **Mobile-First Approach**

Always start with mobile styles, then add larger breakpoints:

```
// ✅ CORRECT - Mobile first
<h1 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl">
  Responsive Headline
</h1>

// ❌ WRONG - Desktop first
<h1 className="text-6xl xl:text-5xl lg:text-4xl md:text-3xl">
  Wrong approach
</h1>
```

## **Dark Mode**

Dark mode is implemented using the `class` strategy with the `.dark` class on the root element.

### **Toggle Implementation**

```
import { useTheme } from "next-themes";

function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  
  return (
    <Button
      variant="ghost"
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
    >
      Toggle Theme
    </Button>
  );
}
```

### **Dark Mode Color Adaptations**

All colors automatically adapt to dark mode through CSS custom properties.

```
// No special dark mode classes needed!
<div className="bg-background text-foreground">
  {/* Automatically adapts to dark mode */}
</div>

<Card className="bg-card text-card-foreground">
  {/* Card colors adapt automatically */}
</Card>
```

## **Utility Classes**

### **cn() Utility Function**

Combine class names with Tailwind Merge to prevent conflicts:

```
import { cn } from "@/lib/utils";

<div className={cn(
  "base-classes",
  condition && "conditional-classes",
  "override-classes"
)}>
  {/* Content */}
</div>
```

## **Usage Guidelines**

### **✅ Do's**

1. **Always use semantic tokens**

```
✅ <div className="bg-primary text-primary-foreground">
✅ <Button variant="cta">Get Started</Button>
```

2.   
   **Follow mobile-first responsive design**

```
✅ <h1 className="text-3xl md:text-5xl lg:text-6xl">
```

3.   
   **Use consistent spacing**

```
✅ <section className="py-20">
✅ <div className="space-y-4">
```

4.   
   **Use `font-mono` for captions and specs**

```
✅ <p className="font-mono text-sm text-muted-foreground">
```

5.   
   **Use subtle transitions**

```
✅ <Button className="transition-colors duration-200 ease-out">
```

### **❌ Don'ts**

1. **Never use hard-coded colors**

```
❌ <div className="bg-green-800 text-yellow-500">
❌ <div className="text-[#FAFA9A]">
```

2.   
   **Don't use flashy, large-scale animations**

```
❌ <div className="animate-slide-in-left">
```

3.   
   **Don't mix color formats**

```
❌ style={{ backgroundColor: 'rgb(250, 250, 245)' }}
```

4.   
   **Don't create custom shadows without tokens**

```
❌ <div className="shadow-[0_10px_40px_rgba(0,0,0,0.5)]">
```

5.   
   **Don't ignore dark mode**

```
❌ <div className="bg-white text-black">  // Breaks in dark mode
```

## **Quick Reference**

### **Most Common Patterns**

```
// Hero Section (Uses an image, not a gradient)
<section className="relative min-h-[85vh] bg-background">
  {/* Full-bleed image goes here, e.g., <img /> */}
  <div className="absolute bottom-12 left-0 right-0 z-10">
    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
      <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
        Headline
      </h1>
      <Button variant="default" size="xl">
        Build Yours
      </Button>
    </div>
  </div>
</section>

// Feature Card
<Card className="shadow-card hover:shadow-lg transition-shadow">
  <CardHeader>
    {/* Use a meaningful icon or image */}
    <CardTitle>Feature Title</CardTitle>
    <CardDescription className="font-mono">Feature specs</CardDescription>
  </CardHeader>
</Card>

// CTA Section
<section className="bg-accent text-accent-foreground py-20">
  <div className="container mx-auto px-4 text-center">
    <h2 className="text-3xl md:text-4xl font-bold mb-4">
      Ready to get started?
    </h2>
    <Button variant="default" size="lg">
      Start Now
    </Button>
  </div>
</section>
```

## **Maintenance**

### **When Adding New Colors**

1. Define in `src/index.css` as HSL custom properties  
2. Add to both `:root` (light) and `.dark` (dark mode)  
3. Extend in `tailwind.config.ts` colors object  
4. Document in this file  
5. Test in both light and dark modes

### **When Adding New Components**

1. Use existing tokens and variants  
2. Follow responsive patterns  
3. Ensure dark mode compatibility  
4. Add subtle hover and focus states  
5. Test accessibility  
6. Document common patterns here

**Last Updated**: 2025-11-09

**Maintained by**: Studio Development Team

