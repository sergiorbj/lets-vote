# Phase 2: Database Configuration and Schema Design

## Overview
This document outlines the database schema design using Prisma with SQLite, including models, relationships, migrations, and seed data strategy.

---

## 1. Prisma Setup

### Installation
```bash
cd packages/backend
pnpm add prisma @prisma/client
pnpm add -D tsx @types/node
```

### Initialize Prisma
```bash
npx prisma init --datasource-provider sqlite
```

This creates:
- `prisma/schema.prisma` - Database schema definition
- `.env` - Environment variables with DATABASE_URL

---

## 2. Database Schema Design

### Entity Relationship Diagram

```
User (1) ──────< (N) Vote (N) >────── (1) Feature
                                             │
                                             │
                                    (User can create multiple Features)
```

### Relationships:
- A **User** can create many **Features**
- A **User** can create many **Votes**
- A **Feature** can have many **Votes**
- A **Vote** belongs to one **User** and one **Feature**
- **Constraint**: One user can vote only once per feature (unique constraint)

---

## 3. Prisma Schema Definition

### Location: `packages/backend/prisma/schema.prisma`

```prisma
// This is your Prisma schema file,
// learn more about it in the docs: https://pris.ly/d/prisma-schema

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "sqlite"
  url      = env("DATABASE_URL")
}

// User Model
model User {
  id        String   @id @default(uuid())
  email     String   @unique
  name      String
  avatarUrl String?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  // Relations
  features  Feature[]  @relation("UserFeatures")
  votes     Vote[]     @relation("UserVotes")

  @@map("users")
}

// Feature Model
model Feature {
  id          String   @id @default(uuid())
  title       String
  description String
  status      String   @default("pending") // pending, in_progress, completed, rejected
  voteCount   Int      @default(0)        // Denormalized for performance
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  // Foreign Keys
  createdById String
  createdBy   User   @relation("UserFeatures", fields: [createdById], references: [id], onDelete: Cascade)

  // Relations
  votes       Vote[] @relation("FeatureVotes")

  @@index([voteCount(sort: Desc)]) // Index for sorting by votes
  @@index([createdById])
  @@map("features")
}

// Vote Model
model Vote {
  id        String   @id @default(uuid())
  createdAt DateTime @default(now())

  // Foreign Keys
  userId    String
  user      User     @relation("UserVotes", fields: [userId], references: [id], onDelete: Cascade)

  featureId String
  feature   Feature  @relation("FeatureVotes", fields: [featureId], references: [id], onDelete: Cascade)

  // Constraint: One user can vote only once per feature
  @@unique([userId, featureId])
  @@index([featureId])
  @@index([userId])
  @@map("votes")
}
```

---

## 4. Model Field Explanations

### User Model

| Field | Type | Description | Constraints |
|-------|------|-------------|-------------|
| id | String | UUID primary key | @id, @default(uuid()) |
| email | String | User email address | @unique |
| name | String | User display name | Required |
| createdAt | DateTime | Account creation timestamp | Auto-generated |
| updatedAt | DateTime | Last update timestamp | Auto-updated |

**Relations:**
- `features` - All features created by this user
- `votes` - All votes cast by this user

---

### Feature Model

| Field | Type | Description | Constraints |
|-------|------|-------------|-------------|
| id | String | UUID primary key | @id, @default(uuid()) |
| title | String | Feature request title | Required |
| description | String | Detailed feature description | Required |
| status | String | Current status | Default: "pending" |
| voteCount | Int | Total votes (denormalized) | Default: 0, indexed DESC |
| createdAt | DateTime | Creation timestamp | Auto-generated |
| updatedAt | DateTime | Last update timestamp | Auto-updated |
| createdById | String | Foreign key to User | Required |

**Status Values:**
- `pending` - Newly submitted feature
- `in_progress` - Being developed
- `completed` - Implemented and released
- `rejected` - Will not be implemented

**Design Decision:**
- `voteCount` is denormalized for performance (avoids counting votes on every query)
- Updated via triggers or application logic when votes are added/removed

---

### Vote Model

| Field | Type | Description | Constraints |
|-------|------|-------------|-------------|
| id | String | UUID primary key | @id, @default(uuid()) |
| createdAt | DateTime | Vote timestamp | Auto-generated |
| userId | String | Foreign key to User | Required |
| featureId | String | Foreign key to Feature | Required |

**Constraints:**
- `@@unique([userId, featureId])` - Ensures one vote per user per feature
- Cascading deletes: If user or feature is deleted, votes are removed

---

## 5. Database Migrations

### Create Initial Migration

```bash
cd packages/backend
npx prisma migrate dev --name init
```

This will:
1. Create `prisma/migrations/` folder
2. Generate SQL migration files
3. Apply migration to database
4. Generate Prisma Client

### Migration Commands Reference

```bash
# Create and apply a new migration
npx prisma migrate dev --name migration_name

# Apply pending migrations (production)
npx prisma migrate deploy

# Reset database (WARNING: deletes all data)
npx prisma migrate reset

# View migration status
npx prisma migrate status

# Generate Prisma Client only (after schema changes)
npx prisma generate
```

---

## 6. Prisma Client Setup

### Location: `packages/backend/src/db/client.ts`

```typescript
import { PrismaClient } from '@prisma/client';

// Singleton pattern for Prisma Client
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma = globalForPrisma.prisma ?? new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
});

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}

// Graceful shutdown
process.on('beforeExit', async () => {
  await prisma.$disconnect();
});
```

**Why Singleton?**
- Prevents multiple Prisma Client instances
- Important for serverless/hot-reload environments
- Reuses connection pool

---

## 7. Seed Data Strategy

### Location: `packages/backend/prisma/seed.ts`

```typescript
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Sample data
const sampleUsers = [
  { email: 'alice@example.com', name: 'Alice Johnson', avatarUrl: 'https://i.pravatar.cc/150?img=1' },
  { email: 'bob@example.com', name: 'Bob Smith', avatarUrl: 'https://i.pravatar.cc/150?img=2' },
  { email: 'charlie@example.com', name: 'Charlie Brown', avatarUrl: 'https://i.pravatar.cc/150?img=3' },
  { email: 'diana@example.com', name: 'Diana Prince', avatarUrl: 'https://i.pravatar.cc/150?img=4' },
  { email: 'eve@example.com', name: 'Eve Adams', avatarUrl: 'https://i.pravatar.cc/150?img=5' },
];

const sampleFeatures = [
  {
    title: 'Dark Mode Support',
    description: 'Add a dark mode toggle to reduce eye strain during night-time studying sessions.',
    status: 'pending',
  },
  {
    title: 'Export Study Data to PDF',
    description: 'Allow users to export their study progress and notes as a PDF document for offline review.',
    status: 'pending',
  },
  {
    title: 'Pomodoro Timer Integration',
    description: 'Built-in pomodoro timer to help students manage their study sessions effectively.',
    status: 'in_progress',
  },
  {
    title: 'Collaborative Study Groups',
    description: 'Create and join study groups where users can share resources and track progress together.',
    status: 'pending',
  },
  {
    title: 'Mobile App Offline Mode',
    description: 'Allow the mobile app to work offline and sync when connection is restored.',
    status: 'pending',
  },
  {
    title: 'AI-Powered Study Recommendations',
    description: 'Use AI to suggest study topics and resources based on user performance and goals.',
    status: 'completed',
  },
  {
    title: 'Spaced Repetition Flashcards',
    description: 'Implement spaced repetition algorithm for flashcard reviews to improve retention.',
    status: 'pending',
  },
  {
    title: 'Calendar Integration',
    description: 'Sync study sessions with Google Calendar and other calendar apps.',
    status: 'rejected',
  },
];

async function main() {
  console.log('🌱 Starting database seed...');

  // Clear existing data
  console.log('🗑️  Clearing existing data...');
  await prisma.vote.deleteMany();
  await prisma.feature.deleteMany();
  await prisma.user.deleteMany();

  // Create users
  console.log('👤 Creating users...');
  const users = await Promise.all(
    sampleUsers.map((userData) =>
      prisma.user.create({
        data: userData,
      })
    )
  );
  console.log(`✅ Created ${users.length} users`);

  // Create features
  console.log('💡 Creating features...');
  const features = await Promise.all(
    sampleFeatures.map((featureData, index) =>
      prisma.feature.create({
        data: {
          ...featureData,
          createdById: users[index % users.length].id, // Distribute features among users
        },
      })
    )
  );
  console.log(`✅ Created ${features.length} features`);

  // Create random votes
  console.log('🗳️  Creating random votes...');
  let votesCreated = 0;

  for (const feature of features) {
    // Random number of votes per feature (0 to all users)
    const numVotes = Math.floor(Math.random() * users.length) + 1;

    // Shuffle users and take random subset
    const shuffledUsers = [...users].sort(() => Math.random() - 0.5);
    const votersForFeature = shuffledUsers.slice(0, numVotes);

    for (const user of votersForFeature) {
      try {
        await prisma.vote.create({
          data: {
            userId: user.id,
            featureId: feature.id,
          },
        });
        votesCreated++;
      } catch (error) {
        // Skip if vote already exists (shouldn't happen but good to handle)
        console.warn(`⚠️  Vote already exists for user ${user.name} on feature ${feature.title}`);
      }
    }

    // Update feature vote count
    await prisma.feature.update({
      where: { id: feature.id },
      data: { voteCount: votersForFeature.length },
    });
  }

  console.log(`✅ Created ${votesCreated} votes`);

  // Display summary
  console.log('\n📊 Seed Summary:');
  console.log(`   Users: ${users.length}`);
  console.log(`   Features: ${features.length}`);
  console.log(`   Votes: ${votesCreated}`);

  console.log('\n🎉 Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
```

---

## 8. Seed Configuration

### Add to `packages/backend/package.json`

```json
{
  "name": "@lets-vote/backend",
  "scripts": {
    "dev": "tsx watch src/index.ts",
    "build": "tsc",
    "prisma:generate": "prisma generate",
    "prisma:migrate": "prisma migrate dev",
    "prisma:migrate:deploy": "prisma migrate deploy",
    "prisma:studio": "prisma studio",
    "prisma:seed": "tsx prisma/seed.ts",
    "db:reset": "prisma migrate reset --force",
    "db:setup": "prisma migrate dev && prisma db seed"
  },
  "prisma": {
    "seed": "tsx prisma/seed.ts"
  }
}
```

---

## 9. Database Commands Reference

### Development Workflow

```bash
# 1. Initial setup
cd packages/backend
pnpm install
npx prisma migrate dev --name init

# 2. Seed the database
pnpm prisma:seed
# OR use Prisma's built-in seed
npx prisma db seed

# 3. View data in Prisma Studio (GUI)
pnpm prisma:studio
# Opens http://localhost:5555

# 4. Reset database and reseed
pnpm db:reset
# This will: drop DB, recreate, run migrations, and run seed

# 5. Generate Prisma Client (after schema changes)
pnpm prisma:generate
```

### Common Commands

```bash
# Create new migration
npx prisma migrate dev --name add_new_field

# Apply migrations (production)
npx prisma migrate deploy

# Check migration status
npx prisma migrate status

# Format schema file
npx prisma format

# Validate schema
npx prisma validate

# Pull schema from existing database
npx prisma db pull

# Push schema without migrations (prototyping only)
npx prisma db push
```

---

## 10. Environment Variables

### `packages/backend/.env`

```env
# Database
DATABASE_URL="file:./dev.db"

# Server
PORT=3000
NODE_ENV=development

# CORS
CORS_ORIGIN=http://localhost:5173
```

### `packages/backend/.env.example` (for version control)

```env
DATABASE_URL="file:./dev.db"
PORT=3000
NODE_ENV=development
CORS_ORIGIN=http://localhost:5173
```

---

## 11. Type Generation for Shared Package

### Export Prisma Types to Shared Package

**Option 1: Direct import (Recommended for monorepo)**

```typescript
// packages/shared/types/models.ts
export type { User, Feature, Vote } from '@prisma/client';
```

**Option 2: Create custom types**

```typescript
// packages/shared/types/models.ts
export interface User {
  id: string;
  email: string;
  name: string;
  avatarUrl: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface Feature {
  id: string;
  title: string;
  description: string;
  status: string;
  voteCount: number;
  createdAt: Date;
  updatedAt: Date;
  createdById: string;
}

export interface Vote {
  id: string;
  userId: string;
  featureId: string;
  createdAt: Date;
}
```

**Usage in frontend:**

```typescript
import { Feature, User, Vote } from '@lets-vote/shared/types/models';
```

---

## 12. Database File Location

### SQLite File Path

```
packages/backend/prisma/dev.db       # Development database
packages/backend/prisma/dev.db-journal  # SQLite journal
```

**Important:**
- Add `*.db` and `*.db-journal` to `.gitignore`
- Do NOT commit database files to version control
- For production, consider PostgreSQL or similar

---

## 13. Query Examples

### Common Prisma Queries for Reference

```typescript
// Get all features sorted by votes
const features = await prisma.feature.findMany({
  orderBy: { voteCount: 'desc' },
  include: {
    createdBy: {
      select: { id: true, name: true, avatarUrl: true }
    },
    _count: {
      select: { votes: true }
    }
  }
});

// Create a new feature
const feature = await prisma.feature.create({
  data: {
    title: 'New Feature',
    description: 'Feature description',
    createdById: userId,
  }
});

// Add a vote (with duplicate prevention)
try {
  const vote = await prisma.vote.create({
    data: {
      userId,
      featureId,
    }
  });

  // Increment vote count
  await prisma.feature.update({
    where: { id: featureId },
    data: { voteCount: { increment: 1 } }
  });
} catch (error) {
  // Handle duplicate vote error
  if (error.code === 'P2002') {
    throw new Error('User has already voted for this feature');
  }
}

// Remove a vote
const deletedVote = await prisma.vote.delete({
  where: {
    userId_featureId: {
      userId,
      featureId,
    }
  }
});

// Decrement vote count
await prisma.feature.update({
  where: { id: featureId },
  data: { voteCount: { decrement: 1 } }
});

// Get user with their features and votes
const user = await prisma.user.findUnique({
  where: { id: userId },
  include: {
    features: true,
    votes: {
      include: { feature: true }
    }
  }
});
```

---

## 14. Database Constraints and Validation

### Enforced at Database Level

1. **Unique Constraints:**
   - `user.email` - Must be unique
   - `vote.[userId, featureId]` - One vote per user per feature

2. **Cascading Deletes:**
   - Deleting a user deletes their features and votes
   - Deleting a feature deletes its votes

3. **Indexes:**
   - `feature.voteCount` (DESC) - Fast sorting by popularity
   - `feature.createdById` - Fast user feature lookup
   - `vote.featureId` - Fast feature vote lookup
   - `vote.userId` - Fast user vote lookup

### Additional Validation (Application Level)

Use Zod for input validation in Phase 3 (Backend API):
- Email format validation
- Title length (min/max)
- Description length (min/max)
- Status enum validation

---

## 15. Next Steps

**Phase 2 Implementation Tasks:**

1. ✅ Install Prisma and dependencies
2. ✅ Initialize Prisma with SQLite
3. ✅ Create schema.prisma with User, Feature, Vote models
4. ✅ Create initial migration
5. ✅ Set up Prisma Client singleton
6. ✅ Create seed.ts file with sample data
7. ✅ Add seed scripts to package.json
8. ✅ Run seed command to populate database
9. ✅ Test Prisma Studio to view data
10. ✅ Export types to shared package

**Then proceed to Phase 3: Backend API Development**

---

## 16. Testing the Database Setup

### Verification Checklist

```bash
# 1. Check Prisma is installed
pnpm list @prisma/client

# 2. Validate schema
npx prisma validate

# 3. Run migrations
npx prisma migrate dev --name init

# 4. Seed database
pnpm prisma:seed

# 5. Open Prisma Studio
pnpm prisma:studio

# 6. Verify data:
#    - Check Users table has 5 users
#    - Check Features table has 8 features
#    - Check Votes table has random votes
#    - Verify feature.voteCount matches actual votes
```

---

## 17. Potential Enhancements (Future)

Consider for later phases:

1. **Comments/Discussion:**
   - Add `Comment` model for feature discussions

2. **Feature Categories:**
   - Add `Category` model and relation

3. **User Roles:**
   - Add admin role for moderation

4. **Vote History:**
   - Track when votes were removed (add `deletedAt` field)

5. **Feature Milestones:**
   - Add `estimatedDate`, `actualDate` fields

6. **Notifications:**
   - Add `Notification` model for updates

7. **Analytics:**
   - Track feature views, vote velocity

---

## Decision Log

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Database | SQLite | Simple, file-based, perfect for development |
| ORM | Prisma | Best TypeScript support, great DX |
| Vote Count Storage | Denormalized | Performance optimization for listing |
| Vote Constraint | Unique composite key | Prevents duplicate votes |
| User Authentication | Basic User model | Can extend with auth provider later |
| Status Field | String enum | Flexible, easy to extend |
| Cascade Deletes | Enabled | Maintain referential integrity |
| Seed Data | Realistic examples | Better for testing UI/UX |

---

## Questions Resolved

✅ User authentication: Yes, users must be tracked to prevent duplicate votes
✅ Vote tracking: By user account (User model)
✅ Vote validation: Enforced by unique constraint at DB level
✅ Feature status: Yes, for tracking implementation progress
✅ Pagination: Will implement in API layer (Phase 3)
✅ Admin features: Status field allows for moderation workflow
