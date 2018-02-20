import React from "react"
import PropTypes from "prop-types"
class PolygonPoint extends React.Component {
  static PropTypes = {
    index: PropTypes.number,
    location: PropTypes.arrayOf(PropTypes.number),
    location_id: PropTypes.number,
    radius: PropTypes.number,
    closePolygonHandler: PropTypes.func.optional,
    draggedPolygonPointHandler: PropTypes.func
  }

  constructor(props) {
    super(props);
    this.state = {
      location_id: props.location_id,
      polygon_point_id: `polygon_point_${props.location_id}_${props.index}`
    }
  }

  componentWillReceiveProps = (nextProps) => {
    this.setState({
      location_id: nextProps.location_id,
      polygon_point_id: `polygon_point_${nextProps.location_id}_${nextProps.index}`
    });
  }

  componentDidMount = () => this.bindDragEvent();
  componentDidUpdate = () => this.bindDragEvent();

  bindDragEvent = () => {
    let self = this;
    d3.select(`#${this.state.polygon_point_id}`).call(d3.drag().on('drag', function() {
      self.props.draggedPolygonPointHandler(this, self.props.index);
    }));
  }

  render() {
    return(<circle className='polygon-point'
                   cx={this.props.location[0]}
                   cy={this.props.location[1]}
                   key={this.state.polygon_point_id}
                   id={this.state.polygon_point_id}
                   r={`${this.props.radius}px`}
                   onClick={this.props.closePolygonHandler} />);
  }
}
export default PolygonPoint;
