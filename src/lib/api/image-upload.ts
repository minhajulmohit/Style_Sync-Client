type ImageUploadResponse = {
  url?: string;
  error?: string;
};

export async function uploadImageToImgBB(imageFile: File): Promise<string> {
  const uploadData = new FormData();
  uploadData.append("image", imageFile);

  const response = await fetch("/api/image-upload", {
    method: "POST",
    body: uploadData,
  });
  const result = (await response.json()) as ImageUploadResponse;

  if (!response.ok || !result.url) {
    throw new Error(result.error ?? "Image upload failed.");
  }

  return result.url;
}
