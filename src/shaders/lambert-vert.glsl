#version 300 es

precision highp float;
precision mediump int;

uniform mat4 u_Model; 
uniform mat4 u_ModelInvTr;  
uniform mat4 u_ViewProj;   

uniform int u_Time;

in vec4 vs_Pos;           
in vec4 vs_Nor;          
in vec2 vs_UV;
in vec4 vs_Col;         

out vec4 fs_Pos;
out vec4 fs_Nor;
out vec2 fs_UV;
out vec4 fs_Col;   

out vec4 fs_LightVec;


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

void main()
{
    fs_Col = vs_Col;   
    fs_UV = vs_UV;                      

    mat3 invTranspose = mat3(u_ModelInvTr);
    fs_Nor = vec4(invTranspose * vec3(vs_Nor), 0);  

    vec4 modelposition =  u_Model * vs_Pos;  
    fs_Pos = modelposition; 

    vec4 lightPos = vec4(100.0 * cos(float(u_Time) * 0.01), 100.0 * sin(float(u_Time) * 0.01), 500, 1); 
    fs_LightVec = lightPos - modelposition; 

    gl_Position = u_ViewProj * modelposition;
}
