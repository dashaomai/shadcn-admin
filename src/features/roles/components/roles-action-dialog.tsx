import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useQueryClient } from '@tanstack/react-query'
import { Role } from '@/schemas/role.ts'
import { createRole, updateRole } from '@/api/auth.ts'
import { z } from '@/lib/i18n'
import { i18n } from '@/lib/i18n.ts'
import { ListAppActionDialogProps } from '@/lib/list-app.ts'
import { CreateOrUpdateRoleResponse } from '@/lib/role.ts'
import { toast } from '@/hooks/use-toast.ts'
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
import { Textarea } from '@/components/ui/textarea.tsx'

const formSchema = z.object({
  name: z.string().min(3),
  description: z.string(),
  isUpdate: z.boolean(),
})
export type RoleForm = z.infer<typeof formSchema>

export function RolesActionDialog(props: ListAppActionDialogProps<Role>) {
  const isUpdate = !!props.currentRow
  const queryClient = useQueryClient()
  const [pending, setPending] = useState<boolean>(false)

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
  })

  const onSubmit = (values: RoleForm) => {
    setPending(true)

    const onResult = (payload: CreateOrUpdateRoleResponse | undefined) => {
      if (payload) {
        queryClient.invalidateQueries({ queryKey: ['roles-list'] }).then()

        toast({
          title: i18n.t(
            isUpdate
              ? 'apps.roles.toast.update.title'
              : 'apps.roles.toast.create.title'
          ),
          description: i18n.t(
            isUpdate
              ? 'apps.roles.toast.update.ed'
              : 'apps.roles.toast.create.ed',
            { name: values.name }
          ),
        })

        form.reset()
        props.onOpenChange(false)
      } else {
        // 提交失败，另有专门处理错误码的位置
        setPending(false)
      }
    }

    if (isUpdate) {
      updateRole(props.currentRow!.id, values).then(onResult)
    } else {
      createRole(values).then(onResult)
    }
  }

  return (
    <Dialog
      open={props.open}
      onOpenChange={(state) => {
        form.reset()
        props.onOpenChange(state)
      }}
    >
      <DialogContent className='sm:max-w-lg'>
        <DialogHeader className='text-left'>
          <DialogTitle>{isUpdate ? 'Edit Role' : 'Add New Role'}</DialogTitle>
          <DialogDescription>
            {isUpdate ? 'Update the role here. ' : 'Create new role here. '}
            Click save when you&apos;re done.
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className='-mr-4 h-[15rem] w-full py-1 pr-4'>
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
                  <FormItem className='grid grid-cols-6 items-center gap-x-4 gap-y-1 space-y-0'>
                    <FormLabel className='col-span-2 text-right'>
                      Name
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder='John'
                        className='col-span-4'
                        autoComplete='off'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className='col-span-4 col-start-3' />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='description'
                render={({ field }) => (
                  <FormItem className='grid grid-cols-6 items-center gap-x-4 gap-y-1 space-y-0'>
                    <FormLabel className='col-span-2 text-right'>
                      Description
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        className='col-span-4'
                        autoComplete='off'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className='col-span-4 col-start-3' />
                  </FormItem>
                )}
              />
            </form>
          </Form>
        </ScrollArea>

        <DialogFooter>
          <Button type='submit' form='role-form' disabled={pending}>
            Save changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}