import { NextResponse } from "next/server";
import { isValidUrl } from "./validation.middleware";

export const MAX_IMAGES_PER_PUBLICATION = 3;

/**
 * Validates image URLs associated with a publication.
 *
 * SOLID:
 * - SRP: this module only validates publication images.
 * - OCP: the image limit is configurable through a constant.
 *
 * Refactoring:
 * - Extract Method: URL validation is reused from validation.middleware.ts.
 */
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

  if (
    imageUrls.length > MAX_IMAGES_PER_PUBLICATION
  ) {
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
    (imageUrl) => !isValidUrl(imageUrl)
  );

  if (containsInvalidImage) {
    return NextResponse.json(
      {
        error: "Invalid image URL",
        message:
          "Todas las imágenes deben contener URLs válidas.",
      },
      { status: 400 }
    );
  }

  return null;
}