#version 300 es
precision highp float;

in float vDepth;
out vec4 outColor;

#include '../shader/module/packing.glsl'

void main() {
  if (0.5 < distance(vec2(0.5), gl_PointCoord)) discard;

  outColor = packDepthToRGBA(vDepth);
}