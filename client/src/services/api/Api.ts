import Cookies from "js-cookie";
import { ApiException } from "./ApiException";

export class Api {
  async request<T>({
    path,
    method = "GET",
    data,
    headers = {},
    contentType = "application/json",
  }: {
    path: string;
    method?: string;
    data?: unknown;
    headers?: Record<string, string>;
    contentType?: string;
  }): Promise<T> {
    try {
      const token = Cookies.get("token");

      const apiUrl = import.meta.env.VITE_API_URL;

      const requestHeaders: Record<string, string> = {
        ...headers,
        ...(contentType ? { "Content-Type": contentType } : {}),
      };

      if (token) {
        requestHeaders.Authorization = `Bearer ${token}`;
      }

      const options: RequestInit = {
        method,
        headers: requestHeaders,
      };

      if (data && ["POST", "PUT", "PATCH"].includes(method.toUpperCase())) {
        options.body = JSON.stringify(data);
      }

      const response = await fetch(`${apiUrl}/${path}`, options);

      if (!response.ok) {
        const errorData = await response.json();
        throw new ApiException(errorData);
      }

      return response.json();
    } catch (error: unknown) {
      if (error instanceof ApiException) {
        throw new ApiException({
          message: error.message,
          statusCode: error.status,
        });
      }
      throw new ApiException({
        message: "An unknown error occurred",
        statusCode: 500,
      });
    }
  }
}
