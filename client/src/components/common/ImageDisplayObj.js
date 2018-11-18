import React from "react";
import classnames from "classnames";
import PropTypes from "prop-types";

// buf={this.state.imageBuffer}
// width={this.state.imageWidth}
// height={this.state.imageHeight}
// filename={this.state.imageFilename}

// imageBuffer: {
//   type: Buffer,
//   required: false
// },
// imageFilename: {
//   type: String
// },
// width: {
//   type: Number,
//   required: false
// },
// height: {
//   type: Number,
//   required: false
// },

//const ImageDisplayObj = ({ buf, width, height, filename }) => {
const ImageDisplayObj = ({ obj }) => {
  //console.log("buf", buf);

  let buffer = null;
  let binary = "";
  let binarybuf = null;
  let bytes = [];
  let imagestr = "";
  buffer = obj.imageBuffer.data;
  if (buffer) {
    // let buffer = obj.imageBuffer;
    bytes = [].slice.call(new Uint8Array(buffer));
    bytes.forEach(b => (binary += String.fromCharCode(b)));
    binarybuf = window.btoa(binary);
    imagestr = "data:image/jpeg;base64," + binarybuf;
  } else {
    buffer = obj.imageBuffer;
    imagestr = "data:image/jpeg;base64," + buffer;
  }
  return (
    <div>
      <img
        style={{ width: obj.width, height: obj.height }}
        src={imagestr}
        className="App-image"
        alt="logo"
      />
      <div className="smallfont">{obj.imageFilename}</div>
      <div className="smallfont">{obj.description}</div>
    </div>
  );
};

// is-invalid depends if error.name exists.  see validation code

// TextFieldGroup.propTypes = {
//   name: PropTypes.string.isRequired,
//   placeholder: PropTypes.string,
//   value: PropTypes.string.isRequired,
//   info: PropTypes.string,
//   error: PropTypes.string,
//   type: PropTypes.string.isRequired,
//   onChange: PropTypes.func.isRequired,
//   disabled: PropTypes.string
// };

// TextFieldGroup.defaultProps = {
//   type: "text"
// };

export default ImageDisplayObj;
