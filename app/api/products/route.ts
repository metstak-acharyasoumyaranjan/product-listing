import { NextResponse } from "next/server";
import { CreateProduct, connectDB , getAllProducts } from "@/lib/mongodb";
import mongoose from "mongoose";
import { ProductValidationSchema } from "@/schema/db_validation";

export async function GET(request: Request) {
  await connectDB();
  const products = await getAllProducts()
  return NextResponse.json(products,{status : 200})
}
export async function POST(request: Request) {
  try {
    await connectDB();
    const body = await request.json();
    const result = ProductValidationSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        {
          errors: result.error.flatten(),
        },
        {
          status: 400,
        }
      );
    }

    const product = await CreateProduct(body);
    return NextResponse.json(product, {
      status: 201,
    });
  } catch (error) {
    console.error(error);
    if (error instanceof mongoose.Error.ValidationError) {
      return NextResponse.json(
        {
          message: error.message,
        },
        {
          status: 400,
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
    );
  }
}
