import { getProfile, updateProfile } from '@/api/auth'
import { Button } from '@/components/ui/button'
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
import { Textarea } from '@/components/ui/textarea'
import { i18n } from '@/lib/i18n'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

const profileFormSchema = z.object({
  nickname: z
    .string(),
  email: z
    .string()
    .email(),
  avatar: z.string().url().optional(),
})

export type ProfileFormValues = z.infer<typeof profileFormSchema>

export default function ProfileForm() {
  
  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: async () => await getProfile() as ProfileFormValues,
    mode: 'onChange',
  })

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit((data) => {
          updateProfile(data).then(() => {
            toast.success(i18n.t('apps.accounts.actions.updateProfile.success'))
          })
        })}
        className='space-y-8'
      >
        <FormField
          control={form.control}
          name='nickname'
          render={({ field }) => (
            <FormItem>
              <FormLabel>{i18n.t('apps.accounts.properties.profile.nickname.title')}</FormLabel>
              <FormControl>
                <Input placeholder={i18n.t('apps.accounts.properties.profile.nickname.placeholder')} {...field} />
              </FormControl>
              <FormDescription>
                {i18n.t('apps.accounts.properties.profile.nickname.description')}
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='email'
          render={({ field }) => (
            <FormItem>
              <FormLabel>{i18n.t('apps.accounts.properties.profile.email.title')}</FormLabel>
              <FormControl>
                <Input placeholder={i18n.t('apps.accounts.properties.profile.email.placeholder')} {...field} />
              </FormControl>
              <FormDescription>
                {i18n.t('apps.accounts.properties.profile.email.description')}
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='avatar'
          render={({ field }) => (
            <FormItem>
              <FormLabel>{i18n.t('apps.accounts.properties.profile.avatar.title')}</FormLabel>
              <FormControl>
                <Textarea
                  placeholder={i18n.t('apps.accounts.properties.profile.avatar.placeholder')}
                  className='resize-none'
                  {...field}
                />
              </FormControl>
              <FormDescription>
                {i18n.t('apps.accounts.properties.profile.avatar.description')}
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <Button type='submit'>{i18n.t('apps.accounts.actions.updateProfile.submit')}</Button>
      </form>
    </Form>
  )
}
