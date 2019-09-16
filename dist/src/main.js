import { vec3 } from 'gl-matrix';
import * as Stats from 'stats-js';
import * as DAT from 'dat-gui';
import Square from './geometry/Square';
import Cube from './geometry/Cube';
import Cactus from './geometry/Cactus';
import OpenGLRenderer from './rendering/gl/OpenGLRenderer';
import Camera from './Camera';
import { setGL } from './globals';
import ShaderProgram, { Shader } from './rendering/gl/ShaderProgram';
import OBJLoader from './OBJLoader';
import Grammar from './LinkedList';
// Define an object with application parameters and button callbacks
// This will be referred to by dat.GUI's functions that add GUI elements.
const controls = {
    'Load Scene': loadScene,
};
let icosphere;
let square;
let cube;
let cactus = new Cactus();
function loadScene() {
    //icosphere = new Icosphere(vec3.fromValues(0, 0, 0), 1, controls.tesselations);
    //icosphere.create();
    square = new Square(vec3.fromValues(0, 0, 0));
    square.create();
    cube = new Cube();
    cube.create();
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
    gui.add(controls, 'Load Scene');
    // get canvas and webgl context
    const canvas = document.getElementById('canvas');
    const gl = canvas.getContext('webgl2');
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
    renderer.setClearColor(0.68, 0.85, 0.9, 1);
    gl.enable(gl.DEPTH_TEST);
    const lambert = new ShaderProgram([
        new Shader(gl.VERTEX_SHADER, require('./shaders/lambert-vert.glsl')),
        new Shader(gl.FRAGMENT_SHADER, require('./shaders/lambert-frag.glsl')),
    ]);
    function callback(indices, positions, normals) {
        cactus.indices = Uint32Array.from(indices);
        cactus.positions = Float32Array.from(positions);
        cactus.normals = Float32Array.from(normals);
        cactus.create();
    }
    // referenced from https://stackoverflow.com/questions/14446447/how-to-read-a-local-text-file
    function readTextFile(file, callback) {
        let indices = new Uint32Array(0);
        let positions = new Float32Array(0);
        let normals = new Float32Array(0);
        var rawFile = new XMLHttpRequest();
        rawFile.open("GET", file, false);
        rawFile.onreadystatechange = function () {
            if (rawFile.readyState === 4) {
                if (rawFile.status === 200 || rawFile.status == 0) {
                    var allText = rawFile.responseText;
                    //console.log(allText);
                    OBJLoader(allText, callback, cactus);
                }
            }
        };
        rawFile.send(null);
    }
    let cactusFilename = "./cactusPaddleTriangles.obj";
    readTextFile(cactusFilename, callback);
    var numIterations = 5;
    var startChar = '0';
    let cactusGrammar = new Grammar(startChar);
    // expand starting character
    for (var i = 0; i < numIterations; i++) {
        cactusGrammar.expandString();
    }
    console.log(cactusGrammar.getString());
    // determine what functions 
    //cactusGrammar.drawString();
    // This function will be called every frame
    function tick() {
        camera.update();
        stats.begin();
        gl.viewport(0, 0, window.innerWidth, window.innerHeight);
        renderer.clear();
        renderer.render(camera, lambert, [
            // icosphere,
            // square,
            cactus,
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
//# sourceMappingURL=main.js.map