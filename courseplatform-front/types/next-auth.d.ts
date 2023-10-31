import NextAuth from 'next-auth'

declare module 'next-auth' {
  interface User {
    id: string
    name: string
    email: string
    password: string
    avatar: string
    created_at: Date
    updated_at: Date
  }

  interface Token {
    type: string
    token: string
  }

  interface Session {
    user: User
    token: Token
  }
}