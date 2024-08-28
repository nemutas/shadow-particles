import { Canvas } from './Canvas'

console.log(`github: https://github.com/nemutas/${import.meta.env.BASE_URL.split('/').at(-2)}`)
console.log('others: https://inoue-prototype-work.vercel.app/')

const canvas = new Canvas(document.querySelector<HTMLCanvasElement>('.webgl-canvas')!)

window.addEventListener('beforeunload', () => {
  canvas.dispose()
})
