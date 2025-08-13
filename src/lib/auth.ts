import type { NextAuthOptions } from "next-auth";
import TwitchProvider from "next-auth/providers/twitch";

export const authOptions: NextAuthOptions = {
  providers: [
    // Viewers
    TwitchProvider({
      id: "twitch",
      clientId: process.env.TWITCH_CLIENT_ID!,
      clientSecret: process.env.TWITCH_CLIENT_SECRET!,
      authorization: { params: { scope: "openid user:read:email" } },
      profile(profile) {
        return {
          id: (profile as any).sub ?? (profile as any).id ?? (profile as any).user_id,
          name: (profile as any).preferred_username ?? (profile as any).login ?? (profile as any).display_name,
          image: (profile as any).picture,
        } as any;
      },
    }),

    // Streamer (broadcaster) — accès aux SUBS
    TwitchProvider({
      id: "twitch-creator",
      clientId: process.env.TWITCH_CLIENT_ID!,
      clientSecret: process.env.TWITCH_CLIENT_SECRET!,
      authorization: { params: { scope: "channel:read:subscriptions user:read:email offline_access" } },
      profile(profile) {
        return {
          id: (profile as any).sub ?? (profile as any).id ?? (profile as any).user_id,
          name: (profile as any).preferred_username ?? (profile as any).login ?? (profile as any).display_name,
          image: (profile as any).picture,
        } as any;
      },
    }),
  ],
  session: { strategy: "jwt" },
  callbacks: {
    async jwt({ token, account, profile }) {
      if (account) {
        (token as any).access_token = account.access_token;
        (token as any).refresh_token = account.refresh_token;
        (token as any).provider = account.provider; // twitch ou twitch-creator
        (token as any).twitch_user_id = (profile as any)?.sub ?? (profile as any)?.id ?? (profile as any)?.user_id;
        (token as any).twitch_login = (profile as any)?.preferred_username ?? (profile as any)?.login;
      }
      return token;
    },
    async session({ session, token }) {
      (session as any).access_token = (token as any).access_token;
      (session as any).provider = (token as any).provider;
      (session as any).twitch_user_id = (token as any).twitch_user_id;
      (session as any).twitch_login = (token as any).twitch_login;
      (session as any).refresh_token = (token as any).refresh_token;
      return session;
    },
  },
};
