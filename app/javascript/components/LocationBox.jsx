import React from "react"
import ReactDom from "react-dom"
import PropTypes from "prop-types"
import JQuery from "jquery"
require('d3');

class LocationBox extends React.Component {
  static PropTypes = {
    location: PropTypes.object
  }

  static defaultProps = {
    position_x: 0,
    position_y: 0,
    width: 50,
    height: 50,
    id: null,
    admin_url: null,
    icon_url: null
  }

  constructor(props) {
    super(props);
    this.state = {
      position_x: this.props.location.position_x,
      position_y: this.props.location.position_y,
      width: this.props.location.width,
      height: this.props.location.height
    }
  }

  componentDidMount = () => {
    this.baseElement = d3.select(`#location-box-${this.props.location.id}`);
    $(`#location-box-${this.props.location.id}`).find('.bounding-box').on('mousedown', (event) => {
      $(`#location-box-${this.props.location.id}`).find('.bounding-box').tooltip('hide')
    });
    $(`#location-box-${this.props.location.id}`).find('.bounding-box').on('keydown', this.handleKeyPress);
    d3.select(`#location-box-${this.props.location.id}`)
      .select('rect')
      .call(d3.drag().on('drag', this.draggedBox));
    d3.select(`#location-box-${this.props.location.id}`)
      .select('circle')
      .call(d3.drag().on('drag', this.draggedCircle));
    let box = $(`#location-box-${this.props.location.id}`).find('.bounding-box');
    box.tooltip({ title: this.props.location.name });
    box.attr('tabindex', '0');
  }

  handleKeyPress = (event) => {
    console.log("pressed");
    let change = 10;
    if (event.shiftKey) {
      change = 1;
    }
    if (event.ctrlKey) {
      if (event.key == "ArrowUp") {
        this.setState({
          height: Math.max(Math.min(this.state.height - change, 800), 0)
        });
        event.preventDefault();
      } else if (event.key == "ArrowDown") {
        this.setState({
          height: Math.max(Math.min(this.state.height + change, 800), 0)
        });
        event.preventDefault();
      }
      if (event.key == "ArrowLeft") {
        this.setState({
          width: Math.max(Math.min(this.state.width - change, 800), 0)
        });
        event.preventDefault();
      } else if (event.key == "ArrowRight") {
        this.setState({
          width: Math.max(Math.min(this.state.width + change, 800), 0)
        });
        event.preventDefault();
      } else if (event.key == "-") {
        this.setState({

        })
      }
    } else {
      if (event.key == "ArrowUp") {
        this.setState({
          position_y: Math.max(Math.min(this.state.position_y - change, 800 - this.state.height), 0)
        });
        event.preventDefault();
      } else if (event.key == "ArrowDown") {
        this.setState({
          position_y: Math.max(Math.min(this.state.position_y + change, 800 - this.state.height), 0)
        });
        event.preventDefault();
      }
      if (event.key == "ArrowLeft") {
        this.setState({
          position_x: Math.max(Math.min(this.state.position_x - change, 800 - this.state.width), 0)
        });
        event.preventDefault();
      } else if (event.key == "ArrowRight") {
        this.setState({
          position_x: Math.max(Math.min(this.state.position_x + change, 800 - this.state.width), 0)
        });
        event.preventDefault();
      }
    }
  }

  draggedCircle = d => {
    let diffX = d3.event.dx;
    let diffY = d3.event.dy;
    this.setState({
      width: Math.max(Math.min(this.state.width + diffX, 800), 0),
      height: Math.max(Math.min(this.state.height + diffY, 800), 0)
    });
  }

  draggedBox = d => {
    let diffX = d3.event.dx;
    let diffY = d3.event.dy;
    this.setState({
      position_y: Math.max(Math.min(this.state.position_y + diffY, 800 - this.state.height), 0),
      position_x: Math.max(Math.min(this.state.position_x + diffX, 800 - this.state.width), 0)
    });
  }

  render = () => {
    return (
      <g className="location-box" id={`location-box-${this.props.location.id}`}>
        <image x={this.state.position_x} y={this.state.position_y} width={this.state.width} xlinkHref={this.props.location.icon_url}></image>
        <rect className="bounding-box edit" data-name={this.props.location.name} height={this.state.height + "px"} width={this.state.width + "px"} x={this.state.position_x + "px"} y={this.state.position_y} />
        <circle className="drag-circle" r="8px" cx={this.state.position_x + this.state.width + "px"} cy={this.state.position_y + this.state.height + "px"} />
        <a href={this.props.location.admin_url} target='_blank'>
          <circle className="link-circle" r="8px" cx={this.state.position_x + "px"} cy={this.state.position_y + "px"}/>
          <text x={(this.state.position_x - 3) + "px"} y={(this.state.position_y + 4) + "px"} fontSize="0.75rem" fill="#fff">?</text>
        </a>
      </g>
    )
  }
}

export default LocationBox;
