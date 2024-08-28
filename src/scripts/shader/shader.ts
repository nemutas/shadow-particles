import pointVs from './point.vs'
import pointFs from './point.fs'
import pointDepthFs from './pointDepth.fs'
import groundVs from './ground.vs'
import groundFs from './ground.fs'
import groundDepthFs from './groundDepth.fs'
import baseVs from './base.vs'
import positionFs from './position.fs'
import compositFs from './composit.fs'
import afterImageFs from './afterImage.fs'
import outputFs from './output.fs'

export const shader = {
  point: {
    vs: pointVs,
    fs: pointFs,
    depthFs: pointDepthFs,
  },
  ground: {
    vs: groundVs,
    fs: groundFs,
    depthFs: groundDepthFs,
  },
  simulator: {
    vs: baseVs,
    fs: positionFs,
  },
  composit: {
    vs: baseVs,
    fs: compositFs,
  },
  afterImage: {
    vs: baseVs,
    fs: afterImageFs,
  },
  output: {
    vs: baseVs,
    fs: outputFs,
  },
}
