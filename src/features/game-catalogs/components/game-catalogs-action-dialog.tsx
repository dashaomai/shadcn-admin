import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { getRouteApi } from '@tanstack/react-router'
import {
  createOrUpdateGameCatalog,
  GameCatalogActionPayload,
} from '@/api/system/game-catalog'
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
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { GameCatalogInfo } from '../data/game-catalog'
import { toast } from 'sonner'

const gameCatalogFormSchema = z.object({
  id: z.number().optional(),
  name: z.string(),
  description: z.string(),
  displayOrder: z.union([z.number(), z.string()]),
  status: z.union([z.number(), z.string()]),
})

export type GameCatalogForm = z.infer<typeof gameCatalogFormSchema>

export function GameCatalogsActionDialog(
  props: ListAppActionDialogProps<GameCatalogInfo>
) {
  const isUpdate = !!props.currentRow
  const queryClient = useQueryClient()

  const api = getRouteApi('/_authenticated/game-catalogs/')
  const { page, limit } = api.useSearch()

  const mutation = useMutation({
    mutationFn: createOrUpdateGameCatalog,
    onSuccess: (
      payload: GameCatalogActionPayload | undefined,
      values: GameCatalogForm
    ) => {
      if (payload) {
        queryClient
          .invalidateQueries({
            queryKey: ['game-catalogs-list', page, limit],
          })
          .then()

        toast.success(i18n.t(
          isUpdate
            ? 'apps.game-catalogs.toast.update.title'
            : 'apps.game-catalogs.toast.create.title'
        ), {
          description: i18n.t(
            isUpdate
              ? 'apps.game-catalogs.toast.update.ed'
              : 'apps.game-catalogs.toast.create.ed',
            { name: values.name }
          ),
        })

        form.reset()
        props.onOpenChange(false)
      }
    },
  })

  const form = useForm<GameCatalogForm>({
    resolver: zodResolver(gameCatalogFormSchema),
    defaultValues: props.currentRow || {
      name: '',
      description: '',
      displayOrder: 0,
      status: 1,
    },
    mode: 'onChange',
  })

  const onSubmit = (values: GameCatalogForm) => {
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
                ? 'apps.game-catalogs.update.title'
                : 'apps.game-catalogs.create.title'
            )}
          </DialogTitle>
          <DialogDescription>
            {i18n.t(
              isUpdate
                ? 'apps.game-catalogs.update.description'
                : 'apps.game-catalogs.create.description'
            )}
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className='-mr-4 max-h-[30rem] w-full py-1 pr-4'>
          <Form {...form}>
            <form
              id='game-catalog-form'
              onSubmit={form.handleSubmit(onSubmit)}
              className='space-y-4 p-0.5'
            >
              <FormField
                control={form.control}
                name='name'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {i18n.t('apps.game-catalogs.properties.name.title')}
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder={i18n.t(
                          'apps.game-catalogs.properties.name.placeholder'
                        )}
                        className='col-span-4'
                        autoComplete='off'
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      {i18n.t(
                        'apps.game-catalogs.properties.name.createDescription'
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
                      {i18n.t(
                        'apps.game-catalogs.properties.description.title'
                      )}
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        rows={3}
                        className='col-span-4'
                        placeholder={i18n.t(
                          'apps.game-catalogs.properties.description.placeholder'
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
                name='displayOrder'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {i18n.t(
                        'apps.game-catalogs.properties.displayOrder.title'
                      )}
                    </FormLabel>
                    <Input
                      type='number'
                      min={0}
                      className='col-span-4'
                      autoComplete='off'
                      {...field}
                    />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='status'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {i18n.t('apps.game-catalogs.properties.status.title')}
                    </FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={String(field.value)}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue
                            placeholder={i18n.t(
                              'apps.game-catalogs.properties.status.placeholder'
                            )}
                          />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value='0'>
                          {i18n.t('apps.game-catalogs.properties.status.draft')}
                        </SelectItem>
                        <SelectItem value='1'>
                          {i18n.t(
                            'apps.game-catalogs.properties.status.published'
                          )}
                        </SelectItem>
                        <SelectItem value='2'>
                          {i18n.t(
                            'apps.game-catalogs.properties.status.deleted'
                          )}
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
            form='game-catalog-form'
            disabled={mutation.isPending}
          >
            {i18n.t(
              isUpdate
                ? 'apps.game-catalogs.update.submit'
                : 'apps.game-catalogs.create.submit'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
