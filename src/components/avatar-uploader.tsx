import { useRef } from 'react'
import { FieldValues, Path, UseFormReturn } from 'react-hook-form'
import { apiBase } from '@/config/api.ts'
import logger from 'loglevel'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import { useAuthStore } from '@/stores/authStore.ts'
import { Button } from '@/components/ui/button.tsx'
import { Input } from '@/components/ui/input.tsx'

export type AvatarUploaderProps<T extends FieldValues> = {
  form: UseFormReturn<T>
  field: Path<T>
}

export default function AvatarUploader<T extends FieldValues>({
  form,
  field,
}: AvatarUploaderProps<T>) {
  const { t } = useTranslation()

  const authStore = useAuthStore()
  const ref = useRef<HTMLInputElement>(null)

  const onAvatarUpload = async () => {
    if (ref.current?.files && ref.current.files.length > 0) {
      const file = ref.current.files[0]
      const formData = new FormData()
      formData.set('avatar', file)

      const response = await fetch(`${apiBase}/account/avatar`, {
        method: 'POST',
        body: formData,
        headers: {
          Authorization: `Bearer ${authStore.auth.accessToken}`,
        },
      })

      if (response.status === 200) {
        const url = await response.text()
        if (url) {
          form.setValue(field, url)
        }

        toast.success(t('apps.accounts.properties.profile.avatar.uploaded'), {
          description: t(
            'apps.accounts.properties.profile.avatar.uploaded-description'
          ),
        })
      } else if (response.status === 401) {
        await authStore.auth.refreshHandler()

        return onAvatarUpload()
      } else {
        logger.error('failed to upload avatar')
      }
    }
  }

  return (
    <div className='flex w-full max-w-sm items-center space-x-2 pt-2'>
      <img
        style={{ width: 48, height: 48, marginRight: 16 }}
        src={form.getValues(field)}
      />
      <Input ref={ref} type='file' accept='image/*' />
      <Button type='button' onClick={onAvatarUpload}>
        {t('apps.accounts.properties.profile.avatar.upload')}
      </Button>
    </div>
  )
}