import { vec3, quat } from 'gl-matrix';
import * as Stats from 'stats-js';
import * as DAT from 'dat-gui';
import Drawable from './rendering/gl/Drawable';
import Icosphere from './geometry/Icosphere';
import Square from './geometry/Square';
import Cube from './geometry/Cube';
import Mesh from './geometry/Mesh';
import OpenGLRenderer from './rendering/gl/OpenGLRenderer';
import Camera from './Camera';
import { setGL } from './globals';
import ShaderProgram, { Shader } from './rendering/gl/ShaderProgram';
import Texture from './rendering/gl/Texture';
import * as Loader from 'webgl-obj-loader';
import {readTextFile} from './globals';
import { SSL_OP_SSLEAY_080_CLIENT_DH_BUG } from 'constants';


// Define an object with application parameters and button callbacks
// This will be referred to by dat.GUI's functions that add GUI elements.
const controls = {
  'Iterations': 1,
  'Rotation': 1,
  'Scale': 1,
};

let wahooMesh: Mesh; 
//let wahooTexture: Texture;
let textures: Texture[];
let tamTextures: Texture[];
let textureNames: string[] = ['./textures/wahoo.bmp', './textures/4096_earth.jpg'];
let tamTextureNames: string[] = ['./textures/tam0.png', './textures/tam1.png',
                                 './textures/tam2.png', './textures/tam3.png',
                                 './textures/tam4.png', './textures/tam5.png'];


function loadScene() {
  let wahooFilename: string = '../../objs/Dog.obj';
  let objText: string = readTextFile(wahooFilename);
  wahooMesh = new Mesh(objText, vec3.fromValues(0.0, 0.0, 0.0));
  wahooMesh.create();

  textures = [];
  for (let i = 0; i < textureNames.length; i++) {
    textures.push(new Texture(textureNames[i]));
  }

  tamTextures = [];
  for (let i = 0; i < tamTextureNames.length; i++) {
    tamTextures.push(new Texture(tamTextureNames[i]));
  }

  //wahooTexture = new Texture('./textures/wahoo.bmp');
}

function main() {
  // Initial display for framerate
  const stats = Stats();
  stats.setMode(0);
  stats.domElement.style.position = 'absolute';
  stats.domElement.style.left = '0px';
  stats.domElement.style.top = '0px';
  document.body.appendChild(stats.domElement);

  // Add controls to the gui
  const gui = new DAT.GUI();
  gui.add(controls, 'Iterations', 0, 5).step(1);
  gui.add(controls, 'Rotation', 0, 3);
  gui.add(controls, 'Scale', 0, 2);

  // get canvas and webgl context
  const canvas = <HTMLCanvasElement>document.getElementById('canvas');
  const gl = <WebGL2RenderingContext>canvas.getContext('webgl2');
  if (!gl) {
    alert('WebGL 2 not supported!');
  }
  // `setGL` is a function imported above which sets the value of `gl` in the `globals.ts` module.
  // Later, we can import `gl` from `globals.ts` to access it
  setGL(gl);

  // Initial call to load scene
  loadScene();

  const camera = new Camera(vec3.fromValues(0, 0, 5), vec3.fromValues(0, 0, 0));

  const renderer = new OpenGLRenderer(canvas);
  renderer.setClearColor(1.0, 1.0, 1.0, 1.0);
  gl.enable(gl.DEPTH_TEST);

  const lambert = new ShaderProgram([
    new Shader(gl.VERTEX_SHADER, require('./shaders/lambert-vert.glsl')),
    new Shader(gl.FRAGMENT_SHADER, require('./shaders/lambert-frag.glsl')),
  ]);

  lambert.setupTexUnits(["u_Sampler", "u_hatch0", "u_hatch1", "u_hatch2", 
                          "u_hatch3", "u_hatch4", "u_hatch5"]);

  // This function will be called every frame
  function tick() {
    camera.update();
    stats.begin();
    gl.viewport(0, 0, window.innerWidth, window.innerHeight);
    renderer.clear();

    lambert.bindTexToUnit("u_Sampler", textures[0], 0);

    for (let i = 0; i < tamTextures.length; i++) {
      lambert.bindTexToUnit("u_hatch" + i.toString(), tamTextures[i], i + 1);
    }

    renderer.render(camera, lambert, [
      wahooMesh
    ]);
    stats.end();

    // Tell the browser to call `tick` again whenever it renders a new frame
    requestAnimationFrame(tick);
  }

  window.addEventListener('resize', function () {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.setAspectRatio(window.innerWidth / window.innerHeight);
    camera.updateProjectionMatrix();
  }, false);

  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.setAspectRatio(window.innerWidth / window.innerHeight);
  camera.updateProjectionMatrix();

  // Start the render loop
  tick();
}

main();
