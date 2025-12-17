# Phase 1: Project Setup and Architecture Planning

## Overview
This document outlines the project setup, technology decisions, and architecture planning for the Feature Voting System using a monorepo structure.

---

## 1. Monorepo Project Structure

```
lets-vote/
├── planning/                    # Planning documents
├── packages/
│   ├── backend/                # Node.js + Express backend
│   │   ├── src/
│   │   │   ├── config/         # Configuration files
│   │   │   ├── db/             # Database setup and migrations
│   │   │   ├── models/         # ORM models
│   │   │   ├── services/       # Business logic layer
│   │   │   ├── controllers/    # Request handlers
│   │   │   ├── routes/         # API routes
│   │   │   ├── middleware/     # Express middleware
│   │   │   ├── validators/     # Zod schemas
│   │   │   └── types/          # TypeScript type definitions
│   │   ├── tests/              # Backend tests
│   │   ├── prisma/             # Prisma schema and migrations
│   │   ├── package.json
│   │   └── tsconfig.json
│   │
│   ├── web/                    # React + Vite web frontend
│   │   ├── src/
│   │   │   ├── components/     # UI components
│   │   │   ├── hooks/          # Custom React hooks
│   │   │   ├── services/       # API client layer
│   │   │   ├── context/        # Context providers (if needed)
│   │   │   ├── types/          # TypeScript types
│   │   │   └── utils/          # Utility functions
│   │   ├── public/
│   │   ├── package.json
│   │   ├── tsconfig.json
│   │   └── vite.config.ts
│   │
│   ├── mobile/                 # React Native + Expo mobile app
│   │   ├── src/
│   │   │   ├── components/     # Mobile UI components
│   │   │   ├── hooks/          # Custom hooks
│   │   │   ├── services/       # API client layer
│   │   │   ├── screens/        # Screen components
│   │   │   ├── navigation/     # Navigation setup
│   │   │   └── types/          # TypeScript types
│   │   ├── app.json            # Expo configuration
│   │   ├── package.json
│   │   └── tsconfig.json
│   │
│   └── shared/                 # Shared code between packages
│       ├── types/              # Shared TypeScript types
│       │   ├── feature.ts
│       │   ├── vote.ts
│       │   └── api.ts
│       ├── utils/              # Shared utility functions
│       ├── package.json
│       └── tsconfig.json
│
├── package.json                # Root package.json (workspace config)
├── pnpm-workspace.yaml         # pnpm workspace configuration
├── tsconfig.json               # Base TypeScript config
├── .gitignore
└── README.md
```

---

## 2. Monorepo Configuration

### Package Manager: pnpm with Workspaces

**pnpm-workspace.yaml:**
```yaml
packages:
  - 'packages/*'
```

**Root package.json:**
```json
{
  "name": "lets-vote",
  "private": true,
  "workspaces": [
    "packages/*"
  ],
  "scripts": {
    "dev:backend": "pnpm --filter backend dev",
    "dev:web": "pnpm --filter web dev",
    "dev:mobile": "pnpm --filter mobile start",
    "build:all": "pnpm -r build",
    "test:all": "pnpm -r test"
  },
  "devDependencies": {
    "typescript": "^5.3.0"
  }
}
```

### Benefits of Monorepo Approach:
- Shared dependencies (single node_modules at root)
- Easy code sharing between packages
- Consistent tooling and scripts
- Atomic commits across frontend/backend
- Simplified CI/CD pipeline
- Type safety across packages

---

## 3. Database: ORM Options Analysis

### Option 1: Prisma (RECOMMENDED)
**Pros:**
- Best-in-class TypeScript support with auto-generated types
- Excellent migrations system with declarative schema (schema.prisma)
- Built-in schema visualization and introspection
- Prisma Studio for database GUI
- Great developer experience with autocomplete
- Active development and large community
- Works perfectly with SQLite
- Type-safe query builder
- Can export types to shared package

**Cons:**
- Slightly larger bundle size
- Additional build step for schema generation
- Learning curve for Prisma-specific syntax

**Best for:** This project - excellent TypeScript integration, migrations, and DX

---

### Option 2: Drizzle ORM
**Pros:**
- Lightweight and performant
- SQL-like syntax (feels closer to raw SQL)
- Excellent TypeScript support
- Built-in migration system (drizzle-kit)
- Smaller bundle size than Prisma
- No code generation step needed
- Growing community

**Cons:**
- Newer than Prisma (less mature ecosystem)
- Smaller community and fewer resources
- More manual type definition compared to Prisma
- Migration tooling less polished than Prisma

**Best for:** Performance-critical apps or developers who prefer SQL-like syntax

---

### Option 3: TypeORM
**Pros:**
- Mature and stable
- Supports multiple databases (easy migration to PostgreSQL later)
- Decorator-based models (if you like that style)
- Active Record and Data Mapper patterns
- Good migration support

**Cons:**
- Heavier than modern alternatives
- TypeScript support good but not as seamless as Prisma/Drizzle
- Decorator syntax can be verbose
- Less active development compared to Prisma
- Some reported issues with SQLite edge cases

**Best for:** Teams familiar with Active Record pattern or migrating from other ORMs

---

### Recommendation: Prisma
For this project, I recommend **Prisma** because:
1. Superior TypeScript experience matches your tech stack
2. Migrations are declarative and easy to manage
3. Works excellently with SQLite
4. Easy to share types between packages in monorepo
5. Can generate types to `packages/shared/types`
6. Great for teams with varying experience levels

---

## 4. Mobile Development: Testing & Tooling

### Local Testing Approach

**Recommended: Expo Go + Android Emulator (Hybrid Approach)**

1. **Expo Go** (for rapid development):
   - Install Expo Go app on your Android phone
   - Scan QR code to test on real device
   - Instant reload on code changes
   - No build required
   - Perfect for UI development and testing

2. **Android Emulator** (for comprehensive testing):
   - Install Android Studio
   - Use AVD (Android Virtual Device) Manager
   - Better for testing features requiring native modules
   - More reliable for debugging
   - Can test different device sizes

**Setup Steps:**
```bash
# Install Android Studio (for Ubuntu)
sudo snap install android-studio --classic

# After Android Studio setup:
# 1. Open Android Studio
# 2. Go to Tools > AVD Manager
# 3. Create a new Virtual Device (Pixel 6 or similar)
# 4. Download Android 13+ system image
# 5. Start the emulator

# Install Expo CLI globally
npm install -g expo-cli

# Or use npx (no global install needed)
npx expo start
```

**Recommended Workflow:**
- Use Expo Go on your phone for quick UI iterations
- Use Android Emulator for feature testing and debugging
- No iOS testing available on Ubuntu (focus on Android)

---

### Component Libraries for Expo

**Recommended Stack:**

1. **React Native Paper** (RECOMMENDED)
   - Material Design components
   - Works perfectly with Expo
   - Excellent TypeScript support
   - Customizable theming
   - Similar feel to Material-UI/MUI
   - Good documentation
   - Consistent with web Material Design

2. **NativeBase** (Alternative)
   - Large component library
   - Good accessibility support
   - Cross-platform consistency
   - Slightly heavier than Paper

3. **React Native Elements** (Lightweight Alternative)
   - Lightweight
   - Highly customizable
   - Good for custom designs

**Essential Additional Libraries:**
- **React Navigation** - Navigation (Expo compatible, required)
- **React Native Vector Icons** - Icon library
- **React Native Safe Area Context** - Handle notches/safe areas
- **@expo/vector-icons** - Pre-bundled icons with Expo

---

### Mobile Development Gotchas

1. **State Management:**
   - useContext works but can cause unnecessary re-renders on mobile
   - Consider Zustand (lightweight) for better performance if needed
   - Mobile is more sensitive to performance issues than web

2. **Styling Differences:**
   - No CSS, only StyleSheet or styled-components
   - Flexbox is default (no need for `display: flex`)
   - No hover states (use `Pressable` component instead)
   - Different measurement units (no px, no rem - just numbers)
   - Box model differences (no margin collapse)

3. **API Calls:**
   - Native fetch works great
   - Same service layer from `packages/shared` can be used
   - Handle offline scenarios (mobile loses connection often)
   - Consider adding retry logic and offline indicators

4. **Development Workflow:**
   - Hot reload can be finicky, sometimes need full restart
   - Clear Metro bundler cache frequently: `expo start -c`
   - Android emulator requires good RAM (8GB minimum, 16GB ideal)
   - Expo Go has ~5 second reload time over network

5. **Expo Limitations:**
   - Some native modules not available in Expo Go
   - May need EAS Build for certain features (push notifications, etc.)
   - Check Expo SDK docs before adding native dependencies
   - Stick to Expo-compatible libraries when possible

6. **Testing on Ubuntu:**
   - iOS simulator not available (macOS only)
   - Focus on Android development
   - Use Expo Go on iPhone if you have one for iOS testing
   - Consider cloud testing services for iOS (BrowserStack, Sauce Labs)
   - Android emulator on Ubuntu can be slow (enable KVM acceleration)

---

## 5. Development Environment Setup

### Required Tools

**All Packages:**
- Node.js 18+ (LTS recommended)
- pnpm 8+ (`npm install -g pnpm`)
- TypeScript 5+
- Git

**Backend:**
- SQLite3 (usually pre-installed on Ubuntu)

**Web:**
- Modern browser with dev tools (Chrome/Firefox)

**Mobile:**
- Android Studio (includes Android SDK and emulator)
- Java Development Kit (JDK) 17+
- Expo CLI (optional global install, or use npx)
- Optional: Physical Android device with Expo Go

---

## 6. Shared Code Strategy

### packages/shared Package

The shared package will contain:

**Types (`packages/shared/types/`):**
```typescript
// feature.ts
export interface Feature {
  id: string;
  title: string;
  description: string;
  voteCount: number;
  createdAt: Date;
  updatedAt: Date;
}

// vote.ts
export interface Vote {
  id: string;
  featureId: string;
  // userId or deviceId depending on auth strategy
  createdAt: Date;
}

// api.ts
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}
```

**Usage:**
```typescript
// In backend
import { Feature, ApiResponse } from '@lets-vote/shared';

// In web
import { Feature, ApiResponse } from '@lets-vote/shared';

// In mobile
import { Feature, ApiResponse } from '@lets-vote/shared';
```

### Package Naming
Use scoped packages for easy imports:
- `@lets-vote/backend`
- `@lets-vote/web`
- `@lets-vote/mobile`
- `@lets-vote/shared`

---

## 7. API Design Principles

**RESTful Endpoints:**
```
GET    /api/features           - List all features (sorted by votes DESC)
POST   /api/features           - Create new feature
GET    /api/features/:id       - Get single feature
POST   /api/features/:id/vote  - Upvote a feature
DELETE /api/features/:id/vote  - Remove upvote (optional)
```

**Request/Response Format:**
```typescript
// Create feature request
POST /api/features
{
  "title": "Dark mode support",
  "description": "Add dark mode toggle to settings"
}

// Success response
{
  "success": true,
  "data": {
    "id": "uuid",
    "title": "Dark mode support",
    "description": "Add dark mode toggle to settings",
    "voteCount": 0,
    "createdAt": "2025-12-16T10:00:00Z",
    "updatedAt": "2025-12-16T10:00:00Z"
  }
}

// Error response
{
  "success": false,
  "error": "Title is required"
}
```

---

## 8. TypeScript Configuration

### Root tsconfig.json
```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "commonjs",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true
  }
}
```

Each package extends the root config with package-specific settings.

---

## 9. Environment Variables Strategy

**.env files (gitignored):**

**packages/backend/.env:**
```
DATABASE_URL="file:./dev.db"
PORT=3000
NODE_ENV=development
CORS_ORIGIN=http://localhost:5173
```

**packages/web/.env:**
```
VITE_API_URL=http://localhost:3000
```

**packages/mobile/.env:**
```
API_URL=http://localhost:3000
EXPO_PUBLIC_API_URL=http://10.0.2.2:3000
```

Note: For Android emulator, use `10.0.2.2` instead of `localhost`

---

## 10. Development Workflow

### Git Strategy
- Main branch: `main`
- Feature branches: `feature/phase-1`, `feature/phase-2`, etc.
- Each phase gets its own feature branch
- Commit often with clear messages

### Running the Monorepo

```bash
# Install all dependencies
pnpm install

# Run backend only
pnpm --filter backend dev

# Run web only
pnpm --filter web dev

# Run mobile only
pnpm --filter mobile start

# Run multiple (in separate terminals)
pnpm --filter backend dev
pnpm --filter web dev

# Build all packages
pnpm -r build

# Run tests across all packages
pnpm -r test
```

---

## 11. Decision Log

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Project Structure | Monorepo | Code sharing, atomic commits, easier management |
| Package Manager | pnpm | Faster, better workspace support, disk efficiency |
| ORM | Prisma | Best TypeScript support, excellent migrations |
| Mobile Testing | Expo Go + Emulator | Best of both worlds for Ubuntu |
| Component Library (Mobile) | React Native Paper | Material Design, Expo compatible |
| State Management | Start with useContext | Simple, upgrade to Zustand if needed |
| API Style | REST | Simple, sufficient for this use case |
| Shared Code | @lets-vote/shared package | Type safety across all packages |

---

## 12. Questions to Resolve Before Phase 2

- [ ] Do we need user authentication, or can anyone vote?
- [ ] Should votes be tracked by IP, device ID, or user account?
- [ ] Do we need vote validation (one vote per user/device)?
- [ ] Should features have categories or tags?
- [ ] Do we need pagination for the feature list?
- [ ] Should there be admin features (delete, edit, moderate)?
- [ ] Do we need vote removal/downvote functionality?
- [ ] Should features have status (pending, in progress, completed)?

---

## 13. Next Steps

**Phase 1 Implementation Tasks:**
1. Initialize git repository with .gitignore
2. Set up monorepo structure with pnpm workspaces
3. Create package.json files for all packages
4. Set up TypeScript configurations
5. Create shared types package
6. Initialize backend with Express and Prisma
7. Initialize web with Vite + React
8. Initialize mobile with Expo
9. Verify all packages can run independently
10. Test imports from shared package

**Then proceed to Phase 2: Database Configuration and Schema Design**
