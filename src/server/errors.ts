// Centralized error envelope for GlobalHealth API responses.

export interface ApiErrorPayload {
  success: false;
  error: {
    code: string;
    message: string;
    requestId?: string;
  };
}

export function apiError(
  code: string,
  message: string,
  requestId?: string
): ApiErrorPayload {
  return {
    success: false,
    error: {
      code,
      message,
      requestId
    }
  };
}
