import { HTMLAttributes, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { getRouteApi, useRouter } from '@tanstack/react-router'
import logger from 'loglevel'
import { doSignIn } from '@/api/auth'
import { useAuthStore } from '@/stores/authStore'
import { SignInPayload } from '@/lib/auth'
import { i18next, z } from '@/lib/i18n'
import { WrappedResponse } from '@/lib/response'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { PasswordInput } from '@/components/password-input'

type UserAuthFormProps = HTMLAttributes<HTMLDivElement>

const formSchema = z.object({
  name: z.string().min(5).max(30),
  password: z.string().min(5).max(20),
})

export function UserAuthForm({ className, ...props }: UserAuthFormProps) {
  const router = useRouter()

  const routeApi = getRouteApi('/(auth)/sign-in-2')
  const search = routeApi.useSearch()

  const [isLoading, setIsLoading] = useState(false)
  const [loginFailed, setLoginFailed] = useState(false)

  const authStore = useAuthStore()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      password: '',
    },
  })

  useEffect(() => {
    setLoginFailed(false)
  }, [form.formState])

  function onSubmit(data: z.infer<typeof formSchema>) {
    setIsLoading(true)
    setLoginFailed(false)

    doSignIn(data.name, data.password)
      .then((result: WrappedResponse<SignInPayload>) => {
        if (result === undefined) {
          logger.warn('sign-in failed.')
          authStore.auth.reset()
          setLoginFailed(true)
        } else if (result.code === 200) {
          // Sign in successful.
          logger.info('sign-in successful.')
          authStore.auth.setAccessToken(
            result.payload.token,
            result.payload.expires
          )
          router.history.push(search.redirect ?? '/')
        } else {
          // Sign in failed
          logger.warn('failed to sign-in:', result)
          authStore.auth.reset()
        }
      })
      .catch((err) => {
        logger.error('error when sign-in:', err)
        authStore.auth.reset()
      })
      .finally(() => setIsLoading(false))
  }

  return (
    <div className={cn('grid gap-6', className)} {...props}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className='grid gap-2'>
            <FormField
              control={form.control}
              name='name'
              render={({ field }) => (
                <FormItem className='space-y-1'>
                  <FormLabel>{i18next.t('auth signIn name label')}</FormLabel>
                  <FormControl>
                    <Input
                      placeholder={i18next.t('auth signIn name placeholder')}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='password'
              render={({ field }) => (
                <FormItem className='space-y-1'>
                  <div className='flex items-center justify-between'>
                    <FormLabel>
                      {i18next.t('auth signIn password label')}
                    </FormLabel>
                  </div>
                  <FormControl>
                    <PasswordInput placeholder='********' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {loginFailed && (
              <FormMessage>{i18next.t('auth signIn failed')}</FormMessage>
            )}

            <Button className='mt-2' disabled={isLoading}>
              {i18next.t('auth signIn submit')}
            </Button>

            <div className='relative my-2'>
              <div className='absolute inset-0 flex items-center'>
                <span className='w-full border-t' />
              </div>
              <div className='relative flex justify-center text-xs uppercase'>
                <span className='bg-background px-2 text-muted-foreground'>
                  {i18next.t('auth signIn tip')}
                </span>
              </div>
            </div>
          </div>
        </form>
      </Form>
    </div>
  )
}
