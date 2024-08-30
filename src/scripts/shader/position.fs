#version 300 es
precision highp float;

uniform sampler2D positionMap;
uniform float time;
uniform float deltaTime;
uniform bool run;

in vec2 vUv;
out vec4 outColor;

#include './module/curl4.glsl'

vec3 hash(vec3 v) {
  uvec3 x = floatBitsToUint(v + vec3(0.1, 0.2, 0.3));
  x = (x >> 8 ^ x.yzx) * 0x456789ABu;
  x = (x >> 8 ^ x.yzx) * 0x6789AB45u;
  x = (x >> 8 ^ x.yzx) * 0x89AB4567u;
  return vec3(x) / vec3(-1u);
}

void main() {
  vec4 positionInfo = texture(positionMap, vUv);
  
  if (!run) {
    outColor = positionInfo;
    return;
  }

  vec3 pos = positionInfo.xyz;
  float life = positionInfo.a;

  if (life < 0.0) {
    vec3 h = hash(vec3(time, vUv));
    life = h.x;
    float radius = (h.y * (0.5 - 0.4) + 0.4);
    pos = normalize(hash(vec3(vUv, time)) * 2.0 - 1.0) * radius;
  } else {
    // life -= 0.01;
    life -= deltaTime * 0.8;
    // pos += curl(pos * 0.35, time, 0.1 + (1.0 - life) * 0.1) * 0.03;
    pos += curl(pos * 0.35, time * 0.5, 0.1 + (1.0 - life) * 0.1) * 0.03;
  }

  outColor = vec4(pos, life);
}