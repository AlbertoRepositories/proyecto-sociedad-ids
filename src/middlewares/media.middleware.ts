import { NextResponse } from "next/server";

export const MAX_IMAGES_PER_PUBLICATION = 3;

export function validateImageLimit(
  imageUrls: unknown
): NextResponse | null {
  if (imageUrls === undefined || imageUrls === null) {
    return null;
  }

  if (!Array.isArray(imageUrls)) {
    return NextResponse.json(
      {
        error: "Invalid images",
        message:
          "Las imágenes deben enviarse como una lista.",
      },
      { status: 400 }
    );
  }

  if (imageUrls.length > MAX_IMAGES_PER_PUBLICATION) {
    return NextResponse.json(
      {
        error: "Image limit exceeded",
        message:
          "Una publicación o evento puede contener máximo 3 imágenes.",
        maximumAllowed:
          MAX_IMAGES_PER_PUBLICATION,
      },
      { status: 400 }
    );
  }

  const containsInvalidImage = imageUrls.some(
    (imageUrl) =>
      typeof imageUrl !== "string" ||
      imageUrl.trim().length === 0
  );

  if (containsInvalidImage) {
    return NextResponse.json(
      {
        error: "Invalid image URL",
        message:
          "Todas las imágenes deben tener una URL válida.",
      },
      { status: 400 }
    );
  }

  return null;
}