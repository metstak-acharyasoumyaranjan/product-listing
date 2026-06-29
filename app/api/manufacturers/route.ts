import { NextResponse } from "next/server";
import { connectDB , getAllManufacturers , createManufacturer } from "@/lib/mongodb";
import { ManufacturerValidationSchema } from "@/schema/db_validation";
import mongoose from "mongoose";


export async function GET(request : Request){
    console.log("connecting")
    await connectDB()
    console.log("Connected")
    const categories = await getAllManufacturers()
    return NextResponse.json(categories ,{ status : 200})
}

export async function POST(request: Request){
    try{
            await connectDB()
            const body = await request.json()
            console.log(body)
            const result = ManufacturerValidationSchema.safeParse(body);
            console.log(result)
            if (!result.success) {

                return NextResponse.json(
                    {
                        errors: result.error.flatten()
                    },
                    {
                        status: 400
                    }
                );

            }
            console.log(request.headers.get("content-type"));
            const product = await createManufacturer(body)
            return NextResponse.json(product, {
                status: 201,
            });

    } catch(error){
         console.error(error);
         if (error instanceof mongoose.Error.ValidationError) {
                return NextResponse.json(
                    {
                        message: error.message
                    },
                    {
                        status: 400
                    }
                );
            }
         return NextResponse.json(
            {
                message: "Internal Server Error",
            },
            {
                status: 500,
            }
    )}
    
}
    