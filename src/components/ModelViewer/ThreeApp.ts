import { BoxBufferGeometry, Mesh, MeshBasicMaterial, PerspectiveCamera, Scene, WebGLRenderer } from "three"

export class ThreeApp {
  private canvasEl: HTMLCanvasElement
  private renderer: WebGLRenderer
  private scene: Scene
  private camera: PerspectiveCamera
  private cube: Mesh
  private renderPaused: boolean = false

  constructor(el: HTMLCanvasElement) {
    this.canvasEl = el
    // 初始化渲染器
    this.renderer = new WebGLRenderer({
      canvas: el,
      alpha: true,
      antialias: true
    })
    this.renderer.setSize(this.canvasEl.width, this.canvasEl.height)
    this.renderer.setPixelRatio(devicePixelRatio)
    // 初始化相机
    this.camera = new PerspectiveCamera(75, this.canvasEl.width / this.canvasEl.height)
    this.camera.position.setZ(5)
    // 初始化场景
    this.scene = new Scene()
    // 初始化临时方块
    this.cube = new Mesh(new BoxBufferGeometry(), new MeshBasicMaterial({ color: 0xffffff }))
    this.scene.add(this.cube)
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
    // 旋转小方块
    this.cube.rotateX(0.01)
    this.cube.rotateY(0.01)
    this.cube.rotateZ(0.01)
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
}
