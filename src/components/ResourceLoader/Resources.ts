import { GLTF } from 'three/examples/jsm/loaders/GLTFLoader'

// 阵营图片素材
import dennisOrg from '../../assets/dennis-org.png'
import ivanovaOrg from '../../assets/ivanova-org.png'
import jonesOrg from '../../assets/jones-org.png'
import linOrg from '../../assets/lin-org.png'
import philipOrg from '../../assets/philip-org.png'
import prajnaOrg from '../../assets/prajna-org.png'
import rosettaOrg from '../../assets/rosetta-org.png'
import tokugawaOrg from '../../assets/tokugawa-org.png'
import touyamaOrg from '../../assets/touyama-org.png'
import vue3Org from '../../assets/Vue3.png'
import watanabeOrg from '../../assets/watanabe-org.png'
// 九霄金币
import kusyouCoin from '../../assets/nft-page/kusyouCoin.glb'
import S_UMSSuper from '../../assets/nft-page/S_UMSSuper.glb'
import coinEnviroment from '../../assets/nft-page/coinEnviroment.hdr'
import { DataTexture, Group, Material, Side } from 'three'
// 背景图片
import homeBackground from '../../assets/static-framework/background-home.png'
import nftBackground from '../../assets/static-framework/background-nft.png'
import charactersBackground from '../../assets/static-framework/background-characters.png'
import settingsBackground from '../../assets/static-framework/background-settings.png'
import archivesBackground from '../../assets/static-framework/background-archives.png'

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
  { name: 'watanabeOrg', value: watanabeOrg, type: 'image', for: 'particle' },
  { name: 'kusyouCoin', value: kusyouCoin, type: 'glb', for: 'NFT' },
  { name: 'S_UMSSuper', value: S_UMSSuper, type: 'glb', for: 'NFT' },
  { name: 'coinEnviroment', value: coinEnviroment, type: 'hdr', for: 'NFT' },
  // 全局背景，请务必以页面名称开头 + Background
  { name: 'homeBackground', value: homeBackground, type: 'image', for: 'background' },
  { name: 'itemsBackground', value: nftBackground, type: 'image', for: 'background' },
  { name: 'charactersBackground', value: charactersBackground, type: 'image', for: 'background' },
  { name: 'settingsBackground', value: settingsBackground, type: 'image', for: 'background' },
  { name: 'archivesBackground', value: archivesBackground, type: 'image', for: 'background' },
] as const
export type Resources = typeof resources
export type LoadingResources = { name: Resources[number]['name'], value: HTMLImageElement | GLTF | DataTexture, for: Resources[number]['for'] }[]
export type LoadedResources = Required<LoadingResources>
export type NFTItem = {
  name: string, // 名称
  nameEn: string, // 名称的英文
  description: string, // 描述
  descriptionEn: string, // 英文描述
  reserved: boolean, // 是否已经预约
  model: Group, // 模型组
  customData?: {
    metalness?: number,
    roughness?: number,
    metalnessMap?: DataTexture,
    roughnessMap?: DataTexture,
    normalMap?: DataTexture,
    alphaMap?: DataTexture,
    map?: DataTexture,
    childName?: string,
    correctToStandardMaterial?: boolean, // 对材质进行修正
    scale?: number,
    rotateX?: number, // 旋转修正
    rotateY?: number,
    rotateZ?: number,
    positionX?: number,
    positionY?: number, // 位置修正
    positionZ?: number,
    env?: DataTexture | 'room', // 环境贴图
    side?: Side, // 显示面
    depthWrite?: boolean
  } // 自定义数据
}
