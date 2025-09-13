# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Core Technologies

- **Next.js 15** (Typescript, `/app` directory)
- **TailwindCSS v4 & Shadcn** for styling
- **Prisma ORM** database queries and types
- **Supabase** database authentication
- **Github** for Continuous integration
- **Vercel** for Continuous deployment

# Rules:

- No comments in code.
- Concatinate classes with "cn" from "@/lib/shadcn.utils"
- Stringify and minify all console.logs.

# File Organization and Naming Conventions

- Types, actions and hooks are named in correlation with their consuming files (eg the hooks for `app/(dashboard)/Component.tsx` are imported from `app/(dashboard)/Component.hooks.tsx`)
- Types and store files are located in ancestor directories
- Actions and hooks files are located in descendant directories

```txt
layout.tsx
layout.providers.tsx ───► useRedirectStore
layout.types.ts
layout.store.ts ◄─── useAppStore; useRedirectStore
(dashboard)/
  ├── layout.tsx
  ├── layout.store.tsx ◄─── useDashboardStore
  ├── page.tsx                  ─┐
  ├── page.hooks.tsx             ├────► useAppStore
  ├── Component.tsx              ├────► useDashboardStore
  ├── Component.hooks.tsx       ─┘
  ├── Component.actions.ts
  └── page.actions.ts

   Key:
   ◄──── = stores defined in a given file
   ────► = stores accessed in a given file
```

# Hook, action, store and type patterns

- Supabase and prisma db queries are called in actions via react-query hooks.
- Data returned in the hooks is used to update the corresponding zustand store.
- Loading and error state is managed via the react-query hooks
- All db types are defined from `@prisma/client` or `@supabase/supabase-js`

## Types file example:

```typescript
import { User } from "@prisma/client";

export interface AppState {
  user: User | null;
  setUser: (user: User | null) => void;
  tempEmail?: string;
  setTempEmail: (tempEmail: string) => void;
  reset: () => void;
}

export interface SignInData {
  email: string;
  password: string;
}
```

## Stores file example:

```typescript
import { UserRole } from "@prisma/client";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { AppState, ExtendedUser, RedirectState } from "./layout.types";

const initialState = {
  user: null,
};

export const useAppStore = create<AppState>()((set) => ({
  ...initialState,
  setUser: (user) => set({ user, profile: user?.profile || null }),
  reset: () => set(initialState),
}));
```

## Actions file example:

```typescript
"use server";

import { ActionResponse, getActionResponse } from "@/lib/action.utils";
import { createSupabaseServerClient } from "@/lib/auth";
import { User } from "@supabase/supabase-js";

export const getUserAction = async (): Promise<ActionResponse<User | null>> => {
  try {
    const supabase = await createSupabaseServerClient();
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (error) throw error;

    return getActionResponse({ data: user });
  } catch (error) {
    return getActionResponse({ error });
  }
};
```

# Hooks file example

```typescript
"use client";

import { configuration, isPrivateRoute } from "@/configuration";
import { useQuery } from "@tanstack/react-query";
import { usePathname, useRouter } from "next/navigation";

import { useAppStore, useRedirectStore } from "@/app/layout.stores";
import { getUserAction } from "./layout.actions";

export const useGetUser = () => {
  const { setUser, reset } = useAppStore();
  const { setIsUser } = useRedirectStore();
  const pathname = usePathname();

  const router = useRouter();
  return useQuery({
    queryKey: ["user"],
    queryFn: async () => {
      const { data, error } = await getUserAction();
      if (!data || error) {
        if (isPrivateRoute(pathname)) {
          router.push(configuration.paths.signIn);
        }
        reset();
        setIsUser(false);
      }
      if (error) throw error;
      setUser(data ?? null);

      return data;
    },
    staleTime: 1000 * 60 * 5,
  });
};
```
