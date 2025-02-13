import z from 'zod'
import translationEn from '@/locales/en/translation.json'
import translationCn from '@/locales/zh-CN/translation.json'
import translationTw from '@/locales/zh-TW/translation.json'
import i18next from 'i18next'
import { initReactI18next } from 'react-i18next'
import { zodI18nMap } from 'zod-i18n-map'
import zodEn from 'zod-i18n-map/locales/en/zod.json'
import zodCn from 'zod-i18n-map/locales/zh-CN/zod.json'
import zodTw from 'zod-i18n-map/locales/zh-TW/zod.json'

const resources = {
  en: {
    zod: zodEn,
    translation: translationEn,
  },
  'zh-CN': {
    zod: zodCn,
    translation: translationCn,
  },
  'zh-TW': {
    zod: zodTw,
    translation: translationTw,
  },
}

i18next
  .use(initReactI18next)
  .init({
    lng: 'zh-CN',
    fallbackLng: 'zh-CN',
    resources,
    keySeparator: ' ',
  })
  .then()
z.setErrorMap(zodI18nMap)

export { i18next, z }
