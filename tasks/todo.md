# DojoC Release Preparation

## Priority 1: Authentication System
- [x] Add bcrypt + jsonwebtoken dependencies
- [x] Extend DB schema: add password_hash to users table
- [x] Create auth lib: hashPassword, verifyPassword, signJwt, verifyJwt
- [x] Create API routes: /api/auth/signup, /api/auth/login, /api/auth/logout, /api/auth/me
- [x] Create auth middleware helper for protected routes
- [x] Add login/signup UI components
- [x] Update Header with auth state

## Priority 2: Content Gating
- [x] Gate paid lessons behind auth + subscription
- [x] Free tier: first 2 lessons per course
- [x] Pro/Enterprise: all lessons
- [x] Paywall/upgrade prompt for locked content

## Priority 3: Stripe Webhook Fulfillment
- [x] On checkout.session.completed: create/update user + subscription in SQLite
- [x] Grant access based on purchased plan

## Priority 4: Fix Pricing Inconsistency
- [x] Align checkout route.ts PLAN_PRICES to plans.ts values (pro=4980)

## Priority 5: Generate sitemap.xml
- [x] Create sitemap with all pages, courses, articles
