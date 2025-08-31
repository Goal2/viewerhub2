// src/auth.ts
import NextAuth from "next-auth";
import Twitch from "next-auth/providers/twitch";

export const { auth, signIn, signOut, handlers } = NextAuth({
  providers: [
    Twitch({
      clientId: process.env.TWITCH_CLIENT_ID!,
      clientSecret: process.env.TWITCH_CLIENT_SECRET!,
      // PAS de "offline_access" ici. Scope par défaut: user:read:email
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  trustHost: true, // pratique sur Vercel (respecte NEXTAUTH_URL)
});

// On expose GET/POST pour la route API (et rien d’autre dans la route).
export const GET = handlers.GET;
export const POST = handlers.POST;
