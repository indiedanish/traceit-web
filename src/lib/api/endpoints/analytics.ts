import { AnalyticsData } from "@/types/analytics";
import { apiClient } from "../client";

// API endpoints
const ENDPOINTS = {
  ANALYTICS: "/api/analytics",
};

/**
 * Fetch analytics data for a website
 */
export async function fetchAnalytics(
  websiteId: string,
  userId: string
): Promise<AnalyticsData> {


  return apiClient.post<AnalyticsData>(
    `${ENDPOINTS.ANALYTICS}/${websiteId}`,
    {},
    apiClient.withAuth(userId)
  );
}

