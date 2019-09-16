#version 300 es

precision highp float;
precision mediump int;

uniform int u_Time;

uniform sampler2D u_Sampler;

uniform sampler2D u_hatch0;
uniform sampler2D u_hatch1;
uniform sampler2D u_hatch2;
uniform sampler2D u_hatch3;
uniform sampler2D u_hatch4;
uniform sampler2D u_hatch5;

in vec4 fs_Pos;
in vec4 fs_Nor;
in vec2 fs_UV;
in vec4 fs_Col;

in vec4 fs_LightVec;

out vec4 color;

//http://www.neilmendoza.com/glsl-rotation-about-an-arbitrary-axis/
mat4 rotationMatrix(vec3 axis, float angle) {
    axis = normalize(axis);
    float s = sin(angle);
    float c = cos(angle);
    float oc = 1.0 - c;
    
    return mat4(oc * axis.x * axis.x + c,           oc * axis.x * axis.y - axis.z * s,  oc * axis.z * axis.x + axis.y * s,  0.0,
                oc * axis.x * axis.y + axis.z * s,  oc * axis.y * axis.y + c,           oc * axis.y * axis.z - axis.x * s,  0.0,
                oc * axis.z * axis.x - axis.y * s,  oc * axis.y * axis.z + axis.x * s,  oc * axis.z * axis.z + c,           0.0,
                0.0,                                0.0,                                0.0,                                1.0);
}

vec3 random3(vec3 c) {
	float j = 4096.0*sin(dot(c,vec3(17.0, 59.4, 15.0)));
	vec3 r;
	r.z = fract(512.0*j);
	j *= .125;
	r.x = fract(512.0*j);
	j *= .125;
	r.y = fract(512.0*j);
	return r-0.5;
}

void main() {
    vec2 uvFix = vec2(fs_UV.x, 1.0 - fs_UV.y);
    vec4 albedo = texture(u_Sampler, uvFix);

    // calculate the diffuse term for Lambert shading
    float diffuseTerm = clamp(dot(normalize(fs_Nor), normalize(fs_LightVec)), 0.0, 1.0);
    float ambientTerm = 0.05; // avoid black shadows with ambient term
    vec4 shadedColor = vec4(albedo.rgb * (diffuseTerm + ambientTerm), albedo.a);

    // calculate fragment brightness
    const vec3 constant = vec3(0.2326, 0.7152, 0.0722);
    //float luminance = dot(shadedColor.rgb, constant);
    float luminance = clamp(dot(vec3(diffuseTerm + ambientTerm), constant), 0.0, 1.0);

    // hatching code (0 = dark, 6 = light)
    float hatch0 = dot(texture(u_hatch5, uvFix).rgb, constant);
    float hatch1 = dot(texture(u_hatch4, uvFix).rgb, constant);
    float hatch2 = dot(texture(u_hatch3, uvFix).rgb, constant);
    float hatch3 = dot(texture(u_hatch2, uvFix).rgb, constant);
    float hatch4 = dot(texture(u_hatch1, uvFix).rgb, constant);
    float hatch5 = dot(texture(u_hatch0, uvFix).rgb, constant);
    float hatch6 = 1.0;

    luminance *= 6.0; // scale luminance to avoid division
    float weight0 = 1.0 - clamp(abs(0.0 - luminance), 0.0, 1.0);
    float weight1 = 1.0 - clamp(abs(1.0 - luminance), 0.0, 1.0);
    float weight2 = 1.0 - clamp(abs(2.0 - luminance), 0.0, 1.0);
    float weight3 = 1.0 - clamp(abs(3.0 - luminance), 0.0, 1.0);
    float weight4 = 1.0 - clamp(abs(4.0 - luminance), 0.0, 1.0);
    float weight5 = 1.0 - clamp(abs(5.0 - luminance), 0.0, 1.0);
    float weight6 = 1.0 - clamp(abs(6.0 - luminance), 0.0, 1.0);

    hatch0 = hatch0 * weight0;
    hatch1 = hatch1 * weight1;
    hatch2 = hatch2 * weight2;
    hatch3 = hatch3 * weight3;
    hatch4 = hatch4 * weight4;
    hatch5 = hatch5 * weight5;
    hatch6 = hatch6 * weight6;

    vec3 hatching = vec3(hatch0 + hatch1 + hatch2 + hatch3 + hatch4 + hatch5 + hatch6);
    color = vec4(hatching, 0.8);
}
