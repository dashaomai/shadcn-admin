import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { getRouteApi } from '@tanstack/react-router'
import { createOrUpdateTag, TagActionPayload } from '@/api/system/tag'
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
import { Textarea } from '@/components/ui/textarea'
import { TagInfo } from '../data/tag'

const tagFormSchema = z.object({
  name: z.string(),
  description: z.string(),
})

export type TagForm = z.infer<typeof tagFormSchema>

export function TagsActionDialog(props: ListAppActionDialogProps<TagInfo>) {
  const isUpdate = !!props.currentRow
  const queryClient = useQueryClient()

  const api = getRouteApi('/_authenticated/tags/')
  const { page, limit } = api.useSearch()

  const mutation = useMutation({
    mutationFn: createOrUpdateTag,
    onSuccess: (payload?: TagActionPayload) => {
      if (payload) {
        queryClient
          .invalidateQueries({
            queryKey: ['tags-list', page, limit],
          })
          .then()

        toast({
          title: i18n.t(
            isUpdate
              ? 'apps.tags.toast.update.title'
              : 'apps.tags.toast.create.title'
          ),
          description: i18n.t(
            isUpdate ? 'apps.tags.toast.update.ed' : 'apps.tags.toast.create.ed'
          ),
        })

        form.reset()
        props.onOpenChange(false)
      }
    },
  })

  const form = useForm<TagForm>({
    resolver: zodResolver(tagFormSchema),
    defaultValues: isUpdate
      ? {
          ...props.currentRow,
        }
      : {
          name: '',
          description: '',
        },
    mode: 'onChange',
  })

  const onSubmit = (values: TagForm) => {
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
              isUpdate ? 'apps.tags.update.title' : 'apps.tags.create.title'
            )}
          </DialogTitle>
          <DialogDescription>
            {i18n.t(
              isUpdate
                ? 'apps.tags.update.description'
                : 'apps.tags.create.description'
            )}
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className='-mr-4 max-h-[30rem] w-full py-1 pr-4'>
          <Form {...form}>
            <form
              id='tag-form'
              onSubmit={form.handleSubmit(onSubmit)}
              className='space-y-4 p-0.5'
            >
              <FormField
                control={form.control}
                name='name'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {i18n.t('apps.tags.properties.name.title')}
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder={i18n.t(
                          'apps.tags.properties.name.placeholder'
                        )}
                        className='col-span-4'
                        autoComplete='off'
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      {i18n.t('apps.tags.properties.name.createDescription')}
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
                      {i18n.t('apps.tags.properties.description.title')}
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        rows={3}
                        className='col-span-4'
                        placeholder={i18n.t(
                          'apps.tags.properties.description.placeholder'
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
          <Button type='submit' form='tag-form' disabled={mutation.isPending}>
            {i18n.t(
              isUpdate ? 'apps.tags.update.submit' : 'apps.tags.create.submit'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
