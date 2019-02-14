import React from "react";
import classnames from "classnames";
import PropTypes from "prop-types";

const SelectCategoryGroup = ({ name, list, value, label, error, onChange }) => {
  //console.log("here is the list", list);
  //value = "amazing";
  const sel = "selected";

  let optionTemplate = null;
  if (list) {
    optionTemplate = list.map(v => (
      <option key={v} value={v}>
        {v}
      </option>
    ));
  } else {
    optionTemplate = <option value="">Select</option>;
  }

  return (
    <div className="form-group">
      <div className="row">
        <div className="col-md-3">{label}</div>
        <div className="col-md-9">
          <select name={name} value={value} onChange={onChange}>
            {/* {list.map((item, index) => (
              <option key="{index}" value="{item}">
                {item}
              </option>
            ))} */}
            {optionTemplate}
            {/* <option value="wow">Wow</option>
            <option value="cool">Cool</option>
            <option value="amazing">Amazing</option> */}
          </select>

          {error && <div className="invalid-feedback">{error}</div>}
        </div>
      </div>
    </div>
  );
};

export default SelectCategoryGroup;
