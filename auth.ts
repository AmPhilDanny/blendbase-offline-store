import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }
        
        // Simple hardcoded admin credentials for this project
        // Driven by env variables
        const adminEmail = process.env.AUTH_ADMIN_EMAIL
        const adminPassword = process.env.AUTH_ADMIN_PASSWORD
        
        if (
          adminEmail && 
          adminPassword && 
          credentials.email === adminEmail && 
          credentials.password === adminPassword
        ) {
          return {
            id: "admin-1",
            email: adminEmail,
            name: "Admin User",
            role: "admin"
          }
        }
        
        return null
      }
    })
  ],
  pages: {
    signIn: "/admin"
  },
  callbacks: {
    jwt({ token, user }: { token: any, user: any }) {
      if (user) {
        token.role = user.role
      }
      return token
    },
    session({ session, token }: { session: any, token: any }) {
      if (session.user && token.role) {
        session.user.role = token.role as string
      }
      return session
    }
  }
})
