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

  let buffer = obj.imageBuffer.data;
  let binary = "";
  let bytes = [].slice.call(new Uint8Array(buffer));
  bytes.forEach(b => (binary += String.fromCharCode(b)));
  let binarybuf = window.btoa(binary);
  let imagestr = "data:image/jpeg;base64," + binarybuf;
  return (
    <div>
      <img
        style={{ width: obj.width, height: obj.height }}
        src={imagestr}
        className="App-image"
        alt="logo"
      />
      <div>{obj.imageFilename}</div>
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
