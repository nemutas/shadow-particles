#version 300 es
precision highp float;

struct Transform {
  mat4 projectionMatrix;
  mat4 viewMatrix;
};

uniform sampler2D normalDiffuseMap;
uniform sampler2D depthMap;
uniform sampler2D lightDepthMap;

uniform Transform sceneTransform;
uniform Transform lightTransform;
uniform vec3 lightDirection;
uniform bool debug;

in vec2 vUv;
out vec4 outColor;

#include '../shader/module/packing.glsl'
#include '../shader/module/hash.glsl'

void main() {
  vec2 uv = vUv;

  if (debug) {
    if (uv.x < 0.5 && uv.y < 0.5) {
      outColor = vec4(vec3(1) * unpackRGBAToDepth(texture(depthMap, uv * 2.0 - vec2(0, 0))), 1.0);  
      return;
    } else if (0.5 <= uv.x && 0.5 <= uv.y) {
      outColor = texture(normalDiffuseMap, uv * 2.0 - vec2(1, 1));
      return;
    } else if (0.5 <= uv.x && uv.y < 0.5) {
      outColor = vec4(vec3(1) * unpackRGBAToDepth(texture(lightDepthMap, uv * 2.0 - vec2(1, 0))), 1.0);  
      return;
    }

    uv = uv * 2.0 - vec2(0, 1);
  }

  vec4 normalDiffuse = texture(normalDiffuseMap, uv);
  vec3 normal = unpackRGBToNormal(normalDiffuse.rgb);
  float diffuse = normalDiffuse.a;
  float depth = unpackRGBAToDepth(texture(depthMap, uv)) * 2.0 - 1.0;

  vec3 ndcPos = vec3(uv * 2.0 - 1.0, depth);
  vec4 wp = inverse(sceneTransform.viewMatrix) * inverse(sceneTransform.projectionMatrix) * vec4(ndcPos, 1.0);
  vec3 worldPos = wp.xyz / wp.w;

  float i, shadow;
  vec3 wph = worldPos;
  for (; i < 10.0; i++) {
    wph = worldPos + (hash(wph.yzx) * 2.0 - 1.0) * 0.005;

    vec4 lp = lightTransform.projectionMatrix * lightTransform.viewMatrix * vec4(wph, 1.0);
    vec3 shadowCoord = lp.xyz / lp.w * 0.5 + 0.5;
    float lightDepth = unpackRGBAToDepth(texture(lightDepthMap, shadowCoord.xy));
    float bias = 0.02;

    shadow += smoothstep(bias, 0.0, shadowCoord.z - lightDepth);
  }
  shadow /= i;
  shadow = shadow * (1.0 - 0.5) + 0.5;
  float selfShadow = dot(normal, -lightDirection) * 0.5 + 0.5;
  shadow += selfShadow * (shadow - 0.5) * 0.3;
  diffuse *= shadow;

  //
  vec3 white = vec3(0.87, 0.89, 0.97);
  vec3 black = vec3(0.00, 0.01, 0.02);
  outColor = vec4(mix(black, white, diffuse), 1.0);

  // outColor = texture(diffuseMap, vUv);
  // outColor = vec4(vec3(1) * unpackRGBAToDepth(texture(depthMap, vUv)), 1.0);
  // outColor = vec4(vec3(1) * unpackRGBAToDepth(texture(lightDepthMap, vUv)), 1.0);
  // outColor = vec4(normal * 0.5 + 0.5, 1.0);
  // outColor = vec4(vec3(selfShadow), 1.0);
}