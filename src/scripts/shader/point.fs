#version 300 es
precision highp float;

uniform mat3 normalMatrix;

layout(location = 0) out vec4 gNormalDiffuse;
layout(location = 1) out vec4 gDepth;

in float vDepth;

#include '../shader/module/packing.glsl'

void main() {
  if (0.5 < distance(vec2(0.5), gl_PointCoord)) discard;

  vec2 suv = gl_PointCoord * 2.0 - 1.0;
  float z = sqrt(1.0 - suv.x * suv.x - suv.y * suv.y);
  vec3 normal = normalize(vec3(suv.x, -suv.y, z));

  normal = inverse(normalMatrix) * normal;

  gNormalDiffuse = vec4(packNormalToRGB(normal), 1);
  gDepth = packDepthToRGBA(vDepth);
}