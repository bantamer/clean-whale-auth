import { API_URL } from "../../env";
import { getCookie } from "../get-cookie";

export class RequestError extends Error {
  public statusCode: number;
  public errorMessage: string;

  constructor(response: Response, message: string) {
    super(message);
    this.name = "RequestError";
    this.statusCode = response.status;
    this.errorMessage = message || response.statusText;

    Error.captureStackTrace(this, RequestError);
  }
}

export const enum HttpMethods {
  GET = "GET",
  POST = "POST",
  PUT = "PUT",
  PATCH = "PATCH",
  DELETE = "DELETE",
}

export interface RequestOptions<TBody = any> {
  method: HttpMethods;
  pathname: string;
  pathnameData?: Record<string, string>;
  headers?: Record<string, string>;
  body?: TBody;
}

const replacePathParams = (path: string, data?: Record<string, string>) => {
  if (!data) return path;

  return Object.entries(data).reduce((acc, [key, value]) => {
    return acc.replace(`:${key}`, encodeURIComponent(value));
  }, path);
};

export const makeRequest = async <TResponseBody = any, TBody = any | undefined>(
  pathname: string,
  options: Omit<RequestOptions<TBody>, "pathname">
): Promise<TResponseBody> => {
  const { pathnameData, body, headers, ...rest } = options;

  const requestOptions: RequestInit = {
    credentials: "include",
    mode: "cors",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      "X-CSRF-Token": getCookie("csrf_token") || "",
      ...headers,
    },
    body: body ? JSON.stringify(body) : undefined,
    ...rest,
  };

  const resolvedPath = replacePathParams(pathname, pathnameData);
  const url = `${API_URL}${resolvedPath}`;

  const response = await fetch(url, requestOptions);

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const errorMessage = errorData.message || response.statusText;
    throw new RequestError(response, errorMessage);
  }

  return response.json();
};
