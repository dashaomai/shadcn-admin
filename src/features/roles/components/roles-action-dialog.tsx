import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { getRouteApi } from '@tanstack/react-router'
import { Role } from '@/schemas/role.ts'
import { createOrUpdateRole } from '@/api/auth.ts'
import { z } from '@/lib/i18n'
import { ListAppActionDialogProps } from '@/lib/list-app.ts'
import { CreateOrUpdateRoleResponse } from '@/lib/role.ts'
import { Button } from '@/components/ui/button.tsx'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog.tsx'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form.tsx'
import { Input } from '@/components/ui/input.tsx'
import { ScrollArea } from '@/components/ui/scroll-area.tsx'
import { Textarea } from '@/components/ui/textarea.tsx'
import { toast } from 'sonner'
import { useTranslation } from 'react-i18next'

const formSchema = z.object({
  name: z.string().min(3),
  description: z.string(),
  isUpdate: z.boolean(),
})
export type RoleForm = z.infer<typeof formSchema>

export function RolesActionDialog(props: ListAppActionDialogProps<Role>) {
  const { t } = useTranslation()
  const isUpdate = !!props.currentRow
  const queryClient = useQueryClient()

  const api = getRouteApi('/_authenticated/roles/')
  const { page, limit } = api.useSearch()

  const mutation = useMutation({
    mutationFn: createOrUpdateRole,
    onSuccess: (payload: CreateOrUpdateRoleResponse | undefined, params) => {
      if (payload) {
        queryClient
          .invalidateQueries({ queryKey: ['roles-list', page, limit] })
          .then()

        const title = isUpdate ? 'apps.roles.toast.update.title' : 'apps.roles.toast.create.title'
        const description = isUpdate ? 'apps.roles.toast.update.ed' : 'apps.roles.toast.create.ed'

        toast.success(t(title), {
          description: t(
            description,
            { name: params.name }
          ),
        })

        form.reset()
        props.onOpenChange(false)
      }
    },
  })

  const form = useForm<RoleForm>({
    resolver: zodResolver(formSchema),
    defaultValues: isUpdate
      ? {
          ...props.currentRow,
          isUpdate,
        }
      : {
          name: '',
          description: '',
          isUpdate,
        },
    mode: 'onChange',
  })

  const onSubmit = (values: RoleForm) => {
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
            {t(
              isUpdate ? 'apps.roles.update.title' : 'apps.roles.create.title'
            )}
          </DialogTitle>
          <DialogDescription>
            {t(
              isUpdate
                ? 'apps.roles.update.description'
                : 'apps.roles.create.description'
            )}
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className='-mr-4 h-[18rem] w-full py-1 pr-4'>
          <Form {...form}>
            <form
              id='role-form'
              onSubmit={form.handleSubmit(onSubmit)}
              className='space-y-4 p-0.5'
            >
              <FormField
                control={form.control}
                name='name'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {t('apps.roles.properties.name.title')}
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder={t(
                          'apps.roles.properties.name.placeholder'
                        )}
                        className='col-span-4'
                        autoComplete='off'
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      {t('apps.roles.properties.name.description')}
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='description'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {t('apps.roles.properties.description.title')}
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        rows={3}
                        className='col-span-4'
                        autoComplete='off'
                        placeholder={t(
                          'apps.roles.properties.description.placeholder'
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
          <Button type='submit' form='role-form' disabled={mutation.isPending}>
            {t(
              isUpdate ? 'apps.roles.update.submit' : 'apps.roles.create.submit'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}