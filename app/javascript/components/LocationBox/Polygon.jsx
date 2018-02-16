import React from "react"
import PropTypes from "prop-types"
import PolygonLine from './PolygonLine';
import PolygonPoint from './PolygonPoint';
import Location from '../Location';

class Polygon extends React.Component {
  static PropTypes = {
    draggedPolygonPointHandler: PropTypes.func,
    box_height: PropTypes.number,
    box_position_x: PropTypes.number,
    box_position_y: PropTypes.number,
    box_width: PropTypes.number,
    location_id: PropTypes.number,
    points: PropTypes.string,
    setStateWithChangesHandler: PropTypes.func
  }

  static defaultProps = {
    location_id: 0,
    points: '',
    polygonClosed: false
  }

  constructor(props) {
    super(props);
    let points = Location.deserializedPolygonPoints(this.props.points);
    this.state = {
      box_height: props.box_height,
      box_position_x: props.box_position_x,
      box_position_y: props.box_position_y,
      box_width: props.box_width,
      location_id: props.location_id,
      points: points,
      polygonClosed: props.polygonClosed
    }
  }

  componentWillReceiveProps = (nextProps) => {
    let points = Location.deserializedPolygonPoints(nextProps.points);
    this.setState({
      box_height: nextProps.box_height,
      box_position_x: nextProps.box_position_x,
      box_position_y: nextProps.box_position_y,
      box_width: nextProps.box_width,
      location_id: nextProps.location_id,
      points: points,
      polygonClosed: nextProps.polygonClosed
    });
  }

  closePolygon = () => {
    this.props.setStateWithChangesHandler({
      hasChanges: true,
      polygonClosed: true
    });
  }

  createPolygonPoint = (p, i) => {
    let has_multiple_points = this.state.points.length >= 3;
    let is_first_point = this.state.points[0] == p;
    let closePolygonHandler = (has_multiple_points && is_first_point && !this.state.polygonClosed ? this.closePolygon : null);
    return(<PolygonPoint key={p.join(':')}
                         index={i}
                         location={p}
                         location_id={this.state.location_id}
                         radius={5}
                         closePolygonHandler={closePolygonHandler}
                         draggedPolygonPointHandler={this.draggedPolygonPoint} />);
  }

  createPolygonLine = (link) => {
    return(<PolygonLine key={link.from.join(':')} from={link.from} to={link.to} />);
  }

  draggedPolygonPoint = (element, index) => {
    let diffX = d3.event.dx;
    let diffY = d3.event.dy;
    let points = this.state.points;
    let point = points[index];
    let box_max_x = this.getInt(this.state.box_position_x + this.state.box_width);
    let box_max_y = this.getInt(this.state.box_position_y + this.state.box_height);
    let point_new_x = this.getInt(point[0] + diffX);
    let point_new_y = this.getInt(point[1] + diffY);
    if((point_new_x - 8) > this.state.box_position_x &&
       (point_new_x + 8) < box_max_x &&
       (point_new_y - 8) > this.state.box_position_y &&
       (point_new_y + 8) < box_max_y) {
      point[0] = point_new_x;
      point[1] = point_new_y;
      points[index] = point;
      this.props.draggedPolygonPointHandler(points.join(' '));
    }
  }

  getInt = (i) => {
    return parseInt(i.toFixed(0));
  }

  linkPolygonPoints = (points, close_polygon) => {
    let links = [];
    for(const [index, element] of points.entries()){
      if(index > 0) {
        links.push({ from: points[index-1], to: points[index] });
      }
    }
    if(this.state.polygonClosed || close_polygon){
      // close the polygon lines
      links.push({ from: points[points.length - 1], to: points[0] });
    }
    return links.map(link => this.createPolygonLine(link));
  }

  render() {
    if(!this.state.points.length) {
      return null;
    }
    return(
      <g>
        { this.linkPolygonPoints(this.state.points, this.state.polygonClosed) }
        { this.state.points.map((p, i) => this.createPolygonPoint(p, i)) }
      </g>
    );
  }
}
export default Polygon;
