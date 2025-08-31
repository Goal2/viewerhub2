import NextAuth, { NextAuthOptions } from "next-auth";
import TwitchProvider from "next-auth/providers/twitch";

export const authOptions: NextAuthOptions = {
  providers: [
    TwitchProvider({
      clientId: process.env.TWITCH_CLIENT_ID!,
      clientSecret: process.env.TWITCH_CLIENT_SECRET!,
      authorization: {
        params: {
          scope: "openid user:read:email", // suffisant
        },
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  session: { strategy: "jwt" },

  // Cookies sécurisés sur Vercel (HTTPS)
  useSecureCookies: true,

  // Redirections propres
  pages: {
    signIn: "/api/auth/signin",
  },

  callbacks: {
    async redirect({ url, baseUrl }) {
      // Ne jamais renvoyer vers localhost en prod
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      if (new URL(url).origin === baseUrl) return url;
      return baseUrl;
    },
  },
};

export const { handlers, auth } = NextAuth(authOptions);
