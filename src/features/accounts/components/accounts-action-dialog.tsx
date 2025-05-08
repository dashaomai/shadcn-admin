import { useRef } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { getRouteApi } from '@tanstack/react-router'
import { apiBase } from '@/config/api.ts'
import logger from 'loglevel'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import { createOrUpdateAccount } from '@/api/auth'
import { useAuthStore } from '@/stores/authStore.ts'
import { CreateOrUpdateProfileResponse } from '@/lib/auth'
import { i18n, z } from '@/lib/i18n'
import { ListAppActionDialogProps } from '@/lib/list-app'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { PasswordInput } from '@/components/password-input'
import { AccountInfo } from '../data/account-info'

const accountFormSchema = z
  .object({
    loginName: z.string(),
    password: z.string().transform((value) => value.trim()),
    passwordConfirm: z.string().transform((value) => value.trim()),
    profileNickname: z.string().max(30),
    profileEmail: z.string().email().optional(),
    profileAvatar: z.string().optional(),
  })
  .refine((data) => data.password === data.passwordConfirm, {
    message: i18n.t('apps.accounts.properties.passwordConfirm.not-equal'),
  })

export type AccountForm = z.infer<typeof accountFormSchema>

export function AccountsActionDialog(
  props: ListAppActionDialogProps<AccountInfo>
) {
  const { t } = useTranslation()
  const isUpdate = !!props.currentRow
  const queryClient = useQueryClient()

  const authStore = useAuthStore()

  const ref = useRef<HTMLInputElement>(null)

  const api = getRouteApi('/_authenticated/accounts/')
  const { page, limit } = api.useSearch()

  const mutation = useMutation({
    mutationFn: createOrUpdateAccount,
    onSuccess: (payload: CreateOrUpdateProfileResponse | undefined, params) => {
      if (payload) {
        queryClient
          .invalidateQueries({ queryKey: ['accounts-list', page, limit] })
          .then()

        const title = isUpdate
          ? 'apps.accounts.toast.update.title'
          : 'apps.accounts.toast.create.title'

        toast.success(t(title), {
          description: t(
            isUpdate
              ? 'apps.accounts.toast.update.ed'
              : 'apps.accounts.toast.create.ed',
            { name: params.profileNickname }
          ),
        })

        form.reset()
        props.onOpenChange(false)
      }
    },
  })

  const form = useForm<AccountForm>({
    resolver: zodResolver(accountFormSchema),
    defaultValues: isUpdate
      ? {
          loginName: props.currentRow?.loginName,
          password: '',
          passwordConfirm: '',
          profileNickname: props.currentRow?.profile.nickname,
          profileEmail: props.currentRow?.profile.email,
          profileAvatar: props.currentRow?.profile.avatar,
        }
      : {
          loginName: '',
          password: '',
          passwordConfirm: '',
          profileNickname: '',
          profileEmail: '',
          profileAvatar: '',
        },
    mode: 'onChange',
  })

  const onSubmit = (values: AccountForm) => {
    mutation.mutate({
      id: props.currentRow?.id,
      ...values,
    })
  }

  const onAvatarUpload = async () => {
    if (ref.current?.files && ref.current.files.length > 0) {
      const file = ref.current.files[0]
      const formData = new FormData()
      formData.set('avatar', file)

      const response = await fetch(`${apiBase}/account/avatar`, {
        method: 'POST',
        body: formData,
        headers: {
          Authorization: `Bearer ${authStore.auth.accessToken}`,
        },
      })

      if (response.status === 200) {
        const url = await response.text()
        if (url) {
          form.setValue('profileAvatar', url)
        }

        toast.success('upload successfully.')
      } else if (response.status === 401) {
        await authStore.auth.refreshHandler()

        return onAvatarUpload()
      } else {
        logger.error('failed to upload avatar')
      }
    }
  }

  return (
    <Dialog
      open={props.open}
      onOpenChange={(state) => {
        form.reset()
        mutation.reset()
        props.onOpenChange(state)
      }}
    >
      <DialogContent className='sm:max-w-lg'>
        <DialogHeader className='text-left'>
          <DialogTitle>
            {t(
              isUpdate
                ? 'apps.accounts.update.title'
                : 'apps.accounts.create.title'
            )}
          </DialogTitle>
          <DialogDescription>
            {t(
              isUpdate
                ? 'apps.accounts.update.description'
                : 'apps.accounts.create.description'
            )}
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className='-mr-4 max-h-[30rem] w-full py-1 pr-4'>
          <Form {...form}>
            <form
              id='account-form'
              onSubmit={form.handleSubmit(onSubmit)}
              className='space-y-4 p-0.5'
            >
              <FormField
                control={form.control}
                name='loginName'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {t('apps.accounts.properties.loginName.title')}
                    </FormLabel>
                    <FormControl>
                      <Input
                        disabled={isUpdate}
                        className='col-span-4'
                        autoComplete='off'
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      {t(
                        isUpdate
                          ? 'apps.accounts.properties.loginName.updateDescription'
                          : 'apps.accounts.properties.loginName.description'
                      )}
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='profileNickname'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {t('apps.accounts.properties.profile.nickname.title')}
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder={t(
                          'apps.accounts.properties.profile.nickname.placeholder'
                        )}
                        className='col-span-4'
                        autoComplete='off'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='profileEmail'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {t('apps.accounts.properties.profile.email.title')}
                    </FormLabel>
                    <FormControl>
                      <Input
                        type='email'
                        required={false}
                        className='col-span-4'
                        autoComplete='off'
                        placeholder={t(
                          'apps.accounts.properties.profile.email.placeholder'
                        )}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='profileAvatar'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {t('apps.accounts.properties.profile.avatar.title')}
                    </FormLabel>
                    <FormControl>
                      <Input
                        required={false}
                        className='col-span-4'
                        autoComplete='off'
                        placeholder={t(
                          'apps.accounts.properties.profile.avatar.placeholder'
                        )}
                        {...field}
                      />
                    </FormControl>

                    <div className='flex w-full max-w-sm items-center space-x-2'>
                      <img
                        style={{ width: 48, height: 48, marginRight: 32 }}
                        src={form.getValues('profileAvatar')}
                      />
                      <Input ref={ref} type='file' accept='image/*' />
                      <Button type='button' onClick={onAvatarUpload}>
                        Upload
                      </Button>
                    </div>

                    <FormMessage />
                  </FormItem>
                )}
              />

              <Separator style={{ marginTop: '2.3rem' }} />

              <FormField
                control={form.control}
                name='password'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {t('apps.accounts.properties.password.title')}
                    </FormLabel>
                    <FormControl>
                      <PasswordInput
                        required={!isUpdate}
                        className='col-span-4'
                        autoComplete='off'
                        placeholder={t(
                          'apps.accounts.properties.password.placeholder'
                        )}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='passwordConfirm'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {t('apps.accounts.properties.passwordConfirm.title')}
                    </FormLabel>
                    <FormControl>
                      <PasswordInput
                        required={!isUpdate}
                        className='col-span-4'
                        autoComplete='off'
                        placeholder={t(
                          'apps.accounts.properties.passwordConfirm.placeholder'
                        )}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </form>
          </Form>
        </ScrollArea>

        <DialogFooter>
          <Button
            type='submit'
            form='account-form'
            disabled={mutation.isPending}
          >
            {t(
              isUpdate
                ? 'apps.accounts.update.submit'
                : 'apps.accounts.create.submit'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}