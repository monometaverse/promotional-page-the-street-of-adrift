import * as THREE from 'three'
export class ThreeApp {
    private $el: HTMLCanvasElement
    private renderer: THREE.WebGLRenderer
    private scene: THREE.Scene
    private camera: THREE.Camera
    private cube: THREE.Mesh
    // 初始化 Three.js App
    constructor(canvasEl: HTMLCanvasElement) {
        this.$el = canvasEl
        this.renderer = new THREE.WebGLRenderer({
            canvas: canvasEl,
            alpha: true
        })
        this.renderer.setPixelRatio(devicePixelRatio)
        this.renderer.setSize(innerWidth, innerHeight)
        this.scene = new THREE.Scene()
        this.camera = new THREE.PerspectiveCamera(70, innerWidth / innerHeight)
        // 创建一个立方体
        this.cube = new THREE.Mesh(new THREE.BoxBufferGeometry(), new THREE.MeshBasicMaterial({ wireframe: true, color: 0xffffff }))
        this.initScene()
        this.tick()
    }

    // 初始化场景
    initScene = () => {
        // 移动摄像机
        this.camera.position.set(0, 0, 5)
        // 将立方体加入到场景中
        this.scene.add(this.cube)
    }

    // 帧刷
    tick = () => {
        requestAnimationFrame(this.tick)
        this.cube.rotateX(0.01)
        this.cube.rotateY(0.01)
        this.cube.rotateZ(0.01)
        this.renderer.render(this.scene, this.camera)
    }
}
