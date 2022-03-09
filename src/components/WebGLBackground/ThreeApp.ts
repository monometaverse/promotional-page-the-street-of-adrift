import * as THREE from 'three'
import { DataTexture, Float32BufferAttribute, IcosahedronBufferGeometry, MeshBasicMaterial, MeshStandardMaterial, Object3D, Vector3 } from 'three'
import { LoadedResources } from '../ResourceLoader/Resources'
import { debounce } from '../../utils'
import { gsap, Power2 } from 'gsap'
import { GLTF } from 'three/examples/jsm/loaders/GLTFLoader'
import { toRaw } from 'vue'
import { TransformControls } from 'three/examples/jsm/controls/TransformControls'

export class ThreeApp {
  // 3D 上下文
  private $el: HTMLCanvasElement
  private $el2D: HTMLCanvasElement
  private renderer: THREE.WebGLRenderer
  private scene: THREE.Scene
  private camera: THREE.PerspectiveCamera
  private res: LoadedResources
  // 目前正在显示的图片名称
  private showingPicIndex: number = -1
  // 所有的粒子点
  private points: THREE.Points[] = []
  // 示例正二十面体
  private icosahedronSample: THREE.Mesh
  // 是否显示辅助 canvas 和辅助图片
  private showHelper: boolean = false
  // 实例是否已经销毁，不再使用
  private destroyed: boolean = false
  // 当前正在显示的视图
  private _viewNo: number = 0
  // 目前正在显示的金币
  private currentCoin: THREE.Mesh | undefined = undefined
  // 手动拖动助手
  private transformHelper: TransformControls | undefined = undefined
  // 金币是否被手动拖动过
  private manualRotated: boolean = false
  // 目前已经有的所有的视图
  readonly allViews = 2
  // 初始化 Three.js App
  constructor(canvasEl: HTMLCanvasElement, res: LoadedResources) {
    this.$el = canvasEl
    this.$el2D = document.createElement('canvas')
    this.$el2D.style.background = '#000000'
    this.renderer = new THREE.WebGLRenderer({
      canvas: canvasEl,
      alpha: true
    })
    this.renderer.setPixelRatio(devicePixelRatio)
    this.renderer.setSize(innerWidth, innerHeight)
    this.scene = new THREE.Scene()
    this.icosahedronSample = new THREE.Mesh(new IcosahedronBufferGeometry(), new MeshBasicMaterial({ wireframe: true }))
    this.camera = new THREE.PerspectiveCamera(70, innerWidth / innerHeight)
    this.res = res
    this.initScene()
    this.nextPic()
    this.tick()
  }

  // 测试时使用
  // 显示或隐藏辅助 canvas 和辅助图片
  showOrHideHelper = (show: boolean) => {
    // 没有正在显示的图片的话就不受影响
    if (!this.showingPic) {
      console.warn('ThreeApp: 修改辅助 canvas 和辅助图片的显示状态：目前没有正在显示的图片')
      return
    }
    // 马上显示或隐藏辅助 canvas 和辅助图片
    if (show) {
      if (!this.showingPic.isConnected) {
        document.body.appendChild(this.showingPic)
      }
      if (!this.$el2D.isConnected) {
        document.body.appendChild(this.$el2D)
      }
    } else {
      if (this.showingPic.isConnected) {
        this.showingPic.remove()
      }
      if (this.$el2D.isConnected) {
        this.$el2D.remove()
      }
    }
    this.showHelper = show
  }

  // 初始化场景
  initScene = () => {
    // 设置环境贴图
    const env = this.res.find(it => it.name === 'coinEnviroment')
    if (env) {
      const v = env.value as DataTexture
      v.mapping = THREE.EquirectangularReflectionMapping
      this.scene.environment = v
    }
    // 移动摄像机
    this.camera.position.set(0, 0, 5)
    // 监听窗口大小变化事件
    window.addEventListener('resize', this.onWindowResize)
    this.initParticleView()
    this.initCoinModelView()
  }

  // 初始化粒子效果演示场景
  initParticleView = () => {
    // 添加临时正二十面体
    this.scene.add(this.icosahedronSample)
  }

  // 根据名称获取到指定的物体
  getChildByName: (name: string, children: Object3D | Object3D[]) => Object3D | undefined = (name: string, children: Object3D | Object3D[]) => {
    // 当传入的值是一个物体数组时
    if (Array.isArray(children)) {
      let objGot: Object3D | undefined
      // 检查数组中的每一个物体
      for (let obj of children) {
        objGot = this.getChildByName(name, obj)
        if (objGot) {
          return objGot
        }
      }
      return undefined
    } else {
      // 不是数组，检查名称
      if (children.name === name) {
        return children
      } else {
        // 如果没有找到，从子物体中找
        if (children.children.length) {
          return this.getChildByName(name, children.children)
        }
        return undefined
      }
    }
  }

  // 初始化金币模型视图
  initCoinModelView = () => {
    // 添加金币模型
    const coin = this.res.find(it => it.name === 'kusyouCoin')
    if (coin) {
      // 从模型文件中寻找真正的金币 Mesh
      const coinContainer = this.getChildByName('YX_Gold', toRaw((coin.value as GLTF).scene))
      if (coinContainer) {
        const coinModel = coinContainer as THREE.Mesh
        // 调整金币的参数
        const material = coinModel.material as MeshStandardMaterial
        material.roughness = 0.2
        coinModel.position.set(5, 0, 0)
        coinModel.scale.set(5, 5, 5)
        // 添加手动拖动助手
        const transformHelper = new TransformControls(this.camera, this.$el)
        transformHelper.attach(coinModel)
        transformHelper.setMode('rotate')
        transformHelper.enabled = true
        transformHelper.showZ = false
        transformHelper.showX = false
        // transformHelper.showY = false
        // 当手动拖动过就不再自动旋转
        transformHelper.addEventListener('objectChange', (args) => {
          this.manualRotated = true
        })
        // 把这个变量暴露到整体环境中
        this.currentCoin = coinModel
        // 把手动拖动助手暴露到整体环境中
        this.transformHelper = transformHelper
        this.scene.add(coinModel)
        this.scene.add(transformHelper)
      }
    }
  }

  // 当窗口大小变化时触发
  onWindowResize = debounce((event: UIEvent) => {
    // 更新相机参数
    this.camera.aspect = innerWidth / innerHeight
    this.camera.updateProjectionMatrix()
    // 更新渲染器高宽
    this.renderer.setSize(innerWidth, innerHeight)
  }, 200)

  // 显示下一张图片
  nextPic = () => {
    if (!this.res || !this.res.length) {
      console.warn('ThreeApp: 当前没有加载资源')
      return
    }
    this.showingPic?.remove()
    if (this.showingPicIndex === -1 || this.showingPicIndex === this.res.length - 1) {
      // 如果没有正在显示的图片，或者已经是最后一张图片，使用第一张
      this.showingPicIndex = 0
      // 跳转到下一个为粒子效果制作的图片
      this.showingPicIndex++
      while(this.res[this.showingPicIndex] !instanceof Image || this.res[this.showingPicIndex].for !== 'particle') {
        this.showingPicIndex++
      }
    } else {
      // 跳转到下一个为粒子效果制作的图片
      this.showingPicIndex++
      while(this.res[this.showingPicIndex] !instanceof Image || this.res[this.showingPicIndex].for !== 'particle') {
        this.showingPicIndex++
      }
    }
    this.applyPic()
  }

  // 获取正在显示的图片
  get showingPic(): HTMLImageElement | null {
    // 如果没有正在显示的图片，返回空
    if (this.showingPicIndex === -1) {
      return null
    }
    // 如果目前资源没有加载完成，返回空
    if (!this.res) {
      return null
    }
    return this.res[this.showingPicIndex].value as HTMLImageElement
  }

  // 切换到下一个视图
  nextView = () => {
    // 如果是最后一个视图，切换到第一个视图
    if (this.isLastView) {
      this._viewNo = 0
    } else {
      this._viewNo ++
    }
    gsap.killTweensOf(this.camera.position, 'x', true)
    gsap.to(this.camera.position, { duration: 0.5, x: this._viewNo * 5, ease: Power2.easeOut })
  }

  // 切换到上一个视图
  prevView = () => {
    // 如果是第一个视图，切换到最后一个视图
    if (this.isFirstView) {
      this._viewNo = this.allViews - 1
    } else {
      this._viewNo --
    }
    gsap.killTweensOf(this.camera.position, 'x', true)
    gsap.to(this.camera.position, { duration: 0.5, x: this._viewNo * 5, ease: Power2.easeOut })
  }

  // 获取当前正在显示的视图
  get currentView(): number {
    return this._viewNo + 1
  }

  // 是否正在显示最后一个视图
  get isLastView(): boolean {
    return this.currentView === this.allViews
  }

  // 是否正在显示第一个视图
  get isFirstView(): boolean {
    return this.currentView === 1
  }

  // 显示上一张图片
  prevPic = () => {
    if (!this.res || !this.res.length) {
      console.warn('ThreeApp: 当前没有加载资源')
      return
    }
    this.showingPic?.remove()
    if (this.showingPicIndex === -1) {
      // 如果没有正在显示的图片，使用第一张
      this.showingPicIndex = 0
      // 跳转到下一个为粒子效果制作的图片
      this.showingPicIndex++
      while(this.res[this.showingPicIndex] !instanceof Image || this.res[this.showingPicIndex].for !== 'particle') {
        this.showingPicIndex++
      }
    } else if (this.showingPicIndex === 0){
      // 如果已经在显示第一张图片，使用最后一张
      this.showingPicIndex = this.res.length - 1
      // 跳转到上一个为粒子效果制作的图片
      this.showingPicIndex--
      while(this.res[this.showingPicIndex] !instanceof Image || this.res[this.showingPicIndex].for !== 'particle') {
        this.showingPicIndex--
      }
    } else {
      // 跳转到上一个为粒子效果制作的图片
      this.showingPicIndex--
      while(this.res[this.showingPicIndex] !instanceof Image || this.res[this.showingPicIndex].for !== 'particle') {
        this.showingPicIndex--
      }
    }
    this.applyPic()
  }

  // 将图片以点阵的形式显示出来
  applyPic = () => {
    // 如果现在没有在显示图片，返回
    if (!this.showingPic) {
      console.warn('ThreeApp: 现在没有在显示的图片')
      return
    }
    const ctx = this.$el2D.getContext('2d')
    // 如果获取不到 canvas 上下文，返回
    if (!ctx) {
      console.warn('ThreeApp: 获取 canvas 上下文失败')
      return
    }
    // 重置现在的点阵
    this.scene.remove(...this.points)
    this.points = []
    this.$el2D.width = this.showingPic.width
    this.$el2D.height = this.showingPic.height
    const { width, height } = this.showingPic
    if (this.showHelper) {
      document.body.appendChild(this.$el2D)
      document.body.appendChild(this.showingPic)
    }
    // 在 2D Canvas 显示图片
    ctx.drawImage(this.showingPic, 0, 0, width, height)
    // 获取图片的像素信息
    const pointPositionData = ctx.getImageData(0, 0, width, height).data
    // 设置粒子间隔为 4 像素，每隔 4 隔像素渲染一个点
    const gap = 4
    // 遍历图片像素点
    for (let positionX = 0; positionX < width; positionX += gap) {
      for (let positionY = 0; positionY < height; positionY += gap) {
        // 通过图片宽度和目前正在遍历的高度，加上目前遍历的行的宽度，和 RGBA 色彩排列方式，计算出目前应该拿到的像素点位置
        const pos = (width * positionY + positionX) * 4
        const r = pointPositionData[pos], g = pointPositionData[pos + 1], b = pointPositionData[pos + 2], a = pointPositionData[pos + 3]
        if (r + g + b === 255 * 3) {
          // 如果像素点是白色，就生成点
          const geometry = new THREE.BufferGeometry()
          geometry.setAttribute('position', new Float32BufferAttribute(new Vector3().toArray(), 3))
          const point = new THREE.Points(geometry, new THREE.PointsMaterial({ size: 0.01 }))
          point.position.set(positionX * 0.01 - this.$el2D.width * 0.01 / 2, - positionY * 0.01 + this.$el2D.height * 0.01 / 2, 0)
          this.points.push(point)
        }
      }
    }
    // 把点加入到场景中
    this.scene.add(...this.points)
  }

  // 帧刷
  tick = () => {
    // 如果实例已经被标记为销毁，就不再渲染
    if (this.destroyed) return
    requestAnimationFrame(this.tick)
    this.icosahedronSample.rotateX(0.01)
    this.icosahedronSample.rotateY(0.01)
    this.icosahedronSample.rotateZ(0.01)
    if (this.currentCoin && !this.manualRotated) {
      this.currentCoin.rotateZ(-0.005)
    }
    this.renderer.render(this.scene, this.camera)
  }

  // 销毁
  destroy = () => {
    // 清除窗口变化监听事件
    window.removeEventListener('resize', this.onWindowResize)
    // 将实例标记为已销毁
    this.destroyed = true
  }
}
