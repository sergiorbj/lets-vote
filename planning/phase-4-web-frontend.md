# Phase 4: Web Frontend Development

## Overview
This document outlines the web frontend implementation using React, Vite, Tailwind CSS, and follows the architecture of services/hooks/components separation.

---

## 1. Application Flow

```
Login Page (/)
    ↓ (email validation)
Vote Page (/vote)
    ↓ (after voting)
Ranking Page (/ranking)
```

---

## 2. Pages Design

### Page 1: Login Page

**Route:** `/` or `/login`

**Purpose:** User enters email to access the voting system

**UI Elements:**
- App title/logo
- Email input field
- "Continue" button
- Loading state while checking user
- Error message if user not found

**Functionality:**
1. User types email
2. On submit: Call `GET /api/users/:email`
3. If user exists: Store email in context/state, navigate to `/vote`
4. If user NOT exists: Show error "User not found. Please use a valid email."

**Validation:**
- Email format validation (Zod)
- Non-empty field

---

### Page 2: Vote Page

**Route:** `/vote`

**Purpose:** Display features as checkboxes for user to select and vote

**UI Elements:**
- User email display (top right)
- Feature list (checkbox for each feature)
  - Feature title
  - Feature description (truncated or collapsible)
  - Vote count badge
  - Checkbox (checked if user already voted)
- "Submit Votes" button (disabled if no changes)
- After successful vote:
  - Success message
  - "View Rankings" button appears

**Functionality:**
1. Load all features: `GET /api/features`
2. Load user's votes: `GET /api/votes?userEmail={email}`
3. Display features with checkboxes:
   - Pre-check features user already voted for
   - Allow user to check/uncheck
4. On "Submit Votes":
   - Compare new selections with existing votes
   - For newly checked: `POST /api/features/:id/vote`
   - For newly unchecked: `DELETE /api/features/:id/vote`
   - Show success message
   - Display "View Rankings" button
5. Navigate to `/ranking` on button click

**Business Rules:**
- User can vote on multiple features
- User can change votes (uncheck to remove vote)
- User can vote on their own features

---

### Page 3: Feature Ranking Page

**Route:** `/ranking`

**Purpose:** Display all features sorted by votes, highlight top 3

**UI Elements:**
- Title: "Feature Rankings"
- Feature list (sorted by votes descending)
  - **Top 3 features: Special styling (medals, badges, or colors)**
    - 1st place: Gold medal/badge
    - 2nd place: Silver medal/badge
    - 3rd place: Bronze medal/badge
  - Feature title
  - Feature description
  - Vote count (large, prominent)
  - Created by (user name)
- "Back to Vote" button
- "Logout" button (returns to login)

**Functionality:**
1. Load all features: `GET /api/features` (already sorted by votes)
2. Display with top 3 highlighted
3. Show vote counts prominently
4. Allow navigation back to vote page

---

## 3. Routing Structure

```typescript
// routes.tsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';

<BrowserRouter>
  <Routes>
    <Route path="/" element={<LoginPage />} />
    <Route path="/vote" element={<VotePage />} />
    <Route path="/ranking" element={<RankingPage />} />
  </Routes>
</BrowserRouter>
```

**Protected Routes:**
- `/vote` and `/ranking` require email in context/state
- If no email, redirect to `/`

---

## 4. Color Palette Suggestions

### Option 1: Modern Blue & Purple (Recommended)
**Theme:** Professional, Tech-forward

```css
--primary: #6366F1      /* Indigo 500 - Primary actions */
--secondary: #8B5CF6    /* Violet 500 - Secondary elements */
--accent: #EC4899       /* Pink 500 - Highlights, badges */
--success: #10B981      /* Emerald 500 - Success states */
--background: #F9FAFB   /* Gray 50 - Page background */
--surface: #FFFFFF      /* White - Cards, surfaces */
--text: #111827         /* Gray 900 - Primary text */
--text-secondary: #6B7280 /* Gray 500 - Secondary text */
```

**Usage:**
- Primary: Main buttons, links, active states
- Secondary: Secondary buttons, hover states
- Accent: Vote badges, top rankings
- Success: Success messages, checkmarks
- Background: Page background
- Surface: Cards, modals
- Text: Headings, body text

---

### Option 2: Fresh Green & Teal
**Theme:** Fresh, Energetic

```css
--primary: #14B8A6      /* Teal 500 */
--secondary: #06B6D4    /* Cyan 500 */
--accent: #F59E0B       /* Amber 500 */
--success: #22C55E      /* Green 500 */
--background: #F0FDF4   /* Green 50 */
--surface: #FFFFFF      /* White */
--text: #0F172A         /* Slate 900 */
--text-secondary: #64748B /* Slate 500 */
```

---

### Option 3: Warm Orange & Red
**Theme:** Energetic, Engaging

```css
--primary: #F97316      /* Orange 500 */
--secondary: #EF4444    /* Red 500 */
--accent: #FBBF24       /* Amber 400 */
--success: #10B981      /* Emerald 500 */
--background: #FFF7ED   /* Orange 50 */
--surface: #FFFFFF      /* White */
--text: #1F2937         /* Gray 800 */
--text-secondary: #6B7280 /* Gray 500 */
```

---

### Option 4: Dark Mode Friendly (Blue & Purple)
**Theme:** Modern, Dark-mode compatible

```css
--primary: #3B82F6      /* Blue 500 */
--secondary: #A855F7    /* Purple 500 */
--accent: #06B6D4       /* Cyan 500 */
--success: #10B981      /* Emerald 500 */
--background: #0F172A   /* Slate 900 - Dark mode */
--surface: #1E293B      /* Slate 800 - Cards */
--text: #F1F5F9         /* Slate 100 - Light text */
--text-secondary: #94A3B8 /* Slate 400 */
```

---

### Option 5: Minimal Monochrome (Accent Blue)
**Theme:** Clean, Minimal, Professional

```css
--primary: #3B82F6      /* Blue 500 */
--secondary: #6B7280    /* Gray 500 */
--accent: #10B981       /* Emerald 500 */
--success: #22C55E      /* Green 500 */
--background: #FFFFFF   /* White */
--surface: #F9FAFB      /* Gray 50 */
--text: #111827         /* Gray 900 */
--text-secondary: #6B7280 /* Gray 500 */
```

---

## 5. Tailwind CSS Configuration

### tailwind.config.js

```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#EEF2FF',
          100: '#E0E7FF',
          200: '#C7D2FE',
          300: '#A5B4FC',
          400: '#818CF8',
          500: '#6366F1',  // Main primary
          600: '#4F46E5',
          700: '#4338CA',
          800: '#3730A3',
          900: '#312E81',
        },
        secondary: {
          50: '#FAF5FF',
          100: '#F3E8FF',
          200: '#E9D5FF',
          300: '#D8B4FE',
          400: '#C084FC',
          500: '#8B5CF6',  // Main secondary
          600: '#7C3AED',
          700: '#6D28D9',
          800: '#5B21B6',
          900: '#4C1D95',
        },
        accent: {
          50: '#FDF2F8',
          100: '#FCE7F3',
          200: '#FBCFE8',
          300: '#F9A8D4',
          400: '#F472B6',
          500: '#EC4899',  // Main accent
          600: '#DB2777',
          700: '#BE185D',
          800: '#9D174D',
          900: '#831843',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
```

**Recommendation:** Use **Option 1 (Modern Blue & Purple)** for its professional look and good contrast.

---

## 6. Component Structure

### Architecture

```
src/
├── components/
│   ├── ui/                    # Reusable UI components
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   ├── Checkbox.tsx
│   │   ├── Card.tsx
│   │   ├── Badge.tsx
│   │   └── Medal.tsx          # For top 3 rankings
│   ├── features/              # Feature-specific components
│   │   ├── FeatureCard.tsx    # Display feature info
│   │   ├── FeatureCheckbox.tsx # Checkbox with feature details
│   │   └── RankingCard.tsx    # Feature card for ranking page
│   └── layout/
│       ├── Header.tsx
│       └── Container.tsx
├── pages/
│   ├── LoginPage.tsx
│   ├── VotePage.tsx
│   └── RankingPage.tsx
├── hooks/
│   ├── useAuth.ts             # Email state management
│   ├── useFeatures.ts         # Fetch and manage features
│   └── useVotes.ts            # Vote operations
├── services/
│   ├── api.ts                 # API base configuration
│   ├── featureService.ts      # Feature API calls
│   ├── voteService.ts         # Vote API calls
│   └── userService.ts         # User API calls
├── context/
│   └── AuthContext.tsx        # User email context
├── types/
│   └── index.ts               # TypeScript types
└── App.tsx
```

---

## 7. State Management Strategy

### Context for Authentication

```typescript
// context/AuthContext.tsx
interface AuthContextType {
  email: string | null;
  setEmail: (email: string) => void;
  logout: () => void;
}

// Stores user email
// Persists in localStorage
// Used across pages
```

**No complex state management needed** - use Context + hooks

---

## 8. Services Layer

### API Service Base

```typescript
// services/api.ts
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export const api = {
  get: async (endpoint: string) => {
    const response = await fetch(`${API_BASE_URL}${endpoint}`);
    if (!response.ok) throw new Error('Request failed');
    return response.json();
  },

  post: async (endpoint: string, body: any) => {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    if (!response.ok) throw new Error('Request failed');
    return response.json();
  },

  delete: async (endpoint: string, body?: any) => {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: body ? JSON.stringify(body) : undefined,
    });
    if (!response.ok) throw new Error('Request failed');
    return response.json();
  },
};
```

### Feature Service

```typescript
// services/featureService.ts
export const featureService = {
  getAll: () => api.get('/api/features'),
  getById: (id: string) => api.get(`/api/features/${id}`),
  create: (data: CreateFeatureData) => api.post('/api/features', data),
  vote: (id: string, userEmail: string) =>
    api.post(`/api/features/${id}/vote`, { userEmail }),
  removeVote: (id: string, userEmail: string) =>
    api.delete(`/api/features/${id}/vote`, { userEmail }),
};
```

---

## 9. Custom Hooks

### useAuth Hook

```typescript
// hooks/useAuth.ts
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
```

### useFeatures Hook

```typescript
// hooks/useFeatures.ts
export const useFeatures = () => {
  const [features, setFeatures] = useState<Feature[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadFeatures = async () => {
    try {
      setLoading(true);
      const response = await featureService.getAll();
      setFeatures(response.data);
    } catch (err) {
      setError('Failed to load features');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFeatures();
  }, []);

  return { features, loading, error, reload: loadFeatures };
};
```

### useVotes Hook

```typescript
// hooks/useVotes.ts
export const useVotes = (userEmail: string) => {
  const [votes, setVotes] = useState<string[]>([]); // feature IDs
  const [loading, setLoading] = useState(false);

  const loadVotes = async () => {
    const response = await voteService.getByUser(userEmail);
    const featureIds = response.data.map(v => v.feature.id);
    setVotes(featureIds);
  };

  const toggleVote = async (featureId: string) => {
    const isVoted = votes.includes(featureId);

    if (isVoted) {
      await featureService.removeVote(featureId, userEmail);
      setVotes(votes.filter(id => id !== featureId));
    } else {
      await featureService.vote(featureId, userEmail);
      setVotes([...votes, featureId]);
    }
  };

  useEffect(() => {
    if (userEmail) loadVotes();
  }, [userEmail]);

  return { votes, loading, toggleVote, reload: loadVotes };
};
```

---

## 10. Page Implementations

### Login Page Pseudocode

```typescript
// pages/LoginPage.tsx

1. State: email, loading, error
2. On form submit:
   - Validate email format
   - Call userService.getByEmail(email)
   - If success:
     - Save email to AuthContext
     - Navigate to /vote
   - If error:
     - Show "User not found" error
3. Render:
   - Center container
   - App title/logo
   - Email input
   - Continue button
   - Error message (if any)
```

### Vote Page Pseudocode

```typescript
// pages/VotePage.tsx

1. Get email from AuthContext (redirect if null)
2. Load features with useFeatures()
3. Load user votes with useVotes(email)
4. State: selectedFeatures (Set of IDs), submitting, success

5. On feature checkbox change:
   - Add/remove from selectedFeatures

6. On "Submit Votes":
   - Show loading state
   - For each change: call toggleVote
   - Show success message
   - Show "View Rankings" button

7. Render:
   - Header with user email
   - Feature list (checkboxes)
   - Submit button
   - Success message + Rankings button (conditional)
```

### Ranking Page Pseudocode

```typescript
// pages/RankingPage.tsx

1. Load features with useFeatures()
2. Features are already sorted by voteCount (from API)
3. Identify top 3

4. Render:
   - Header
   - Feature list:
     - Top 1: Gold medal/badge, special styling
     - Top 2: Silver medal/badge, special styling
     - Top 3: Bronze medal/badge, special styling
     - Rest: Normal styling
   - Back to Vote button
   - Logout button
```

---

## 11. UI Components

### Button Component

```typescript
// components/ui/Button.tsx
interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  onClick?: () => void;
  disabled?: boolean;
  children: React.ReactNode;
}
```

**Styles:**
- Primary: `bg-primary-500 hover:bg-primary-600 text-white`
- Secondary: `bg-secondary-500 hover:bg-secondary-600 text-white`
- Outline: `border-2 border-primary-500 text-primary-500 hover:bg-primary-50`

### Medal Component (for Top 3)

```typescript
// components/ui/Medal.tsx
interface MedalProps {
  rank: 1 | 2 | 3;
}

// Displays 🥇🥈🥉 or colored badge
// rank 1: Gold (#FFD700)
// rank 2: Silver (#C0C0C0)
// rank 3: Bronze (#CD7F32)
```

---

## 12. Magic UI Integration

**Recommended Magic UI Components:**
- `AnimatedCard` - For feature cards with hover effects
- `Badge` - For vote counts
- `GradientText` - For page titles
- `Ripple` - For button effects

**Installation:**
```bash
npx magicui-cli add animated-card
npx magicui-cli add badge
```

---

## 13. Responsive Design

### Breakpoints (Tailwind)
- Mobile: `< 640px` (sm)
- Tablet: `640px - 1024px` (md, lg)
- Desktop: `> 1024px` (xl)

### Layout Strategy
- Login page: Single column, centered
- Vote page: 1 column (mobile), 2 columns (tablet+)
- Ranking page: 1 column (mobile), 2-3 columns (tablet+)

---

## 14. Environment Variables

### .env

```env
VITE_API_URL=http://localhost:3000
```

---

## 15. Implementation Checklist

### Setup Phase
- [ ] Initialize Vite + React + TypeScript
- [ ] Install Tailwind CSS
- [ ] Install React Router
- [ ] Install Magic UI (optional)
- [ ] Set up project structure

### Core Implementation
- [ ] Create API service layer
- [ ] Create AuthContext
- [ ] Create custom hooks (useAuth, useFeatures, useVotes)
- [ ] Create UI components (Button, Input, Checkbox, Card, Medal, Badge)
- [ ] Implement Login Page
- [ ] Implement Vote Page
- [ ] Implement Ranking Page
- [ ] Add routing and protected routes
- [ ] Style with Tailwind CSS
- [ ] Add responsive design

### Testing Phase
- [ ] Test login flow
- [ ] Test voting functionality
- [ ] Test ranking display
- [ ] Test error handling
- [ ] Test responsive design
- [ ] Test on different browsers

---

## 16. Recommended Color Palette

**Final Recommendation: Option 1 - Modern Blue & Purple**

**Why:**
- Professional and tech-forward
- Good contrast for accessibility
- Works well with both light and dark modes
- Suitable for web and mobile
- Popular in modern web apps

**Tailwind Classes:**
```css
bg-primary-500     /* Main primary color */
bg-secondary-500   /* Secondary actions */
bg-accent-500      /* Highlights, badges */
text-gray-900      /* Primary text */
text-gray-500      /* Secondary text */
bg-gray-50         /* Background */
```

---

## 17. Accessibility Considerations

- Proper contrast ratios (WCAG AA)
- Keyboard navigation
- Screen reader support
- Focus indicators
- Semantic HTML
- ARIA labels where needed

---

## 18. Performance Optimizations

- Lazy load pages with React.lazy()
- Memoize components with React.memo()
- Debounce API calls
- Optimize images
- Code splitting

---

## 19. Next Steps

After Phase 4 implementation:
1. Test all user flows
2. Gather user feedback
3. Proceed to Phase 5: Mobile Frontend Development

---

## 20. Wireframes

### Login Page
```
┌────────────────────────────────┐
│                                │
│     [LOGO] Lets Vote           │
│                                │
│   ┌──────────────────────┐    │
│   │ Email:               │    │
│   │ [________________]   │    │
│   │                      │    │
│   │   [Continue Button]  │    │
│   │                      │    │
│   │   (error message)    │    │
│   └──────────────────────┘    │
│                                │
└────────────────────────────────┘
```

### Vote Page
```
┌────────────────────────────────┐
│ user@example.com    [Logout]   │
├────────────────────────────────┤
│ Select Features to Vote        │
│                                │
│ ☑ Dark Mode (5 votes)         │
│ ☐ PDF Export (3 votes)        │
│ ☑ Pomodoro Timer (2 votes)    │
│ ☐ Study Groups (1 vote)       │
│ ...                            │
│                                │
│     [Submit Votes]             │
│                                │
│ ✓ Success! [View Rankings]    │
└────────────────────────────────┘
```

### Ranking Page
```
┌────────────────────────────────┐
│ Feature Rankings    [Logout]   │
├────────────────────────────────┤
│ 🥇 #1 Dark Mode         15     │
│    Best feature ever!          │
│                                │
│ 🥈 #2 PDF Export        12     │
│    Very useful feature         │
│                                │
│ 🥉 #3 Pomodoro Timer     8     │
│    Love this idea!             │
│                                │
│ #4 Study Groups          5     │
│ #5 Calendar Sync         3     │
│                                │
│     [Back to Vote]             │
└────────────────────────────────┘
```

---

## 21. E2E Testing with Playwright

### Overview

End-to-end tests ensure the complete user journey works as expected. We'll focus on critical flows rather than full coverage.

**Testing Approach:**
- Test happy paths (successful user journeys)
- Test important edge cases (validation, errors)
- Test user interactions (clicks, form inputs)
- Test navigation between pages

---

### Setup

**Install Playwright:**

```bash
# Navigate to web package
cd packages/web

# Install Playwright
pnpm add -D @playwright/test

# Install browsers
pnpm exec playwright install
```

**Create Playwright configuration:**

```javascript
// packages/web/playwright.config.ts
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:5173',
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  webServer: {
    command: 'pnpm run dev',
    url: 'http://localhost:5173',
    reuseExistingServer: !process.env.CI,
  },
});
```

---

### Test Structure

```
packages/web/
├── e2e/
│   ├── login.spec.ts          # Login page tests
│   ├── vote.spec.ts           # Vote page tests
│   ├── ranking.spec.ts        # Ranking page tests
│   └── full-flow.spec.ts      # Complete user journey
└── playwright.config.ts
```

---

### Test Scenarios

#### Login Page Tests (e2e/login.spec.ts)

**Happy Path:**
- ✅ User enters valid email and successfully logs in
- ✅ User is redirected to vote page

**Edge Cases:**
- ❌ Empty email shows validation error
- ❌ Invalid email format shows validation error
- ❌ Non-existent user shows "User not found" error
- ✅ Valid seeded email (alice@example.com) works

```typescript
// e2e/login.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Login Page', () => {
  test('should successfully log in with valid email', async ({ page }) => {
    await page.goto('/');

    // Fill in email
    await page.fill('input[type="email"]', 'alice@example.com');

    // Click continue button
    await page.click('button:has-text("Continue")');

    // Should redirect to vote page
    await expect(page).toHaveURL('/vote');

    // Should display welcome message with user name
    await expect(page.locator('text=Welcome, Alice')).toBeVisible();
  });

  test('should show error for non-existent user', async ({ page }) => {
    await page.goto('/');

    await page.fill('input[type="email"]', 'nonexistent@example.com');
    await page.click('button:has-text("Continue")');

    // Should show error message
    await expect(page.locator('text=User not found')).toBeVisible();

    // Should remain on login page
    await expect(page).toHaveURL('/');
  });

  test('should show error for invalid email format', async ({ page }) => {
    await page.goto('/');

    await page.fill('input[type="email"]', 'invalid-email');
    await page.click('button:has-text("Continue")');

    // Should show validation error
    await expect(page.locator('text=valid email')).toBeVisible();
  });

  test('should show error for empty email', async ({ page }) => {
    await page.goto('/');

    // Try to submit without entering email
    await page.click('button:has-text("Continue")');

    // Should show error
    await expect(page.locator('text=enter your email')).toBeVisible();
  });
});
```

---

#### Vote Page Tests (e2e/vote.spec.ts)

**Happy Path:**
- ✅ User can see list of features
- ✅ User can select multiple features
- ✅ User can submit votes successfully
- ✅ Success message appears after voting
- ✅ "View Rankings" button appears after voting

**Edge Cases:**
- ❌ Cannot access vote page without authentication
- ✅ Pre-checked features show user's existing votes
- ✅ Cannot submit without selecting new features

```typescript
// e2e/vote.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Vote Page', () => {
  test.beforeEach(async ({ page }) => {
    // Log in first
    await page.goto('/');
    await page.fill('input[type="email"]', 'bob@example.com');
    await page.click('button:has-text("Continue")');
    await expect(page).toHaveURL('/vote');
  });

  test('should display list of features', async ({ page }) => {
    // Should show feature checkboxes
    const featureCheckboxes = page.locator('input[type="checkbox"]');
    const count = await featureCheckboxes.count();

    expect(count).toBeGreaterThan(0);

    // Each feature should show vote count
    await expect(page.locator('text=votes').first()).toBeVisible();
  });

  test('should allow selecting and submitting votes', async ({ page }) => {
    // Find an unchecked feature and check it
    const firstUnchecked = page.locator('input[type="checkbox"]:not(:checked)').first();
    await firstUnchecked.check();

    // Submit votes
    await page.click('button:has-text("Submit Votes")');

    // Should show success message
    await expect(page.locator('text=submitted successfully')).toBeVisible();

    // Should show "View Rankings" button
    await expect(page.locator('button:has-text("View Rankings")')).toBeVisible();
  });

  test('should navigate to rankings after voting', async ({ page }) => {
    // Select a feature
    const firstUnchecked = page.locator('input[type="checkbox"]:not(:checked)').first();
    await firstUnchecked.check();

    // Submit votes
    await page.click('button:has-text("Submit Votes")');

    // Wait for success message
    await expect(page.locator('text=submitted successfully')).toBeVisible();

    // Click "View Rankings"
    await page.click('button:has-text("View Rankings")');

    // Should navigate to rankings page
    await expect(page).toHaveURL('/ranking');
  });

  test('should redirect to login if not authenticated', async ({ page }) => {
    // Clear localStorage to simulate logout
    await page.context().clearCookies();
    await page.evaluate(() => localStorage.clear());

    // Try to access vote page
    await page.goto('/vote');

    // Should redirect to login
    await expect(page).toHaveURL('/');
  });

  test('should allow selecting multiple features', async ({ page }) => {
    // Select multiple features
    const unchecked = page.locator('input[type="checkbox"]:not(:checked)');
    const count = await unchecked.count();

    if (count >= 2) {
      await unchecked.nth(0).check();
      await unchecked.nth(1).check();

      // Both should be checked
      expect(await unchecked.nth(0).isChecked()).toBe(true);
      expect(await unchecked.nth(1).isChecked()).toBe(true);
    }
  });
});
```

---

#### Ranking Page Tests (e2e/ranking.spec.ts)

**Happy Path:**
- ✅ Features are displayed sorted by vote count
- ✅ Top 3 features are highlighted with medals (🥇🥈🥉)
- ✅ Each feature shows vote count
- ✅ "Back to Vote" button works

**Edge Cases:**
- ❌ Cannot access ranking page without authentication

```typescript
// e2e/ranking.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Ranking Page', () => {
  test.beforeEach(async ({ page }) => {
    // Log in first
    await page.goto('/');
    await page.fill('input[type="email"]', 'charlie@example.com');
    await page.click('button:has-text("Continue")');
    await page.goto('/ranking');
  });

  test('should display features sorted by votes', async ({ page }) => {
    // Should show feature rankings
    const features = page.locator('[data-testid="ranking-card"], .ranking-card, article');
    const count = await features.count();

    expect(count).toBeGreaterThan(0);

    // Each feature should show vote count
    await expect(page.locator('text=votes').first()).toBeVisible();
  });

  test('should highlight top 3 features with medals', async ({ page }) => {
    // Check for medal emojis or special styling
    await expect(page.locator('text=🥇').or(page.locator('text=#1')).first()).toBeVisible();
    await expect(page.locator('text=🥈').or(page.locator('text=#2')).first()).toBeVisible();
    await expect(page.locator('text=🥉').or(page.locator('text=#3')).first()).toBeVisible();
  });

  test('should show rankings in descending order', async ({ page }) => {
    // Get all vote count badges
    const voteCounts = await page.locator('text=/\\d+ votes?/').allTextContents();

    // Extract numbers and verify descending order
    const numbers = voteCounts.map(text => parseInt(text.match(/\d+/)?.[0] || '0'));

    for (let i = 0; i < numbers.length - 1; i++) {
      expect(numbers[i]).toBeGreaterThanOrEqual(numbers[i + 1]);
    }
  });

  test('should navigate back to vote page', async ({ page }) => {
    // Click "Back to Vote" button
    await page.click('button:has-text("Back to Vote")');

    // Should navigate to vote page
    await expect(page).toHaveURL('/vote');
  });

  test('should redirect to login if not authenticated', async ({ page }) => {
    // Clear authentication
    await page.context().clearCookies();
    await page.evaluate(() => localStorage.clear());

    // Try to access ranking page
    await page.goto('/ranking');

    // Should redirect to login
    await expect(page).toHaveURL('/');
  });

  test('should allow logout from ranking page', async ({ page }) => {
    // Find and click logout button
    await page.click('button:has-text("Logout")');

    // Should redirect to login page
    await expect(page).toHaveURL('/');
  });
});
```

---

#### Full User Flow Test (e2e/full-flow.spec.ts)

**Complete Journey:**
- Login → Vote → Rankings → Back to Vote → Logout

```typescript
// e2e/full-flow.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Complete User Journey', () => {
  test('should complete full voting flow', async ({ page }) => {
    // Step 1: Login
    await page.goto('/');
    await page.fill('input[type="email"]', 'diana@example.com');
    await page.click('button:has-text("Continue")');
    await expect(page).toHaveURL('/vote');

    // Step 2: Vote on features
    const unchecked = page.locator('input[type="checkbox"]:not(:checked)').first();
    await unchecked.check();
    await page.click('button:has-text("Submit Votes")');
    await expect(page.locator('text=submitted successfully')).toBeVisible();

    // Step 3: View Rankings
    await page.click('button:has-text("View Rankings")');
    await expect(page).toHaveURL('/ranking');
    await expect(page.locator('text=🥇').or(page.locator('text=#1')).first()).toBeVisible();

    // Step 4: Back to Vote
    await page.click('button:has-text("Back to Vote")');
    await expect(page).toHaveURL('/vote');

    // Step 5: Logout
    await page.click('button:has-text("Logout")');
    await expect(page).toHaveURL('/');
  });
});
```

---

### Running Tests

**Add to package.json scripts:**

```json
// packages/web/package.json
{
  "scripts": {
    "dev": "vite",
    "build": "tsc -b && vite build",
    "preview": "vite preview",
    "test:e2e": "playwright test",
    "test:e2e:ui": "playwright test --ui",
    "test:e2e:headed": "playwright test --headed",
    "test:e2e:debug": "playwright test --debug"
  }
}
```

**Add to root package.json:**

```json
// package.json (root)
{
  "scripts": {
    "test:web": "pnpm --filter web test:e2e",
    "test:frontend": "pnpm --filter web test:e2e",
    "test:e2e": "pnpm --filter web test:e2e",
    "test:e2e:ui": "pnpm --filter web test:e2e:ui",
    "test:e2e:headed": "pnpm --filter web test:e2e:headed",
    "test:e2e:debug": "pnpm --filter web test:e2e:debug"
  }
}
```

---

### Running Commands

**From root directory:**

```bash
# Run all frontend tests
pnpm test:web
# or
pnpm test:frontend

# Run all E2E tests
pnpm test:e2e

# Run with UI mode (interactive)
pnpm test:e2e:ui

# Run in headed mode (see browser)
pnpm test:e2e:headed

# Run in debug mode
pnpm test:e2e:debug
```

**From web package:**

```bash
cd packages/web

# Run all tests
pnpm test:e2e

# Run specific test file
pnpm exec playwright test e2e/login.spec.ts

# Run tests with UI
pnpm test:e2e:ui

# View test report
pnpm exec playwright show-report
```

---

### Prerequisites for Running Tests

**Ensure backend is running:**

```bash
# In one terminal
cd packages/backend
pnpm run dev
```

**Database should have seed data:**

```bash
cd packages/backend
pnpm prisma db push
pnpm prisma db seed
```

The Playwright web server will automatically start the frontend on port 5173.

---

### Test Data Requirements

**Seeded users for testing:**
- alice@example.com
- bob@example.com
- charlie@example.com
- diana@example.com
- eve@example.com

**Test scenarios use different users to avoid conflicts:**
- Login tests: alice@example.com
- Vote tests: bob@example.com
- Ranking tests: charlie@example.com
- Full flow: diana@example.com

---

### CI/CD Integration

For continuous integration, add to `.github/workflows/e2e.yml`:

```yaml
name: E2E Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: pnpm/action-setup@v2
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'pnpm'

      - name: Install dependencies
        run: pnpm install

      - name: Install Playwright browsers
        run: pnpm exec playwright install --with-deps

      - name: Setup database
        run: |
          cd packages/backend
          pnpm prisma db push
          pnpm prisma db seed

      - name: Start backend
        run: cd packages/backend && pnpm run dev &

      - name: Run E2E tests
        run: pnpm test:e2e

      - uses: actions/upload-artifact@v3
        if: always()
        with:
          name: playwright-report
          path: packages/web/playwright-report/
```

---

### Best Practices

1. **Test Isolation:** Each test should be independent
2. **Data Cleanup:** Reset state between tests if needed
3. **Wait for Elements:** Use Playwright's auto-waiting features
4. **Page Objects:** Consider creating page object models for complex pages
5. **Selective Testing:** Focus on critical paths, not 100% coverage
6. **Readable Tests:** Write descriptive test names and clear assertions

---

### Debugging Tips

**Take screenshots on failure:**

```typescript
test('my test', async ({ page }) => {
  await page.screenshot({ path: 'screenshot.png' });
});
```

**Slow down execution:**

```bash
pnpm exec playwright test --headed --slowMo=1000
```

**Inspect element selectors:**

```bash
pnpm exec playwright codegen http://localhost:5173
```

---

## Summary

Phase 4 will deliver a clean, functional web frontend with:
- 3 pages: Login, Vote, Ranking
- Modern Blue & Purple color scheme
- Responsive design
- Clean architecture (services/hooks/components)
- Tailwind CSS styling
- Error handling and validation
- User-friendly voting experience
- Comprehensive E2E test coverage with Playwright

Ready for implementation!
