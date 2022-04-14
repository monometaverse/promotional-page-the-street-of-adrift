import { NFTItem } from './../ResourceLoader/Resources'
import { DataTexture, EquirectangularReflectionMapping, Group, Mesh, MeshStandardMaterial, PerspectiveCamera, PMREMGenerator, Scene, WebGLRenderer } from "three"
import { getChildObject } from '../../utils'
import { gsap } from 'gsap'
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

export class ThreeApp {
  private canvasEl: HTMLCanvasElement
  private renderer: WebGLRenderer
  private scene: Scene
  private camera: PerspectiveCamera
  private renderPaused: boolean = false
  // 当前模型
  private currentModel: Group | null = null
  private currentCustomData: NFTItem['customData'] = undefined
  // 拖动控制
  private orbitControls: OrbitControls

  constructor(el: HTMLCanvasElement) {
    this.canvasEl = el
    // 初始化渲染器
    this.renderer = new WebGLRenderer({
      canvas: el,
      alpha: true,
      antialias: true
    })
    this.renderer.setSize(this.canvasEl.width, this.canvasEl.height)
    // 初始化相机
    this.camera = new PerspectiveCamera(50, this.canvasEl.width / this.canvasEl.height)
    this.camera.position.setZ(5)
    // 初始化拖动控制助手
    this.orbitControls = new OrbitControls(this.camera, this.canvasEl)
    this.orbitControls.enableDamping = true
    this.orbitControls.autoRotate = true
    // 初始化场景
    this.scene = new Scene()
    // 设置统一的环境贴图
    const pemremGenerator = new PMREMGenerator(this.renderer)
    this.scene.environment = pemremGenerator.fromScene(new RoomEnvironment()).texture
  }

  // 设置高宽
  setWidthHeight = (width: number, height: number) => {
    this.renderer.setSize(width, height)
    this.camera.aspect = width / height
    this.camera.updateProjectionMatrix()
  }

  // 渲染函数
  render = () => {
    requestAnimationFrame(this.render.bind(this))
    if (this.renderPaused) return
    // this.currentModel?.rotateY(0.01)
    this.orbitControls.update()
    this.renderer.render(this.scene, this.camera)
  }

  // 暂停渲染
  pauseRender = () => {
    this.renderPaused = true
  }

  // 继续渲染
  resumeRender = () => {
    this.renderPaused = false
  }

  // 添加模型到场景里
  private addModel = (model: Group, customData: NFTItem['customData']) => {
    // 根据自定义数据，对模型材质进行修正
    if (customData) {
      model.position.set(customData.positionX ?? 0, customData.positionY ?? 0, customData.positionZ ?? 0)
      if (customData.scale) model.scale.set(customData.scale, customData.scale, customData.scale)
      if (customData.childName) {
        const child = getChildObject(model, customData.childName, true, true) as Mesh
        if (!child) throw new Error('指定的要修改的子对象不存在: ' + customData.childName)
        let material = child.material as MeshStandardMaterial
        if (customData.correctToStandardMaterial) material = new MeshStandardMaterial()
        if (customData.metalness) material.metalness = customData.metalness
        if (customData.roughness) material.roughness = customData.roughness
        if (customData.metalnessMap) material.metalnessMap = customData.metalnessMap
        if (customData.normalMap) material.normalMap = customData.normalMap
        if (customData.map) material.map = customData.map
        if (customData.roughnessMap) material.roughnessMap = customData.roughnessMap
        if (customData.depthWrite) material.depthWrite = true
        if (customData.side) material.side = customData.side
      }
    }
    this.scene.add(model)
  }

  // 显示上一个或下一个模型
  prevOrNext = (next: boolean, model: Group, customData: NFTItem['customData']) => {
    this.camera.position.set(0, 0, 5)
    if (!this.currentModel) {
      // 当前没有在显示的模型，直接把模型放到画布中央
      this.addModel(model, customData)
      // 设置当前模型
      this.currentCustomData = customData
      this.currentModel = model
    } else {
      // 有正在显示的模型，把下一个模型放到当前模型的旁边
      this.addModel(model, customData)
      gsap.fromTo(model.position, { x: (next ? -10 : 10) + (customData?.positionX ?? 0) }, { x: customData?.positionX ?? 0, duration: 0.5 })
      gsap.fromTo(this.currentModel.position, { x: customData?.positionX ?? 0 }, { x: (next ? 10 : -10), duration: 0.5, onComplete: () => {
        this.scene.remove(this.currentModel!)
        this.currentModel = model
        this.currentCustomData = customData
      }})
    }
  }
}
