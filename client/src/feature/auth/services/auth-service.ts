// Provides typed login and registration requests through TanStack Query mutations.
import { useMutation } from "@tanstack/react-query"

import type {
  AuthResponse,
  LoginParams,
  RegisterParams,
} from "@/feature/auth/types"
import { publicApiClient } from "@/lib/api/api-client"
import {
  ApiError,
  extractFieldErrors,
  toApiError,
  type ApiResponse,
} from "@/lib/api/api-error"

const authMutationKeys = {
  login: ["auth", "login"] as const,
  register: ["auth", "register"] as const,
}

async function authRequest<TResponse, TBody extends object>(
  path: string,
  body: TBody
) {
  try {
    const { data: payload } = await publicApiClient.post<ApiResponse<TResponse>>(
      path,
      body
    )

    if (!payload.success || !payload.data) {
      throw new ApiError(payload.message || "Something went wrong. Please try again.", {
        fieldErrors: extractFieldErrors(payload.errors),
      })
    }

    return payload.data
  } catch (error) {
    const apiError = toApiError(error)

    if (apiError.status === 409 && !apiError.fieldErrors?.email) {
      throw new ApiError(apiError.message, {
        status: apiError.status,
        code: apiError.code,
        fieldErrors: { ...apiError.fieldErrors, email: apiError.message },
        cause: apiError,
      })
    }

    throw apiError
  }
}

export function loginUser(params: LoginParams) {
  return authRequest<AuthResponse, LoginParams>("/users/login", params)
}

export function registerUser(params: RegisterParams) {
  return authRequest<AuthResponse, RegisterParams>("/users/register", params)
}

export function useAuthLoginService() {
  return useMutation({
    mutationKey: authMutationKeys.login,
    mutationFn: loginUser,
  })
}

export function useAuthRegisterService() {
  return useMutation({
    mutationKey: authMutationKeys.register,
    mutationFn: registerUser,
  })
}
