import React from "react"
import PropTypes from "prop-types"
class FloorButton extends React.Component {

  constructor(props) {
    super(props);
    this.state = {current_selected_floor: 2};
  }

  render () {
    return (
      <button type="button"
              onClick={(e) => this.props.handler(e, this.props.floor.level)} 
              className={this.props.was_searched_floor ? "btn btn-primary center-block" : "btn btn-warning center-block"}>
        {this.props.floor.name}
      </button>
    );
  }
}
FloorButton.propTypes = {
  floor: PropTypes.object,
  was_searched_floor: PropTypes.bool,
  handler: PropTypes.func
};
export default FloorButton
