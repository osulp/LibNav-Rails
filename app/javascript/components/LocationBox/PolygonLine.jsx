import React from "react"
import PropTypes from "prop-types"
class PolygonLine extends React.Component {
  static PropTypes = {
    from: PropTypes.arrayOf(PropTypes.number),
    to: PropTypes.arrayOf(PropTypes.number)
  }

  constructor(props) {
    super(props);
  }

  render() {
    return(<line x1={this.props.from[0]} y1={this.props.from[1]} x2={this.props.to[0]} y2={this.props.to[1]} />);
  }
}
export default PolygonLine;
