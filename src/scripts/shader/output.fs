#version 300 es
precision highp float;

uniform sampler2D srcMap;

in vec2 vUv;
out vec4 outColor;

void main() {
  // outColor = texture(srcMap, vUv);

  vec4 col = texture(srcMap, vUv);

  vec3 white = vec3(0.87, 0.89, 0.97);
  vec3 black = vec3(0.00, 0.01, 0.02);
  outColor = vec4(mix(black, white, col.r), col.a);
}