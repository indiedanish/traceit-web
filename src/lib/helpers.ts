/**
 * Generates the tracking script HTML for a website
 * @param websiteId The ID of the website to track
 * @returns HTML script tag as a string
 */
export function generateTrackingScript(websiteId: string): string {
  return `<script src="${process.env.NEXT_PUBLIC_API_URL}/tracker.js" data-website-id="${websiteId}"></script>`;
}
