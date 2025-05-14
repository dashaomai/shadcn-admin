import { useTranslation } from 'react-i18next'
import { UserAuthForm } from './components/user-auth-form'

export default function SignIn2() {
  const { t } = useTranslation()

  return (
    <div className='relative container grid h-svh flex-col items-center justify-center lg:max-w-none lg:grid-cols-2 lg:px-0'>
      <div className='bg-muted relative hidden h-full flex-col p-10 text-white lg:flex dark:border-r'>
        <div className='absolute inset-0 bg-zinc-500' />
        <div className='relative z-20 flex items-center text-lg font-medium'>
          <img
            src='./images/cherry-fresh-fruit-svgrepo-com.svg'
            width={24}
            height={24}
            alt={t('title')}
          />
          &nbsp;{t('title')}
        </div>

        <img
          src='./images/sydney-opera-house-svgrepo-com.svg'
          className='relative m-auto'
          width={335}
          height={225}
          alt={t('title')}
        />

        <div className='relative z-20 mt-auto'>
          <blockquote className='space-y-2'>
            <p className='text-lg'>&ldquo;{t('auth.signIn.welcome')}&rdquo;</p>
            <footer className='text-sm'>{t('title')}</footer>
          </blockquote>
        </div>
      </div>
      <div className='lg:p-8'>
        <div className='mx-auto flex w-full flex-col justify-center space-y-2 sm:w-[350px]'>
          <div className='flex flex-col space-y-2 text-left'>
            <h1 className='text-2xl font-semibold tracking-tight'>
              {t('auth.signIn.title')}
            </h1>
            <p className='text-muted-foreground text-sm'>
              {t('auth.signIn.description')}
            </p>
          </div>
          <UserAuthForm />
          <p className='text-muted-foreground px-8 text-center text-sm'>
            {t('auth.signIn.footer')}
          </p>
        </div>
      </div>
    </div>
  )
}
