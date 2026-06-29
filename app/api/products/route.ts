import { NextResponse } from "next/server";
import { CreateProduct, connectDB } from "@/lib/mongodb";
import mongoose from "mongoose";
import { ProductValidationSchema } from "@/schema/db_validation";
import { Product } from "@/model/Product";

export async function GET(request: Request) {
  await connectDB();

  const url = new URL(request.url);
  const search = url.searchParams.get("search")?.trim() || "";
  const page = Math.max(Number(url.searchParams.get("page") || "1"), 1);
  const limit = Math.max(Math.min(Number(url.searchParams.get("limit") || "3"), 50), 1);

  const filter: Record<string, any> = {};
  if (search) {
    filter.product_name = { $regex: search, $options: "i" };
  }

  const total = await Product.countDocuments(filter);
  const products = await Product.find(filter)
    .skip((page - 1) * limit)
    .limit(limit)
    .populate({
      path: "brand",
      populate: {
        path: "manufacturer",
      },
    })
    .populate("categories");

  return NextResponse.json(
    {
      products,
      page,
      total,
      totalPages: Math.max(Math.ceil(total / limit), 1),
    },
    {
      status: 200,
    }
  );
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
