import { ListAppActionDialogProps } from "@/lib/list-app"
import { i18n, z } from '@/lib/i18n'
import { getRouteApi } from "@tanstack/react-router"
import { createOrUpdateAccountsProfile } from "@/api/auth"
import { toast } from "@/hooks/use-toast"
import { CreateOrUpdateProfileResponse } from "@/lib/auth"
import { useQueryClient, useMutation } from "@tanstack/react-query"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { DialogHeader, DialogFooter, Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage, Form } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { AccountInfo } from "../data/account-info"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { PasswordInput } from "@/components/password-input"

const accountFormSchema = z.object({
  loginName: z.string(),
  password: z.string().min(6).max(20),
  passwordConfirm: z.string(),
  profileNickname: z.string().max(30),
  profileEmail: z.string().email().optional(),
  profileAvatar: z.string().url().optional(),
  isUpdate: z.boolean(),
}).refine(data => data.password === data.passwordConfirm, {
  message: i18n.t('apps.accounts.properties.password.confirm.not-equal'),
})

export type AccountForm = z.infer<typeof accountFormSchema>

export function AccountsActionDialog(props: ListAppActionDialogProps<AccountInfo>) {
  const isUpdate = !!props.currentRow
  const queryClient = useQueryClient()

  const api = getRouteApi('/_authenticated/accounts/')
  const { page, limit } = api.useSearch()

  const mutation = useMutation({
    mutationFn: createOrUpdateAccountsProfile,
    onSuccess: (payload: CreateOrUpdateProfileResponse | undefined, params) => {
      if (payload) {
        queryClient
          .invalidateQueries({ queryKey: ['accounts-list', page, limit] })
          .then()

        toast({
          title: i18n.t(
            isUpdate
              ? 'apps.accounts.toast.update.title'
              : 'apps.accounts.toast.create.title'
          ),
          description: i18n.t(
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
          isUpdate,
      }
      : {
        loginName: '',
        password: '',
        passwordConfirm: '',
        profileNickname: '',
        profileEmail: '',
        profileAvatar: '',
        isUpdate,
      },
    mode: 'onChange',
  })

  const onSubmit = (values: AccountForm) => {
    mutation.mutate({
      id: props.currentRow?.id,
      ...values,
    })
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
            {i18n.t(
              isUpdate ? 'apps.accounts.update.title' : 'apps.accounts.create.title'
            )}
          </DialogTitle>
          <DialogDescription>
            {i18n.t(
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
                      {i18n.t('apps.accounts.properties.loginName.title')}
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
                      {i18n.t('apps.accounts.properties.loginName.description')}
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
                      {i18n.t('apps.accounts.properties.profile.nickname.title')}
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder={i18n.t(
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
                      {i18n.t('apps.accounts.properties.profile.email.title')}
                    </FormLabel>
                    <FormControl>
                      <Input
                        type='email'
                        className='col-span-4'
                        autoComplete='off'
                        placeholder={i18n.t(
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
                      {i18n.t('apps.accounts.properties.profile.avatar.title')}
                    </FormLabel>
                    <FormControl>
                      <Input
                        className='col-span-4'
                        autoComplete='off'
                        placeholder={i18n.t(
                          'apps.accounts.properties.profile.avatar.placeholder'
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
                name='password'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {i18n.t('apps.accounts.properties.password.title')}
                    </FormLabel>
                    <FormControl>
                      <PasswordInput
                        className='col-span-4'
                        autoComplete='off'
                        placeholder={i18n.t(
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
                      {i18n.t('apps.accounts.properties.passwordConfirm.title')}
                    </FormLabel>
                    <FormControl>
                      <PasswordInput
                        className='col-span-4'
                        autoComplete='off'
                        placeholder={i18n.t(
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
          <Button type='submit' form='account-form' disabled={mutation.isPending}>
            {i18n.t(
              isUpdate ? 'apps.accounts.update.submit' : 'apps.accounts.create.submit'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}