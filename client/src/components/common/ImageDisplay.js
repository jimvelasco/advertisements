import React from "react";
import classnames from "classnames";
import PropTypes from "prop-types";

const ImageDisplay = ({ buf, width, height, filename }) => {
  //console.log("buf", buf);
  if (buf) {
    let buffer = buf.data;
    let binary = "";
    let bytes = [].slice.call(new Uint8Array(buffer));
    bytes.forEach(b => (binary += String.fromCharCode(b)));
    let binarybuf = window.btoa(binary);
    let imagestr = "data:image/jpeg;base64," + binarybuf;
    return (
      <div>
        <img
          style={{ width: width, height: height }}
          src={imagestr}
          className="App-image"
          alt="logo"
        />
        <div>{filename}</div>
      </div>
    );
  } else {
    return <h3>No Image Available</h3>;
  }
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

export default ImageDisplay;
