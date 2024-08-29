#version 300 es
precision highp float;

layout(location = 0) out vec4 gColor;
layout(location = 1) out vec4 gDepth;

in float vDepth;

#include '../shader/module/packing.glsl'

void main() {
  if (0.5 < distance(vec2(0.5), gl_PointCoord)) discard;

  gColor = vec4(1, 1, 1, 1);
  gDepth = packDepthToRGBA(vDepth);
}