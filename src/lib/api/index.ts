// Re-export all API functions
export * from "./endpoints/websites";
export * from "./endpoints/analytics";

// Export client for direct use if needed
export { apiClient } from "./client";
export { API_CONFIG } from "@/configs";
