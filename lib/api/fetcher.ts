export class ApiError extends Error {
  status: number;
  data?: unknown;

  constructor(message: string, status: number, data?: unknown) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.data = data;
  }
}

export async function fetcher<T>(
  url: string,
  options?: RequestInit
): Promise<T> {
  const res = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
      ...options?.headers
    },
    ...options
  });

  if (!res.ok) {
    let errorData: { error?: string; message?: string } | undefined;
    try {
      errorData = await res.json();
    } catch {
      // Ignore JSON parse error if response body is non-JSON
    }

    const message =
      errorData?.error ||
      errorData?.message ||
      `HTTP error ${res.status}: ${res.statusText}`;

    throw new ApiError(message, res.status, errorData);
  }

  // If 204 No Content
  if (res.status === 204) {
    return {} as T;
  }

  return (await res.json()) as T;
}
