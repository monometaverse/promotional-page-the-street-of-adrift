// 阵营图片素材
import dennisOrg from './assets/dennis-org.png'
import ivanovaOrg from './assets/ivanova-org.png'
import jonesOrg from './assets/jones-org.png'
import linOrg from './assets/lin-org.png'
import philipOrg from './assets/philip-org.png'
import prajnaOrg from './assets/prajna-org.png'
import rosettaOrg from './assets/rosetta-org.png'
import tokugawaOrg from './assets/tokugawa-org.png'
import touyamaOrg from './assets/touyama-org.png'
import vue3Org from './assets/Vue3.png'
import watanabeOrg from './assets/watanabe-org.png'

// 要加载的资源
export const resources = [
  { name: 'dennisOrg', value: dennisOrg, type: 'image', for: 'particle' },
  { name: 'ivanovaOrg', value: ivanovaOrg, type: 'image', for: 'particle' },
  { name: 'jonesOrg', value: jonesOrg, type: 'image', for: 'particle' },
  { name: 'linOrg', value: linOrg, type: 'image', for: 'particle' },
  { name: 'philipOrg', value: philipOrg, type: 'image', for: 'particle' },
  { name: 'prajnaOrg', value: prajnaOrg, type: 'image', for: 'particle' },
  { name: 'rosettaOrg', value: rosettaOrg, type: 'image', for: 'particle' },
  { name: 'tokugawaOrg', value: tokugawaOrg, type: 'image', for: 'particle' },
  { name: 'touyamaOrg', value: touyamaOrg, type: 'image', for: 'particle' },
  { name: 'vue3Org', value: vue3Org, type: 'image', for: 'particle' },
  { name: 'watanabeOrg', value: watanabeOrg, type: 'image', for: 'particle' }
] as const
export type Resources = typeof resources
export type LoadingResources = { name: Resources[number]['name'], value: HTMLImageElement }[]
export type LoadedResources = Required<LoadingResources>
