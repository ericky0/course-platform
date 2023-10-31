import api from "@/services/api";
import NextAuth, { NextAuthOptions } from "next-auth";
import Credentials from "next-auth/providers/credentials";

const nextAuthOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    Credentials({
      name: 'credentials',
      credentials: {
        email: { label: 'email', type: 'string' },
        password: { label: 'password', type: 'string' }
      },
      async authorize(credentials) {
        const response = await api.post('/auth', {
          email: credentials?.email,
          password: credentials?.password
        })

        const user = await response.data

        if (user && response.status === 201) {
          return user
        }

        return null
      }
    })
  ],
  pages: {
    signIn: '/sign-in',
  },
  callbacks: {
    async jwt({ token, user }) {
      return { ...token, ...user }
    },

    async session({ session, token }) {
      session.user = token.user as any
      session.token = token.token as any

      return session
    }
  }
}

const handler = NextAuth(nextAuthOptions)

export { handler as GET, handler as POST, nextAuthOptions }