import Cookies from 'js-cookie'
import { apiBase } from '@/config/api'
import logger from 'loglevel'
import { create } from 'zustand'
import { WrappedResponse } from '@/lib/response'

const ACCESS_TOKEN = 'sdfjas;ldfjal;sjdkfs;djkfasd;fj'

export interface AuthUser {
  id: string
  nickname: string
  email: string
  avatar: string
  roles: string[]
}

interface AuthState {
  auth: {
    user: AuthUser | null
    setUser: (user: AuthUser | null) => void
    expire: number
    accessToken: string
    setAccessToken: (accessToken: string, expire: number) => void
    resetAccessToken: () => void
    reset: () => void
  }
}

export const useAuthStore = create<AuthState>()((set) => {
  const cookieState = Cookies.get(ACCESS_TOKEN)
  const initToken = cookieState ?? ''
  return {
    auth: {
      user: null,
      setUser: (user) =>
        set((state) => ({ ...state, auth: { ...state.auth, user } })),
      expire: 0,
      accessToken: initToken,
      setAccessToken: (accessToken: string, expire: number) =>
        set((state) => {
          Cookies.set(ACCESS_TOKEN, accessToken)
          return { ...state, auth: { ...state.auth, accessToken, expire } }
        }),
      resetAccessToken: () =>
        set((state) => {
          Cookies.remove(ACCESS_TOKEN)
          return {
            ...state,
            auth: { ...state.auth, accessToken: '', expire: 0 },
          }
        }),
      reset: () =>
        set((state) => {
          Cookies.remove(ACCESS_TOKEN)
          return {
            ...state,
            auth: { ...state.auth, user: null, accessToken: '', expire: 0 },
          }
        }),
    },
  }
})

// export const useAuth = () => useAuthStore((state) => state.auth)

export const isAuthenticated = (): boolean => !!Cookies.get(ACCESS_TOKEN)

const requestInterceptor = (request: Request) => {
  const token = Cookies.get(ACCESS_TOKEN)

  if (token) {
    request.headers.append('Authorization', `Bearer ${token}`)
  } else {
    logger.error('failed to get token with a authed fetch.')
  }

  request.headers.append('Content-Type', 'application/json')

  return request
}

const responseInterceptor = async <T>(
  response: Response
): Promise<WrappedResponse<T> | undefined> => {
  if (response.status === 200) {
    // 取出结果并解析
    const resp: WrappedResponse<T> = await response.json()

    return resp
  } else if (response.status === 401) {
    // 自动执行 refresh 操作
  }
}

export const fetchAuthed = async <T>(
  url: RequestInfo | URL,
  options?: RequestInit
): Promise<WrappedResponse<T> | undefined> => {
  const request = requestInterceptor(new Request(`${apiBase}${url}`, options))
  const response = await responseInterceptor<T>(await fetch(request))

  return response
}
