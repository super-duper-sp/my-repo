import { PrismaClient } from "@prisma/client";
import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter"
import bcrypt from "bcrypt"

const prisma = new PrismaClient();
export const authOptions = {
    adapter: PrismaAdapter(prisma),
    
    providers:[
        CredentialsProvider({
            name : "Credentials",
            credentials: {
                email :{},
                password: {},
            },
            async authorize(credentials,req){
              const register = await fetch("http://localhost:3000/api/login",{
                method:"POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({
                    email: credentials.email,
                    password: credentials.password
                })
              })
              const data = await register.json()
              console.log(data)
              if(register.ok && data){
                return data;
              }else{
                return null;;
              }
            }
        })
    ],
    session: {
        strategy: "jwt",
      },

    callbacks: {
        async session({ session, token }) {
          session.user = token.user;
          session.user.id = token.id
          return session;
        },
        async jwt({ token, user }) {
          if (user) {
            token.user = user;
          }

          return token;
        },
      },
    
    secret : process.env.NEXTAUTH_SECRET,
    pages: {
        signIn: "/login",
    },
}


const handler = NextAuth(authOptions);

export {handler as GET , handler as POST}