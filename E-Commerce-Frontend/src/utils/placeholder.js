// Neutral "no image" picture (inline SVG, no network request).
// Used ONLY when a product really has no image / the image URL is broken.
// (Before, the fallback was a real headphones photo, which made every product
// that lacked an image look like headphones.)
export const PLACEHOLDER_IMAGE =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="600" viewBox="0 0 600 600">
      <rect width="600" height="600" fill="#f1f1f1"/>
      <g fill="none" stroke="#bbb" stroke-width="10" stroke-linecap="round" stroke-linejoin="round">
        <rect x="170" y="190" width="260" height="200" rx="18"/>
        <circle cx="240" cy="260" r="22"/>
        <path d="M185 375l85-80 55 50 40-35 50 55"/>
      </g>
      <text x="300" y="450" font-family="Arial, sans-serif" font-size="28" fill="#aaa" text-anchor="middle">No image</text>
    </svg>`
  );

// Use as <img onError={handleImageError} /> - swaps a broken URL for the placeholder once.
export const handleImageError = (e) => {
  if (e.currentTarget.src !== PLACEHOLDER_IMAGE) {
    e.currentTarget.onerror = null;
    e.currentTarget.src = PLACEHOLDER_IMAGE;
  }
};