import axios from "axios"

export type ApiFieldErrors = Record<string, string>

export type ApiResponse<T> = {
  success: boolean
  message: string
  data?: T
  errors?: Record<string, string[] | undefined>
}

type ApiErrorOptions = {
  status?: number
  code?: string
  fieldErrors?: ApiFieldErrors
  cause?: unknown
}

export class ApiError extends Error {
  readonly status?: number
  readonly code?: string
  readonly fieldErrors?: ApiFieldErrors

  constructor(message: string, options: ApiErrorOptions = {}) {
    super(message, { cause: options.cause })
    this.name = "ApiError"
    this.status = options.status
    this.code = options.code
    this.fieldErrors = options.fieldErrors
  }
}

export function extractFieldErrors(
  errors: ApiResponse<unknown>["errors"]
): ApiFieldErrors | undefined {
  if (!errors) return undefined

  const fieldErrors = Object.fromEntries(
    Object.entries(errors).flatMap(([field, messages]) =>
      messages?.[0] ? [[field, messages[0]]] : []
    )
  )

  return Object.keys(fieldErrors).length > 0 ? fieldErrors : undefined
}

export function toApiError(error: unknown) {
  if (error instanceof ApiError) return error

  if (!axios.isAxiosError<ApiResponse<unknown>>(error)) {
    return new ApiError("Something went wrong. Please try again.", { cause: error })
  }

  const payload = error.response?.data
  const status = error.response?.status

  if (error.code === "ECONNABORTED") {
    return new ApiError("The request took too long. Please try again.", {
      code: error.code,
      status,
      cause: error,
    })
  }

  if (!error.response) {
    return new ApiError("We could not reach TrackFlow. Please try again.", {
      code: error.code,
      cause: error,
    })
  }

  return new ApiError(
    payload?.message || "Something went wrong. Please try again.",
    {
      status,
      code: error.code,
      fieldErrors: extractFieldErrors(payload?.errors),
      cause: error,
    }
  )
}
