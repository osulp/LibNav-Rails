import React from "react"
import PropTypes from "prop-types"
class FloorButton extends React.Component {
  render () {
    return (
      <button type="button" className={this.props.was_searched_floor ? "btn btn-primary center-block" : "btn btn-warning center-block"}>
        {this.props.floor.name}
      </button>
    );
  }
}
FloorButton.propTypes = {
  floor: PropTypes.object,
  was_searched_floor: PropTypes.bool
};
export default FloorButton
