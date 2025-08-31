// src/auth.ts
import NextAuth from "next-auth";
import Twitch from "next-auth/providers/twitch";

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Twitch({
      clientId: process.env.TWITCH_CLIENT_ID!,
      clientSecret: process.env.TWITCH_CLIENT_SECRET!,
      // IMPORTANT : on enlève "offline_access" qui te provoquait une 400
      authorization: {
        params: {
          scope: "user:read:email chat:read chat:edit moderator:read:chatters",
        },
      },
    }),
  ],
  session: { strategy: "jwt" },
  callbacks: {
    async jwt({ token, account }) {
      if (account) {
        token.accessToken = account.access_token;
        token.expires_at = account.expires_at;
        token.refresh_token = account.refresh_token;
      }
      return token;
    },
    async session({ session, token }) {
      (session as any).accessToken = token.accessToken;
      return session;
    },
  },
});
