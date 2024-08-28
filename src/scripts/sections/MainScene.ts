import * as THREE from 'three'
import { PerspectiveCamera } from '../core/Camera'
import { RawShaderMaterial } from '../core/ExtendedMaterials'
import { shader } from '../shader/shader'
import { Light } from './Light'

export class MainScene {
  readonly scene = new THREE.Scene()
  readonly camera: PerspectiveCamera

  private readonly multipleRenderTarget: THREE.WebGLRenderTarget

  readonly light: Light

  constructor(
    private readonly renderer: THREE.WebGLRenderer,
    amount: number,
  ) {
    this.light = this.createLight()
    this.multipleRenderTarget = this.createMultipleRenderTarget()
    this.camera = this.createCamera()
    this.createPoints(amount)
    this.createGround()
  }

  private createCamera() {
    const camera = new PerspectiveCamera(this.renderer, { near: 0.1, far: 20 })
    camera.lookAt(this.scene.position)
    camera.controls.enablePan = false
    camera.controls.maxPolarAngle = Math.PI / 2
    camera.controls.maxDistance = 10
    camera.controls.enableDamping = true
    return camera
  }

  private createLight() {
    const light = new Light(this.renderer, [4096, 4096])
    const size = 15
    light.camera = new THREE.OrthographicCamera(-size, size, size, -size, 1, 30)
    light.camera.position.set(3, 5, 0)
    light.camera.position.set(1, 5, -1)
    light.camera.lookAt(this.scene.position)
    this.scene.add(light.camera)
    return light
  }

  private createMultipleRenderTarget() {
    const width = this.renderer.domElement.width * this.renderer.getPixelRatio()
    const height = this.renderer.domElement.height * this.renderer.getPixelRatio()

    const renderTarget = new THREE.WebGLRenderTarget(width, height, {
      count: 2,
      minFilter: THREE.NearestFilter,
      magFilter: THREE.NearestFilter,
    })
    renderTarget.textures[0].name = 'diffuse'
    renderTarget.textures[1].name = 'depth'
    return renderTarget
  }

  private createPoints(amount: number) {
    const geo = new THREE.BufferGeometry()

    const verticies: number[] = []
    const uvs: number[] = []

    for (let i = 0; i < amount; i++) {
      for (let j = 0; j < amount; j++) {
        verticies.push(0, 0, 0)
        uvs.push(i / amount, j / amount)
      }
    }

    geo.setAttribute('position', new THREE.Float32BufferAttribute(verticies, 3))
    geo.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2))

    const mat = new RawShaderMaterial({
      uniforms: {
        positionMap: { value: null },
      },
      vertexShader: shader.point.vs,
      fragmentShader: shader.point.fs,
    })
    const mesh = new THREE.Points(geo, mat)
    mesh.name = 'points'
    this.scene.add(mesh)

    // set depth material
    mesh.userData.depthMaterial = new RawShaderMaterial({
      uniforms: {
        positionMap: { value: null },
      },
      vertexShader: shader.point.vs,
      fragmentShader: shader.point.depthFs,
    })
  }

  private createGround() {
    const geo = new THREE.PlaneGeometry(10, 10, 10, 10)
    const mat = new RawShaderMaterial({
      uniforms: {},
      vertexShader: shader.ground.vs,
      fragmentShader: shader.ground.fs,
    })
    const mesh = new THREE.Mesh(geo, mat)
    mesh.rotation.x = -Math.PI / 2
    mesh.position.y = -2
    mesh.name = 'ground'
    this.scene.add(mesh)

    // set depth material
    mesh.userData.depthMaterial = new RawShaderMaterial({
      uniforms: {},
      vertexShader: shader.ground.vs,
      fragmentShader: shader.ground.depthFs,
    })
  }

  render(positionMap: THREE.Texture) {
    this.camera.controls.update()

    this.uniforms('points').positionMap.value = positionMap

    this.renderer.setRenderTarget(this.multipleRenderTarget)
    this.renderer.render(this.scene, this.camera)

    this.light.render(this, positionMap)
  }

  resize(resWidth: number, resHeight: number) {
    this.multipleRenderTarget.setSize(resWidth, resHeight)
    this.camera.update()
  }

  mesh(name: 'points' | 'ground') {
    return this.scene.getObjectByName(name) as THREE.Mesh<THREE.BufferGeometry, RawShaderMaterial>
  }

  private uniforms(name: 'points' | 'ground') {
    return this.mesh(name).material.uniforms
  }

  texture(name: 'diffuse' | 'depth') {
    return this.multipleRenderTarget.textures.find((t) => t.name === name)!
  }
}
