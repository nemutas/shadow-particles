#version 300 es
precision highp float;

uniform sampler2D srcMap;
uniform sampler2D prevMap;

in vec2 vUv;
out vec4 outColor;

void main() {
  vec4 src = texture(srcMap, vUv);
  vec4 prev = texture(prevMap, vUv);

  // outColor = mix(prev, src, 0.5);
  outColor = mix(prev, src, 1.0);
}