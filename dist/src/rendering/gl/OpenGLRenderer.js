import { mat4, vec4 } from 'gl-matrix';
import { gl } from '../../globals';
// In this file, `gl` is accessible because it is imported above
class OpenGLRenderer {
    constructor(canvas) {
        this.canvas = canvas;
        this.color = vec4.fromValues(0.42, 0.56, 0.14, 1); // default geometry color
        this.time = 0;
    }
    setClearColor(r, g, b, a) {
        gl.clearColor(r, g, b, a);
    }
    setSize(width, height) {
        this.canvas.width = width;
        this.canvas.height = height;
    }
    setGeometryColor(color) {
        this.color = vec4.fromValues(color[0] / 255, color[1] / 255, color[2] / 255, 1);
    }
    clear() {
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    }
    render(camera, prog, drawables) {
        let model = mat4.create();
        let viewProj = mat4.create();
        mat4.identity(model);
        mat4.multiply(viewProj, camera.projectionMatrix, camera.viewMatrix);
        prog.setModelMatrix(model);
        prog.setViewProjMatrix(viewProj);
        prog.setGeometryColor(this.color);
        prog.setTime(this.time);
        this.time++;
        for (let drawable of drawables) {
            prog.draw(drawable);
        }
    }
}
;
export default OpenGLRenderer;
//# sourceMappingURL=OpenGLRenderer.js.map