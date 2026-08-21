# Voxly Customization Guide

Common customizations you can make to Voxly without deep code changes.

## 🎨 Colors & Branding

### Change Primary Color

Edit `tailwind.config.ts`:

```typescript
theme: {
  extend: {
    colors: {
      primary: '#3B82F6',      // ← Change this (currently blue)
      'primary-dark': '#1E40AF',
      'primary-light': '#DBEAFE',
    },
  },
},
```

**Suggested colors:**
- Modern Blue: `#3B82F6` (current)
- Vibrant Purple: `#7C3AED`
- Fresh Green: `#10B981`
- Bold Orange: `#F97316`

### Change Secondary (Dark Text) Color

Edit `tailwind.config.ts`:

```typescript
secondary: '#1F2937',    // ← Change this (currently dark gray)
```

### Change Accent Color

Edit `tailwind.config.ts`:

```typescript
accent: '#8B5CF6',       // ← Change this (currently purple)
```

## 🏷️ Branding & Copy

### Change App Name

1. **In Navigation** - Edit `app/components/Navigation.tsx`:
```tsx
<span>Voxly</span>  // ← Change this
```

2. **In Footer** - Edit `app/components/Footer.tsx`:
```tsx
<span>Voxly</span>  // ← Change this
```

3. **In page.tsx** (layout) - Edit `app/layout.tsx`:
```typescript
export const metadata: Metadata = {
  title: 'Voxly - Your Voice, Amplified',  // ← Change this
  description: '...',
}
```

### Change Tagline

Edit `app/components/Hero.tsx`:

```tsx
<p className="text-xl sm:text-2xl text-gray-600 mb-12">
  Create engaging polls, gather feedback in real-time, and make decisions 
  together with your community.  {/* ← Change this */}
</p>
```

### Change Hero Heading

Edit `app/components/Hero.tsx`:

```tsx
<h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold">
  Your Voice,{' '}
  <span className="bg-gradient-primary bg-clip-text text-transparent">
    Amplified  {/* ← Change this */}
  </span>
</h1>
```

### Change CTA Button Text

Edit `app/components/Hero.tsx`:

```tsx
<button>
  Sign in with Google  {/* ← Change this text */}
</button>
```

## 🎯 Feature List Customization

Edit `app/components/Features.tsx` and modify the `features` array:

```typescript
const features = [
  {
    icon: BarChart3,  // Change icon from lucide-react
    title: 'Create Polls',  // ← Change title
    description: 'Easily create and customize polls...',  // ← Change description
  },
  // Add or remove items here
]
```

**Available icons from Lucide React:**
```
BarChart3, MessageCircle, Users, Zap, Check, Heart, 
Star, Award, Trending, Target, Settings, Share, etc.
```

See all: https://lucide.dev/

## 📋 How It Works Steps

Edit `app/components/HowItWorks.tsx`:

```typescript
const steps = [
  {
    number: '1',
    title: 'Sign In',  // ← Change title
    description: 'Create your account securely...',  // ← Change description
  },
  {
    number: '2',
    title: 'Create a Poll',
    description: '...',
  },
  // Modify as needed
]
```

## 🔗 Footer Links

Edit `app/components/Footer.tsx`:

```tsx
<Link href="#about" className="...">
  About  {/* ← Change link text */}
</Link>

<a href="https://example.com" className="...">
  Contact  {/* ← Change link text & href */}
</a>
```

## 🎨 Logo Customization

### Replace Text-Based Logo with Image Logo

Edit `app/components/Navigation.tsx`:

Replace this:
```tsx
<div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center text-white text-sm font-bold">
  V
</div>
```

With an image:
```tsx
<img 
  src="/logo.png" 
  alt="Voxly" 
  className="w-8 h-8"
/>
```

Then place your logo at `public/logo.png`.

### Customize the Gradient Badge

Edit the badge color in `app/components/Hero.tsx`:

```tsx
<div className="mb-8 inline-flex items-center gap-2 px-4 py-2 bg-blue-100 rounded-full">
  {/* Change bg-blue-100 to any Tailwind color */}
</div>
```

## 🔤 Typography Changes

### Change Default Font

Edit `app/layout.tsx`:

```tsx
import { Inter, Poppins } from 'next/font/google'

const poppins = Poppins({ 
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
})

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={poppins.className}>
        {/* content */}
      </body>
    </html>
  )
}
```

Then update `tailwind.config.ts`:
```typescript
fontFamily: {
  sans: ['var(--font-poppins)', 'system-ui', 'sans-serif'],
}
```

**Popular fonts to try:**
- `Poppins` - Modern, friendly
- `Playfair Display` - Elegant, bold
- `Montserrat` - Clean, geometric
- `Outfit` - Tech-forward

## 🎯 Button Styling

### Make Buttons Larger

Edit button classes, e.g., in `app/components/Hero.tsx`:

```tsx
<button className="px-8 py-4">  {/* ← px-8 py-4 is padding */}
  Sign in with Google
</button>

/* Could change to larger: px-12 py-6 */
```

### Change Button Style (More Rounded)

```tsx
<button className="rounded-lg">     {/* ← Current: lg = 8px */}
  Sign in
</button>

/* Change to: rounded-full for pill-shaped button */
```

### Add Button Icons

```tsx
import { Zap } from 'lucide-react'

<button className="flex items-center gap-2">
  <Zap size={20} />
  Sign in with Google
</button>
```

## 🚀 Hero Section Customization

### Add Background Image

Edit `app/components/Hero.tsx`:

```tsx
<section className="pt-32 pb-20 px-4 bg-gradient-to-br from-blue-50 via-white to-purple-50 bg-cover"
  style={{ backgroundImage: 'url(/bg-image.jpg)' }}>
```

### Change Hero Layout

Current: Centered text with image below

To make it side-by-side, change the grid to:
```tsx
<div className="grid md:grid-cols-2 gap-12 items-center">
  {/* Text on left */}
  <div>
    {/* heading, subheading, buttons */}
  </div>
  {/* Image on right */}
  <div>
    {/* hero image */}
  </div>
</div>
```

## 📱 Responsive Breakpoints

Tailwind breakpoints (already in the code):
- `sm:` - 640px and up
- `md:` - 768px and up
- `lg:` - 1024px and up
- `xl:` - 1280px and up

Example:
```tsx
<div className="text-2xl md:text-4xl lg:text-5xl">
  {/* Small: 2xl, tablet+: 4xl, desktop+: 5xl */}
</div>
```

## 🌙 Dark Mode (Optional)

To enable dark mode, edit `tailwind.config.ts`:

```typescript
export default {
  darkMode: 'class',  // ← Add this line
  // ... rest of config
}
```

Then in components:
```tsx
<div className="bg-white dark:bg-slate-900 text-black dark:text-white">
  Content that changes in dark mode
</div>
```

## 🔐 Firebase Customization

### Change Sign-In Method (Future)

Currently only Google is enabled in Firebase Console.

To add more methods (V2+), enable them in Firebase Console:
1. Go to **Authentication** > **Sign-in method**
2. Enable: Email, Phone, GitHub, etc.
3. Update `app/components/Navigation.tsx` to show additional buttons

### Change Google OAuth Scopes

Edit `lib/firebase.ts`:

```typescript
googleProvider.addScope('profile')
googleProvider.addScope('email')
// Add more scopes if needed
```

## 📊 Removing Sections

### Remove Features Section

Edit `app/page.tsx`:

```tsx
export default function Home() {
  return (
    <>
      <Hero />
      {/* <Features /> */}  {/* ← Comment this out */}
      <HowItWorks />
      <Footer />
    </>
  )
}
```

### Remove How It Works Section

```tsx
export default function Home() {
  return (
    <>
      <Hero />
      <Features />
      {/* <HowItWorks /> */}  {/* ← Comment this out */}
      <Footer />
    </>
  )
}
```

## 🎨 Gradient Customization

### Change Hero Gradient

Edit `app/components/Hero.tsx`:

```tsx
<span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
  {/* Change colors here */}
</span>
```

Available gradients in Tailwind:
- `from-blue-600 to-purple-600` (current)
- `from-pink-600 to-red-600` (vibrant)
- `from-green-600 to-blue-600` (fresh)
- `from-indigo-600 to-pink-600` (trendy)

## 📝 Profile Page Customization

Edit `app/profile/page.tsx`:

### Change Placeholder Section

```tsx
<h3 className="text-xl font-bold">Your Polls</h3>  {/* ← Change title */}
<p className="text-gray-600">
  Your polls will appear here once you create your first one!  {/* ← Change text */}
</p>
```

### Add Additional User Information

```tsx
<div className="flex items-center gap-4">
  <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 rounded-lg">
    <Phone size={20} className="text-blue-600" />
  </div>
  <div>
    <p className="text-sm text-gray-600">Phone</p>
    <p className="font-semibold text-gray-900">{user.phoneNumber}</p>
  </div>
</div>
```

## 🚀 Performance Tips

1. **Use `next/image` for images** (instead of `<img>`)
2. **Code split** - Components are already split by route
3. **Lazy load** - Components load only when needed
4. **Optimize fonts** - Already using `@next/font`

## 📚 Resources

- **Tailwind Colors:** https://tailwindcss.com/docs/customizing-colors
- **Lucide Icons:** https://lucide.dev/
- **Google Fonts:** https://fonts.google.com/
- **Color Palettes:** https://coolors.co/

---

**Need more help? Check SETUP_GUIDE.md or README.md** 🎨
