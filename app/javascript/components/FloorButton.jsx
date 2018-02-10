import React from "react"
import PropTypes from "prop-types"
class FloorButton extends React.Component {

  constructor(props) {
    super(props);
    this.state = { current_selected_floor: 2 };
  }

  render() {
    return (
      <li className="nav-item">
        <a onClick={(e) => this.props.handler(e, this.props.floor.level)}
          className={`${this.props.was_searched_floor ? 'searched-floor' : ''} ${this.props.active ? 'active' : ''} btn btn-primary orange`}>
          {this.props.floor.name}
          {this.props.was_searched_floor ? <span className="search-hit-count">{this.props.hit_count}</span> : ''}
        </a>
      </li>
    );
  }
}

// className={this.props.was_searched_floor ? "btn btn-primary center-block" : "btn btn-warning center-block"}>

FloorButton.propTypes = {
  floor: PropTypes.object,
  was_searched_floor: PropTypes.bool,
  handler: PropTypes.func,
  active: PropTypes.bool,
  hit_count: PropTypes.number
};
export default FloorButton
