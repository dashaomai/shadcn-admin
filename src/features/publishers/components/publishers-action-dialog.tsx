import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { getRouteApi } from '@tanstack/react-router'
import {
  createOrUpdatePublisher,
  PublisherActionPayload,
} from '@/api/system/publisher'
import { i18n, z } from '@/lib/i18n'
import { ListAppActionDialogProps } from '@/lib/list-app'
import { toast } from '@/hooks/use-toast'
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
import { PublisherInfo } from '../data/publisher'

const publisherFormSchema = z.object({
  name: z.string(),
  description: z.string(),
  type: z.union([z.number(), z.string()]),
  status: z.union([z.number(), z.string()]),
})

export type PublisherForm = z.infer<typeof publisherFormSchema>

export function PublishersActionDialog(
  props: ListAppActionDialogProps<PublisherInfo>
) {
  const isUpdate = !!props.currentRow
  const queryClient = useQueryClient()

  const api = getRouteApi('/_authenticated/publishers/')
  const { page, limit } = api.useSearch()

  const mutation = useMutation({
    mutationFn: createOrUpdatePublisher,
    onSuccess: (payload?: PublisherActionPayload) => {
      if (payload) {
        queryClient
          .invalidateQueries({
            queryKey: ['publishers-list', page, limit],
          })
          .then()

        toast({
          title: i18n.t(
            isUpdate
              ? 'apps.publishers.toast.update.title'
              : 'apps.publishers.toast.create.title'
          ),
          description: i18n.t(
            isUpdate
              ? 'apps.publishers.toast.update.ed'
              : 'apps.publishers.toast.create.ed'
          ),
        })

        form.reset()
        props.onOpenChange(false)
      }
    },
  })

  const form = useForm<PublisherForm>({
    resolver: zodResolver(publisherFormSchema),
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

  const onSubmit = (values: PublisherForm) => {
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
                ? 'apps.publishers.update.title'
                : 'apps.publishers.create.title'
            )}
          </DialogTitle>
          <DialogDescription>
            {i18n.t(
              isUpdate
                ? 'apps.publishers.update.description'
                : 'apps.publishers.create.description'
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
                      {i18n.t('apps.publishers.properties.name.title')}
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder={i18n.t(
                          'apps.publishers.properties.name.placeholder'
                        )}
                        className='col-span-4'
                        autoComplete='off'
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      {i18n.t(
                        'apps.publishers.properties.name.createDescription'
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
                      {i18n.t('apps.publishers.properties.description.title')}
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        rows={3}
                        className='col-span-4'
                        placeholder={i18n.t(
                          'apps.publishers.properties.description.placeholder'
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
                      {i18n.t('apps.publishers.properties.type.title')}
                    </FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={String(field.value)}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue
                            placeholder={i18n.t(
                              'apps.publishers.properties.type.placeholder'
                            )}
                          />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value='0'>
                          {i18n.t('apps.publishers.properties.type.unknown')}
                        </SelectItem>
                        <SelectGroup>
                          <SelectLabel>
                            {i18n.t('apps.publishers.properties.type.private')}
                          </SelectLabel>
                          <SelectItem value='1'>
                            {i18n.t(
                              'apps.publishers.properties.type.department'
                            )}
                          </SelectItem>
                          <SelectItem value='2'>
                            {i18n.t(
                              'apps.publishers.properties.type.subsidiary'
                            )}
                          </SelectItem>
                        </SelectGroup>

                        <SelectItem value='3'>
                          {i18n.t('apps.publishers.properties.type.thirdparty')}
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
                      {i18n.t('apps.publishers.properties.status.title')}
                    </FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={String(field.value)}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue
                            placeholder={i18n.t(
                              'apps.publishers.properties.status.placeholder'
                            )}
                          />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value='0'>
                          {i18n.t('apps.publishers.properties.status.disabled')}
                        </SelectItem>
                        <SelectItem value='1'>
                          {i18n.t('apps.publishers.properties.status.enabled')}
                        </SelectItem>
                        <SelectItem value='2'>
                          {i18n.t('apps.publishers.properties.status.pending')}
                        </SelectItem>
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
                ? 'apps.publishers.update.submit'
                : 'apps.publishers.create.submit'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
