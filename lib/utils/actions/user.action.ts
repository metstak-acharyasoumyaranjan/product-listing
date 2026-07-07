'use server';

import { Users } from "@/model/Users";
import { connectDB } from "@/lib/mongodb";
import bcrypt from 'bcrypt';
import { cookies } from 'next/headers'
import { createSession } from "@/lib/mongodb";
import { session } from "@/model/Session";


export async function validateLoginForm(userName: string, userPassword: string) {
    await connectDB();
    
    const user = await Users.findOne({ user_name: userName });
    
    if (!user) {
        console.log("No user found with this username");
        return { success: false, error: "Invalid username or password" };
    }

    const isMatch = await bcrypt.compare(userPassword , user.password)

    if (!isMatch) {
        console.log("Password Doesn't Match");
        return { success: false, error: "Invalid username or password" };
    }

    if(user.role !== 'admin'){
        console.log("No admin found with this username");
        return { success: false, error: "U need admin role to acces this" };
    }

    const session = await createSession(user._id)
    const cookieStore = await cookies();
    cookieStore.set("session_id" , session.session_id)
    console.log("Login successful!");
    return { success: true };
}

export async function logOutSession(){
    const cookieStore = await cookies()
    // const sessionId = cookieStore.get("session_id")
    // const sessionRecord = await session.findOne({session_id : sessionId})
    // const sessionRecordId = sessionRecord._id
    cookieStore.delete("session_id");
    // await connectDB();
    // await session.findByIdAndUpdate(sessionRecordId ,
    //     {validity : 'invalid'},
    //     {new : true}
    // )
}

