import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { getRouteApi } from '@tanstack/react-router'
import {
  createOrUpdatePlatform,
  PlatformActionPayload,
} from '@/api/system/platform'
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
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { PlatformInfo } from '../data/platform'
import { toast } from 'sonner'

const platformFormSchema = z.object({
  id: z.number().optional(),
  name: z.string(),
  description: z.string(),
  type: z.union([z.number(), z.string()]),
  status: z.union([z.number(), z.string()]),
})

export type PlatformForm = z.infer<typeof platformFormSchema>

export function PlatformsActionDialog(
  props: ListAppActionDialogProps<PlatformInfo>
) {
  const isUpdate = !!props.currentRow
  const queryClient = useQueryClient()

  const api = getRouteApi('/_authenticated/platforms/')
  const { page, limit } = api.useSearch()

  const mutation = useMutation({
    mutationFn: createOrUpdatePlatform,
    onSuccess: (
      payload: PlatformActionPayload | undefined,
      values: PlatformForm
    ) => {
      if (payload) {
        queryClient
          .invalidateQueries({ queryKey: ['platforms-list', page, limit] })
          .then()

        toast.success(i18n.t(
          isUpdate
            ? 'apps.platforms.toast.update.title'
            : 'apps.platforms.toast.create.title'
        ), {
          description: i18n.t(
            isUpdate
              ? 'apps.platforms.toast.update.ed'
              : 'apps.platforms.toast.create.ed',
            { name: values.name }
          ),
        })

        form.reset()
        props.onOpenChange(false)
      }
    },
  })

  const form = useForm<PlatformForm>({
    resolver: zodResolver(platformFormSchema),
    defaultValues: isUpdate
      ? {
          ...props.currentRow,
        }
      : {
          name: '',
          description: '',
          type: 0,
          status: 0,
        },
    mode: 'onChange',
  })

  const onSubmit = (values: PlatformForm) => {
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
              isUpdate
                ? 'apps.platforms.update.title'
                : 'apps.platforms.create.title'
            )}
          </DialogTitle>
          <DialogDescription>
            {i18n.t(
              isUpdate
                ? 'apps.platforms.update.description'
                : 'apps.platforms.create.description'
            )}
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className='-mr-4 max-h-[30rem] w-full py-1 pr-4'>
          <Form {...form}>
            <form
              id='platform-form'
              onSubmit={form.handleSubmit(onSubmit)}
              className='space-y-4 p-0.5'
            >
              <FormField
                control={form.control}
                name='name'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {i18n.t('apps.platforms.properties.name.title')}
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder={i18n.t(
                          'apps.platforms.properties.name.placeholder'
                        )}
                        className='col-span-4'
                        autoComplete='off'
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      {i18n.t(
                        'apps.platforms.properties.name.createDescription'
                      )}
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
                      {i18n.t('apps.platforms.properties.description.title')}
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        rows={3}
                        className='col-span-4'
                        placeholder={i18n.t(
                          'apps.platforms.properties.description.placeholder'
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
                name='type'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {i18n.t('apps.platforms.properties.type.title')}
                    </FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={String(field.value)}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue
                            placeholder={i18n.t(
                              'apps.platforms.properties.type.placeholder'
                            )}
                          />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value='0'>
                          {i18n.t('apps.platforms.properties.type.unknown')}
                        </SelectItem>
                        <SelectItem value='1'>
                          {i18n.t('apps.platforms.properties.type.private')}
                        </SelectItem>
                        <SelectItem value='2'>
                          {i18n.t('apps.platforms.properties.type.cooperate')}
                        </SelectItem>
                        <SelectItem value='3'>
                          {i18n.t('apps.platforms.properties.type.thirdparty')}
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='status'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {i18n.t('apps.platforms.properties.status.title')}
                    </FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={String(field.value)}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue
                            placeholder={i18n.t(
                              'apps.platforms.properties.status.placeholder'
                            )}
                          />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>
                            {i18n.t(
                              'apps.platforms.properties.status.unavailable'
                            )}
                          </SelectLabel>
                          <SelectItem value='0'>
                            {i18n.t('apps.platforms.properties.status.offline')}
                          </SelectItem>
                          <SelectItem value='1'>
                            {i18n.t(
                              'apps.platforms.properties.status.intention'
                            )}
                          </SelectItem>
                          <SelectItem value='2'>
                            {i18n.t(
                              'apps.platforms.properties.status.developing'
                            )}
                          </SelectItem>
                        </SelectGroup>
                        <SelectGroup>
                          <SelectLabel>
                            {i18n.t(
                              'apps.platforms.properties.status.available'
                            )}
                          </SelectLabel>
                          <SelectItem value='3'>
                            {i18n.t('apps.platforms.properties.status.online')}
                          </SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />
            </form>
          </Form>
        </ScrollArea>

        <DialogFooter>
          <Button
            type='submit'
            form='platform-form'
            disabled={mutation.isPending}
          >
            {i18n.t(
              isUpdate
                ? 'apps.platforms.update.submit'
                : 'apps.platforms.create.submit'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
