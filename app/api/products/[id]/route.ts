import { getProductById , updateProductById , deleteProductById } from "@/lib/mongodb";
import { NextResponse } from "next/server";

export async function GET(request: Request , { params }: { params: Promise<{ id: string }> }){
    const { id } = await params;
    const productDetails = await getProductById(id)

    return NextResponse.json(productDetails , {status: 200})
}

export async function PATCH(request: Request , { params }: { params: Promise<{ id: string }> }){
    const { id } = await params;
    const data = await request.json()
    const updatedProduct = await updateProductById(id , data)

    return NextResponse.json(updatedProduct , {status: 200})
}

export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;

    const deletedProduct = await deleteProductById(id);

    return NextResponse.json(deletedProduct, { status: 200 });
}