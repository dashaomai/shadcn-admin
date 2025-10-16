import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import { updateAnchor } from '@/api/auth.ts'
import { CreateOrUpdateProfileResponse } from '@/lib/auth.ts'
import { z } from '@/lib/i18n.ts'
import { ListAppActionDialogProps } from '@/lib/list-app.ts'
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
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form.tsx'
import { Input } from '@/components/ui/input.tsx'
import { ScrollArea } from '@/components/ui/scroll-area.tsx'
import {
  Select,
  SelectContent, SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select.tsx'
import { Separator } from '@/components/ui/separator.tsx'
import AvatarUploader from '@/components/avatar-uploader.tsx'
import { AnchorConfiguration } from '@/features/anchors/data/anchor-info.ts'

const anchorFormSchema = z.object({
  avatar: z.string().url(),
  status: z.union([z.number(), z.string()]),
  specialStatus: z.union([z.number(), z.string()]),
})

export type AnchorsForm = z.infer<typeof anchorFormSchema>

export function AnchorsActionDialog(
  props: ListAppActionDialogProps<AnchorConfiguration>
) {
  const { t } = useTranslation()
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: updateAnchor,
    onSuccess: (payload: CreateOrUpdateProfileResponse | undefined) => {
      if (payload) {
        queryClient.invalidateQueries({ queryKey: ['anchors-list'] }).then()

        toast.success(t('apps.anchors.toast.update.title'), {
          description: t('apps.anchors.toast.update.ed', {
            name: props.currentRow!.nickname,
          }),
        })

        form.reset()
        props.onOpenChange(false)
      }
    },
  })

  const form = useForm<AnchorsForm>({
    resolver: zodResolver(anchorFormSchema),
    defaultValues: {
      avatar: props.currentRow?.avatar,
      status: props.currentRow?.status,
      specialStatus: props.currentRow?.specialStatus,
    },
    mode: 'onChange',
  })

  const onSubmit = (values: AnchorsForm) => {
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
          <DialogTitle>{t('apps.anchors.update.title')}</DialogTitle>
          <DialogDescription>
            {t('apps.anchors.update.description', {
              name: props.currentRow?.nickname,
            })}
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className='-mr-4 max-h-[38rem] w-full py-1 pr-4'>
          <Form {...form}>
            <form
              id='anchor-form'
              onSubmit={form.handleSubmit(onSubmit)}
              className='space-y-4 p-0.5'
            >
              <FormField
                control={form.control}
                name='avatar'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {t('apps.anchors.properties.avatar.title')}
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

                    <AvatarUploader form={form} field='avatar' />

                    <FormMessage />
                  </FormItem>
                )}
              />

              <Separator style={{ marginTop: '2.3rem' }} />

              <FormField
                control={form.control}
                name='status'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {t('apps.anchors.properties.status.title')}
                    </FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={String(field.value)}
                      >
                        <SelectTrigger className='w-full'>
                          <SelectValue
                            placeholder={t(
                              'apps.anchors.properties.status.placeholder'
                            )}
                          />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectItem value='1'>开启</SelectItem>
                            <SelectItem value='0'>停止</SelectItem>
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='specialStatus'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {t('apps.anchors.properties.specialStatus.title')}
                    </FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={String(field.value)}
                      >
                        <SelectTrigger className='w-full'>
                          <SelectValue
                            placeholder={t(
                              'apps.anchors.properties.specialStatus.placeholder'
                            )}
                          />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectItem value='0'>无</SelectItem>
                            <SelectItem value='1'>优先显示</SelectItem>
                          </SelectGroup>
                        </SelectContent>
                      </Select>
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
            form='anchor-form'
            disabled={mutation.isPending}
          >
            {t('apps.anchors.update.submit')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
