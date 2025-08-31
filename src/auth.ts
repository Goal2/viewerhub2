// src/auth.ts
import type { NextAuthOptions } from "next-auth";
import TwitchProvider from "next-auth/providers/twitch";

export const authOptions: NextAuthOptions = {
  // JWT par défaut (pas de DB nécessaire)
  session: { strategy: "jwt" },
  secret: process.env.NEXTAUTH_SECRET,

  providers: [
    TwitchProvider({
      clientId: process.env.TWITCH_CLIENT_ID!,
      clientSecret: process.env.TWITCH_CLIENT_SECRET!,
      // Scopes supportés par Twitch (pas de offline_access)
      authorization: {
        params: {
          scope: "user:read:email",
          // forcer l’écran de consentement évite des bizarreries de cache
          prompt: "consent",
        },
      },
    }),
  ],

  // Mapping de quelques infos utiles dans le token/session
  callbacks: {
    async jwt({ token, account }) {
      if (account) {
        token.accessToken = account.access_token;
        token.twitchId = account.providerAccountId;
      }
      return token;
    },
    async session({ session, token }) {
      (session as any).twitchId = token.twitchId;
      (session as any).accessToken = token.accessToken;
      return session;
    },
  },

  // Affiche les erreurs dans l’URL (utile pour debug si ça reboucle)
  pages: {
    signIn: "/api/auth/signin",
    error: "/api/auth/signin",
  },

  // Active les logs en dev/preview
  debug: process.env.NEXTAUTH_DEBUG === "true",
};
