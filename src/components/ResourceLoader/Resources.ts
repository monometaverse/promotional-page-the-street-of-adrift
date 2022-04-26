import { GLTF } from 'three/examples/jsm/loaders/GLTFLoader'

// 阵营图片素材
import annaOrg from '../../assets/characters-page/anna-org.png'
import christinaOrg from '../../assets/characters-page/christina-org.png'
import linOrg from '../../assets/characters-page/lin-org.png'
import hannyaOrg from '../../assets/characters-page/hannya-org.png'
import rosettaOrg from '../../assets/characters-page/rosetta-org.png'
import tokugawaOrg from '../../assets/characters-page/tokugawa-org.png'
import higashiyamaOrg from '../../assets/characters-page/higashiyama-org.png'
import watanabeOrg from '../../assets/characters-page/watanabe-org.png'
// 角色立绘
import annaPaint from '../../assets/characters-page/anna.png'
import christinaPaint from '../../assets/characters-page/christina.png'
import shiraishiPaint from '../../assets/characters-page/rosetta.png'
import watanabePaint from '../../assets/characters-page/watanabe.png'
import linPaint from '../../assets/characters-page/lin.png'
import higashiyamaPaint from '../../assets/characters-page/higashiyama.png'
import hannyaPaint from '../../assets/characters-page/hannya.png'
import tokugawaPaint from '../../assets/characters-page/tokugawa.png'
// 九霄金币
import kusyouCoin from '../../assets/nft-page/kusyouCoin.glb'
import S_UMSSuper from '../../assets/nft-page/S_UMSSuper.glb'
import { DataTexture, Group, Material, Side } from 'three'
// 背景图片
import homeBackground from '../../assets/static-framework/background-home.png'
import nftBackground from '../../assets/static-framework/background-nft.png'
import charactersBackground from '../../assets/static-framework/background-characters.png'
import settingsBackground from '../../assets/static-framework/background-settings.png'
import archivesBackground from '../../assets/static-framework/background-archives.png'
// 档案页图片
import alcoholAbuse from '../../assets/archive-page/alcohol-abuse.jpg'
import conceptDesign from '../../assets/archive-page/concept-design-of-the-street-of-adrift.jpg'
import linInArchive from '../../assets/archive-page/lin.jpg'
import noTitle from '../../assets/archive-page/no-title.jpg'
import planningBoard from '../../assets/archive-page/planning-board.jpg'
import refrigerator2044 from '../../assets/archive-page/refrigerator-2044.jpg'
import refrigerator2045 from '../../assets/archive-page/refrigerator-2045.jpg'
import tokugawaInArchive from '../../assets/archive-page/tokugawa.jpg'
import annaInArchive from '../../assets/archive-page/anna.jpg'
import beauties from '../../assets/archive-page/beauties.jpg'

// 要加载的资源
export const resources = [
  // 适用于粒子效果的图片
  { name: 'annaOrg', value: annaOrg, type: 'image', for: 'particle' },
  { name: 'christinaOrg', value: christinaOrg, type: 'image', for: 'particle' },
  { name: 'linOrg', value: linOrg, type: 'image', for: 'particle' },
  { name: 'hannyaOrg', value: hannyaOrg, type: 'image', for: 'particle' },
  { name: 'shiraishiOrg', value: rosettaOrg, type: 'image', for: 'particle' },
  { name: 'tokugawaOrg', value: tokugawaOrg, type: 'image', for: 'particle' },
  { name: 'higashiyamaOrg', value: higashiyamaOrg, type: 'image', for: 'particle' },
  { name: 'watanabeOrg', value: watanabeOrg, type: 'image', for: 'particle' },
  // NFT 模型
  { name: 'kusyouCoin', value: kusyouCoin, type: 'glb', for: 'NFT' },
  { name: 'S_UMSSuper', value: S_UMSSuper, type: 'glb', for: 'NFT' },
  // 全局背景，请务必以页面名称开头 + Background
  { name: 'static.homeBackground', value: homeBackground, type: 'image', for: 'background' },
  { name: 'static.itemBackground', value: nftBackground, type: 'image', for: 'background' },
  { name: 'static.characterBackground', value: charactersBackground, type: 'image', for: 'background' },
  { name: 'static.settingsBackground', value: settingsBackground, type: 'image', for: 'background' },
  { name: 'static.archivesBackground', value: archivesBackground, type: 'image', for: 'background' },
  // 角色立绘
  { name: 'annaPaint', value: annaPaint, type: 'image', for: 'characterPaint' },
  { name: 'tokugawaPaint', value: tokugawaPaint, type: 'image', for: 'characterPaint' },
  { name: 'hannyaPaint', value: hannyaPaint, type: 'image', for: 'characterPaint' },
  { name: 'higashiyamaPaint', value: higashiyamaPaint, type: 'image', for: 'characterPaint' },
  { name: 'christinaPaint', value: christinaPaint, type: 'image', for: 'characterPaint' },
  { name: 'linPaint', value: linPaint, type: 'image', for: 'characterPaint' },
  { name: 'shiraishiPaint', value: shiraishiPaint, type: 'image', for: 'characterPaint' },
  { name: 'watanabePaint', value: watanabePaint, type: 'image', for: 'characterPaint' },
  // 档案页图片
  { name: 'alcoholAbuse', value: alcoholAbuse, type: 'image', for: 'archive' },
  { name: 'conceptDesign', value: conceptDesign, type: 'image', for: 'archive' },
  { name: 'linInArchive', value: linInArchive, type: 'image', for: 'archive' },
  { name: 'noTitle', value: noTitle, type: 'image', for: 'archive' },
  { name: 'planningBoard', value: planningBoard, type: 'image', for: 'archive' },
  { name: 'refrigerator2044', value: refrigerator2044, type: 'image', for: 'archive' },
  { name: 'refrigerator2045', value: refrigerator2045, type: 'image', for: 'archive' },
  { name: 'tokugawaInArchive', value: tokugawaInArchive, type: 'image', for: 'archive' },
  { name: 'beauties', value: beauties, type: 'image', for: 'archive' },
  { name: 'annaInArchive', value: annaInArchive, type: 'image', for: 'archive' },

] as const
export type Resources = typeof resources
export type LoadingResources = { name: Resources[number]['name'], value: HTMLImageElement | GLTF | DataTexture, for: Resources[number]['for'] }[]
export type LoadedResources = Required<LoadingResources>
export type NFTItem = {
  name: string, // 名称
  description: string, // 描述
  reserved: boolean, // 是否已经预约
  model: Group, // 模型组
  customData?: {
    childName?: string,
    scale?: number,
    rotateX?: number, // 旋转修正
    rotateY?: number,
    rotateZ?: number,
    positionX?: number,
    positionY?: number, // 位置修正
    positionZ?: number,
    side?: Side, // 显示面
    depthWrite?: boolean,
    correctMaterial?: Material
  } // 自定义数据
}
