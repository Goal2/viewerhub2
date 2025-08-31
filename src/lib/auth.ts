// src/lib/auth.ts
import type { NextAuthOptions } from "next-auth";
import TwitchProvider from "next-auth/providers/twitch";

export const authOptions: NextAuthOptions = {
  providers: [
    TwitchProvider({
      clientId: process.env.TWITCH_CLIENT_ID!,
      clientSecret: process.env.TWITCH_CLIENT_SECRET!,
      // Twitch refuse souvent "offline_access" si mal configuré.
      // Garde un scope simple et valide :
      authorization: { params: { scope: "user:read:email" } },
    }),
  ],
  // (optionnel) URLs de pages personnalisées
  // pages: { signIn: "/auth/signin" },

  // (optionnel) callbacks si tu veux lire/écrire des infos dans le token/session
  callbacks: {
    async session({ session, token }) {
      // ex: session.user.id = token.sub;
      return session;
    },
  },
  // (optionnel) mets un secret si tu veux forcer
  secret: process.env.NEXTAUTH_SECRET,
};
