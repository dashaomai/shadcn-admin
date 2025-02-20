import Cookies from 'js-cookie'
import { apiBase } from '@/config/api'
import logger from 'loglevel'
import { create } from 'zustand'
import { queryClient } from '@/lib/client'
import { Code } from '@/lib/code.ts'
import { i18n } from '@/lib/i18n.ts'
import { WrappedResponse } from '@/lib/response'
import { toast } from '@/hooks/use-toast.ts'

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
          clearSelfData()
          return { ...state, auth: { ...state.auth, accessToken, expire } }
        }),
      resetAccessToken: () =>
        set((state) => {
          Cookies.remove(ACCESS_TOKEN)
          clearSelfData()
          return {
            ...state,
            auth: { ...state.auth, accessToken: '', expire: 0 },
          }
        }),
      reset: () =>
        set((state) => {
          Cookies.remove(ACCESS_TOKEN)
          clearSelfData()
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

  return request
}

const responseInterceptor = async <T>(
  response: Response
): Promise<WrappedResponse<T> | undefined> => {
  if (response.status === Code.StatusOk) {
    // 取出结果并解析
    const result = (await response.json()) as WrappedResponse<T>

    if (result.code === Code.StatusOk) {
      return result
    } else {
      switch (result.code) {
        case Code.CodeLoginDuplicated: {
          // 登录信息重复
          logger.error('login name duplicated')
          toast({
            variant: 'destructive',
            title: i18n.t('errors.duplicated.login.title'),
            description: i18n.t('errors.duplicated.login.description'),
          })

          break
        }

        case Code.CodeRoleNameDuplicated: {
          // 角色信息重复
          logger.error('role name duplicated')
          toast({
            variant: 'destructive',
            title: i18n.t('errors.duplicated.role.title'),
            description: i18n.t('errors.duplicated.role.description'),
          })

          break
        }
      }
    }
  } else {
    switch (response.status) {
      case Code.StatusBadRequest: {
        // 请求无效
        logger.error('http request was invalid')

        break
      }

      case Code.StatusUnauthorized: {
        // 自动执行 refresh 操作
        logger.error('access token is expired, need refresh or sign-out.')

        break
      }

      case Code.StatusForbidden: {
        // 权限不足
        logger.error('no authorization for this api.')
        toast({
          variant: 'destructive',
          title: i18n.t('errors.forbidden.title'),
          description: i18n.t('errors.forbidden.description'),
        })

        break
      }

      case Code.StatusNotFound: {
        // api 资源不存在
        logger.error('the api was not found')

        break
      }

      default: {
        // 其它错误代码
        logger.error('wrong status of the api result: %d', response.status)

        break
      }
    }
  }
}

export const fetchAuthed = async <T>(
  url: RequestInfo | URL,
  options?: RequestInit
): Promise<T | undefined> => {
  const request = requestInterceptor(
    new Request(`${apiBase}${url}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    })
  )
  const response = await responseInterceptor<T>(await fetch(request))

  return response?.payload
}

const clearSelfData = () => {
  setTimeout(() => {
    queryClient.invalidateQueries({
      queryKey: ['self-profile'],
    })
    queryClient.invalidateQueries({
      queryKey: ['self-roles'],
    })
  }, 0)
}
