import {gl} from '../../globals';

export class Texture {
  texture: WebGLTexture;
  
  bindTex() {
  	  gl.bindTexture(gl.TEXTURE_2D, this.texture);
  }

  handle(): WebGLTexture {
  	return this.texture;
  }

  isPowerOf2(value: number) : boolean {
      return (value & (value - 1)) == 0;
  }

  constructor(imageSource: string) {
  	this.texture = gl.createTexture();
  	this.bindTex();

    // create a white pixel to serve as placeholder
  	const formatSrc = gl.RGBA;
  	const formatDst = gl.RGBA;
  	const level = 0;
  	const phWidth = 1; // placeholder
  	const phHeight = 1;
  	const phImg = new Uint8Array([255, 255, 255, 255]);
  	const formatBit = gl.UNSIGNED_BYTE; // TODO: HDR

  	gl.texImage2D(gl.TEXTURE_2D, level, formatDst, phWidth, phHeight, 0, formatSrc, formatBit, phImg);

  	// get a javascript image locally and load it. not instant but will auto-replace white pixel
  	const image = new Image();

  	image.onload = function() {
  	    this.bindTex();
  		gl.texImage2D(gl.TEXTURE_2D, level, formatDst, image.width, image.height, 0, formatSrc, formatBit, image);
		  
		// WebGL1 has different requirements for power of 2 images vs. 
		// non power of 2 images so check if the image is a power of 2 in both dimensions.
    	if (this.isPowerOf2(image.width) && this.isPowerOf2(image.height)) {
			// Yes, it's a power of 2. Generate mips.
			gl.generateMipmap(gl.TEXTURE_2D);
		 } else {
			// No, it's not a power of 2. Turn off mips and set wrapping to clamp to edge
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
		}
  	}.bind(this);

  	image.src = imageSource; // load the image
  }
};

export default Texture;