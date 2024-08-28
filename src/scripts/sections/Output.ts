import * as THREE from 'three'
import { RawShaderMaterial } from '../core/ExtendedMaterials'
import { shader } from '../shader/shader'

export class Output {
  private readonly camera = new THREE.OrthographicCamera()
  private readonly scene = new THREE.Scene()

  constructor(
    private readonly renderer: THREE.WebGLRenderer,
    src: THREE.Texture,
  ) {
    this.createPlane(src)
  }

  private createPlane(src: THREE.Texture) {
    const geo = new THREE.PlaneGeometry(2, 2)
    const mat = new RawShaderMaterial({
      uniforms: {
        srcMap: { value: src },
      },
      vertexShader: shader.output.vs,
      fragmentShader: shader.output.fs,
    })
    const mesh = new THREE.Mesh(geo, mat)
    mesh.name = 'output'
    this.scene.add(mesh)
  }

  render(src?: THREE.Texture) {
    if (src) {
      this.uniforms.srcMap.value = src
    }

    this.renderer.setRenderTarget(null)
    this.renderer.render(this.scene, this.camera)
  }

  private get uniforms() {
    return (this.scene.getObjectByName('output') as THREE.Mesh<THREE.PlaneGeometry, RawShaderMaterial>).material.uniforms
  }
}
