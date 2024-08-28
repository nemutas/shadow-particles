#version 300 es

in vec3 position;
in vec2 uv;

uniform mat4 modelMatrix;
uniform mat4 viewMatrix;
uniform mat4 projectionMatrix;

out float vDepth;
out vec2 vUv;

void main() {
  vUv = uv;

	gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(position, 1.0);
	vDepth = (gl_Position.z / gl_Position.w) * 0.5 + 0.5;
}