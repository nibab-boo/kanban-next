import NextAuth, { NextAuthOptions } from "next-auth"
import GithubProvider from "next-auth/providers/github"
import { FirestoreAdapter } from "@next-auth/firebase-adapter"
import { firebaseConfig, db } from "../../../core/firebase"

export const authOptions: NextAuthOptions = {
  adapter: FirestoreAdapter(firebaseConfig),
  // Configure one or more authentication providers
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID as string,
      clientSecret: process.env.GITHUB_SECRET as string,
    }),
  ],
  // events: {
  //   signIn: async({ account, user }) => {
  //     console.log("user: ", user)
  //     console.log("account", account);
  //     return true
  //   },
  //   session: async({ session }) => {
  //     console.log("Session", session)
  //     return session
  //   }
  // },
  callbacks: {
    // jwt: async({ token, account }) => {
    //   // Persist the OAuth access_token to the token right after signin
    //   return token
    // },
    session: async ({ session, token, user }) => {
      session.user.username = session.user.name
          .split(" ")
          .join("")
          .toLocaleLowerCase()

      session.user.id = user.id

      return session
    }
  },
  secret: process.env.NEXTAUTH_SECRET
}

export default NextAuth(authOptions)