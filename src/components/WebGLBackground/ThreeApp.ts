import * as THREE from 'three'
import { Float32BufferAttribute, IcosahedronBufferGeometry, MeshBasicMaterial, Vector3 } from 'three'
import { LoadedResources } from '../../Resources'

export class ThreeApp {
  // 3D 上下文
  private $el: HTMLCanvasElement
  private $el2D: HTMLCanvasElement
  private renderer: THREE.WebGLRenderer
  private scene: THREE.Scene
  private camera: THREE.Camera
  private res: LoadedResources
  // 目前正在显示的图片名称
  private showingPicIndex: number = -1
  // 所有的粒子点
  private points: THREE.Points[] = []
  // 示例正二十面体
  private icosahedronSample: THREE.Mesh
  // 是否显示辅助 canvas 和辅助图片
  private showHelper: boolean = false
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
    // 移动摄像机
    this.camera.position.set(0, 0, 5)
    this.scene.add(this.icosahedronSample)
  }

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
    } else {
      this.showingPicIndex++
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
    return this.res[this.showingPicIndex].value
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
    } else if (this.showingPicIndex === 0){
      // 如果已经在显示第一张图片，使用最后一张
      this.showingPicIndex = this.res.length - 1
    } else {
      this.showingPicIndex--
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
    requestAnimationFrame(this.tick)
    this.icosahedronSample.rotateX(0.01)
    this.icosahedronSample.rotateY(0.01)
    this.icosahedronSample.rotateZ(0.01)
    this.renderer.render(this.scene, this.camera)
  }
}
