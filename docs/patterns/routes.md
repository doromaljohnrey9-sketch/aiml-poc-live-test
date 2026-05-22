# Route Definitions

Centralize all routes as constants. No hardcoded URL strings.

## The Problem

Hardcoded route strings make refactoring painful and error-prone:

```typescript
// ❌ Routes scattered everywhere
<Link href="/admin">Admin Overview</Link>
<Link href="/operator">Operator Logs</Link>

import { API_ROUTES } from "@/constants/routes.constant";

const response = await fetch(API_ROUTES.HEALTHCHECK);
const redirectUrl = "/login";
```

Change `/dashboard` to `/app`? You'll miss strings and create bugs.

**Solution:** Define all routes once, use everywhere via constants.

## How It Works

All routes are defined in one place with clear organization:

```typescript
// constants/routes.constant.ts

// Public routes that do not require authentication
export const PUBLIC_ROUTES = {
  ROOT: "/",
} as const;

// Authentication-related routes
export const AUTH_ROUTES = {
  LOGIN: "/login",
  REGISTER: "/register",
  FORGOT_PASSWORD: "/forgot-password",
  RESET_PASSWORD: "/reset-password",
} as const;

// Protected routes that require authentication
export const PROTECTED_ROUTES = {
  ADMIN: "/admin",
  CONTRIBUTOR: "/contributor",
  OPERATOR: "/operator",
} as const;

// API routes
export const API_ROUTES = {
  MAIL: {
    SEND: "/api/mail/send",
  },
  HEALTHCHECK: "/api/healthcheck",
} as const;
```

## Default Redirects

Centralized redirect destinations:

```typescript
// When authenticated user tries to access auth pages
export const DEFAULT_AUTH_REDIRECT = PROTECTED_ROUTES.ADMIN; // "/admin"

// When unauthenticated user tries to access protected pages
export const DEFAULT_UNAUTH_REDIRECT = AUTH_ROUTES.LOGIN; // "/login"
```

## Real-World Usage

### In Middleware

```typescript
// proxy.ts
import { PROTECTED_ROUTE_PATTERNS } from "@/constants/routes.constant";

export async function proxy(request: NextRequest) {
  return await updateSession(request, PROTECTED_ROUTE_PATTERNS);
}
```

### In Services

```typescript
// services/mail.service.ts
import { API_ROUTES } from "@/constants/routes.constant";

export const mailService = {
  send: async (payload: SendMailPayload) => {
    await axiosInstance.post(API_ROUTES.MAIL.SEND, payload);
  },
};
```

### In Navigation

```typescript
import { AUTH_ROUTES } from "@/constants/routes.constant";
import Link from "next/link";

export function LoginButton() {
  return <Link href={AUTH_ROUTES.LOGIN}>Sign In</Link>;
}
```

## ✨ Benefits

- **No hardcoded strings** — Routes defined once, used everywhere
- **Easy refactoring** — Change a path once, all references update
- **Type-safe** — TypeScript prevents typos in route paths
- **Auto-generated patterns** — Middleware patterns sync automatically

## Related

- [Auth Guard →](./auth-guard.md) — Route protection
- [HTTP Status →](./http-status.md) — Status codes
