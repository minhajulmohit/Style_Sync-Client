import { NextResponse } from "next/server";

const maxImageSize = 4 * 1024 * 1024;

type ImgBBUploadResponse = {
  success?: boolean;
  data?: {
    display_url?: string;
  };
  error?: {
    message?: string;
  };
};

export async function POST(request: Request) {
  const apiKey =
    process.env.IMAGEBB_API ?? process.env.NEXT_PUBLIC_IMAGEBB_API;
  if (!apiKey) {
    return NextResponse.json(
      { error: "Image uploads are not configured." },
      { status: 503 },
    );
  }

  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return NextResponse.json(
      { error: "Choose an image to upload." },
      { status: 400 },
    );
  }

  const image = formData.get("image");
  if (!(image instanceof File) || image.size === 0) {
    return NextResponse.json(
      { error: "Choose an image to upload." },
      { status: 400 },
    );
  }
  if (!image.type.startsWith("image/")) {
    return NextResponse.json(
      { error: "The selected file must be an image." },
      { status: 415 },
    );
  }
  if (image.size > maxImageSize) {
    return NextResponse.json(
      { error: "Choose an image smaller than 4 MB." },
      { status: 413 },
    );
  }

  const uploadData = new FormData();
  uploadData.append("image", image);

  let response: Response;
  try {
    response = await fetch(
      `https://api.imgbb.com/1/upload?key=${encodeURIComponent(apiKey)}`,
      { method: "POST", body: uploadData },
    );
  } catch (error) {
    console.error("Could not reach ImgBB:", error);
    return NextResponse.json(
      { error: "The image upload service is unavailable." },
      { status: 502 },
    );
  }

  let result: ImgBBUploadResponse;
  try {
    result = (await response.json()) as ImgBBUploadResponse;
  } catch (error) {
    console.error("Could not read the ImgBB response:", error);
    return NextResponse.json(
      { error: "The image upload service returned an invalid response." },
      { status: 502 },
    );
  }

  if (!response.ok || !result.success || !result.data?.display_url) {
    return NextResponse.json(
      { error: result.error?.message ?? "Image upload failed." },
      { status: 502 },
    );
  }

  return NextResponse.json({ url: result.data.display_url });
}
