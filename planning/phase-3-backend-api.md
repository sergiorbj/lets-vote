# Phase 3: Backend API Development

## Overview
This document outlines the backend API implementation using Node.js, Express, TypeScript, Zod validation, and a clean service layer architecture.

---

## 1. API Endpoints Overview

### Base URL
```
http://localhost:3000/api
```

### Endpoints Summary

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/features` | Get all features (sorted by votes) | No |
| GET | `/api/features/:id` | Get single feature by ID | No |
| POST | `/api/features` | Create new feature | No |
| POST | `/api/features/:id/vote` | Vote on a feature | No |
| DELETE | `/api/features/:id/vote` | Remove vote from a feature | No |
| GET | `/api/votes` | Get all votes | No |
| GET | `/api/users/:email` | Get user by email | No |

---

## 2. Detailed API Specifications

### Features Endpoints

#### GET `/api/features`
**Description:** Get all features sorted by vote count (descending)

**Response:** `200 OK`
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "title": "Dark Mode Support",
      "description": "Add dark mode toggle...",
      "voteCount": 15,
      "createdAt": "2025-12-16T10:00:00.000Z",
      "updatedAt": "2025-12-16T10:00:00.000Z",
      "createdBy": {
        "id": "uuid",
        "name": "Alice Johnson",
        "email": "alice@example.com"
      }
    }
  ]
}
```

---

#### GET `/api/features/:id`
**Description:** Get a single feature by ID

**URL Parameters:**
- `id` (required): Feature UUID

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "title": "Dark Mode Support",
    "description": "Add dark mode toggle...",
    "voteCount": 15,
    "createdAt": "2025-12-16T10:00:00.000Z",
    "updatedAt": "2025-12-16T10:00:00.000Z",
    "createdBy": {
      "id": "uuid",
      "name": "Alice Johnson",
      "email": "alice@example.com"
    },
    "votes": [
      {
        "id": "uuid",
        "userId": "uuid",
        "createdAt": "2025-12-16T10:00:00.000Z"
      }
    ]
  }
}
```

**Error Response:** `404 Not Found`
```json
{
  "success": false,
  "error": "Feature not found"
}
```

---

#### POST `/api/features`
**Description:** Create a new feature request

**Request Body:**
```json
{
  "title": "Dark Mode Support",
  "description": "Add dark mode toggle to the application",
  "createdByEmail": "alice@example.com"
}
```

**Validation Rules:**
- `title`: Required, string, 5-100 characters
- `description`: Required, string, 10-500 characters
- `createdByEmail`: Required, valid email format

**Response:** `201 Created`
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "title": "Dark Mode Support",
    "description": "Add dark mode toggle...",
    "voteCount": 0,
    "createdAt": "2025-12-16T10:00:00.000Z",
    "updatedAt": "2025-12-16T10:00:00.000Z",
    "createdBy": {
      "id": "uuid",
      "name": "Alice Johnson",
      "email": "alice@example.com"
    }
  }
}
```

**Error Response:** `400 Bad Request`
```json
{
  "success": false,
  "error": "Validation failed",
  "details": [
    {
      "field": "title",
      "message": "Title must be at least 5 characters"
    }
  ]
}
```

**Error Response:** `404 Not Found`
```json
{
  "success": false,
  "error": "User not found with email: alice@example.com"
}
```

---

#### POST `/api/features/:id/vote`
**Description:** Vote on a feature

**URL Parameters:**
- `id` (required): Feature UUID

**Request Body:**
```json
{
  "userEmail": "bob@example.com"
}
```

**Validation Rules:**
- `userEmail`: Required, valid email format

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "vote": {
      "id": "uuid",
      "userId": "uuid",
      "featureId": "uuid",
      "createdAt": "2025-12-16T10:00:00.000Z"
    },
    "feature": {
      "id": "uuid",
      "title": "Dark Mode Support",
      "voteCount": 16
    }
  }
}
```

**Error Response:** `404 Not Found`
```json
{
  "success": false,
  "error": "Feature not found"
}
```

**Error Response:** `409 Conflict`
```json
{
  "success": false,
  "error": "User has already voted for this feature"
}
```

---

#### DELETE `/api/features/:id/vote`
**Description:** Remove a vote from a feature

**URL Parameters:**
- `id` (required): Feature UUID

**Request Body:**
```json
{
  "userEmail": "bob@example.com"
}
```

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "message": "Vote removed successfully",
    "feature": {
      "id": "uuid",
      "title": "Dark Mode Support",
      "voteCount": 15
    }
  }
}
```

**Error Response:** `404 Not Found`
```json
{
  "success": false,
  "error": "Vote not found"
}
```

---

### Votes Endpoints

#### GET `/api/votes`
**Description:** Get all votes with user and feature information

**Query Parameters:**
- `featureId` (optional): Filter votes by feature ID
- `userEmail` (optional): Filter votes by user email

**Response:** `200 OK`
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "createdAt": "2025-12-16T10:00:00.000Z",
      "user": {
        "id": "uuid",
        "name": "Bob Smith",
        "email": "bob@example.com"
      },
      "feature": {
        "id": "uuid",
        "title": "Dark Mode Support",
        "voteCount": 15
      }
    }
  ]
}
```

---

### Users Endpoints

#### GET `/api/users/:email`
**Description:** Get user by email with their created features and votes

**URL Parameters:**
- `email` (required): User email address

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "name": "Alice Johnson",
    "email": "alice@example.com",
    "createdAt": "2025-12-16T10:00:00.000Z",
    "features": [
      {
        "id": "uuid",
        "title": "Dark Mode Support",
        "voteCount": 15
      }
    ],
    "votes": [
      {
        "id": "uuid",
        "feature": {
          "id": "uuid",
          "title": "PDF Export"
        }
      }
    ]
  }
}
```

**Error Response:** `404 Not Found`
```json
{
  "success": false,
  "error": "User not found"
}
```

---

## 3. HTTP Status Codes

| Status Code | Usage |
|-------------|-------|
| 200 OK | Successful GET, DELETE operations |
| 201 Created | Successful POST (resource created) |
| 400 Bad Request | Validation errors, malformed requests |
| 404 Not Found | Resource not found |
| 409 Conflict | Duplicate vote, constraint violations |
| 500 Internal Server Error | Unexpected server errors |

---

## 4. Project Structure

```
packages/backend/src/
├── index.ts                    # Express app entry point
├── config/
│   └── env.ts                  # Environment variables
├── db/
│   └── client.ts               # Prisma Client singleton ✅
├── middleware/
│   ├── errorHandler.ts         # Global error handling
│   └── validateRequest.ts      # Zod validation middleware
├── validators/
│   ├── feature.validator.ts    # Feature validation schemas
│   ├── vote.validator.ts       # Vote validation schemas
│   └── user.validator.ts       # User validation schemas
├── services/
│   ├── feature.service.ts      # Feature business logic
│   ├── vote.service.ts         # Vote business logic
│   └── user.service.ts         # User business logic
├── controllers/
│   ├── feature.controller.ts   # Feature route handlers
│   ├── vote.controller.ts      # Vote route handlers
│   └── user.controller.ts      # User route handlers
├── routes/
│   ├── index.ts                # Main router
│   ├── feature.routes.ts       # Feature endpoints
│   ├── vote.routes.ts          # Vote endpoints
│   └── user.routes.ts          # User endpoints
└── types/
    └── api.types.ts            # API type definitions
```

---

## 5. Business Rules & Constraints

### Voting Constraints

1. **✅ Users CAN vote on their own features**
   - A user who creates a feature is allowed to vote on it
   - This is permitted by the system

2. **❌ Users CANNOT vote more than once on the same feature**
   - Enforced by database unique constraint: `@@unique([userId, featureId])`
   - Attempting to vote twice will return a 409 Conflict error
   - The constraint is already in the Prisma schema (Vote model)

3. **✅ Users CAN vote on multiple different features**
   - No limit on how many different features a user can vote on
   - Only restriction is one vote per feature

### Database Constraint Verification

The Vote model in Prisma schema already enforces this:

```prisma
model Vote {
  // ...
  userId    String
  featureId String

  @@unique([userId, featureId])  // ← Prevents duplicate votes
}
```

This means:
- User A can vote on Feature 1 ✅
- User A can vote on Feature 2 ✅
- User A can vote on Feature 3 ✅
- User A CANNOT vote on Feature 1 again ❌ (409 Conflict)

---

## 6. Zod Validation Schemas

### Feature Validators

```typescript
// packages/backend/src/validators/feature.validator.ts
import { z } from 'zod';

export const createFeatureSchema = z.object({
  body: z.object({
    title: z.string()
      .min(5, 'Title must be at least 5 characters')
      .max(100, 'Title must not exceed 100 characters'),
    description: z.string()
      .min(10, 'Description must be at least 10 characters')
      .max(500, 'Description must not exceed 500 characters'),
    createdByEmail: z.string()
      .email('Invalid email format'),
  }),
});

export const getFeatureByIdSchema = z.object({
  params: z.object({
    id: z.string().uuid('Invalid feature ID'),
  }),
});

// No query parameters needed - returns all features
```

### Vote Validators

```typescript
// packages/backend/src/validators/vote.validator.ts
import { z } from 'zod';

export const voteOnFeatureSchema = z.object({
  params: z.object({
    id: z.string().uuid('Invalid feature ID'),
  }),
  body: z.object({
    userEmail: z.string().email('Invalid email format'),
  }),
});

export const getVotesSchema = z.object({
  query: z.object({
    featureId: z.string().uuid().optional(),
    userEmail: z.string().email().optional(),
  }).optional(),
});
```

### User Validators

```typescript
// packages/backend/src/validators/user.validator.ts
import { z } from 'zod';

export const getUserByEmailSchema = z.object({
  params: z.object({
    email: z.string().email('Invalid email format'),
  }),
});
```

---

## 7. Architecture Pattern: Controller/Service

### Separation of Concerns

**Controller Layer (controllers/):**
- Handles HTTP request/response
- Extracts data from req.body, req.params, req.query
- Validates payload using Zod schemas
- Calls service layer methods
- Returns formatted responses
- Uses early return pattern

**Service Layer (services/):**
- Contains business logic
- Performs database operations using Prisma ORM
- Handles data transformations
- Throws custom errors for business rule violations
- Pure business logic, no HTTP concerns

### Example Flow

```
Request → Controller (validate) → Service (business logic + DB) → Controller (format response) → Response
```

---

## 8. Service Layer Architecture

### Feature Service

```typescript
// packages/backend/src/services/feature.service.ts

interface CreateFeatureData {
  title: string;
  description: string;
  createdByEmail: string;
}

class FeatureService {
  // Get all features sorted by votes (ORM query)
  async getAllFeatures()

  // Get feature by ID (ORM query)
  async getFeatureById(id: string)

  // Create new feature (business logic + ORM query)
  async createFeature(data: CreateFeatureData)

  // Vote on feature (business logic + ORM query)
  async voteOnFeature(featureId: string, userEmail: string)

  // Remove vote from feature (business logic + ORM query)
  async removeVote(featureId: string, userEmail: string)
}
```

### Vote Service

```typescript
// packages/backend/src/services/vote.service.ts

interface GetVotesOptions {
  featureId?: string;
  userEmail?: string;
}

class VoteService {
  // Get all votes with filters (ORM query)
  async getAllVotes(options?: GetVotesOptions)
}
```

### User Service

```typescript
// packages/backend/src/services/user.service.ts

class UserService {
  // Get user by email with features and votes (ORM query)
  async getUserByEmail(email: string)

  // Helper: Find or create user for feature creation (business logic + ORM query)
  async findOrCreateUser(email: string, name?: string)
}
```

---

## 9. Error Handling Middleware

### Custom Error Classes

```typescript
// packages/backend/src/middleware/errorHandler.ts

class AppError extends Error {
  statusCode: number;
  isOperational: boolean;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

class NotFoundError extends AppError {
  constructor(message: string = 'Resource not found') {
    super(message, 404);
  }
}

class ValidationError extends AppError {
  constructor(message: string = 'Validation failed') {
    super(message, 400);
  }
}

class ConflictError extends AppError {
  constructor(message: string = 'Conflict') {
    super(message, 409);
  }
}
```

### Global Error Handler

```typescript
// Error handler middleware (must be last middleware)
export const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
  // Prisma unique constraint violation
  if (err.code === 'P2002') {
    return res.status(409).json({
      success: false,
      error: 'Resource already exists',
    });
  }

  // Prisma record not found
  if (err.code === 'P2025') {
    return res.status(404).json({
      success: false,
      error: 'Resource not found',
    });
  }

  // Zod validation errors
  if (err instanceof ZodError) {
    return res.status(400).json({
      success: false,
      error: 'Validation failed',
      details: err.errors.map(e => ({
        field: e.path.join('.'),
        message: e.message,
      })),
    });
  }

  // Custom app errors
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      success: false,
      error: err.message,
    });
  }

  // Unknown errors
  console.error('Unexpected error:', err);
  return res.status(500).json({
    success: false,
    error: 'Internal server error',
  });
};
```

---

## 10. Validation Middleware

```typescript
// packages/backend/src/middleware/validateRequest.ts
import { z, ZodSchema } from 'zod';
import { Request, Response, NextFunction } from 'express';

export const validateRequest = (schema: ZodSchema) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Validate request (params, query, body)
      await schema.parseAsync({
        params: req.params,
        query: req.query,
        body: req.body,
      });

      next();
    } catch (error) {
      next(error); // Pass to error handler
    }
  };
};
```

---

## 11. Controller Pattern (Early Return)

### Controller Responsibilities

Controllers handle:
1. **Extract data** from request (body, params, query)
2. **Validate** using Zod schemas (via middleware)
3. **Call service layer** with validated data
4. **Format response** with proper HTTP status
5. **Handle errors** by passing to error middleware

Controllers do NOT:
- Perform database queries directly
- Contain business logic
- Transform business data

### Example Controller

```typescript
// packages/backend/src/controllers/feature.controller.ts
import { Request, Response, NextFunction } from 'express';
import { featureService } from '../services/feature.service';

export const getAllFeatures = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Call service layer (service handles ORM queries)
    const features = await featureService.getAllFeatures();

    // Format and return response
    return res.status(200).json({
      success: true,
      data: features,
    });
  } catch (error) {
    // Pass error to error handler
    return next(error);
  }
};

export const createFeature = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Extract validated data from request body
    // (validation already done by middleware)
    const { title, description, createdByEmail } = req.body;

    // Call service layer with data
    const feature = await featureService.createFeature({
      title,
      description,
      createdByEmail,
    });

    // Return success response
    return res.status(201).json({
      success: true,
      data: feature,
    });
  } catch (error) {
    return next(error);
  }
};
```

---

## 12. Service Pattern (Business Logic + ORM)

### Service Responsibilities

Services handle:
1. **Business logic** and rules
2. **Database operations** using Prisma ORM
3. **Data transformation** and aggregation
4. **Error throwing** for business rule violations

Services do NOT:
- Access req/res objects
- Format HTTP responses
- Validate input (validation done in controller/middleware)

### Example Service

```typescript
// packages/backend/src/services/feature.service.ts
import { prisma } from '../db/client';
import { NotFoundError, ConflictError } from '../middleware/errorHandler';

class FeatureService {
  async getAllFeatures() {
    // ORM query - get all features sorted by votes
    return await prisma.feature.findMany({
      orderBy: { voteCount: 'desc' },
      include: {
        createdBy: {
          select: { id: true, name: true, email: true }
        }
      }
    });
  }

  async getFeatureById(id: string) {
    // ORM query - get feature with votes
    const feature = await prisma.feature.findUnique({
      where: { id },
      include: {
        createdBy: {
          select: { id: true, name: true, email: true }
        },
        votes: true
      }
    });

    // Business logic - throw error if not found
    if (!feature) {
      throw new NotFoundError('Feature not found');
    }

    return feature;
  }

  async createFeature(data: CreateFeatureData) {
    const { title, description, createdByEmail } = data;

    // Business logic - find user
    const user = await prisma.user.findUnique({
      where: { email: createdByEmail }
    });

    if (!user) {
      throw new NotFoundError(`User not found with email: ${createdByEmail}`);
    }

    // ORM query - create feature
    return await prisma.feature.create({
      data: {
        title,
        description,
        createdById: user.id,
      },
      include: {
        createdBy: {
          select: { id: true, name: true, email: true }
        }
      }
    });
  }

  async voteOnFeature(featureId: string, userEmail: string) {
    // Business logic - verify feature exists
    const feature = await prisma.feature.findUnique({
      where: { id: featureId }
    });

    if (!feature) {
      throw new NotFoundError('Feature not found');
    }

    // Business logic - find user
    const user = await prisma.user.findUnique({
      where: { email: userEmail }
    });

    if (!user) {
      throw new NotFoundError(`User not found with email: ${userEmail}`);
    }

    // ORM query - create vote (will throw if duplicate due to unique constraint)
    try {
      const vote = await prisma.vote.create({
        data: {
          userId: user.id,
          featureId: featureId,
        }
      });

      // Business logic - increment vote count
      const updatedFeature = await prisma.feature.update({
        where: { id: featureId },
        data: { voteCount: { increment: 1 } },
        select: { id: true, title: true, voteCount: true }
      });

      return { vote, feature: updatedFeature };
    } catch (error: any) {
      // Business logic - handle duplicate vote
      if (error.code === 'P2002') {
        throw new ConflictError('User has already voted for this feature');
      }
      throw error;
    }
  }

  async removeVote(featureId: string, userEmail: string) {
    // Business logic - find user
    const user = await prisma.user.findUnique({
      where: { email: userEmail }
    });

    if (!user) {
      throw new NotFoundError(`User not found with email: ${userEmail}`);
    }

    // ORM query - delete vote
    try {
      await prisma.vote.delete({
        where: {
          userId_featureId: {
            userId: user.id,
            featureId: featureId,
          }
        }
      });

      // Business logic - decrement vote count
      const updatedFeature = await prisma.feature.update({
        where: { id: featureId },
        data: { voteCount: { decrement: 1 } },
        select: { id: true, title: true, voteCount: true }
      });

      return {
        message: 'Vote removed successfully',
        feature: updatedFeature
      };
    } catch (error: any) {
      // Business logic - handle vote not found
      if (error.code === 'P2025') {
        throw new NotFoundError('Vote not found');
      }
      throw error;
    }
  }
}

export const featureService = new FeatureService();
```

**Key Points:**
- ✅ Service contains all Prisma ORM queries
- ✅ Service contains business logic (validation, error handling)
- ✅ Service throws custom errors for controllers to catch
- ✅ No HTTP concerns (req/res) in service
- ✅ Controller only calls service and formats response
```

---

## 13. Express App Setup

```typescript
// packages/backend/src/index.ts
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import routes from './routes';
import { errorHandler } from './middleware/errorHandler';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
}));
app.use(express.json());

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// API routes
app.use('/api', routes);

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    error: 'Route not found',
  });
});

// Global error handler (must be last)
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
```

---

## 14. Routes Structure

```typescript
// packages/backend/src/routes/index.ts
import { Router } from 'express';
import featureRoutes from './feature.routes';
import voteRoutes from './vote.routes';
import userRoutes from './user.routes';

const router = Router();

router.use('/features', featureRoutes);
router.use('/votes', voteRoutes);
router.use('/users', userRoutes);

export default router;
```

```typescript
// packages/backend/src/routes/feature.routes.ts
import { Router } from 'express';
import * as featureController from '../controllers/feature.controller';
import { validateRequest } from '../middleware/validateRequest';
import * as validators from '../validators/feature.validator';

const router = Router();

router.get(
  '/',
  featureController.getAllFeatures
);

router.get(
  '/:id',
  validateRequest(validators.getFeatureByIdSchema),
  featureController.getFeatureById
);

router.post(
  '/',
  validateRequest(validators.createFeatureSchema),
  featureController.createFeature
);

router.post(
  '/:id/vote',
  validateRequest(validators.voteOnFeatureSchema),
  featureController.voteOnFeature
);

router.delete(
  '/:id/vote',
  validateRequest(validators.voteOnFeatureSchema),
  featureController.removeVote
);

export default router;
```

---

## 15. Testing Strategy

### Manual Testing with cURL

```bash
# Get all features
curl http://localhost:3000/api/features

# Get feature by ID
curl http://localhost:3000/api/features/{id}

# Create feature
curl -X POST http://localhost:3000/api/features \
  -H "Content-Type: application/json" \
  -d '{
    "title": "New Feature",
    "description": "This is a new feature request",
    "createdByEmail": "alice@example.com"
  }'

# Vote on feature
curl -X POST http://localhost:3000/api/features/{id}/vote \
  -H "Content-Type: application/json" \
  -d '{"userEmail": "bob@example.com"}'

# Remove vote
curl -X DELETE http://localhost:3000/api/features/{id}/vote \
  -H "Content-Type: application/json" \
  -d '{"userEmail": "bob@example.com"}'

# Get all votes
curl http://localhost:3000/api/votes

# Get user by email
curl http://localhost:3000/api/users/alice@example.com
```

### Testing with Thunder Client / Postman

Create a collection with all endpoints for easy testing.

---

## 16. Unit Testing Strategy

### Testing Philosophy

> **Focus on Business Logic Correctness, NOT Code Coverage**
>
> The goal is to ensure business rules work correctly, not to achieve a coverage percentage.

### What to Test (Business Logic Focus)

**✅ Test:**
- Voting rules (user can vote on own feature, cannot vote twice)
- Feature creation requires existing user
- Vote increments `voteCount`, removal decrements
- Business errors (NotFoundError, ConflictError)
- Edge cases (resource not found, duplicate vote)

**❌ Do NOT Test:**
- Controllers (thin HTTP layer)
- Routes (better as integration tests)
- Prisma queries themselves (trust the ORM)
- Simple middleware

### Technical Approach

- Jest with TypeScript (`ts-jest`)
- Mock Prisma via dependency injection
- Arrange-Act-Assert pattern
- No comments in test files
- Descriptive test names that explain the business rule

### Critical Test Cases

1. **Voting:**
   - User CAN vote on their own feature
   - User CANNOT vote twice on same feature (P2002 → ConflictError)
   - Removing non-existent vote returns error (P2025 → NotFoundError)

2. **Features:**
   - Creating feature with non-existent email fails
   - Getting non-existent feature returns NotFoundError

3. **Users:**
   - Getting non-existent user returns NotFoundError

---

## 17. Implementation Checklist

### Setup Phase
- [ ] Install additional dependencies (express types, dotenv)
- [ ] Create project structure (folders)
- [ ] Set up environment variables
- [ ] Configure TypeScript for Express

### Core Implementation
- [ ] Create error handler middleware
- [ ] Create validation middleware
- [ ] Create Zod validation schemas
- [ ] Implement Feature service
- [ ] Implement Vote service
- [ ] Implement User service
- [ ] Create Feature controller
- [ ] Create Vote controller
- [ ] Create User controller
- [ ] Set up routes
- [ ] Configure Express app
- [ ] Add CORS configuration

### Unit Testing Phase
- [ ] Install Jest and dependencies
- [ ] Configure Jest for TypeScript
- [ ] Set up Prisma mock
- [ ] Write Feature service tests
- [ ] Write Vote service tests
- [ ] Write User service tests
- [ ] Run all tests and verify

### Manual Testing Phase
- [ ] Test all GET endpoints
- [ ] Test POST endpoints with valid data
- [ ] Test validation errors
- [ ] Test 404 errors
- [ ] Test duplicate vote handling
- [ ] Test error responses

---

## 18. Dependencies

✅ Already in package.json:
- express
- cors
- dotenv
- @prisma/client
- zod
- @types/node
- @types/express
- @types/cors
- typescript
- tsx

**Testing Dependencies to Install:**
- jest
- @types/jest
- ts-jest
- jest-mock-extended

---

## 19. Environment Variables

```env
# .env (already exists)
DATABASE_URL="file:./prisma/dev.db"
PORT=3000
NODE_ENV=development
CORS_ORIGIN=http://localhost:5173
```

---

## 20. Best Practices Applied

1. **Clean Architecture:**
   - Separation of concerns (routes → controllers → services → database)
   - **Controllers:** Validation and HTTP handling
   - **Services:** Business logic and ORM queries

2. **Error Handling:**
   - Custom error classes for different scenarios
   - Global error handler middleware
   - Proper HTTP status codes
   - Consistent error response format

3. **Validation:**
   - Zod schemas for type-safe validation
   - Early validation at route level
   - Detailed validation error messages

4. **Early Return Pattern:**
   - All controllers use early returns
   - No nested if/else blocks
   - Clear success/error paths

5. **Type Safety:**
   - TypeScript throughout
   - Zod for runtime validation
   - Prisma for type-safe database queries

6. **API Design:**
   - RESTful conventions
   - Consistent response format
   - Proper HTTP methods and status codes
   - No pagination (keeping it simple)

7. **Unit Testing:**
   - Focus on business logic correctness
   - Mock Prisma for isolated tests
   - Test critical paths and edge cases
   - Clear arrange-act-assert pattern

---

## 21. Summary of Clarifications

### ✅ Confirmed Decisions

1. **No Pagination:**
   - GET `/api/features` returns all features
   - GET `/api/votes` returns all votes
   - Simple implementation for now

2. **Controller/Service Pattern:**
   - **Controller Layer:** Validates payload, handles HTTP
   - **Service Layer:** Processes data, executes ORM queries
   - Clear separation of concerns

3. **Voting Constraints:**
   - ✅ Users CAN vote on their own features
   - ❌ Users CANNOT vote twice on same feature (enforced by DB)
   - ✅ Users CAN vote on multiple different features

---

## Next Steps

After Phase 3 implementation:
1. Test all endpoints thoroughly
2. Document any edge cases
3. Proceed to Phase 4: Web Frontend Development

---

## Notes

- No authentication yet - users identified by email only
- Vote tracking is simple (one vote per user per feature)
- Can add authentication in future phases
- Database already seeded with test data
- Prisma Client already configured
