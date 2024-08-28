import * as THREE from 'three'
import { RawShaderMaterial } from '../core/ExtendedMaterials'
import { shader } from '../shader/shader'
import { MainScene } from './MainScene'

export class Composit {
  private readonly camera = new THREE.OrthographicCamera()
  private readonly scene = new THREE.Scene()
  private readonly renderTarget: THREE.WebGLRenderTarget

  constructor(
    private readonly renderer: THREE.WebGLRenderer,
    mainScene: MainScene,
  ) {
    this.renderTarget = this.createRenderTarget()
    this.createPlane(mainScene)
  }

  private createRenderTarget() {
    const width = this.renderer.domElement.width * this.renderer.getPixelRatio()
    const height = this.renderer.domElement.height * this.renderer.getPixelRatio()
    return new THREE.WebGLRenderTarget(width, height)
  }

  private createPlane(mainScene: MainScene) {
    const geo = new THREE.PlaneGeometry(2, 2)
    const mat = new RawShaderMaterial({
      uniforms: {
        diffuseMap: { value: mainScene.texture('diffuse') },
        depthMap: { value: mainScene.texture('depth') },
        lightDepthMap: { value: mainScene.light.depthTexture },
        sceneTransform: {
          value: {
            projectionMatrix: mainScene.camera.projectionMatrix,
            viewMatrix: mainScene.camera.matrixWorldInverse,
          },
        },
        lightTransform: {
          value: {
            projectionMatrix: mainScene.light.camera.projectionMatrix,
            viewMatrix: mainScene.light.camera.matrixWorldInverse,
          },
        },
      },
      vertexShader: shader.composit.vs,
      fragmentShader: shader.composit.fs,
    })
    const mesh = new THREE.Mesh(geo, mat)
    mesh.name = 'composit'
    this.scene.add(mesh)
  }

  render({ output }: { output: boolean } = { output: false }) {
    if (output) {
      this.renderer.setRenderTarget(null)
    } else {
      this.renderer.setRenderTarget(this.renderTarget)
    }
    this.renderer.render(this.scene, this.camera)
  }

  resize(resWidth: number, resHeight: number) {
    this.renderTarget.setSize(resWidth, resHeight)
  }

  get texture() {
    return this.renderTarget.texture
  }
}
