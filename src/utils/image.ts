/**
 * Utility functions for sanitizing, deduplicating, and extracting image URLs.
 * Handles cases where URLs are concatenated (e.g., duplicated same URL, multiple URLs joined,
 * or host prefixes inadvertently prepended to full URLs).
 */

const FILE_EXT_REGEX = /\.(png|jpe?g|webp|gif|svg|avif)($|\?)/i;

/**
 * Extracts all distinct, valid, clean image URLs from a raw input string or array.
 * Handles:
 * - Duplicated URLs concatenated together (e.g. "https://domain.com/a.pnghttps://domain.com/a.png")
 * - Duplicated URLs concatenated with slashes or commas (e.g. "https://domain/https://domain/a.png")
 * - Multiple URLs joined with or without separators (e.g. "url1.png,url2.jpg" or "url1.pngurl2.jpg")
 * - JSON stringified arrays
 * - Local blob: and data: URIs
 */
export function extractImageUrls(rawInput: any): string[] {
  if (!rawInput) return [];

  // If already an array, flatten and recursively clean
  if (Array.isArray(rawInput)) {
    const results: string[] = [];
    for (const item of rawInput) {
      results.push(...extractImageUrls(item));
    }
    return Array.from(new Set(results.filter(Boolean)));
  }

  if (typeof rawInput !== "string") return [];

  let str = rawInput.trim();
  if (!str) return [];

  // Blob or data URI - return immediately as valid local preview
  if (str.startsWith("blob:") || str.startsWith("data:")) {
    return [str];
  }

  // JSON stringified array check e.g. '["http..."]'
  if (str.startsWith("[") && str.endsWith("]")) {
    try {
      const parsed = JSON.parse(str);
      if (Array.isArray(parsed)) {
        return extractImageUrls(parsed);
      }
    } catch {
      // Fall through to regex extraction
    }
  }

  // Remove wrapping quotes if any
  str = str.replace(/^["']|["']$/g, "").trim();

  // Find all indices of http:// or https://
  const regex = /https?:\/\//gi;
  const indices: number[] = [];
  let match: RegExpExecArray | null;
  while ((match = regex.exec(str)) !== null) {
    indices.push(match.index);
  }

  if (indices.length === 0) {
    // Relative path, blob, or data URI
    if (str.startsWith("/") || str.startsWith("blob:") || str.startsWith("data:")) {
      return [str];
    }
    return [];
  }

  const rawSegments: string[] = [];
  for (let i = 0; i < indices.length; i++) {
    const start = indices[i];
    const end = i + 1 < indices.length ? indices[i + 1] : str.length;
    let seg = str.substring(start, end).trim();

    // Strip trailing punctuation or spaces
    seg = seg.replace(/[,;"'\s]+$/, "");

    // If followed by another URL, also strip trailing slash from domain prefix
    if (i + 1 < indices.length) {
      seg = seg.replace(/\/+$/, "");
    }

    if (seg) rawSegments.push(seg);
  }

  const cleaned: string[] = [];
  for (let seg of rawSegments) {
    // Check if segment is identically repeated, e.g. "urlurl"
    const half = Math.floor(seg.length / 2);
    if (seg.substring(0, half) === seg.substring(half)) {
      seg = seg.substring(0, half);
    }
    // Also if duplicated with a slash: "url/url"
    if (seg.substring(0, half) === seg.substring(half + 1) && seg[half] === "/") {
      seg = seg.substring(0, half);
    }

    cleaned.push(seg);
  }

  // Deduplicate
  const unique = Array.from(new Set(cleaned));

  // If we have multiple unique segments, prefer ones with valid image file extensions
  // (filtering out bare base URL prefixes like "https://bucket.s3.amazonaws.com")
  const withExt = unique.filter((u) => FILE_EXT_REGEX.test(u));
  if (withExt.length > 0) {
    return withExt;
  }

  return unique;
}

export const DEFAULT_VENUE_IMAGE =
  "https://images.unsplash.com/photo-1514933651103-005eec06c04b?auto=format&fit=crop&w=1200&q=80";

/**
 * Returns a single clean image URL, resolving concatenated or duplicated URLs.
 * If rawInput contains multiple concatenated URLs, returns the primary valid image URL.
 * Falls back to the provided fallback URL if rawInput is empty or invalid.
 */
export function cleanImageUrl(rawInput: any, fallback: string = DEFAULT_VENUE_IMAGE): string {
  if (!rawInput) return fallback;

  if (typeof rawInput === "string") {
    const trimmed = rawInput.trim();
    if (trimmed.startsWith("blob:") || trimmed.startsWith("data:")) {
      return trimmed;
    }
  }

  const urls = extractImageUrls(rawInput);
  if (urls.length > 0) {
    return urls[0] || fallback;
  }
  if (typeof rawInput === "string" && rawInput.trim()) {
    const trimmed = rawInput.trim();
    if (trimmed.startsWith("/") || trimmed.startsWith("blob:") || trimmed.startsWith("data:")) {
      return trimmed;
    }
  }
  return fallback;
}

/**
 * Safe image onError event handler that swaps a broken or unreachable image src
 * with a high-resolution dummy image so that browser alt text is never displayed.
 */
export function handleImageError(
  event: React.SyntheticEvent<HTMLImageElement, Event>,
  fallbackUrl: string = DEFAULT_VENUE_IMAGE
) {
  const target = event.currentTarget;
  if (target && target.src !== fallbackUrl) {
    target.onerror = null; // Prevent infinite fallback loop if offline
    target.src = fallbackUrl;
  }
}

/**
 * Compresses an image client-side using an offscreen HTML5 Canvas.
 * Automatically scales down excessively large dimensions and compresses
 * the image so it safely remains below maxSizeBytes (default 4MB),
 * allowing users to upload large images (e.g. 5MB - 30MB) without exceeding server limits.
 */
export async function compressImageIfNeeded(
  file: File,
  maxSizeBytes: number = 4 * 1024 * 1024,
  maxWidthOrHeight: number = 1920
): Promise<File> {
  if (typeof window === "undefined" || !file || !file.type.startsWith("image/")) {
    return file;
  }

  // If already under target size, no compression needed
  if (file.size <= maxSizeBytes) {
    return file;
  }

  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new window.Image();
      img.onload = () => {
        let { width, height } = img;

        if (width > maxWidthOrHeight || height > maxWidthOrHeight) {
          if (width > height) {
            height = Math.round((height * maxWidthOrHeight) / width);
            width = maxWidthOrHeight;
          } else {
            width = Math.round((width * maxWidthOrHeight) / height);
            height = maxWidthOrHeight;
          }
        }

        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          resolve(file);
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);

        const tryQuality = (quality: number) => {
          canvas.toBlob(
            (blob) => {
              if (!blob) {
                resolve(file);
                return;
              }

              if (blob.size > maxSizeBytes && quality > 0.45) {
                tryQuality(quality - 0.15);
              } else {
                const newFileName = file.name.replace(/\.[^.]+$/, ".jpg");
                const compressedFile = new File([blob], newFileName, {
                  type: "image/jpeg",
                  lastModified: Date.now(),
                });
                resolve(compressedFile);
              }
            },
            "image/jpeg",
            quality
          );
        };

        tryQuality(0.85);
      };
      img.onerror = () => resolve(file);
      img.src = e.target?.result as string;
    };
    reader.onerror = () => resolve(file);
    reader.readAsDataURL(file);
  });
}
