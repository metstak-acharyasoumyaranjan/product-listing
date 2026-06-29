import { NextResponse } from "next/server";
import {connectDB , getCategoryById , updateCategoryById } from "@/lib/mongodb";

export async function GET(request: Request , {params}:{ params: Promise<{ id: string }> }){
    await connectDB()
    const {id} =await params
    const category = await getCategoryById(id)
    return NextResponse.json(category,{status : 200})
}

export async function PATCH(request : Request , {params}: {params: Promise<{id:string}>}){
    const { id } = await params
    const body = await request.json()
    const updatedProduct = await updateCategoryById(id , body)
    return NextResponse.json(updatedProduct , {status : 200})
}