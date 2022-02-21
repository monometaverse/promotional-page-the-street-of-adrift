import {zh} from './zh'
import {en} from './en'
import { createI18n, I18nOptions } from 'vue-i18n'

export type MessageSchema = {
    switchLang: string
    hello: string
}
export const i18n = createI18n<I18nOptions, [MessageSchema], 'en' | 'zh'>({
    legacy: false,
    locale: 'en',
    fallbackLocale: 'zh',
    messages: {
        en, zh
    }
})