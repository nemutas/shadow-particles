import * as THREE from 'three'
import { RawShaderMaterial } from '../core/ExtendedMaterials'
import { shader } from '../shader/shader'

export class Simulator {
  private readonly scene = new THREE.Scene()
  private readonly camera = new THREE.OrthographicCamera()

  private readonly renderTargets: THREE.WebGLRenderTarget[] = []

  constructor(
    private readonly renderer: THREE.WebGLRenderer,
    amount: number,
  ) {
    this.createRenderTargets(amount)
    this.createPlane()
  }

  private createRenderTargets(amount: number) {
    const create = () =>
      new THREE.WebGLRenderTarget(amount, amount, {
        minFilter: THREE.NearestFilter,
        magFilter: THREE.NearestFilter,
        type: THREE.HalfFloatType,
      })
    this.renderTargets.push(create(), create())
  }

  private createPlane() {
    const geo = new THREE.PlaneGeometry(2, 2)
    const mat = new RawShaderMaterial({
      uniforms: {
        positionMap: { value: null },
        time: { value: 0 },
        deltaTime: { value: 0 },
        run: { value: true },
      },
      vertexShader: shader.simulator.vs,
      fragmentShader: shader.simulator.fs,
    })
    const mesh = new THREE.Mesh(geo, mat)
    mesh.name = 'sim'
    this.scene.add(mesh)
  }

  render(dt: number) {
    this.uniforms.positionMap.value = this.texture
    this.uniforms.time.value += dt
    this.uniforms.deltaTime.value = dt

    this.renderer.setRenderTarget(this.renderTargets[1])
    this.renderer.render(this.scene, this.camera)
    this.swap()
  }

  private swap() {
    const temp = this.renderTargets[0]
    this.renderTargets[0] = this.renderTargets[1]
    this.renderTargets[1] = temp
  }

  private get uniforms() {
    return (this.scene.getObjectByName('sim') as THREE.Mesh<THREE.PlaneGeometry, RawShaderMaterial>).material.uniforms
  }

  get texture() {
    return this.renderTargets[0].texture
  }

  toggleRun() {
    this.uniforms.run.value = !this.uniforms.run.value
  }
}
