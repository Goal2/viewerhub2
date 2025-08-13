// src/auth.ts
import NextAuth from "next-auth";
import { authOptions } from "@/lib/auth"; // ta config (providers, callbacks, etc.)

// v5 : NextAuth retourne des helpers liés à CETTE instance
export const { handlers, auth, signIn, signOut } = NextAuth(authOptions);
