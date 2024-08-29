#version 300 es
precision highp float;

struct Transform {
  mat4 projectionMatrix;
  mat4 viewMatrix;
};

uniform sampler2D diffuseMap;
uniform sampler2D depthMap;
uniform sampler2D lightDepthMap;

uniform Transform sceneTransform;
uniform Transform lightTransform;

uniform bool debug;

in vec2 vUv;
out vec4 outColor;

#include '../shader/module/packing.glsl'

void main() {
  vec2 uv = vUv;

  if (debug) {
    uv = uv * 2.0 - vec2(0, 1);
  }

  vec4 color = texture(diffuseMap, uv); 
  float depth = unpackRGBAToDepth(texture(depthMap, uv)) * 2.0 - 1.0;

  outColor = vec4(color.rgb, color.a);

  vec3 ndcPos = vec3(uv * 2.0 - 1.0, depth);
  vec4 wp = inverse(sceneTransform.viewMatrix) * inverse(sceneTransform.projectionMatrix) * vec4(ndcPos, 1.0);
  vec3 worldPos = wp.xyz / wp.w;

  vec4 lp = lightTransform.projectionMatrix * lightTransform.viewMatrix * vec4(worldPos, 1.0);
  vec3 shadowCoord = lp.xyz / lp.w * 0.5 + 0.5;
  float lightDepth = unpackRGBAToDepth(texture(lightDepthMap, shadowCoord.xy));
  float bias = 0.02;

  // float shadow = step(shadowCoord.z - 0.01, lightDepth);
  float shadow = smoothstep(bias, 0.0, shadowCoord.z - lightDepth);
  shadow = shadow * (1.0 - 0.5) + 0.5;
  outColor.rgb *= shadow;

  //
  vec3 white = vec3(0.87, 0.89, 0.97);
  vec3 black = vec3(0.00, 0.01, 0.02);
  outColor = vec4(mix(black, white, outColor.r), outColor.a);

  if (debug) {
    if (vUv.x < 0.5 && vUv.y < 0.5) {
      outColor = vec4(vec3(1) * unpackRGBAToDepth(texture(depthMap, vUv * 2.0 - vec2(0, 0))), 1.0);  
    } else if (0.5 <= vUv.x && 0.5 <= vUv.y) {
      outColor = texture(diffuseMap, vUv * 2.0 - vec2(1, 1));
    } else if (0.5 <= vUv.x && vUv.y < 0.5) {
      outColor = vec4(vec3(1) * unpackRGBAToDepth(texture(lightDepthMap, vUv * 2.0 - vec2(1, 0))), 1.0);  
    }
  }

  // outColor = texture(diffuseMap, vUv);
  // outColor = vec4(vec3(1) * unpackRGBAToDepth(texture(depthMap, vUv)), 1.0);
  // outColor = vec4(vec3(1) * unpackRGBAToDepth(texture(lightDepthMap, vUv)), 1.0);
}