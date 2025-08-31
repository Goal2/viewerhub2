import NextAuth from "next-auth";
import Twitch from "next-auth/providers/twitch";

export const { handlers: { GET, POST }, auth } = NextAuth({
  // IMPORTANT: ne mets pas offline_access ici
  providers: [
    Twitch({
      clientId: process.env.TWITCH_CLIENT_ID!,
      clientSecret: process.env.TWITCH_CLIENT_SECRET!,
      // scope par défaut: "user:read:email"
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  trustHost: true,            // utile sur Vercel
  // Pas de baseUrl/localhost en dur — NEXTAUTH_URL fait foi
});
