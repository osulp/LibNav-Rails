import React from "react"
import ReactDom from "react-dom"
import PropTypes from "prop-types"
import JQuery from "jquery"
import LocationBox from "./LocationBox";
require('d3');

class EditMap extends React.Component {
  static propTypes = {
    // bounding_box_height: PropTypes.number,
    // bounding_box_width: PropTypes.number,
    // bounding_box_x: PropTypes.number,
    // bounding_box_y: PropTypes.number,
    // gridSize: PropTypes.number,
    id: PropTypes.string,
    locations: PropTypes.array
  }
  static defaultProps = {
    bounding_box_height: 800,
    bounding_box_width: 800,
    bounding_box_x: 0,
    bounding_box_y: 0,
    grid_size: 10,
    locations: [],
    id: null
  }
  constructor(props) {
    super(props);
    this.state = {
      locations: this.props.locations,
      locationsBoxes: this.props.locations.map((location => <LocationBox key={location.id} position_x={location.position_x} position_y={location.position_y} width={location.width} height={location.height} id={location.id} />))
    }
    console.log(this.state.locationsBoxes);
  }
  updateGridSize = event => {
    this.setState({
      grid_size: event.target.value
    });
  }

  componentDidMount = () => {
    document.getElementById(`${this.props.id}-slider`).value = parseInt(this.state.gridSize);
    document.getElementById(`${this.props.id}-slider`)
      .addEventListener('input', this.updateGridSize);
    $(`#${this.props.id}-save-btn`).on('click', (event) => {
      this.saveFloor(event);
    });
  }

  // the following two functions use d3 helpers & are more concise/readable than just using jquery
  draggedCircle = d => {
    let diffX = d3.event.dx;
    let diffY = d3.event.dy;
    console.log('dragging circle');
    this.setState({
      bounding_box_width: Math.max(Math.min(this.state.bounding_box_width + diffX, 800), 0),
      bounding_box_height: Math.max(Math.min(this.state.bounding_box_height + diffY, 800), 0)
    });
  }

  draggedBox(d) {
    // console.log('dragging');
    // let diffX = d3.event.dx;
    // let diffY = d3.event.dy;
    // this.setState({
    //   bounding_box_y: Math.max(Math.min(this.state.bounding_box_y + diffY, 800 - this.state.bounding_box_height), 0),
    //   bounding_box_x: Math.max(Math.min(this.state.bounding_box_x + diffX, 800 - this.state.bounding_box_width), 0)
    // });
    d3.select(this)
      .attr("x", d.x = d3.event.x)
      .attr("y", d.y = d3.event.y);
  }

  saveFloor = (event) => {
    console.log("clicked");
    let floorId = this.props.id.split('-').pop();
    let token = $('meta[name="csrf-token"]').attr('content');
    let locations_attributes = []
    Object.keys(this.state.locations).forEach((key) => {
      let id = this.state.locations[key].id
      let group = $(`#location-box-${id}`)
      let new_attributes = {};
      new_attributes.id = id;
      new_attributes.height = parseInt(group.find('rect').attr('height'));
      new_attributes.width = parseInt(group.find('rect').attr('width'));
      new_attributes.position_x = parseInt(group.find('rect').attr('x'));
      new_attributes.position_y = parseInt(group.find('rect').attr('y'));
      locations_attributes.push(new_attributes);
    })
    // let locations_attributes = {}
    // Object.keys(this.state.locations).forEach((key, index) => {
    //   let id = this.state.locations[key].id
    //   let group = $(`#location-box-${id}`)
    //   locations_attributes[index] = {};
    //   locations_attributes[index].floor_id = floorId;
    //   locations_attributes[index].id = id;
    //   locations_attributes[index].height = parseInt(group.find('rect').attr('height'));
    //   locations_attributes[index].width = parseInt(group.find('rect').attr('width'));
    //   locations_attributes[index].position_x = parseInt(group.find('rect').attr('x'));
    //   locations_attributes[index].position_y = parseInt(group.find('rect').attr('y'));
    //   // locations_attributes[index]._destroy = false;
    // })
    console.log(locations_attributes);
    let foo = null;
    $.ajax({
      url: `floors/${floorId}.json`,
      type: 'patch',
      // contentType: 'application/json',
      beforeSend: (xhr) => {
        xhr.setRequestHeader('X-CSRF-Token', token);
      },
      data: {
        floor: {
          // id: floorId,
          name: "Second Floor",
          locations_attributes: locations_attributes
        }
      }
    })
  }

  render() {
    return (
      <div className='map' >
        <div className="row">
          <div className="col">
            <svg height="800px" width="800px" id={`${this.props.id}-svg`}>
              {/* <pattern id="grid" width={this.state.grid_size + "px"} height={this.state.grid_size + "px"} patternUnits="userSpaceOnUse">
                <path d="M 100 0 L 0 0 0 100" fill="none" stroke="gray" strokeWidth="1" />
              </pattern>
              <rect id={`${this.props.id}-bounding-box`} className="bounding-box" x={this.state.bounding_box_x + "px"} y={this.state.bounding_box_y + "px"} width={this.state.bounding_box_width + "px"} height={this.state.bounding_box_height + "px"} fill="url(#grid)" stroke="black" />
              <circle id={`${this.props.id}-drag-circle`} className="drag-circle" r="10px" cx={this.state.bounding_box_x + this.state.bounding_box_width + "px"} cy={this.state.bounding_box_y + this.state.bounding_box_height + "px"} >
              <text>BLAH</text>
              </circle> */}
              {
                // this.props.locations.map((location) => {
                //   <LocationBox position_x={location.position_x} position_y={location.position_y} width={location.width} height={location.height} id={location.id} />
                // })
                this.state.locationsBoxes
              }
            </svg>
          </div>
        </div>
        <div className="row">
          <div className="col">
            <form className="form-inline">
              <div className="form-group">
                <label htmlFor={`${this.props.id}-slider`}>Grid Size:</label>
                <input type="range" min="5" max="50" id={`${this.props.id}-slider`} />
              </div>
            </form>
          </div>
          <div className="col">
            <button className="btn btn-primary" id={`${this.props.id}-save-btn`}>
              Save
            </button>
          </div>
        </div>
      </div >);
  }
}

export default EditMap
