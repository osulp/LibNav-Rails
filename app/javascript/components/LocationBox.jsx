import React from "react"
import ReactDom from "react-dom"
import PropTypes from "prop-types"
import JQuery from "jquery"
require('d3');

class LocationBox extends React.Component {
  static PropTypes = {
    add_location_url: PropTypes.string.optional,
    floor_id: PropTypes.string.optional
  }

  static defaultProps = {
    admin_url: null,
    add_location_url: null,
    floor_id: null,
    height: 50,
    icon_url: null,
    id: null,
    new_location: false,
    position_x: 0,
    position_y: 0,
    width: 50
  }

  constructor(props) {
    super(props);
    this.state = {
      admin_url: this.props.admin_url,
      height: this.props.height,
      name: this.props.name,
      new_location: this.props.new_location,
      position_x: this.props.position_x,
      position_y: this.props.position_y,
      width: this.props.width
    }
  }

  componentDidMount = () => {
    this.baseElement = d3.select(`#location-box-${this.props.id}`);
    $(`#location-box-${this.props.id}`).find('.bounding-box').on('mousedown', (event) => {
      $(`#location-box-${this.props.id}`).find('.bounding-box').tooltip('hide')
    });
    $(`#location-box-${this.props.id}`).find('.bounding-box').on('keydown', this.handleKeyPress);
    d3.select(`#location-box-${this.props.id}`)
      .select('rect')
      .call(d3.drag().on('drag', this.draggedBox));
    d3.select(`#location-box-${this.props.id}`)
      .select('circle')
      .call(d3.drag().on('drag', this.draggedCircle));
    let box = $(`#location-box-${this.props.id}`).find('.bounding-box');
    box.tooltip({ title: this.props.name });
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

  saveLocation = (e) => {
    e.preventDefault();
    let locations = [{
      height: this.state.height,
      name: this.state.name,
      position_x: this.state.position_x,
      position_y: this.state.position_y,
      width: this.state.width
    }];

    let add_location_url = this.props.add_location_url.replace('FLOORID', this.props.floor_id);
    console.log('post locations', locations, add_location_url);

    let token = $('meta[name="csrf-token"]').attr('content');
    $.ajax({
      url: add_location_url,
      type: 'post',
      beforeSend: (xhr) => {
        xhr.setRequestHeader('X-CSRF-Token', token);
      },
      data: {
        floor: {
          locations_attributes: locations
        }
      }
    }).done((data, status, xhr) => {
      console.log(data, status, xhr);
      this.setState({
        admin_url: data[0].admin_url,
        new_location: false
      });
    }).fail((xhr, status, error) => {
      console.log('failed', xhr, status, error);
    });
  }

  saveButton = () => {
    return(
      <a href='#' target='_blank' onClick={this.saveLocation} >
        <circle className="link-circle save-location" r="8px" cx={this.state.position_x + "px"} cy={this.state.position_y + "px"}/>
        <text x={(this.state.position_x - 3) + "px"} y={(this.state.position_y + 4) + "px"} fontSize="0.75rem" fill="#fff">*</text>
      </a>
    );
  }

  adminButton = () => {
    if(this.state.admin_url === null) {
      return;
    }
    return(
      <a href={this.state.admin_url} target='_blank'>
        <circle className="link-circle" r="8px" cx={this.state.position_x + "px"} cy={this.state.position_y + "px"}/>
        <text x={(this.state.position_x - 3) + "px"} y={(this.state.position_y + 4) + "px"} fontSize="0.75rem" fill="#fff">?</text>
      </a>
    );
  }

  render = () => {
    return (
      <g className={`location-box ${this.state.new_location ? 'location-box-new' : ''}`} id={`location-box-${this.props.id}`}>
        <image x={this.state.position_x} y={this.state.position_y} width={this.state.width} xlinkHref={this.props.icon_url}></image>
        <rect className="bounding-box edit" data-name={this.props.name} height={this.state.height + "px"} width={this.state.width + "px"} x={this.state.position_x + "px"} y={this.state.position_y} />
        <circle className="drag-circle" r="8px" cx={this.state.position_x + this.state.width + "px"} cy={this.state.position_y + this.state.height + "px"} />
        { this.state.new_location ? this.saveButton() : this.adminButton() }
      </g>
    )
  }
}

export default LocationBox;
