// src/auth.ts
import type { NextAuthOptions } from "next-auth";
import TwitchProvider from "next-auth/providers/twitch";

export const authOptions: NextAuthOptions = {
  providers: [
    TwitchProvider({
      clientId: process.env.TWITCH_CLIENT_ID!,
      clientSecret: process.env.TWITCH_CLIENT_SECRET!,
      // Ne PAS ajouter "offline_access" (sinon 400 "invalid scope").
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  // pages: { signIn: "/api/auth/signin" } // optionnel si tu as une page custom
};
