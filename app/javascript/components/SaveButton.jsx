import React from "react"
import PropTypes from "prop-types"
class SaveButton extends React.Component {
  render() {
    return (
      <button id={`floor-save-btn`} className="btn btn-success save-btn">
        Save
        <span className="icon-container">
          <i className="fa fa-spin fa-circle-o-notch icon active" />
          <i className="fa fa-check icon" />
          <i className="fa fa-times icon" />
        </span>
      </button>
    );
  }
}
export default SaveButton;
