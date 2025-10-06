import { API_BASE_URL, MOCK_WARNING_PREFIX, USE_API_MOCKS } from "./config";
import { getAuthToken } from "../utils/authStorage";

export class ApiError extends Error {
  constructor(message, { status, payload } = {}) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.payload = payload;
  }
}

const buildQueryString = (query) => {
  if (!query || typeof query !== "object") {
    return "";
  }

  const searchParams = new URLSearchParams();
  Object.entries(query).forEach(([key, value]) => {
    if (value === undefined || value === null || value === "") {
      return;
    }

    if (Array.isArray(value)) {
      value.forEach((item) => searchParams.append(key, item));
      return;
    }

    searchParams.append(key, value);
  });

  const serialized = searchParams.toString();
  return serialized.length ? `?${serialized}` : "";
};

export const apiRequest = async (
  path,
  { method = "GET", headers, body, query, signal } = {}
) => {
  if (typeof path !== "string" || !path.length) {
    throw new Error("apiRequest requires a path string");
  }

  const endpoint = path.startsWith("http")
    ? path
    : `${API_BASE_URL.replace(/\/$/, "")}/${path.replace(/^\//, "")}`;

  const requestInit = {
    method,
    headers: {
      "Content-Type": "application/json",
      ...headers,
    },
    signal,
  };

  const token = getAuthToken();
  if (token && !requestInit.headers.Authorization) {
    requestInit.headers.Authorization = `Bearer ${token}`;
  }

  if (body !== undefined && body !== null) {
    requestInit.body = typeof body === "string" ? body : JSON.stringify(body);
  }

  const queryString = buildQueryString(query);

  const response = await fetch(`${endpoint}${queryString}`, requestInit);

  const contentType = response.headers.get("content-type") ?? "";
  const isJson = contentType.includes("application/json");
  const payload = isJson ? await response.json() : await response.text();

  if (!response.ok) {
    throw new ApiError("Request failed", {
      status: response.status,
      payload,
    });
  }

  return payload;
};

export const withApiFallback = async (requestFn, mockFn, {
  silenceWarnings = false,
} = {}) => {
  if (typeof requestFn !== "function") {
    throw new Error("withApiFallback requires a request function");
  }

  try {
    return await requestFn();
  } catch (error) {
    if (!USE_API_MOCKS || typeof mockFn !== "function") {
      throw error;
    }

    if (!silenceWarnings) {
      console.warn(
        `${MOCK_WARNING_PREFIX} Falling back to mock data due to API error:`,
        error
      );
    }

    return await mockFn();
  }
};
