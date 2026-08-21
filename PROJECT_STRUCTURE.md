# Voxly Project Structure

Complete overview of the project architecture and file organization.

## Directory Tree

```
voxly/
│
├── app/                          # Next.js App Router
│   ├── components/               # Reusable React components
│   │   ├── Navigation.tsx        # Top navigation bar
│   │   │                         # - Logo/branding
│   │   │                         # - Navigation links
│   │   │                         # - Auth status display
│   │   │                         # - Responsive mobile menu
│   │   │                         # - Sign-in/out buttons
│   │   │
│   │   ├── Hero.tsx              # Landing page hero section
│   │   │                         # - Main headline
│   │   │                         # - Tagline
│   │   │                         # - Primary CTA
│   │   │                         # - Hero image placeholder
│   │   │
│   │   ├── Features.tsx          # Features showcase section
│   │   │                         # - 3-column grid
│   │   │                         # - Feature cards with icons
│   │   │                         # - Create polls, Vote, Comment
│   │   │
│   │   ├── HowItWorks.tsx        # Step-by-step process section
│   │   │                         # - 3-step flow
│   │   │                         # - Sign in, Create poll, Share
│   │   │                         # - Arrow connectors
│   │   │
│   │   └── Footer.tsx            # Footer with links
│   │                             # - Brand info
│   │                             # - Product links
│   │                             # - Legal links
│   │
│   ├── context/                  # React Context providers
│   │   └── AuthContext.tsx       # Global auth state
│   │                             # - useAuth() hook
│   │                             # - Firebase listener
│   │                             # - Sign-out function
│   │
│   ├── profile/                  # Protected pages
│   │   └── page.tsx              # User profile page
│   │                             # - Redirect if not authenticated
│   │                             # - User info display
│   │                             # - Sign-out button
│   │
│   ├── layout.tsx                # Root layout
│   │                             # - AuthProvider wrapper
│   │                             # - Navigation bar
│   │                             # - Metadata
│   │
│   ├── page.tsx                  # Landing page (home)
│   │                             # - Imports all sections
│   │                             # - Hero + Features + HowItWorks + Footer
│   │
│   └── globals.css               # Global styles
│                                 # - CSS reset
│                                 # - Custom scrollbar
│                                 # - Font configuration
│
├── lib/                          # Utility libraries
│   └── firebase.ts               # Firebase configuration
│                                 # - Firebase app init
│                                 # - Auth instance
│                                 # - Google provider setup
│                                 # - Persistence settings
│
├── public/                       # Static assets (images, etc.)
│   └── (empty in V1)
│
├── Configuration Files
│   ├── package.json              # Dependencies and scripts
│   ├── tsconfig.json             # TypeScript configuration
│   ├── tailwind.config.ts        # Tailwind CSS theme
│   ├── postcss.config.js         # PostCSS plugins
│   ├── next.config.js            # Next.js configuration
│   └── .gitignore                # Git ignore rules
│
├── Environment Files
│   ├── .env.example              # Environment template
│   └── .env.local                # Local secrets (git-ignored)
│
└── Documentation
    ├── README.md                 # Project overview
    ├── SETUP_GUIDE.md            # Detailed setup instructions
    ├── QUICK_START.md            # Quick start checklist
    └── PROJECT_STRUCTURE.md      # This file
```

## Component Hierarchy

```
RootLayout
├── AuthProvider (context)
│   └── Navigation
│       ├── Logo / Brand
│       ├── Desktop Menu
│       │   ├── Features link
│       │   ├── How it Works link
│       │   └── About link
│       ├── Auth Status
│       │   ├── User Avatar (if signed in)
│       │   ├── User Name (if signed in)
│       │   └── Sign in/out button
│       └── Mobile Menu (responsive)
│
└── Page Content
    ├── Hero Component
    │   ├── Badge
    │   ├── Heading
    │   ├── Subheading
    │   ├── CTA Buttons
    │   └── Hero Image
    │
    ├── Features Component
    │   └── Feature Cards (x3)
    │       ├── Icon
    │       ├── Title
    │       └── Description
    │
    ├── HowItWorks Component
    │   └── Step Cards (x3)
    │       ├── Number
    │       ├── Title
    │       ├── Description
    │       └── Arrow Connector
    │
    └── Footer Component
        ├── Brand Section
        ├── Product Links
        ├── Company Links
        ├── Legal Links
        └── Copyright
```

## Data Flow

```
┌─────────────────────────────────────────────────┐
│         Firebase Authentication                 │
│  (Google Sign-In, Session Persistence)         │
└────────────────────┬────────────────────────────┘
                     │
                     ▼
         ┌───────────────────────────┐
         │   AuthContext (Provider)  │
         │  - useAuth() hook         │
         │  - user state             │
         │  - loading state          │
         │  - signOutUser function   │
         └───────────────────────────┘
                     │
      ┌──────────────┼──────────────┐
      ▼              ▼              ▼
  Navigation    Hero Component  Profile Page
  (Auth UI)    (CTA button)     (Protected)
```

## File Purpose Summary

### Pages
| File | Purpose |
|------|---------|
| `app/page.tsx` | Landing page (home route) |
| `app/profile/page.tsx` | User profile (protected route) |

### Components
| File | Purpose |
|------|---------|
| `Navigation.tsx` | Top bar with logo, links, auth |
| `Hero.tsx` | Hero section with CTA |
| `Features.tsx` | Features showcase (3 columns) |
| `HowItWorks.tsx` | Step-by-step guide (3 steps) |
| `Footer.tsx` | Footer with links |

### Context & Auth
| File | Purpose |
|------|---------|
| `AuthContext.tsx` | Global auth state management |
| `firebase.ts` | Firebase initialization & setup |

### Styling & Config
| File | Purpose |
|------|---------|
| `globals.css` | Global styles & CSS reset |
| `tailwind.config.ts` | Tailwind theme colors & fonts |
| `tsconfig.json` | TypeScript configuration |

## Key Features Location

### Landing Page
- **Location:** `app/page.tsx`
- **Sections:** Hero, Features, HowItWorks, Footer
- **Responsive:** Yes (Tailwind breakpoints)

### Navigation
- **Location:** `app/components/Navigation.tsx`
- **Features:** 
  - Logo with gradient background
  - Desktop & mobile menus
  - Auth state display
  - Sign-in/out buttons

### Authentication Flow
1. **Navigation.tsx** - Sign-in button
2. **Firebase (lib/firebase.ts)** - Google sign-in handler
3. **AuthContext.tsx** - State management
4. **profile/page.tsx** - Protected redirect

### Profile Page
- **Location:** `app/profile/page.tsx`
- **Features:**
  - Auth guard (redirects to home if not signed in)
  - Displays user name, email, avatar
  - Show polls placeholder
  - Sign-out button

## Styling System

### Tailwind Classes Used

**Layout:**
- `max-w-*` - Container max-widths
- `px-*, py-*` - Padding
- `gap-*` - Flexbox gaps
- `grid`, `flex` - Layout models

**Colors:**
- `bg-gradient-primary` - Blue-to-purple gradient
- `text-primary` - Blue text
- `text-secondary` - Dark gray text
- `bg-blue-100`, `text-blue-600` - Light blue bg/text

**Typography:**
- `font-bold`, `font-semibold`, `font-medium` - Font weights
- `text-*xl`, `text-lg`, `text-sm` - Font sizes

**Components:**
- `rounded-lg`, `rounded-xl`, `rounded-2xl` - Border radius
- `border`, `border-gray-200` - Borders
- `shadow-lg`, `shadow` - Box shadows
- `hover:*` - Hover states
- `transition`, `duration-300` - Transitions

**Responsive:**
- `sm:`, `md:`, `lg:` - Breakpoints
- `hidden md:flex` - Show on desktop only
- `md:grid-cols-3` - 3 columns on desktop

## Environment Variables

All variables are stored in `.env.local` and prefixed with `NEXT_PUBLIC_`:

```env
NEXT_PUBLIC_FIREBASE_API_KEY
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
NEXT_PUBLIC_FIREBASE_PROJECT_ID
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
NEXT_PUBLIC_FIREBASE_APP_ID
```

**Why `NEXT_PUBLIC_`?** These values are safe to expose in the browser. Firebase is designed to have public credentials.

## Dependencies

**Core:**
- `next@^14.0.0` - React framework
- `react@^18.2.0` - UI library
- `react-dom@^18.2.0` - DOM rendering

**Styling:**
- `tailwindcss@^3.4.1` - Utility CSS
- `postcss@^8.4.32` - CSS processing
- `autoprefixer@^10.4.16` - Browser prefixes

**Authentication:**
- `firebase@^10.7.0` - Firebase SDK

**Icons:**
- `lucide-react@^0.292.0` - Icon library

**Development:**
- `typescript@^5.3.3` - Type checking
- `eslint@^8.54.0` - Code linting

## Build & Deployment

### Local Development
```bash
npm run dev          # Start dev server
```

### Production Build
```bash
npm run build        # Create optimized build
npm start            # Start production server
```

### Deployment
```bash
# Push to GitHub first
git push origin main

# Deploy to Vercel via dashboard
# (or use `vercel deploy`)
```

## Next Steps (V2+)

These files would be added:
```
app/
├── polls/
│   ├── page.tsx              # Polls listing
│   ├── [id]/
│   │   └── page.tsx          # Poll detail/voting
│   └── create/
│       └── page.tsx          # Create poll form
├── components/
│   ├── PollCard.tsx          # Poll UI component
│   ├── PollForm.tsx          # Create poll form
│   └── VoteButton.tsx        # Vote interaction
└── api/
    ├── polls/
    │   ├── route.ts          # Create poll endpoint
    │   └── [id]/
    │       └── route.ts      # Vote endpoint
```

---

This structure provides a clean, scalable foundation for building out poll functionality in V2 and beyond.
