import { WebsitesResponse, WebsiteResponse } from "@/types/website";
import { apiClient } from "../client";

// API endpoints
const ENDPOINTS = {
  WEBSITES: "/api/websites",
  USER_WEBSITES: "/api/websites/me",
  COUNTER_EMBED: "/api/analytics/counter/:websiteId/embed",
};

/**
 * Fetch all websites for a user
 */
export async function fetchUserWebsites(
  userId: string
): Promise<WebsitesResponse> {
  return apiClient.post<WebsitesResponse>(
    ENDPOINTS.USER_WEBSITES,
    {},
    apiClient.withAuth(userId)
  );
}

/**
 * Create a new website
 */
export async function createWebsite(
  data: { name: string; websiteUrl: string },
  userId: string
): Promise<WebsiteResponse> {
  return apiClient.post<WebsiteResponse>(
    ENDPOINTS.WEBSITES,
    data,
    apiClient.withAuth(userId)
  );
}

/**
 * Get embed code for website counter
 * @param websiteId - ID of the website
 * @param options - Customization options for the counter
 * @param userId - User ID for authentication
 */
export async function getWebsiteCounterEmbed(
  websiteId: string,
  options?: {
    style?: "default" | "minimal" | "dark" | "badge";
    bgColor?: string;
    textColor?: string;
    valueColor?: string;
    text?: string;
    fontSize?: string;
    borderRadius?: string;
    isUniqueVisitors?: boolean;
    fontWeight?: string;
    customCSS?: string;
  },
  userId?: string
): Promise<{
  embedCode: string;
  styles: string[];
  customization: Record<string, string>;
  preview: string;
}> {
  const endpoint = ENDPOINTS.COUNTER_EMBED.replace(":websiteId", websiteId);

  // Convert options to query parameters if provided
  const queryParams = new URLSearchParams();
  if (options) {
    if (options.style) queryParams.append("style", options.style);
    if (options.bgColor) queryParams.append("bgColor", options.bgColor);
    if (options.textColor) queryParams.append("textColor", options.textColor);
    if (options.valueColor)
      queryParams.append("valueColor", options.valueColor);
    if (options.text) queryParams.append("text", options.text);
    if (options.fontSize) queryParams.append("fontSize", options.fontSize);
    if (options.borderRadius)
      queryParams.append("borderRadius", options.borderRadius);
    if (options.isUniqueVisitors !== undefined)
      queryParams.append(
        "isUniqueVisitors",
        options.isUniqueVisitors.toString()
      );
    if (options.fontWeight)
      queryParams.append("fontWeight", options.fontWeight);
    if (options.customCSS) queryParams.append("customCSS", options.customCSS);
  }

  const queryString = queryParams.toString();
  const url = queryString ? `${endpoint}?${queryString}` : endpoint;

  const config = userId ? apiClient.withAuth(userId) : {};

  return apiClient.post(url, config);
}
