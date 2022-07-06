/// <reference types="vite/client" />
/// <reference types="vite-plugin-pages/client" />

declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}

declare module '*.hdr' {
  const value: string
  export default value
}

declare module '*.glb' {
  const value: string
  export default value
}

declare interface ImportMetaEnv {
  VITE_APP_API_URL_BASE: string
  VITE_APP_OSS_URL_BASE: string
  VITE_APP_MONO_FE: string
}
