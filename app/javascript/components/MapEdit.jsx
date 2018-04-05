import React from 'react'
import ReactDom from 'react-dom'
import PropTypes from 'prop-types'
import JQuery from 'jquery'
import LocationBox from './LocationBox/LocationBox';
require('d3');

class EditMap extends React.Component {
  static propTypes = {
    current_selected_floor: PropTypes.string,
    editLocationHandler: PropTypes.func,
    id: PropTypes.string,
    locations: PropTypes.array,
    mapUrl: PropTypes.string,
    successNotificationHandler: PropTypes.func,
    map_marker_path: PropTypes.string
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
      locations: this.props.locations.filter(l => l.floor_id == this.props.id),
      locationsBoxes: this.props.locations.map(l => l.floor_id == this.props.id ? this.locationBox(l) : null)
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
      locations: nextProps.locations.filter(l => l.floor_id == nextProps.id),
      locationsBoxes: nextProps.locations.map(l => l.floor_id == nextProps.id ? this.locationBox(l) : null)
    })
  }

  componentDidMount = () => {
    this.renderSvg(this.props.mapUrl);
  }

  locationBox = l => {
    return (<LocationBox key={`${l.id}`}
                         deleteLocationHandler={this.props.deleteLocationHandler}
                         edit_mode={true}
                         editLocationHandler={this.props.editLocationHandler}
                         location={l}
                         successNotificationHandler ={this.props.successNotificationHandler}
                         map_marker_path={this.props.map_marker_path} />);
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
      .attr('x', d.x = d3.event.x)
      .attr('y', d.y = d3.event.y);
  }

  renderSvg = (mapUrl) => {
    let svgContainer = d3.select('.svgContainer');
    if (d3.select('.map_image')) {
      d3.select('.map_image').remove();
    }

    svgContainer.append('svg:image')
      .attr('class', 'map_image')
      .attr('xlink:href', mapUrl)
      .attr('x', 0)
      .attr('y', 0)
      .attr('height', '100%')
      .attr('width', '100%')
      .lower();
  }

  render() {
    return (
      <svg width='100%' viewBox='0 0 800 650' className='svgContainer map' id={`floor-${this.props.current_selected_floor}-svg`}>
        {this.state.locationsBoxes}
      </svg>
    );
  }
}

export default EditMap;
