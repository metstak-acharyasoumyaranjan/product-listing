import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { getAllUsers , createUser } from "@/lib/mongodb";


export async function GET(request : Request){
    await connectDB()

    const users = await getAllUsers()

    return NextResponse.json(users , {status : 200})
}



export async function POST(request : Request){
    await connectDB()
    const body = await request.json()
    const createdUser = await createUser(body)

    return NextResponse.json(createdUser,{status : 200})
}
