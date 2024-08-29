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
    if (uv.x < 0.5 && uv.y < 0.5) {
      outColor = vec4(vec3(1) * unpackRGBAToDepth(texture(depthMap, uv * 2.0 - vec2(0, 0))), 1.0);  
      return;
    } else if (0.5 <= uv.x && 0.5 <= uv.y) {
      outColor = texture(diffuseMap, uv * 2.0 - vec2(1, 1));
      return;
    } else if (0.5 <= uv.x && uv.y < 0.5) {
      outColor = vec4(vec3(1) * unpackRGBAToDepth(texture(lightDepthMap, uv * 2.0 - vec2(1, 0))), 1.0);  
      return;
    }

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

  // outColor = texture(diffuseMap, vUv);
  // outColor = vec4(vec3(1) * unpackRGBAToDepth(texture(depthMap, vUv)), 1.0);
  // outColor = vec4(vec3(1) * unpackRGBAToDepth(texture(lightDepthMap, vUv)), 1.0);
}