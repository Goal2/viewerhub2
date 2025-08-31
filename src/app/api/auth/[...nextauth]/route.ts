// src/app/api/auth/[...nextauth]/route.ts
import NextAuth from "next-auth";
import { authOptions } from "@/lib/auth"; // défini plus bas

const handler = NextAuth(authOptions);

// Next.js App Router: il faut exporter GET et POST
export { handler as GET, handler as POST };
