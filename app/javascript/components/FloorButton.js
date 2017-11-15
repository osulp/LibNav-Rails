import React from "react"
import PropTypes from "prop-types"
class FloorButton extends React.Component {
  render () {
    return (
      <button type="button" className="btn btn-warning center-block">
        {this.props.floor.name}
      </button>
    );
  }
}
FloorButton.propTypes = {
  floor: PropTypes.object,
};
export default FloorButton
