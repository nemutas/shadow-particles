import { Three } from './core/Three'
import { pane } from './Gui'
import { Composit } from './sections/Composit'
import { Output } from './sections/Output'
import { MainScene } from './sections/MainScene'
import { Simulator } from './sections/Simulator'
import { isTouch } from './utils/media'

export class Canvas extends Three {
  private readonly amount = isTouch ? 256 : 512

  private readonly simulator: Simulator
  private readonly mainScene: MainScene
  private readonly composit: Composit
  private readonly output: Output

  constructor(canvas: HTMLCanvasElement) {
    super(canvas)

    this.simulator = new Simulator(this.renderer, this.amount)
    this.mainScene = new MainScene(this.renderer, this.amount)
    this.composit = new Composit(this.renderer, this.mainScene)
    this.output = new Output(this.renderer, this.composit.texture)

    this.setGui()

    window.addEventListener('resize', this.resize.bind(this))
    this.renderer.setAnimationLoop(this.anime.bind(this))
  }

  private setGui() {
    pane.title = '(^_^)/'
    pane.addFpsBlade()

    const btn = pane.addButton({ title: 'stop' }).on('click', () => {
      this.simulator.toggleRun()
      btn.title = btn.title === 'stop' ? 'restart' : 'stop'
    })
  }

  private anime() {
    pane.updateFps()

    const dt = this.clock.getDelta()

    this.simulator.render(dt)
    this.mainScene.render(this.simulator.texture)
    this.composit.render()
    this.output.render()
  }

  private resize() {
    const { width, height } = this.resolution

    this.mainScene.resize(width, height)
    this.composit.resize(width, height)
  }
}
