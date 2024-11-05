import NextAuth from "next-auth";
import { authOptions } from "@/app/lib/auth";

function checkCreditinals(){
    console.log(process.env.GOOGLE_CLIENT_ID)
    console.log(process.env.GOOGLE_CLIENT_SECRET)
}

checkCreditinals()

export default NextAuth(authOptions)