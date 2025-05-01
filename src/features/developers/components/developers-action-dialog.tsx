import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { getRouteApi } from '@tanstack/react-router'
import {
  createOrUpdateDeveloper,
  DeveloperActionPayload,
} from '@/api/system/developer'
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
import { DeveloperInfo } from '../data/developer'
import { toast } from 'sonner'

const developerFormSchema = z.object({
  id: z.number().optional(),
  name: z.string(),
  description: z.string(),
  type: z.union([z.number(), z.string()]),
  status: z.union([z.number(), z.string()]),
})

export type DeveloperForm = z.infer<typeof developerFormSchema>

export function DevelopersActionDialog(
  props: ListAppActionDialogProps<DeveloperInfo>
) {
  const isUpdate = !!props.currentRow
  const queryClient = useQueryClient()

  const api = getRouteApi('/_authenticated/developers/')
  const { page, limit } = api.useSearch()

  const mutation = useMutation({
    mutationFn: createOrUpdateDeveloper,
    onSuccess: (
      payload: DeveloperActionPayload | undefined,
      values: DeveloperForm
    ) => {
      if (payload) {
        queryClient
          .invalidateQueries({ queryKey: ['developers-list', page, limit] })
          .then()

        toast.success(i18n.t(
          isUpdate
            ? 'apps.developers.toast.update.title'
            : 'apps.developers.toast.create.title'
        ), {
          description: i18n.t(
            isUpdate
              ? 'apps.developers.toast.update.ed'
              : 'apps.developers.toast.create.ed',
            { name: values.name }
          ),
        })

        form.reset()
        props.onOpenChange(false)
      }
    },
  })

  const form = useForm<DeveloperForm>({
    resolver: zodResolver(developerFormSchema),
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

  const onSubmit = (values: DeveloperForm) => {
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
                ? 'apps.developers.update.title'
                : 'apps.developers.create.title'
            )}
          </DialogTitle>
          <DialogDescription>
            {i18n.t(
              isUpdate
                ? 'apps.developers.update.description'
                : 'apps.developers.create.description'
            )}
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className='-mr-4 max-h-[30rem] w-full py-1 pr-4'>
          <Form {...form}>
            <form
              id='developer-form'
              onSubmit={form.handleSubmit(onSubmit)}
              className='space-y-4 p-0.5'
            >
              <FormField
                control={form.control}
                name='name'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {i18n.t('apps.developers.properties.name.title')}
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder={i18n.t(
                          'apps.developers.properties.name.placeholder'
                        )}
                        className='col-span-4'
                        autoComplete='off'
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      {i18n.t(
                        'apps.developers.properties.name.createDescription'
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
                      {i18n.t('apps.developers.properties.description.title')}
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        rows={3}
                        className='col-span-4'
                        placeholder={i18n.t(
                          'apps.developers.properties.description.placeholder'
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
                      {i18n.t('apps.developers.properties.type.title')}
                    </FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={String(field.value)}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue
                            placeholder={i18n.t(
                              'apps.developers.properties.type.placeholder'
                            )}
                          />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value='0'>
                          {i18n.t('apps.developers.properties.type.unknown')}
                        </SelectItem>
                        <SelectGroup>
                          <SelectLabel>
                            {i18n.t('apps.developers.properties.type.private')}
                          </SelectLabel>
                          <SelectItem value='1'>
                            {i18n.t(
                              'apps.developers.properties.type.department'
                            )}
                          </SelectItem>
                          <SelectItem value='2'>
                            {i18n.t(
                              'apps.developers.properties.type.subsidiary'
                            )}
                          </SelectItem>
                        </SelectGroup>

                        <SelectGroup>
                          <SelectLabel>
                            {i18n.t(
                              'apps.developers.properties.type.thirdparty'
                            )}
                          </SelectLabel>
                          <SelectItem value='3'>
                            {i18n.t(
                              'apps.developers.properties.type.individual'
                            )}
                          </SelectItem>
                          <SelectItem value='4'>
                            {i18n.t('apps.developers.properties.type.studio')}
                          </SelectItem>
                          <SelectItem value='5'>
                            {i18n.t('apps.developers.properties.type.company')}
                          </SelectItem>
                        </SelectGroup>
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
                      {i18n.t('apps.developers.properties.status.title')}
                    </FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={String(field.value)}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue
                            placeholder={i18n.t(
                              'apps.developers.properties.status.placeholder'
                            )}
                          />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value='0'>
                          {i18n.t('apps.developers.properties.status.unknown')}
                        </SelectItem>
                        <SelectItem value='1'>
                          {i18n.t('apps.developers.properties.status.normal')}
                        </SelectItem>
                        <SelectItem value='2'>
                          {i18n.t('apps.developers.properties.status.frozen')}
                        </SelectItem>
                        <SelectItem value='3'>
                          {i18n.t('apps.developers.properties.status.deleted')}
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
            form='developer-form'
            disabled={mutation.isPending}
          >
            {i18n.t(
              isUpdate
                ? 'apps.developers.update.submit'
                : 'apps.developers.create.submit'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
