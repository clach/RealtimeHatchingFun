import Drawable from '../rendering/gl/Drawable';
import { gl } from '../globals';
class Cactus extends Drawable {
    constructor() {
        super(); // Call the constructor of the super class. This is required.
    }
    create() {
        this.generateIdx();
        this.generatePos();
        this.generateNor();
        this.count = this.indices.length;
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.bufIdx);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, this.indices, gl.STATIC_DRAW);
        gl.bindBuffer(gl.ARRAY_BUFFER, this.bufNor);
        gl.bufferData(gl.ARRAY_BUFFER, this.normals, gl.STATIC_DRAW);
        gl.bindBuffer(gl.ARRAY_BUFFER, this.bufPos);
        gl.bufferData(gl.ARRAY_BUFFER, this.positions, gl.STATIC_DRAW);
        console.log('Created cactus');
    }
}
;
export default Cactus;
//# sourceMappingURL=Cactus.js.map