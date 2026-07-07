import { put } from "@vercel/blob";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();

    const file = formData.get("image") as File;

    if (!file) {
      return Response.json(
        { message: "No file uploaded" },
        { status: 400 }
      );
    }

    const fileName = `${Date.now()}-${file.name}`;

    const blob = await put(fileName, file, {
      access: "public",
    });

    return Response.json(
      {
        message: "Image uploaded successfully",
        path: blob.url,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);

    return Response.json(
      {
        message: "Failed to upload image",
      },
      { status: 500 }
    );
  }
}