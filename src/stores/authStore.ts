import Cookies from 'js-cookie'
import { apiBase } from '@/config/api'
import { Base64 } from 'js-base64'
import { jwtDecode } from 'jwt-decode'
import logger from 'loglevel'
import { toast } from 'sonner'
import { create } from 'zustand'
import { SignInPayload } from '@/lib/auth'
import { brokerConn } from '@/lib/broker_conn'
import { queryClient } from '@/lib/client'
import { Code } from '@/lib/code.ts'
import { i18n } from '@/lib/i18n.ts'
import { WrappedResponse } from '@/lib/response'

const ACCESS_TOKEN = 'sdfjas'

type SubscriptionPush = {
  topic: string
  subject: string
  payload: string
}

type UserInfo = {
  identity: string
  sid: string
  exp: number
}

interface AuthState {
  auth: {
    accountId?: string
    sessionId?: string
    expire: number
    accessToken?: string
    setAccessToken: (accessToken: string, isRefresh: boolean) => void
    refreshHandler: () => Promise<void>
    resetAccessToken: () => void
    reset: () => void
  }
}

export function connectToBroker(accountId: string, sessionId: string) {
  brokerConn.init(
    {
      wsUrl: 'ws://localhost:7799',
    },
    () => {
      logger.info('broker connected')

      brokerConn.request(
        'broker.subscriber.entry',
        { accountId, sessionId },
        () => {
          logger.info('broker subscriber entry successful.')
        }
      )
    }
  )
}

export function disconnectFromBroker() {
  brokerConn.disconnect()
}

export const useAuthStore = create<AuthState>()((set, get) => {
  const cookieState = Cookies.get(ACCESS_TOKEN)
  const initToken = cookieState ?? ''
  let accountId: string | undefined = undefined
  let sessionId: string | undefined = undefined
  let expire = 0
  if (initToken) {
    const decoded = jwtDecode<UserInfo>(initToken)
    accountId = decoded.identity
    sessionId = decoded.sid
    expire = decoded.exp

    connectToBroker(accountId, sessionId)
  }

  setInterval(() => {
    const now = Date.now()
    const state = get()
    const { expire } = state.auth
    if (expire && expire * 1000 - now < 60000) {
      state.auth.refreshHandler().then()
    }
  }, 1000)

  brokerConn.emitter.on('onSubscribePush', (push: SubscriptionPush) => {
    decode(push)

    logger.info('broker pushed message:', push)

    const { accountId, sessionId } = get().auth
    const topicPrefix = `cyber.vod.account.${accountId}.`

    if (push.subject.startsWith(topicPrefix)) {
      // 个人消息
      const route = push.subject.substring(topicPrefix.length)
      processBrokerSubscription(accountId!, sessionId!, route, push, get)
    } else {
      // 其他消息
    }
  })

  return {
    auth: {
      accountId,
      sessionId,
      expire,
      accessToken: initToken,
      setAccessToken: (accessToken: string, isRefresh: boolean) =>
        set((state) => {
          const decoded = jwtDecode<UserInfo>(accessToken)

          logger.info('set access token with expire: %d', decoded.exp)

          Cookies.set(ACCESS_TOKEN, accessToken)
          clearSelfData()

          if (!isRefresh) {
            connectToBroker(decoded.identity, decoded.sid)
          }

          return {
            ...state,
            auth: {
              ...state.auth,
              accountId: decoded.identity,
              sessionId: decoded.sid,
              accessToken,
              expire: decoded.exp,
            },
          }
        }),
      resetAccessToken: () =>
        set((state) => {
          Cookies.remove(ACCESS_TOKEN)
          clearSelfData()

          disconnectFromBroker()

          return {
            ...state,
            auth: {
              ...state.auth,
              accountId: undefined,
              sessionId: undefined,
              accessToken: undefined,
              expire: 0,
            },
          }
        }),
      refreshHandler: async () => {
        const state = get()
        const token = state.auth.accessToken

        if (token) {
          const payload = await fetchAuthed<SignInPayload>('/auth/refresh', {
            method: 'POST',
          })

          if (payload) {
            state.auth.setAccessToken(payload.token, true)
          } else {
            state.auth.resetAccessToken()
          }
        }
      },
      reset: () => {
        const state = get()
        state.auth.resetAccessToken()
      },
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
  request: Request
): Promise<WrappedResponse<T> | undefined> => {
  const response = await fetch(request)

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
          toast.error(i18n.t('errors.duplicated.login.title'), {
            description: i18n.t('errors.duplicated.login.description'),
          })

          break
        }

        case Code.CodeRoleNameDuplicated: {
          // 角色信息重复
          logger.error('role name duplicated')
          toast.error(i18n.t('errors.duplicated.role.title'), {
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

        await useAuthStore.getState().auth.refreshHandler()

        break
      }

      case Code.StatusForbidden: {
        // 权限不足
        logger.error('no authorization for this api.')
        toast.error(i18n.t('errors.forbidden.title'), {
          description: i18n.t('errors.forbidden.description'),
        })

        useAuthStore.getState().auth.reset()

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
        ...options?.headers,
      },
    })
  )
  const response = await responseInterceptor<T>(request)

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

    setTimeout(() => {
      window.location.reload()
    }, 5)
  }, 0)
}

const decode = (push: SubscriptionPush) => {
  push.payload = Base64.decode(push.payload)
}

const processBrokerSubscription = (
  accountId: string,
  sessionId: string,
  route: string,
  push: SubscriptionPush,
  get: () => AuthState
) => {
  switch (route) {
    case 'signIn': {
      const signInSessionId = push.payload

      if (sessionId !== signInSessionId) {
        logger.info(
          'account %s was signed in another session: %s -> %s',
          accountId,
          sessionId,
          signInSessionId
        )

        /* toast.warning(i18n.t('auth.duplication.kick-off'), {
          description: i18n.t('auth.duplication.kick-off-description'),
        }) */

        get().auth.resetAccessToken()
      }

      break
    }
  }
}