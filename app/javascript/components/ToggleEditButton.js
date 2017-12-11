import React from "react"
import PropTypes from "prop-types"
class ToggleEditButton extends React.Component {

  render () {
    return (
      <button type="button"
              onClick={(e) => this.props.handler(e, this.props.edit_state)} 
              className="btn btn-primary center-block">
        Edit
      </button>
    );
  }
}
ToggleEditButton.propTypes = {
  edit_state: PropTypes.bool,
  handler: PropTypes.func
};
export default ToggleEditButton
