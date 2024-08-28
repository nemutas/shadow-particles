#version 300 es
precision highp float;

layout(location = 0) out vec4 gColor;
layout(location = 1) out vec4 gDepth;

in float vDepth;
in vec2 vUv;

#include '../shader/module/packing.glsl'

void main() {
  float th = smoothstep(0.5, 0.2, distance(vec2(0.5), vUv));
  gColor = vec4(vec3(0.8) * th, 1);
  // gColor = vec4(vec3(0.87, 0.88, 0.92) * th, 1);
  gDepth = packDepthToRGBA(vDepth);
}