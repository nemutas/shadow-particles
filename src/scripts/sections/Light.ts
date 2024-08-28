import * as THREE from 'three'
import { MainScene } from './MainScene'

export class Light {
  private readonly renderTarget: THREE.WebGLRenderTarget
  camera: THREE.OrthographicCamera

  constructor(
    private readonly renderer: THREE.WebGLRenderer,
    resolution: [number, number],
  ) {
    this.camera = new THREE.OrthographicCamera()
    this.renderTarget = this.createRenderTarget(resolution)
  }

  private createRenderTarget(resolution: [number, number]) {
    return new THREE.WebGLRenderTarget(resolution[0], resolution[1], {
      minFilter: THREE.NearestFilter,
      magFilter: THREE.NearestFilter,
    })
  }

  render(mainScene: MainScene, positionMap: THREE.Texture) {
    const pointsMesh = mainScene.mesh('points')
    const groundMesh = mainScene.mesh('ground')

    const pointsMaterial = pointsMesh.material
    const groundMaterial = groundMesh.material

    pointsMesh.material = pointsMesh.userData.depthMaterial
    groundMesh.material = groundMesh.userData.depthMaterial

    pointsMesh.userData.depthMaterial.uniforms.positionMap.value = positionMap

    this.renderer.setRenderTarget(this.renderTarget)
    this.renderer.render(mainScene.scene, this.camera)

    pointsMesh.material = pointsMaterial
    groundMesh.material = groundMaterial
  }

  get depthTexture() {
    return this.renderTarget.texture
  }
}
