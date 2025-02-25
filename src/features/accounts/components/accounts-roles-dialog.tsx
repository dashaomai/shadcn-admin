import { i18n, z } from "@/lib/i18n";
import { ListAppActionDialogProps } from "@/lib/list-app";
import { AccountInfo } from "../data/account-info";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { getRouteApi } from "@tanstack/react-router";
import { updateRoles, useAllRoles, useProfile } from "@/api/auth";
import { CreateOrUpdateProfileResponse } from "@/lib/auth";
import { toast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";

const accountRolesFormSchema = z.object({
  roles: z.array(z.string()),
})

export type AccountRolesForm = z.infer<typeof accountRolesFormSchema>

export function AccountsRolesActionDialog(props: ListAppActionDialogProps<AccountInfo>) {
  const queryClient = useQueryClient()

  const api = getRouteApi('/_authenticated/accounts/')
  const { page, limit } = api.useSearch()

  const selfProfile = useProfile()

  const mutation = useMutation({
    mutationFn: updateRoles,
    onSuccess: (payload?: CreateOrUpdateProfileResponse) => {
      if (payload) {
        queryClient
          .invalidateQueries({ queryKey: ['accounts-list', page, limit] })
          .then()
        
        // if is myself, reset my roles immediately
        if (payload.id === selfProfile.data?.id) {
          queryClient.invalidateQueries({ queryKey: ['self-roles']}).then()
        }

        toast({
          title: i18n.t('apps.accounts.actions.updateRoles.success'),
          description: i18n.t('apps.accounts.actions.updateRoles.successDescription', { loginName: props.currentRow?.loginName}),
        })

        form.reset()
        props.onOpenChange(false)
      }
    },
  })

  const form = useForm<AccountRolesForm>({
    defaultValues: {
      roles: props.currentRow?.roles ?? [],
    },
    resolver: zodResolver(accountRolesFormSchema),
  })

  const onSubmit = (values: AccountRolesForm) => {
    mutation.mutate({
      id: props.currentRow?.id,
      roles: values.roles,
    })
  }

  const allRoles = useAllRoles()

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
            {i18n.t('apps.accounts.updateRoles.title', {loginName: props.currentRow?.loginName})}
          </DialogTitle>
          <DialogDescription>
            {i18n.t('apps.accounts.updateRoles.description')}
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className='-mr-4 max-h-[30rem] w-full py-1 pr-4'>
          <Form {...form}>
            <form
              id='account-roles-form'
              onSubmit={form.handleSubmit(onSubmit)}
              className='space-y-4 p-0.5'
            >

              <FormField
                control={form.control}
                name='roles'
                render={() => (
                  <FormItem>
                    <FormLabel>
                      {i18n.t('apps.accounts.properties.roles.updateTitle')}
                    </FormLabel>
                    <FormDescription>
                      {i18n.t('apps.accounts.properties.roles.description')}
                    </FormDescription>

                    {allRoles.isFetched && (
                      allRoles.data?.map((role) => (
                        <FormField
                          key={role.id}
                          control={form.control}
                          name='roles'
                          render={({ field }) => (
                            <FormItem
                              key={role.id}
                              className="flex flex-row items-start space-x-3 space-y-0"
                            >
                              <FormControl>
                                <Checkbox
                                  checked={field.value?.includes(role.name)}
                                  onCheckedChange={(checked) => {
                                    return checked
                                      ? field.onChange([...field.value, role.name])
                                      : field.onChange(field.value.filter((value) => value !== role.name))
                                  }}
                                />
                              </FormControl>
                              <FormLabel>{role.name}</FormLabel>
                              <FormDescription>{role.description}</FormDescription>
                            </FormItem>
                          )}
                        />
                      ))

                    )}

                  </FormItem>
                )}
              />

            </form>
          </Form>
        </ScrollArea>

        <DialogFooter>
          <Button type='submit' form='account-roles-form' disabled={mutation.isPending}>
            {i18n.t('common.save')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}