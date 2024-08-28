const float PackUpscale = 256. / 255.; // fraction -> 0..1 (including 1)
const float UnpackDownscale = 255. / 256.; // 0..1 -> fraction (excluding 1)
const float ShiftRight8 = 1. / 256.;
const float Inv255 = 1. / 255.;

const vec4 PackFactors = vec4(1.0, 256.0, 256.0 * 256.0, 256.0 * 256.0 * 256.0);

const vec2 UnpackFactors2 = vec2(UnpackDownscale, 1.0 / PackFactors.g);
const vec3 UnpackFactors3 = vec3(UnpackDownscale / PackFactors.rg, 1.0 / PackFactors.b);
const vec4 UnpackFactors4 = vec4(UnpackDownscale / PackFactors.rgb, 1.0 / PackFactors.a);

vec4 packDepthToRGBA(const in float v) {
  if (v <= 0.0)
    return vec4(0., 0., 0., 0.);
  if (v >= 1.0)
    return vec4(1., 1., 1., 1.);
  float vuf;
  float af = modf(v * PackFactors.a, vuf);
  float bf = modf(vuf * ShiftRight8, vuf);
  float gf = modf(vuf * ShiftRight8, vuf);
  return vec4(vuf * Inv255, gf * PackUpscale, bf * PackUpscale, af);
}

float unpackRGBAToDepth(const in vec4 v) {
  return dot(v, UnpackFactors4);
}