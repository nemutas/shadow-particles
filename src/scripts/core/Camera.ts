import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/Addons.js'

export class OrthographicCamera extends THREE.OrthographicCamera {
  private _controls?: OrbitControls
  private readonly frustomScale

  constructor(
    private renderer: THREE.WebGLRenderer,
    params?: { left?: number; right?: number; top?: number; bottom?: number; near?: number; far?: number; scale?: number },
  ) {
    const aspect = window.innerWidth / window.innerHeight
    const left = params?.left ?? -aspect
    const right = params?.right ?? aspect
    const top = params?.top ?? 1
    const bottom = params?.bottom ?? -1
    const near = params?.near ?? 0.1
    const far = params?.far ?? 100
    const scale = params?.scale ?? 1

    super(left * scale, right * scale, top * scale, bottom * scale, near, far)

    this.position.z = 10
    this.frustomScale = scale
  }

  update() {
    const aspect = window.innerWidth / window.innerHeight
    this.left = -aspect * this.frustomScale
    this.right = aspect * this.frustomScale
    this.updateProjectionMatrix()
  }

  enableControls() {
    return this.controls
  }

  get controls() {
    if (!this._controls) {
      this._controls = new OrbitControls(this, this.renderer.domElement)
    }
    return this._controls
  }
}

export class PerspectiveCamera extends THREE.PerspectiveCamera {
  private _controls?: OrbitControls

  constructor(
    private renderer: THREE.WebGLRenderer,
    params?: { fov?: number; aspect?: number; near?: number; far?: number },
  ) {
    const fov = params?.fov ?? 40
    const aspect = params?.aspect ?? window.innerWidth / window.innerHeight
    const near = params?.near ?? 0.1
    const far = params?.far ?? 100

    super(fov, aspect, near, far)

    this.position.z = 10
  }

  update() {
    this.aspect = window.innerWidth / window.innerHeight
    this.updateProjectionMatrix()
  }

  enableControls() {
    return this.controls
  }

  get controls() {
    if (!this._controls) {
      this._controls = new OrbitControls(this, this.renderer.domElement)
    }
    return this._controls
  }
}
