#version 300 es

in vec3 position;
in vec2 uv;

uniform mat4 modelMatrix;
uniform mat4 viewMatrix;
uniform mat4 projectionMatrix;

uniform sampler2D positionMap;

out float vDepth;

void main() {
	vec4 positionInfo = texture(positionMap, uv);
	vec3 pos = positionInfo.xyz;
	float life = positionInfo.w;

	vec4 mvPos = viewMatrix * modelMatrix * vec4(pos, 1.0);

	gl_PointSize = 50.0 / -mvPos.z;
	gl_PointSize *= tanh(life * 5.0);

	gl_Position = projectionMatrix * mvPos;
	vDepth = (gl_Position.z / gl_Position.w) * 0.5 + 0.5;
}