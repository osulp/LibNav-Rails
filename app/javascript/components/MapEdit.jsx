import React from "react"
import ReactDom from "react-dom"
import PropTypes from "prop-types"
import JQuery from "jquery"
import LocationBox from "./LocationBox";
require('d3');

class EditMap extends React.Component {
  static propTypes = {
    mapUrl: PropTypes.string,
    id: PropTypes.string,
    current_selected_floor: PropTypes.string,
    locations: PropTypes.array
  }
  static defaultProps = {
    bounding_box_height: 650,
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
      locations: this.props.locations.filter(location => location.floor_id == this.props.id),
      locationsBoxes: this.props.locations.map((location => location.floor_id == this.props.id ? this.locationBox(location) : null))
    }
  }
  updateGridSize = event => {
    this.setState({
      grid_size: event.target.value
    });
  }

  componentWillReceiveProps = (nextProps) => {
    this.renderSvg(nextProps.mapUrl);
    this.setState({
      locations: nextProps.locations.filter(location => location.floor_id == nextProps.id),
      locationsBoxes: nextProps.locations.map((location => location.floor_id == nextProps.id ? this.locationBox(location) : null))
    })
  }
  componentDidMount = () => {
    this.renderSvg(this.props.mapUrl);
    $(`#floor-${this.props.current_selected_floor}-save-btn`).on('click', this.saveFloor);
  }

  locationBox = l => {
    return (<LocationBox key={l.id} location={l} />);
  }

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
    d3.select(this)
      .attr("x", d.x = d3.event.x)
      .attr("y", d.y = d3.event.y);
  }

  saveFloor = (event) => {
    console.log("clicked save");
    let floorId = this.props.id;
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
    });
    console.log("saving location attributes: ", locations_attributes);
    $.ajax({
      url: `floors/${floorId}.json`,
      type: 'patch',
      beforeSend: (xhr) => {
        xhr.setRequestHeader('X-CSRF-Token', token);
      },
      data: {
        floor: {
          locations_attributes: locations_attributes
        }
      }
    });
  }

  renderSvg = (mapUrl) => {
    let svgContainer = d3.select(".svgContainer");
    if (d3.select('.map_image')) {
      d3.select('.map_image').remove();
    }

    svgContainer.append('svg:image')
      .attr("class", "map_image")
      .attr("xlink:href", mapUrl)
      .attr("x", 0)
      .attr("y", 0)
      .attr("width", '100%')
      .lower();
  }

  render() {
    return (
      <svg width="100%" viewBox="0 0 800 650" className="svgContainer" id={`floor-${this.props.current_selected_floor}-svg`}>
        {this.state.locationsBoxes}
      </svg>
    );
  }
}

export default EditMap
