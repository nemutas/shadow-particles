#version 300 es
precision highp float;

in vec3 position;
in vec2 uv;

uniform mat4 modelMatrix;
uniform mat4 viewMatrix;
uniform mat4 projectionMatrix;

uniform sampler2D positionMap;
uniform bool isDpr2;

out float vDepth;

void main() {
	vec4 positionInfo = texture(positionMap, uv);
	vec3 pos = positionInfo.xyz;
	float life = positionInfo.w;

	vec4 mvPos = viewMatrix * modelMatrix * vec4(pos, 1.0);

	// gl_PointSize = 50.0 / -mvPos.z;
	float size = 50.0 * (float(isDpr2) * (2.5 - 1.0) + 1.0);
	gl_PointSize = size / -mvPos.z;
	gl_PointSize *= tanh(life * 5.0);

	gl_Position = projectionMatrix * mvPos;
	vDepth = (gl_Position.z / gl_Position.w) * 0.5 + 0.5;
}