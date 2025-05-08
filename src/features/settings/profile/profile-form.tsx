import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import { updateProfile, useProfile } from '@/api/auth'
import { queryClient } from '@/lib/client'
import { z } from '@/lib/i18n'
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
import AvatarUploader from '@/components/avatar-uploader.tsx'

const profileFormSchema = z.object({
  nickname: z.string(),
  email: z.string().email(),
  avatar: z.string().url().optional(),
})

export type ProfileFormValues = z.infer<typeof profileFormSchema>

export default function ProfileForm() {
  const { t } = useTranslation()

  const profileQuery = useProfile()

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    // defaultValues: async () => await getProfile() as ProfileFormValues,
    values: profileQuery.data,
    mode: 'onChange',
  })

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit((data) => {
          updateProfile(data).then(() => {
            setTimeout(() => {
              queryClient.invalidateQueries({
                queryKey: ['self-profile'],
              })
            }, 0)
            toast.success(t('apps.accounts.actions.updateProfile.success'))
          })
        })}
        className='space-y-8'
      >
        <FormField
          control={form.control}
          name='nickname'
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                {t('apps.accounts.properties.profile.nickname.title')}
              </FormLabel>
              <FormControl>
                <Input
                  placeholder={t(
                    'apps.accounts.properties.profile.nickname.placeholder'
                  )}
                  {...field}
                />
              </FormControl>
              <FormDescription>
                {t('apps.accounts.properties.profile.nickname.description')}
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
              <FormLabel>
                {t('apps.accounts.properties.profile.email.title')}
              </FormLabel>
              <FormControl>
                <Input
                  placeholder={t(
                    'apps.accounts.properties.profile.email.placeholder'
                  )}
                  {...field}
                />
              </FormControl>
              <FormDescription>
                {t('apps.accounts.properties.profile.email.description')}
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
              <FormLabel>
                {t('apps.accounts.properties.profile.avatar.title')}
              </FormLabel>
              <FormControl>
                <Textarea
                  placeholder={t(
                    'apps.accounts.properties.profile.avatar.placeholder'
                  )}
                  className='resize-none'
                  {...field}
                />
              </FormControl>
              <FormDescription>
                {t('apps.accounts.properties.profile.avatar.description')}
              </FormDescription>

              <AvatarUploader form={form} field='avatar' />

              <FormMessage />
            </FormItem>
          )}
        />

        <Button type='submit'>
          {t('apps.accounts.actions.updateProfile.submit')}
        </Button>
      </form>
    </Form>
  )
}
