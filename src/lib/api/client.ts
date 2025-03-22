import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";
import { API_CONFIG } from "@/configs";

// Create axios instance with default config
const axiosInstance: AxiosInstance = axios.create({
  baseURL: API_CONFIG.baseURL,
  timeout: API_CONFIG.timeout,
  headers: API_CONFIG.headers,
});

// API client with typed methods
export const apiClient = {
  get: <T>(url: string, config?: AxiosRequestConfig): Promise<T> => {
    return axiosInstance
      .get(url, config)
      .then((response: AxiosResponse<T>) => response.data);
  },

  post: <T>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<T> => {
    return axiosInstance
      .post(url, data, config)
      .then((response: AxiosResponse<T>) => response.data);
  },

  put: <T>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<T> => {
    return axiosInstance
      .put(url, data, config)
      .then((response: AxiosResponse<T>) => response.data);
  },

  delete: <T>(url: string, config?: AxiosRequestConfig): Promise<T> => {
    return axiosInstance
      .delete(url, config)
      .then((response: AxiosResponse<T>) => response.data);
  },

  // Helper to add auth headers
  withAuth: (userId: string): AxiosRequestConfig => {
    return {
      headers: {
        "x-user-id": userId,
      },
    };
  },
};
