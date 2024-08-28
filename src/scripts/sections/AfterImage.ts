import * as THREE from 'three'
import { RawShaderMaterial } from '../core/ExtendedMaterials'
import { shader } from '../shader/shader'

export class AfterImage {
  private readonly camera = new THREE.OrthographicCamera()
  private readonly scene = new THREE.Scene()

  private readonly renderTargets: THREE.WebGLRenderTarget[] = []

  constructor(
    private readonly renderer: THREE.WebGLRenderer,
    src: THREE.Texture,
  ) {
    this.renderTargets.push(this.createRenderTarget(), this.createRenderTarget())
    this.createPlane(src)
  }

  private createRenderTarget() {
    const width = this.renderer.domElement.width * this.renderer.getPixelRatio()
    const height = this.renderer.domElement.height * this.renderer.getPixelRatio()
    return new THREE.WebGLRenderTarget(width, height)
  }

  private createPlane(src: THREE.Texture) {
    const geo = new THREE.PlaneGeometry(2, 2)
    const mat = new RawShaderMaterial({
      uniforms: {
        srcMap: { value: src },
        prevMap: { value: null },
      },
      vertexShader: shader.afterImage.vs,
      fragmentShader: shader.afterImage.fs,
    })
    const mesh = new THREE.Mesh(geo, mat)
    mesh.name = 'afterImage'
    this.scene.add(mesh)
  }

  render() {
    this.uniforms.prevMap.value = this.texture

    this.renderer.setRenderTarget(this.renderTargets[1])
    this.renderer.render(this.scene, this.camera)
    this.swap()
  }

  resize(resWidth: number, resHeight: number) {
    this.renderTargets.forEach((rt) => rt.setSize(resWidth, resHeight))
  }

  private get uniforms() {
    return (this.scene.getObjectByName('afterImage') as THREE.Mesh<THREE.BufferGeometry, RawShaderMaterial>).material.uniforms
  }

  private swap() {
    const temp = this.renderTargets[0]
    this.renderTargets[0] = this.renderTargets[1]
    this.renderTargets[1] = temp
  }

  get texture() {
    return this.renderTargets[0].texture
  }
}
