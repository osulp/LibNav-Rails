import React from "react"
import ReactDom from "react-dom"
import PropTypes from "prop-types"
import JQuery from "jquery"
require('d3');

class LocationBox extends React.Component {
  static PropTypes = {
    position_x: PropTypes.number,
    position_y: PropTypes.number,
    width: PropTypes.number,
    height: PropTypes.number,
    id: PropTypes.number
  }

  static defaultProps = {
    position_x: 0,
    position_y: 0,
    width: 50,
    height: 50,
    id: null
  }

  constructor(props) {
    super(props);
    this.state = {
      position_x: this.props.position_x,
      position_y: this.props.position_y,
      width: this.props.width,
      height: this.props.height
    }

  }

  componentDidMount = () => {
    this.baseElement = d3.select(`#location-box-${this.props.id}`);
    console.log(this.baseElement);
    console.log($(`#location-box-${this.props.id}`).attr('id'));
    // this.baseElement
    d3.select(`#location-box-${this.props.id}`).select('rect')
      .call(d3.drag()
        .on('drag', this.draggedBox));
    // this.baseElement
    d3.select(`#location-box-${this.props.id}`).select('circle')
      .call(d3.drag()
        .on('drag', this.draggedCircle));
  }

  draggedCircle = d => {
    let diffX = d3.event.dx;
    let diffY = d3.event.dy;
    this.setState({
      width: Math.max(Math.min(this.state.width + diffX, 700), 0),
      height: Math.max(Math.min(this.state.height + diffY, 500), 0)
    });
  }

  draggedBox = d => {
    let diffX = d3.event.dx;
    let diffY = d3.event.dy;
    this.setState({
      position_y: Math.max(Math.min(this.state.position_y + diffY, 500 - this.state.height), 0),
      position_x: Math.max(Math.min(this.state.position_x + diffX, 700 - this.state.width), 0)
    });
  }

  render = () => {
    return (
      <g className="location-box" id={`location-box-${this.props.id}`}>
        <rect className="bounding-box" height={this.state.height + "px"} width={this.state.width + "px"} x={this.state.position_x + "px"} y={this.state.position_y} />
        <circle className="drag-circle" r="8px" cx={this.state.position_x + this.state.width + "px"} cy={this.state.position_y + this.state.height + "px"} />
      </g>
    )
  }
}

export default LocationBox;