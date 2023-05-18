import zh from './zh.json'
import en from './en.json'
import { createI18n, I18nOptions } from 'vue-i18n'

export type MessageSchema = typeof zh
export const i18n = createI18n({
  legacy: false,
  locale: 'en',
  fallbackLocale: 'zh',
  messages: {
    en, zh
  }
})
