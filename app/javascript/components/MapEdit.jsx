import React from "react"
import ReactDom from "react-dom"
import PropTypes from "prop-types"
import JQuery from "jquery"
require('d3');

class EditMap extends React.Component {
  static propTypes = {
    bounding_box_height: PropTypes.number,
    bounding_box_width: PropTypes.number,
    bounding_box_x: PropTypes.number,
    bounding_box_y: PropTypes.number,
    gridSize: PropTypes.number,
    id: PropTypes.string
  }
  static defaultProps = {
    bounding_box_height: 500,
    bounding_box_width: 700,
    bounding_box_x: 0,
    bounding_box_y: 0,
    grid_size: 10,
    id: null
  }
  constructor(props) {
    super(props);
    this.state = {
      bounding_box_height: this.props.bounding_box_height,
      bounding_box_width: this.props.bounding_box_width,
      bounding_box_x: this.props.bounding_box_x,
      bounding_box_y: this.props.bounding_box_y,
      grid_size: this.props.grid_size
    }
  }
  updateGridSize = event => {
    this.setState({
      grid_size: event.target.value
    });
  }

  componentDidMount() {
    document.getElementById(`${this.props.id}-slider`).value = parseInt(this.state.gridSize);
    document.getElementById(`${this.props.id}-slider`)
      .addEventListener('input', this.updateGridSize);
    $(`#${this.props.id}-save-btn`).on('click', this.saveFloor);
    d3.select('body').select(`#${this.props.id}-drag-circle`)
      .raise()
      .call(d3.drag()
        .on('drag', this.draggedCircle));
    d3.select('body').select(`#${this.props.id}-bounding-box`)
      .call(d3.drag()
        .on('drag', this.draggedBox))
  }

  // the following two functions use d3 helpers & are more concise/readable than just using jquery
  draggedCircle = d => {
    let diffX = d3.event.dx;
    let diffY = d3.event.dy;
    this.setState({
      bounding_box_width: Math.max(Math.min(this.state.bounding_box_width + diffX, 700), 0),
      bounding_box_height: Math.max(Math.min(this.state.bounding_box_height + diffY, 500), 0)
    });
  }

  draggedBox = d => {
    let diffX = d3.event.dx;
    let diffY = d3.event.dy;
    this.setState({
      bounding_box_y: Math.max(Math.min(this.state.bounding_box_y + diffY, 500 - this.state.bounding_box_height), 0),
      bounding_box_x: Math.max(Math.min(this.state.bounding_box_x + diffX, 700 - this.state.bounding_box_width), 0)
    });
  }

  saveFloor = (event) => {
    console.log("clicked");
    let id = this.props.id.split('-').pop();
    let token = $('meta[name="csrf-token"]').attr('content');
    $.ajax({
      url: `floors/${id}`,
      type: 'patch',
      accept: 'json',
      beforeSend: (xhr) => {
        xhr.setRequestHeader('X-CSRF-Token', token);
      },
      data: {
        "floor": {
          id: id,
          bounding_box_height: this.state.bounding_box_height,
          bounding_box_width: this.state.bounding_box_width,
          bounding_box_x: this.state.bounding_box_x,
          bounding_box_y: this.state.bounding_box_y,
          grid_size: this.state.grid_size
        }
      }
    })
  }

  render() {
    return (
      <div className='map' >
        <div className="row">
          <div className="col">
            <svg height="500px" width="700px" id={`${this.props.id}-floor-svg`}>
              <pattern id="grid" width={this.state.grid_size + "px"} height={this.state.grid_size + "px"} patternUnits="userSpaceOnUse">
                <path d="M 100 0 L 0 0 0 100" fill="none" stroke="gray" strokeWidth="1" />
              </pattern>
              <rect id={`${this.props.id}-bounding-box`} className="bounding-box" x={this.state.bounding_box_x + "px"} y={this.state.bounding_box_y + "px"} width={this.state.bounding_box_width + "px"} height={this.state.bounding_box_height + "px"} fill="url(#grid)" stroke="black" />
              <circle id={`${this.props.id}-drag-circle`} className="drag-circle" r="10px" cx={this.state.bounding_box_x + this.state.bounding_box_width + "px"} cy={this.state.bounding_box_y + this.state.bounding_box_height + "px"} >
                {/* <i className='fa fa-arrows-v text-white' /> */}
                <text>BLAH</text>
              </circle>
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
      </div>);
  }
}

export default EditMap