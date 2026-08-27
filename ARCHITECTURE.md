# Dexnive Frontend Architecture Guide

> **For AI coding agents and developers:** Read this entire document before writing any code. Follow every rule exactly. Do not invent conventions — if something isn't covered here, match the closest existing pattern.

---

## Table of Contents

1. [Tech Stack](#tech-stack)
2. [Project Commands](#project-commands)
3. [Folder Structure](#folder-structure)
4. [Architecture Boundaries](#architecture-boundaries)
5. [Naming Conventions](#naming-conventions)
6. [Feature Module Pattern](#feature-module-pattern)
7. [Type Management](#type-management)
8. [API Layer Pattern](#api-layer-pattern)
9. [State Management](#state-management)
10. [Providers](#providers)
11. [Forms and Validation](#forms-and-validation)
12. [Route Guards](#route-guards)
13. [Socket.io Integration](#socketio-integration)
14. [Tailwind CSS v4](#tailwind-css-v4)
15. [Key Rules Summary](#key-rules-summary)

---

## Tech Stack

| Layer | Tool |
|---|---|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript (strict) |
| Styling | Tailwind CSS v4 + Geist font |
| UI Components | Shadcn UI (`src/components/ui/`) |
| Global State | Redux Toolkit |
| Server State / API | TanStack Query + Axios |
| Forms | React Hook Form + Zod |
| Real-time | Socket.io client |
| React Compiler | Enabled |

> **React Compiler is enabled.** Never manually add `useMemo`, `useCallback`, or `React.memo`. The compiler handles this automatically.

---

## Project Commands

```bash
npm run dev       # Start dev server at http://localhost:3000
npm run build     # Production build
npm run start     # Start production server
```

---

## Folder Structure

```
src/
├── app/                          # Next.js App Router — routing ONLY, no logic
│   ├── (marketing)/              # Route group: public/landing pages
│   ├── auth/                     # Auth routes (flat)
│   │   ├── login/page.tsx
│   │   ├── register/page.tsx
│   │   └── layout.tsx
│   ├── dashboard/
│   │   ├── page.tsx
│   │   └── layout.tsx
│   ├── not-found.tsx             # 404 page
│   ├── layout.tsx                # Root layout — mounts <Providers>
│   └── globals.css
│
├── components/
│   ├── ui/                       # Shadcn UI primitives — auto-generated, never edit manually
│   └── shared/                   # App-wide layout components — files, NOT subfolders
│       ├── navbar.tsx
│       ├── footer.tsx
│       └── sidebar.tsx
│
├── config/
│   └── routes.ts                 # Single source of truth for all route arrays
│
├── features/                     # One folder per product feature — fully co-located
│   └── [feature]/
│       ├── api/
│       │   ├── [feature].service.ts      # Raw Axios functions
│       │   ├── [feature].queries.ts      # TanStack useQuery hooks
│       │   └── [feature].mutations.ts    # TanStack useMutation hooks
│       ├── components/                   # Feature UI components
│       ├── hooks/                        # Feature-scoped logic hooks
│       ├── schemas/                      # Zod validation schemas
│       └── types/
│           └── [feature].types.d.ts      # Ambient type declarations (no export)
│
├── hooks/                        # Cross-feature hooks (used in 2+ features)
│
├── lib/                          # Third-party instance setup ONLY
│   ├── axios.ts                  # Axios instance + interceptors
│   ├── query-client.ts           # TanStack QueryClient
│   ├── socket.ts                 # Socket.io-client single instance
│   └── socket-events.ts          # All socket event name constants
│
├── providers/                    # React providers — NOT a Next.js route
│   ├── index.tsx                 # Compose-only: nests all providers in order
│   ├── redux-provider.tsx
│   ├── query-provider.tsx
│   ├── auth-rehydrator.tsx       # Restores Redux from localStorage on mount
│   └── socket-provider.tsx       # Socket connection lifecycle + Context
│
├── proxy.ts                      # Next.js 16 route guard (replaces middleware.ts)
│
├── store/
│   ├── index.ts                  # Store config + typed hooks
│   └── slices/
│       └── [feature].slice.ts
│
├── types/
│   └── common.d.ts               # Global types shared across features
│
└── utils/
    ├── cn.ts                     # Tailwind class merging utility
    └── constants.ts              # App-wide constants

public/
├── images/
├── icons/
├── videos/
└── fonts/
```

---

## Architecture Boundaries

| Layer | Rule |
|---|---|
| `app/` | Routing only — import from `features/` and `components/` only |
| `features/[f]/components/` | UI only — call feature hooks, never call API or Redux directly |
| `features/[f]/api/` | Data functions only — service, queries, mutations |
| `features/[f]/hooks/` | Hooks used **only within this feature** |
| `hooks/` | Hooks used in **2+ features or shared components** |
| `lib/` | Third-party instance setup only — no React, no business logic |
| `utils/` | Pure functions — zero imports from app code |
| `types/` | Declaration files only — zero runtime code |
| `store/slices/` | Serializable state only — no socket instances, no DOM refs |

Features must never import from each other. Share logic through `hooks/` (cross-feature hooks) or Redux slices.

---

## Naming Conventions

| Item | Convention | Example |
|---|---|---|
| All files and folders | lowercase kebab-case | `product-card.tsx`, `use-debounce.ts` |
| Same-type files (dot notation) | `[name].[type].ts` | `auth.slice.ts`, `auth.service.ts`, `auth.queries.ts` |
| Zod schemas | `[name].schema.ts` | `login.schema.ts` |
| Redux slices | `[name].slice.ts` | `auth.slice.ts` |
| Services | `[name].service.ts` | `products.service.ts` |
| TanStack queries | `[name].queries.ts` | `products.queries.ts` |
| TanStack mutations | `[name].mutations.ts` | `auth.mutations.ts` |
| Custom hooks | `use-[name].ts` | `use-debounce.ts` |
| Type declaration files | `[name].types.d.ts` | `auth.types.d.ts` |
| Components | kebab-case file, PascalCase export | `product-card.tsx` → `export default function ProductCard` |

---

## Feature Module Pattern

Every feature follows this exact structure. No exceptions.

```
features/orders/
├── api/
│   ├── orders.service.ts     ← raw async Axios calls
│   ├── orders.queries.ts     ← useQuery hooks
│   └── orders.mutations.ts   ← useMutation hooks
├── components/
│   └── order-card.tsx        ← pure UI, calls feature hook
├── hooks/
│   └── use-orders.ts         ← combines API + state + dispatch
├── schemas/
│   └── order.schema.ts       ← Zod schema
└── types/
    └── orders.types.d.ts     ← ambient type declarations
```

### Layer responsibilities

**`[f].service.ts`** — raw async functions, no hooks

```ts
import axiosInstance from "@/lib/axios";

export async function getOrders(page: number): Promise<OrdersResponse> {
  const { data } = await axiosInstance.get<OrdersResponse>("/orders", {
    params: { page },
  });
  return data;
}
```

**`[f].queries.ts`** — TanStack useQuery hooks wrapping service functions

```ts
import { useQuery } from "@tanstack/react-query";
import { getOrders } from "@/features/orders/api/orders.service";

export function useOrdersQuery(page: number) {
  return useQuery({
    queryKey: ["orders", page],
    queryFn: () => getOrders(page),
  });
}
```

**`[f].mutations.ts`** — TanStack useMutation hooks

```ts
import { useMutation } from "@tanstack/react-query";
import { createOrder } from "@/features/orders/api/orders.service";

export function useCreateOrderMutation() {
  return useMutation({
    mutationFn: (payload: CreateOrderPayload) => createOrder(payload),
  });
}
```

**`hooks/use-[f].ts`** — combines API + form + dispatch + navigation into one hook; component stays pure UI

```ts
// features/orders/hooks/use-orders.ts
"use client";

export function useOrders() {
  const [page, setPage] = useState(1);
  const { data, isLoading, isError } = useOrdersQuery(page);

  return {
    orders: data?.orders ?? [],
    total: data?.total ?? 0,
    isLoading,
    isError,
    page,
    setPage,
  };
}
```

**`components/[name].tsx`** — pure UI, calls hook, no logic

```tsx
"use client";

export default function OrderList() {
  const { orders, isLoading } = useOrders();
  // Only JSX — no dispatch, no API calls, no routing
}
```

---

## Type Management

### Where types live

| Type | Location |
|---|---|
| Feature-specific data models and API shapes | `features/[f]/types/[f].types.d.ts` |
| Shared across 2+ features | `src/types/common.d.ts` |
| Component props | Inline, directly above the component |
| One-off local types | Inline where used |

### Ambient declarations — no `export`, no `import`

All `.d.ts` files use **no `export` keyword**. TypeScript treats them as global ambient declarations — available everywhere with zero import statements.

```ts
// features/orders/types/orders.types.d.ts

interface Order {
  id: string;
  // ... fields relevant to this project
}

interface OrdersResponse {
  orders: Order[];
  total: number;
  page: number;
}

// Types defined here are globally available — no import needed
```

```ts
// src/types/common.d.ts

interface ApiResponse<T> {
  data: T;
  message: string;
  success: boolean;
}

interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
}
```

---

## API Layer Pattern

### `lib/axios.ts` — single Axios instance

```ts
import axios from "axios";

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  timeout: 10000,
  headers: { "Content-Type": "application/json" },
});

// Attach auth token on every request
axiosInstance.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("auth-token");
    if (token) config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Normalize error messages
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error.response?.data?.message ?? error.message;
    return Promise.reject(new Error(message));
  }
);

export default axiosInstance;
```

### Path alias — always use `@/*`

```ts
import axiosInstance from "@/lib/axios";         // ✅
import axiosInstance from "../../lib/axios";      // ❌
```

---

## State Management

### Redux — serializable business state only

Redux holds data that multiple features need to read: current user, auth token, feature flags, global UI state. It does **not** hold:

- Socket instances (non-serializable → Context)
- Server cache (TanStack Query owns this)
- UI-only state (local `useState`)

### Typed hooks — always use these

Defined in `store/index.ts`. **Never use plain `useDispatch` or `useSelector`.**

```ts
// store/index.ts
export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();
```

### Auth persistence pattern

On login: persist token to three places:

```
localStorage("auth-token")  ← axios interceptor reads on every request
localStorage("auth-user")   ← AuthRehydrator reads on page reload
cookie("auth-token")        ← proxy.ts reads for SSR route protection
```

On page reload → `AuthRehydrator` (inside `providers/`) reads localStorage and restores Redux.  
On logout → clear all three + `dispatch(logout())`.

---

## Providers

Each provider has its own file. `providers/index.tsx` is **compose-only** — no logic, just nesting.

```
providers/
├── index.tsx               ← compose only
├── redux-provider.tsx      ← <Provider store={store}>
├── query-provider.tsx      ← <QueryClientProvider>
├── auth-rehydrator.tsx     ← restores Redux from localStorage on mount
└── socket-provider.tsx     ← socket lifecycle (add when project uses sockets)
```

```tsx
// providers/index.tsx
export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ReduxProvider>
      <QueryProvider>
        <AuthRehydrator>
          <SocketProvider>      {/* after AuthRehydrator — token must be in Redux first */}
            {children}
          </SocketProvider>
        </AuthRehydrator>
      </QueryProvider>
    </ReduxProvider>
  );
}
```

**When adding a new provider:** create `providers/[name]-provider.tsx` then add it to `index.tsx`. Never write provider logic inside `index.tsx`.

---

## Forms and Validation

Always use React Hook Form + Zod together.

### Schema file

```ts
// features/[f]/schemas/[name].schema.ts
import { z } from "zod";

export const exampleSchema = z.object({
  field: z.string().min(1, "Field is required"),
});
```

### Hook setup

```ts
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { exampleSchema } from "@/features/[f]/schemas/example.schema";

const form = useForm<ExampleFormData>({   // type comes from the .d.ts file
  resolver: zodResolver(exampleSchema),
  defaultValues: { field: "" },
});
```

The form's generic type (`ExampleFormData`) comes from the ambient `.d.ts` file. Do **not** use `z.infer<typeof schema>` as the form type — keep schema for validation, interface for the type.

---

## Route Guards

### `src/proxy.ts` — not `middleware.ts`

**Next.js 16 breaking change:** the file is `src/proxy.ts` and the exported function is `proxy()`, not `middleware()`.

```ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { AUTH_REDIRECT, DEFAULT_REDIRECT, PROTECTED_ROUTES } from "@/config/routes";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("auth-token")?.value;

  const isProtected = PROTECTED_ROUTES.some((r) => pathname.startsWith(r));
  const isAuthPage = ["/auth/login", "/auth/register"].includes(pathname);

  if (isProtected && !token) {
    return NextResponse.redirect(new URL(AUTH_REDIRECT, request.url));
  }
  if (isAuthPage && token) {
    return NextResponse.redirect(new URL(DEFAULT_REDIRECT, request.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\..*).*)"],
};
```

### `src/config/routes.ts`

All route strings live here. `proxy.ts` imports from here — never hardcode routes in the proxy.

```ts
export const PUBLIC_ROUTES = ["/", "/auth/login", "/auth/register"];
export const PROTECTED_ROUTES = ["/dashboard"];
export const AUTH_REDIRECT = "/auth/login";
export const DEFAULT_REDIRECT = "/dashboard";

// Add as the project grows:
// export const ROLE_ROUTES: Record<string, string[]> = { "/admin": ["admin"] };
// export const ONBOARDING_ROUTE = "/onboarding";
// export const MAINTENANCE_ROUTE = "/maintenance";
```

---

## Socket.io Integration

### Architecture

```
lib/socket.ts                 ← single socket.io-client instance
lib/socket-events.ts          ← ALL event name constants (every feature, one file)
providers/socket-provider.tsx ← connection lifecycle + isConnected state via Context
hooks/use-socket.ts           ← cross-feature hook: { socket, isConnected }
features/[f]/hooks/           ← feature hooks subscribe via useSocket()
```

### `lib/socket.ts` — single instance, never recreated

```ts
import { io } from "socket.io-client";
import type { Socket } from "socket.io-client";

export const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io(
  process.env.NEXT_PUBLIC_SOCKET_URL!,
  {
    autoConnect: false,
    reconnection: true,
    reconnectionAttempts: 5,
    reconnectionDelay: 1000,
    auth: (cb) => {              // callback — always reads latest token on reconnect
      const token = typeof window !== "undefined"
        ? localStorage.getItem("auth-token")
        : null;
      cb({ token });
    },
  }
);
```

### `lib/socket-events.ts` — single source of truth for all event names

Group constants by feature. Never use raw event strings anywhere else.

```ts
export const SOCKET_EVENTS = {
  // ── Connection ──────────────────────────────────────────
  CONNECT: "connect",
  DISCONNECT: "disconnect",
  CONNECT_ERROR: "connect_error",

  // ── [Feature]: Server → Client ─────────────────────────
  // FEATURE_EVENT_NAME: "feature:event-name",

  // ── [Feature]: Client → Server ─────────────────────────
  // FEATURE_ACTION_NAME: "feature:action-name",
} as const;
```

### `providers/socket-provider.tsx`

- `isConnected` lives in `useState` — **not** in Redux (socket state is non-serializable)
- Connects when `accessToken` is in Redux; disconnects on logout

```tsx
"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { socket } from "@/lib/socket";
import { SOCKET_EVENTS } from "@/lib/socket-events";
import { useAppSelector } from "@/store";

interface SocketContextValue {
  socket: typeof socket;
  isConnected: boolean;
}

const SocketContext = createContext<SocketContextValue | null>(null);

export default function SocketProvider({ children }: { children: React.ReactNode }) {
  const isAuthenticated = useAppSelector((state) => !!state.auth.accessToken);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      if (socket.connected) socket.disconnect();
      return;
    }
    socket.connect();
    socket.on(SOCKET_EVENTS.CONNECT, () => setIsConnected(true));
    socket.on(SOCKET_EVENTS.DISCONNECT, () => setIsConnected(false));
    socket.on(SOCKET_EVENTS.CONNECT_ERROR, () => setIsConnected(false));

    return () => {
      socket.off(SOCKET_EVENTS.CONNECT);
      socket.off(SOCKET_EVENTS.DISCONNECT);
      socket.off(SOCKET_EVENTS.CONNECT_ERROR);
    };
  }, [isAuthenticated]);

  return (
    <SocketContext.Provider value={{ socket, isConnected }}>
      {children}
    </SocketContext.Provider>
  );
}

export function useSocketContext() {
  const ctx = useContext(SocketContext);
  if (!ctx) throw new Error("useSocketContext must be used inside <SocketProvider>");
  return ctx;
}
```

### `hooks/use-socket.ts`

```ts
"use client";

import { useSocketContext } from "@/providers/socket-provider";

export function useSocket() {
  return useSocketContext(); // { socket, isConnected }
}
```

### Feature hook pattern for real-time events

```ts
// features/[f]/hooks/use-[f].ts
export function useFeature() {
  const { socket, isConnected } = useSocket();

  useEffect(() => {
    if (!isConnected) return;

    socket.emit(SOCKET_EVENTS.FEATURE_JOIN, roomId);
    socket.on(SOCKET_EVENTS.FEATURE_EVENT, (data) => { /* update state */ });

    return () => {
      socket.off(SOCKET_EVENTS.FEATURE_EVENT);   // always clean up
      socket.emit(SOCKET_EVENTS.FEATURE_LEAVE, roomId);
    };
  }, [isConnected, socket]);
}
```

### Socket rules

| Rule | |
|---|---|
| Single instance | `io()` called once in `lib/socket.ts` — never inside a component or hook |
| Auth via handshake | Token in `auth` callback, never sent as an event |
| Typed events | Use `Socket<ServerToClientEvents, ClientToServerEvents>` |
| Always clean up | `socket.off()` in every `useEffect` return — prevents memory leaks |
| No direct socket in components | Components call feature hooks only |
| Disconnect on logout | Call `socket.disconnect()` before clearing localStorage |

---

## Tailwind CSS v4

This project uses Tailwind v4 — significantly different from v3.

| v3 | v4 |
|---|---|
| `@tailwind base/components/utilities` | `@import "tailwindcss"` |
| `tailwind.config.js` | No config file — `@theme {}` in `globals.css` |
| `dark:` class variant | `prefers-color-scheme` CSS media query |

### Theme customisation

```css
/* app/globals.css */
@import "tailwindcss";

@theme {
  --color-brand: oklch(0.6 0.2 250);
  --font-sans: "Geist", sans-serif;
}
```

### Dark mode

```css
/* ✅ correct */
@media (prefers-color-scheme: dark) {
  .card { background: #09090b; }
}
```

```tsx
{/* ❌ wrong — dark: variant is not configured */}
<div className="dark:bg-zinc-900" />
```

---

## Key Rules Summary

Check every rule before writing or submitting code.

1. **No logic in `app/`** — pages import from `features/` and `components/` only
2. **No API calls in components** — always through a feature hook
3. **No plain `useDispatch`/`useSelector`** — always `useAppDispatch`/`useAppSelector`
4. **No `useMemo`/`useCallback`/`React.memo`** — React Compiler handles optimization
5. **No `export` in `.d.ts` files** — types are ambient globals, no import needed
6. **No hardcoded routes in `proxy.ts`** — import from `config/routes.ts`
7. **No socket imported directly in components** — use `useSocket()` or a feature hook
8. **No raw socket event strings** — always `SOCKET_EVENTS.*`
9. **No feature types in `src/types/`** — feature types live in `features/[f]/types/`
10. **No cross-feature imports** — features never import from each other
11. **`proxy.ts` not `middleware.ts`** — exported function is `proxy()` not `middleware()`
12. **Each provider in its own file** — `providers/index.tsx` is compose-only
13. **Kebab-case for all files and folders** — no camelCase, no PascalCase filenames
14. **Dot notation for same-type files** — `auth.slice.ts` not `authSlice.ts`
15. **`lib/` is for instances only** — no React hooks, no business logic, no feature imports


---

## Table of Contents

1. [Tech Stack](#tech-stack)
2. [Project Commands](#project-commands)
3. [Folder Structure](#folder-structure)
4. [Architecture Boundaries](#architecture-boundaries)
5. [Naming Conventions](#naming-conventions)
6. [Feature Module Pattern](#feature-module-pattern)
7. [Type Management](#type-management)
8. [API Layer Pattern](#api-layer-pattern)
9. [State Management](#state-management)
10. [Providers](#providers)
11. [Forms and Validation](#forms-and-validation)
12. [Route Guards](#route-guards)
13. [Socket.io Integration](#socketio-integration)
14. [Tailwind CSS v4](#tailwind-css-v4)
15. [Key Rules Summary](#key-rules-summary)

---

## Tech Stack

| Layer | Tool |
|---|---|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript (strict) |
| Styling | Tailwind CSS v4 + Geist font |
| UI Components | Shadcn UI (`src/components/ui/`) |
| Global State | Redux Toolkit |
| Server State / API | TanStack Query + Axios |
| Forms | React Hook Form + Zod |
| Real-time | Socket.io client |
| React Compiler | Enabled |

> **React Compiler is enabled.** Never manually add `useMemo`, `useCallback`, or `React.memo`. The compiler handles this automatically.

---

## Project Commands

```bash
npm run dev       # Start dev server at http://localhost:3000
npm run build     # Production build
npm run start     # Start production server
```

No test runner or linter is configured.

---

## Folder Structure

```
src/
├── app/                          # Next.js App Router — routing ONLY, no logic
│   ├── (marketing)/              # Route group for public/landing pages
│   │   └── page.tsx
│   ├── auth/                     # Auth routes (flat, not nested)
│   │   ├── login/
│   │   │   └── page.tsx
│   │   ├── register/
│   │   │   └── page.tsx
│   │   └── layout.tsx
│   ├── dashboard/
│   │   ├── page.tsx
│   │   └── layout.tsx
│   ├── not-found.tsx             # 404 page
│   ├── layout.tsx                # Root layout (fonts, providers)
│   ├── globals.css
│   └── page.tsx
│
├── components/
│   ├── ui/                       # Shadcn UI primitives — auto-generated, do not edit manually
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── input.tsx
│   │   └── label.tsx
│   └── shared/                   # App-wide layout — files, NOT folders
│       ├── navbar.tsx
│       ├── footer.tsx
│       └── sidebar.tsx
│
├── config/
│   └── routes.ts                 # Single source of truth for all route arrays
│
├── features/                     # Feature-based modules — fully co-located
│   └── [feature]/
│       ├── api/
│       │   ├── [f].service.ts        # Raw Axios functions only
│       │   ├── [f].queries.ts        # TanStack useQuery hooks
│       │   └── [f].mutations.ts      # TanStack useMutation hooks
│       ├── components/               # Feature-specific UI components
│       ├── hooks/                    # Feature-specific logic hooks
│       ├── schemas/                  # Zod validation schemas
│       └── types/
│           └── [f].types.d.ts        # Ambient type declarations (NO export keyword)
│
├── hooks/                        # Cross-feature hooks (used in 2+ features or shared components)
│   ├── use-auth.ts
│   └── use-socket.ts
│
├── lib/                          # Third-party instance setup ONLY — no business logic
│   ├── axios.ts                  # Axios instance with interceptors
│   ├── query-client.ts           # TanStack QueryClient instance
│   ├── socket.ts                 # Socket.io-client single instance
│   └── socket-events.ts          # All socket event name constants (every feature)
│
├── providers/                    # React context providers — NOT a Next.js route
│   ├── index.tsx                 # Compose-only: nests all providers in order
│   ├── redux-provider.tsx        # Redux <Provider>
│   ├── query-provider.tsx        # TanStack <QueryClientProvider>
│   ├── auth-rehydrator.tsx       # Restores Redux auth state from localStorage on mount
│   └── socket-provider.tsx       # Socket.io connection lifecycle + isConnected state
│
├── proxy.ts                      # Next.js 16 route guard (replaces middleware.ts)
│
├── store/
│   ├── index.ts                  # Store config + typed hooks (useAppDispatch, useAppSelector)
│   └── slices/
│       ├── auth.slice.ts
│       └── [feature].slice.ts
│
├── types/
│   └── common.d.ts               # Truly global types shared across features (ApiResponse<T>, etc.)
│
└── utils/                        # Pure utility functions — no imports from app code
    ├── cn.ts                     # Tailwind class merging (clsx + tailwind-merge)
    └── constants.ts              # App-wide string/number constants

public/
├── images/                       # Static images
├── icons/                        # SVG icons
├── videos/                       # Video files
└── fonts/                        # Custom font files
```

---

## Architecture Boundaries

These rules are strict. Do not cross layers.

| Layer | What it can import |
|---|---|
| `app/` | `features/`, `components/` — **no** API calls, no business logic, no Redux |
| `features/[f]/components/` | Feature hooks only — **no** direct API calls, no `useAppDispatch` |
| `features/[f]/api/` | `lib/axios.ts`, ambient types — raw data functions only |
| `features/[f]/hooks/` | Feature `api/`, `schemas/`, `store/`, `hooks/` (cross-feature) |
| `hooks/` | `store/`, `providers/`, `lib/` — no feature-specific imports |
| `lib/` | Third-party packages only — no React, no Redux, no features |
| `utils/` | Zero app imports — pure functions only |
| `types/` | Zero runtime code — declaration files only |
| `store/slices/` | Serializable data only — no socket instances, no DOM refs |

---

## Naming Conventions

| Item | Convention | Example |
|---|---|---|
| All files and folders | lowercase kebab-case | `login-form.tsx`, `use-debounce.ts` |
| Same-type files | dot notation | `auth.slice.ts`, `auth.service.ts`, `auth.queries.ts` |
| Zod schemas | `[name].schema.ts` | `login.schema.ts` |
| Redux slices | `[name].slice.ts` | `auth.slice.ts` |
| Services | `[name].service.ts` | `auth.service.ts` |
| TanStack queries | `[name].queries.ts` | `products.queries.ts` |
| TanStack mutations | `[name].mutations.ts` | `auth.mutations.ts` |
| Custom hooks | `use-[name].ts` | `use-debounce.ts` |
| Type declaration files | `[name].types.d.ts` | `auth.types.d.ts` |
| Components | kebab-case file, PascalCase export | `login-form.tsx` → `export default function LoginForm` |
| Environment variables | `NEXT_PUBLIC_` prefix for client-side | `NEXT_PUBLIC_API_URL` |

---

## Feature Module Pattern

Every feature follows this exact structure. The `auth` and `products` features are the reference implementations.

### Service — raw Axios calls

```ts
// features/auth/api/auth.service.ts
import axiosInstance from "@/lib/axios";

export async function loginUser(credentials: LoginCredentials): Promise<LoginResponse> {
  const { data } = await axiosInstance.post<LoginResponse>("/auth/login", {
    ...credentials,
    expiresInMins: 30,
  });
  return data;
}
```

### Mutations — TanStack useMutation

```ts
// features/auth/api/auth.mutations.ts
import { useMutation } from "@tanstack/react-query";
import { loginUser } from "@/features/auth/api/auth.service";

export function useLoginMutation() {
  return useMutation({
    mutationFn: (credentials: LoginCredentials) => loginUser(credentials),
  });
}
```

### Queries — TanStack useQuery

```ts
// features/products/api/products.queries.ts
import { useQuery } from "@tanstack/react-query";
import { getProducts } from "@/features/products/api/products.service";

export function useProductsQuery(limit: number) {
  return useQuery({
    queryKey: ["products", limit],
    queryFn: () => getProducts(limit),
  });
}
```

### Feature hook — business logic

Combines form state + API call + Redux dispatch + navigation into one hook. The component stays pure UI.

```ts
// features/auth/hooks/use-login.ts
"use client";

import { useRouter } from "next/navigation";
import { useAppDispatch } from "@/store";
import { setCredentials } from "@/store/slices/auth.slice";
import { useLoginMutation } from "@/features/auth/api/auth.mutations";
import { loginSchema } from "@/features/auth/schemas/login.schema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

export function useLogin() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { mutate: login, isPending, error } = useLoginMutation();

  const form = useForm<LoginCredentials>({
    resolver: zodResolver(loginSchema),
  });

  function onSubmit(data: LoginCredentials) {
    login(data, {
      onSuccess: (response) => {
        const { accessToken, refreshToken, ...user } = response;
        // Persist token for axios interceptor + Redux rehydration
        localStorage.setItem("auth-token", accessToken);
        localStorage.setItem("auth-user", JSON.stringify(user));
        // Cookie for proxy.ts (server-side route protection)
        document.cookie = `auth-token=${accessToken}; path=/; max-age=1800`;
        dispatch(setCredentials({ user, accessToken }));
        router.push("/dashboard");
      },
    });
  }

  return { form, onSubmit, isPending, error };
}
```

### Component — pure UI

```tsx
// features/auth/components/login-form.tsx
"use client";

export default function LoginForm() {
  const { form, onSubmit, isPending, error } = useLogin();
  // Only JSX here — no API calls, no dispatch, no routing logic
}
```

---

## Type Management

### Where types live

| Type category | Location |
|---|---|
| Feature data models, API responses | `features/[f]/types/[f].types.d.ts` |
| Truly global (used in 2+ features) | `src/types/common.d.ts` |
| Component props | Inline, directly above the component |
| Local one-off types | Inline where used |

### Ambient declarations — no imports needed

`.d.ts` files must have **no `export` keyword**. TypeScript treats them as global ambient types — available everywhere with zero imports.

```ts
// features/auth/types/auth.types.d.ts
// ✅ No export — types are globally available

interface LoginCredentials {
  username: string;
  password: string;
}

interface User {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  gender: string;
  image: string;
}

interface LoginResponse extends User {
  accessToken: string;
  refreshToken: string;
}

interface AuthState {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
}
```

```ts
// ✅ Use types anywhere — no import statement needed
const user: User = JSON.parse(stored);
const state: AuthState = { user: null, accessToken: null, isAuthenticated: false };
```

---

## API Layer Pattern

### `lib/axios.ts` — single Axios instance

```ts
import axios from "axios";

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  timeout: 10000,
  headers: { "Content-Type": "application/json" },
});

// Attach auth token to every request
axiosInstance.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("auth-token");
    if (token) config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Normalize error messages
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error.response?.data?.message ?? error.message;
    return Promise.reject(new Error(message));
  }
);

export default axiosInstance;
```

### Path alias — always use `@/*`

```ts
import axiosInstance from "@/lib/axios";        // ✅
import axiosInstance from "../../lib/axios";     // ❌ never use relative paths
```

---

## State Management

### Redux rules

- Use Redux for **serializable business state** only: auth user, feature flags, domain data
- Do **not** put in Redux: socket instances, DOM refs, callbacks, UI-only state
- Do **not** put in Redux: server cache (TanStack Query owns this)

### Typed hooks — mandatory

Always use the typed hooks from `store/index.ts`. Never use plain `useDispatch` or `useSelector`.

```ts
// store/index.ts
export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();

// Usage
const dispatch = useAppDispatch();           // ✅
const dispatch = useDispatch();              // ❌
const user = useAppSelector((s) => s.auth.user);   // ✅
const user = useSelector((s: RootState) => s.auth.user); // ❌
```

### Auth persistence pattern

```
Login success
  ↓
localStorage("auth-token") ← axios interceptor reads this
localStorage("auth-user")  ← AuthRehydrator reads this on reload
cookie("auth-token")       ← proxy.ts reads this for SSR route protection
Redux state                ← source of truth for components
```

On reload → `AuthRehydrator` restores Redux from localStorage.  
On logout → clear all three stores + `dispatch(logout())`.

---

## Providers

Each provider is its own file. `providers/index.tsx` is **compose-only**.

```tsx
// providers/index.tsx — ONLY this, no logic
export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ReduxProvider>
      <QueryProvider>
        <AuthRehydrator>           {/* restores Redux from localStorage */}
          <SocketProvider>         {/* connects socket after auth is ready */}
            {children}
          </SocketProvider>
        </AuthRehydrator>
      </QueryProvider>
    </ReduxProvider>
  );
}
```

**Order matters:** `SocketProvider` must be inside `AuthRehydrator` so the auth token is in Redux before the socket connects.

When adding a new provider:
1. Create `providers/[name]-provider.tsx` with a single responsibility
2. Import and nest it in `providers/index.tsx`

---

## Forms and Validation

Always use React Hook Form + Zod together. Never use controlled components (`useState` per field).

### Schema file

```ts
// features/auth/schemas/login.schema.ts
import { z } from "zod";

export const loginSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});
```

### Form setup in feature hook

```ts
const form = useForm<LoginCredentials>({
  resolver: zodResolver(loginSchema),
  defaultValues: { username: "", password: "" },
});
```

Use the ambient type (`LoginCredentials`) as the generic — do **not** use `z.infer<typeof loginSchema>`. The schema is for validation; the interface is for the type.

---

## Route Guards

### `src/proxy.ts` — not `middleware.ts`

Next.js 16 breaking change: the file is `proxy.ts` and exports `proxy()`, not `middleware()`.

```ts
// src/proxy.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import {
  AUTH_REDIRECT,
  DEFAULT_REDIRECT,
  PROTECTED_ROUTES,
} from "@/config/routes";

export function proxy(request: NextRequest) {          // ← "proxy" not "middleware"
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("auth-token")?.value;

  const isProtected = PROTECTED_ROUTES.some((r) => pathname.startsWith(r));
  const isAuthPage = ["/auth/login", "/auth/register"].includes(pathname);

  if (isProtected && !token) {
    return NextResponse.redirect(new URL(AUTH_REDIRECT, request.url));
  }
  if (isAuthPage && token) {
    return NextResponse.redirect(new URL(DEFAULT_REDIRECT, request.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\..*).*)"],
};
```

### `src/config/routes.ts`

All route strings live here. `proxy.ts` imports from here — never hardcode routes in the proxy.

```ts
export const PUBLIC_ROUTES = ["/", "/auth/login", "/auth/register"];
export const PROTECTED_ROUTES = ["/dashboard"];
export const AUTH_REDIRECT = "/auth/login";
export const DEFAULT_REDIRECT = "/dashboard";

// Add as the project grows:
// export const ROLE_ROUTES: Record<string, string[]> = { "/admin": ["admin"] };
// export const ONBOARDING_ROUTE = "/onboarding";
// export const MAINTENANCE_ROUTE = "/maintenance";
```

---

## Socket.io Integration

### Architecture overview

```
lib/socket.ts               ← single socket.io-client instance
lib/socket-events.ts        ← ALL event name constants (every feature in one file)
providers/socket-provider.tsx   ← connection lifecycle + isConnected state via Context
hooks/use-socket.ts         ← cross-feature hook returning { socket, isConnected }
features/[f]/hooks/         ← feature hooks subscribe to events via useSocket()
```

### `lib/socket.ts` — single instance

Create once, share via Context. Never instantiate `io()` inside a component or hook.

```ts
import { io } from "socket.io-client";
import type { Socket } from "socket.io-client";

export const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io(
  process.env.NEXT_PUBLIC_SOCKET_URL!,
  {
    autoConnect: false,          // SocketProvider decides when to connect
    reconnection: true,
    reconnectionAttempts: 5,
    reconnectionDelay: 1000,
    auth: (cb) => {              // callback — always reads latest token on reconnect
      const token = typeof window !== "undefined"
        ? localStorage.getItem("auth-token")
        : null;
      cb({ token });
    },
  }
);
```

### `lib/socket-events.ts` — all event constants

One file for every event name across all features. Group by feature.

```ts
export const SOCKET_EVENTS = {
  // ── Connection ──────────────────────────────────────────
  CONNECT: "connect",
  DISCONNECT: "disconnect",
  CONNECT_ERROR: "connect_error",

  // ── Chat: Server → Client ───────────────────────────────
  CHAT_HISTORY: "chat:history",
  CHAT_MESSAGE: "chat:message",
  CHAT_TYPING: "chat:typing",
  CHAT_ERROR: "chat:error",

  // ── Chat: Client → Server ───────────────────────────────
  CHAT_SEND: "chat:send",
  CHAT_TYPING_EMIT: "chat:typing",
  CHAT_JOIN: "chat:join",
  CHAT_LEAVE: "chat:leave",

  // ── Add new feature events below, grouped by feature ────
} as const;
```

### `providers/socket-provider.tsx`

- `isConnected` is `useState` — **not** in Redux (socket state is non-serializable)
- Connects only when `accessToken` is in Redux (after `AuthRehydrator` runs)
- Disconnects on logout

```tsx
"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { socket } from "@/lib/socket";
import { SOCKET_EVENTS } from "@/lib/socket-events";
import { useAppSelector } from "@/store";

interface SocketContextValue {
  socket: typeof socket;
  isConnected: boolean;
}

const SocketContext = createContext<SocketContextValue | null>(null);

export default function SocketProvider({ children }: { children: React.ReactNode }) {
  const isAuthenticated = useAppSelector((state) => !!state.auth.accessToken);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      if (socket.connected) socket.disconnect();
      return;
    }

    socket.connect();
    socket.on(SOCKET_EVENTS.CONNECT, () => setIsConnected(true));
    socket.on(SOCKET_EVENTS.DISCONNECT, () => setIsConnected(false));
    socket.on(SOCKET_EVENTS.CONNECT_ERROR, () => setIsConnected(false));

    return () => {
      socket.off(SOCKET_EVENTS.CONNECT);
      socket.off(SOCKET_EVENTS.DISCONNECT);
      socket.off(SOCKET_EVENTS.CONNECT_ERROR);
    };
  }, [isAuthenticated]);

  return (
    <SocketContext.Provider value={{ socket, isConnected }}>
      {children}
    </SocketContext.Provider>
  );
}

export function useSocketContext() {
  const ctx = useContext(SocketContext);
  if (!ctx) throw new Error("useSocketContext must be used inside <SocketProvider>");
  return ctx;
}
```

### `hooks/use-socket.ts`

```ts
"use client";

import { useSocketContext } from "@/providers/socket-provider";

export function useSocket() {
  return useSocketContext(); // { socket, isConnected }
}
```

### Feature hook pattern

```ts
// features/chat/hooks/use-chat.ts
export function useChat() {
  const { socket, isConnected } = useSocket();

  useEffect(() => {
    if (!isConnected) return;

    socket.emit(SOCKET_EVENTS.CHAT_JOIN, roomId);
    socket.on(SOCKET_EVENTS.CHAT_MESSAGE, (msg) => setMessages((prev) => [...prev, msg]));
    socket.on(SOCKET_EVENTS.CHAT_TYPING, ({ userId, isTyping }) => { /* ... */ });

    return () => {
      socket.off(SOCKET_EVENTS.CHAT_MESSAGE);   // always clean up on unmount
      socket.off(SOCKET_EVENTS.CHAT_TYPING);
      socket.emit(SOCKET_EVENTS.CHAT_LEAVE, roomId);
    };
  }, [isConnected, socket]);
}
```

### Socket rules

| Rule | |
|---|---|
| Single instance | `io()` is called once in `lib/socket.ts` — never in a component |
| Auth via handshake | Token passed in `auth` callback on connect, never as an event |
| Typed events | `Socket<ServerToClientEvents, ClientToServerEvents>` typed interfaces |
| Always clean up | `socket.off(...)` in every `useEffect` return to prevent memory leaks |
| No direct socket in components | Components call feature hooks only |
| Disconnect on logout | Call `socket.disconnect()` before clearing localStorage |

---

## Tailwind CSS v4

This project uses Tailwind CSS **v4** — significantly different from v3.

| v3 | v4 (this project) |
|---|---|
| `@tailwind base/components/utilities` | `@import "tailwindcss"` |
| `tailwind.config.js` | No config file — use `@theme {}` blocks in `globals.css` |
| `dark:` class variant | CSS `prefers-color-scheme` media query |

### Theme customisation

```css
/* app/globals.css */
@import "tailwindcss";

@theme {
  --color-brand: #6366f1;
  --font-sans: "Geist", sans-serif;
}
```

### Dark mode

```css
/* ✅ correct for v4 */
@media (prefers-color-scheme: dark) {
  .card { background: #09090b; }
}
```

```tsx
{/* ❌ wrong — dark: variant is not configured in this project */}
<div className="dark:bg-zinc-900" />
```

---

## Key Rules Summary

The most commonly violated rules — check every one before submitting code.

1. **No logic in `app/`** — pages import from `features/` and `components/` only
2. **No API calls in components** — always through a feature hook
3. **No plain `useDispatch`/`useSelector`** — always `useAppDispatch`/`useAppSelector`
4. **No `useMemo`/`useCallback`/`React.memo`** — React Compiler handles optimization
5. **No `export` in `.d.ts` files** — types are ambient globals, zero imports needed
6. **No hardcoded routes in `proxy.ts`** — import everything from `config/routes.ts`
7. **No `socket` imported directly in components** — always through `useSocket()` or a feature hook
8. **No hardcoded socket event strings** — always `SOCKET_EVENTS.*` from `lib/socket-events.ts`
9. **No feature types in `src/types/`** — feature types go in `features/[f]/types/`
10. **No cross-feature imports** — features never import from each other; share through `hooks/` or Redux
11. **`proxy.ts` not `middleware.ts`** — exported function is `proxy()`, not `middleware()`
12. **Each provider in its own file** — `providers/index.tsx` is compose-only
13. **Kebab-case for all files and folders** — `login-form.tsx`, `use-debounce.ts`
14. **Dot notation for same-type files** — `auth.slice.ts` not `authSlice.ts` or `AuthSlice.ts`
15. **`lib/` is for instances only** — no React hooks, no business logic, no feature imports
