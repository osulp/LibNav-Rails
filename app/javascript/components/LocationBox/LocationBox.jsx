import update from 'immutability-helper';
import React from "react"
import ReactDom from "react-dom"
import PropTypes from "prop-types"
import JQuery from "jquery"
import ActionButton from './ActionButton';
import Polygon from './Polygon';
import Location from '../Location';
import SavingIndicator from './SavingIndicator';
require('d3');

class LocationBox extends React.Component {
  static PropTypes = {
    deleteLocationHandler: PropTypes.func.optional,
    edit_mode: PropTypes.bool.optional,
    editLocationHandler: PropTypes.func.optional,
    highlight: PropTypes.bool.optional,
    location: PropTypes.object,
    successNotificationHandler: PropTypes.bool.func
  }

  static defaultProps = {
    edit_mode: false,
    highlight: false
  }

  constructor(props) {
    super(props);
    this.state = {
      csrf: $('meta[name="csrf-token"]').attr('content'),
      box_selector: `#location-box-${this.props.location.internal_id}`,
      edit_mode: this.props.edit_mode,
      highlight: this.props.highlight,
      location: this.props.location,
      map_height: 650,
      map_width: 800
    }
  }

  componentDidMount = () => {
    if(this.state.edit_mode) {
      // Tooltip visibility
      $(this.state.box_selector).find('.bounding-box').on('mousedown', (event) => { $(this.state.box_selector).find('.bounding-box').tooltip('hide') });
      $(this.state.box_selector).find('.bounding-box').tooltip({ title: this.props.location.name }).attr('tabindex', '0');

      // Provide keyboard positioning with arrows, ctrl, and shift for fine tuning location position
      $(this.state.box_selector).find('.bounding-box').on('keydown', this.handleKeyPress);

      // Bind D3 drag events
      d3.select(this.state.box_selector).select('rect.bounding-box').call(d3.drag().on('drag', this.draggedBox)
                                                                                   .on('end', this.droppedBox));
      d3.select(this.state.box_selector).select('circle.drag-circle').call(d3.drag().on('drag', this.draggedCircle));
      d3.select(this.state.box_selector).select('.box-content').select('.label').call(d3.drag().on('drag', this.draggedText));

      // Bind D3 click event without ES6 helping to bind 'this' breakage
      let self = this;
      d3.select(this.state.box_selector).select('rect.bounding-box').on('click', function(d) { self.clickedBox(this); });

      let text = $(this.state.box_selector).find('.label');
      let icon = $(this.state.box_selector).find('.icon');
      let updated_location = Object.assign(this.state.location, { text_height: text[0].getBBox().height, text_width: text[0].getBBox().width, icon_height: icon[0].getBBox().height, icon_width: icon[0].getBBox().width });
      this.setState({
        location: update(this.state.location, { $set: updated_location })
      });
    }
  }

  componentDidUpdate = () => {
    d3.select(this.state.box_selector).select('.box-content').select('.label').call(d3.drag().on('drag', this.draggedText));
    d3.select(this.state.box_selector).select('.box-content').select('.icon').call(d3.drag().on('drag', this.draggedIcon));
  }

  componentWillReceiveProps = (nextProps) => {
    this.setState({
      location: update(this.state.location, { $set: nextProps.location })
    });
  }

  // Allow for keyboard movement of the location box
  handleKeyPress = (event) => {
    let change = 10;
    if (event.shiftKey) {
      change = 1;
    }
    switch(event.key) {
      case 'ArrowUp':
        this.setStateWithChanges({ hasChanges: true, position_y: this.getNewPosition(this.state.location.position_y, (change * -1), this.state.location.height, this.stat.locatione.map_height)});
        break;
      case 'ArrowDown':
        this.setStateWithChanges({ hasChanges: true, position_y: this.getNewPosition(this.state.location.position_y, change, this.state.location.height, this.state.location.map_height)});
        break;
      case 'ArrowLeft':
        this.setStateWithChanges({ hasChanges: true, position_x: this.getNewPosition(this.state.location.position_x, (change * -1), this.state.location.width, this.state.location.map_width)});
        break;
      case 'ArrowRight':
        this.setStateWithChanges({ hasChanges: true, position_x: this.getNewPosition(this.state.location.position_x, change, this.state.location.width, this.state.location.map_width)});
        break;
    }
  }

  getNewPosition = (px, offset, boundary, map_edge_max) => {
    return this.getInt(Math.max(Math.min(px + offset, map_edge_max - boundary), 0));
  }

  getInt = (i) => {
    return parseInt(i.toFixed(0));
  }

  /*
   * When resizing the location box, keep the label within the boundaries of the location box. Have to determine
   * the 4 edges of both the location box and the label to reposition the label when the location box is being dragged.
   * Prevent the location from being smaller than the size of the label.
   */
  draggedCircle = d => {
    let diffX = d3.event.dx;
    let diffY = d3.event.dy;
    let box_width = this.getInt(this.state.location.width + diffX);
    let box_height = this.getInt(this.state.location.height + diffY);
    let box_max_x = this.getInt(this.state.location.position_x + box_width);
    let box_max_y = this.getInt(this.state.location.position_y + box_height);
    let text_max_x = this.getInt(this.state.location.text_position_x + this.state.location.text_width);
    let text_max_y = this.getInt(this.state.location.text_position_y);
    let text_min_x = this.getInt(this.state.location.text_position_x);
    let text_min_y = this.getInt(this.state.location.text_position_y - this.state.location.text_height);
    let icon_max_x = this.getInt(this.state.location.icon_position_x + this.state.location.icon_width);
    let icon_max_y = this.getInt(this.state.location.icon_position_y + this.state.location.icon_height);
    let icon_min_x = this.getInt(this.state.location.icon_position_x);
    let icon_min_y = this.getInt(this.state.location.icon_position_y);
    let polygon_max_x = 0;
    let polygon_max_y = 0;
    let points = Location.deserializedPolygonPoints(this.state.location.polygon_points);
    if(points.length > 0) {
      polygon_max_x = this.getInt(Math.max(...points.map(p => p[0])) + 8);
      polygon_max_y = this.getInt(Math.max(...points.map(p => p[1])) + 8);
    }
    let next_state = {};
    //For text limits
    if(box_max_x < text_max_x){
      // box is resizing and pushing text toward the left edge, but not past the left edge (accounting for text_width)
      next_state = Object.assign(next_state, { hasChanges: true, text_position_x: box_max_x <= this.state.location.position_x + this.state.location.text_width ? this.state.location.position_x : box_max_x - this.state.location.text_width });
    }
    if(box_max_y < text_max_y){
      // box is resizing and pushing text toward the top edge, but not past the top edge (accounting for the text_height)
      next_state = Object.assign(next_state, { hasChanges: true, text_position_y: box_max_y <= this.state.location.position_y + this.state.location.text_height ? this.state.location.position_y + this.state.location.text_height : box_max_y });
    }
    if(box_width > this.state.location.text_width && box_max_x > polygon_max_x) {
      // the box shouldn't be narrower than the width of the text
      next_state = Object.assign(next_state, { hasChanges: true, width: this.getInt(Math.max(Math.min(box_width, 800), 0)), });
    } else if(box_width <= this.state.location.text_width && box_max_x <= text_max_x) {
      // force the box to be at least as wide as the text
      next_state = Object.assign(next_state, { hasChanges: true, width: this.state.location.text_width });
    }
    if(box_height > this.state.location.text_height && box_max_y > polygon_max_y) {
      // the box shouldn't be shorter than the height of the text
      next_state = Object.assign(next_state, { hasChanges: true, height: this.getInt(Math.max(Math.min(box_height, 800), 0)), });
    } else if(box_height <= this.state.location.text_height && box_max_y <= text_max_y) {
      // force the box to be at least as tall as the text
      next_state = Object.assign(next_state, { hasChanges: true, height: this.state.location.text_height });
    }

    //for icon limit it is the same as the above
    if(box_max_x < icon_max_x){
      next_state = Object.assign(next_state, { hasChanges: true, icon_position_x: box_max_x <= this.state.location.position_x + this.state.location.icon_width ? this.state.location.position_x : box_max_x - this.state.location.icon_width });
    }
    if(box_max_y < icon_max_y){
      next_state = Object.assign(next_state, { hasChanges: true, icon_position_y: box_max_y <= this.state.location.position_y + this.state.location.icon_height ? this.state.location.position_y : box_max_y - this.state.location.icon_height });
    }
    if(box_width > this.state.location.icon_width && box_max_x > polygon_max_x) {
      next_state = Object.assign(next_state, { hasChanges: true, width: this.getInt(Math.max(Math.min(box_width, 800), 0)), });
    } else if(box_width <= this.state.location.icon_width && box_max_x <= icon_max_x) {
      next_state = Object.assign(next_state, { hasChanges: true, width: this.state.location.icon_width });
    }
    if(box_height > this.state.location.icon_height && box_max_y > polygon_max_y) {
      next_state = Object.assign(next_state, { hasChanges: true, height: this.getInt(Math.max(Math.min(box_height, 800), 0)), });
    } else if(box_height <= this.state.location.icon_height && box_max_y <= icon_max_y) {
      next_state = Object.assign(next_state, { hasChanges: true, height: this.state.location.icon_height });
    }

    this.setStateWithChanges(next_state);
  }

  draggedBox = d => {
    let diffX = d3.event.dx;
    let diffY = d3.event.dy;
    let new_x = this.getNewPosition(this.state.location.position_x, diffX, this.state.location.width, this.state.map_width);
    let new_y = this.getNewPosition(this.state.location.position_y, diffY, this.state.location.height, this.state.map_height);
    let new_state = {
      hasChanges: true,
      isDragging: true,
      position_y: new_y,
      position_x: new_x
    };

    if(!this.state.location.isDragging) {
      new_state.previous_position_x = this.state.location.position_x;
      new_state.previous_position_y = this.state.location.position_y;
    }
    this.setStateWithChanges(new_state);
  }

  droppedBox = d => {
    if(this.state.location.isDragging) {
      let location = this.state.location;
      let diffX = location.position_x - location.previous_position_x;
      let diffY = location.position_y - location.previous_position_y;
      let points = Location.movePolygonPoints(diffX, diffY, location.polygon_points);
      this.setStateWithChanges({
        hasChanges: true,
        isDragging: false,
        polygon_points: points,
        text_position_x: location.text_position_x + diffX,
        text_position_y: location.text_position_y + diffY,
        icon_position_x: location.icon_position_x + diffX,
        icon_position_y: location.icon_position_y + diffY
      });
    }
  }

  draggedPolygonPoint = (points) => {
    this.setStateWithChanges({
      hasChanges: true,
      polygon_points: points
    });
  }

  /*
   * Keep label text coordinates within the bounding-box that it is located in.
   * Bounding box x,y relative to upper left corner of the element.
   * Label box x,y relative to lower left corner of the element. (Text baseline)
   */
  draggedText = d => {
    // Add the diff pixels to the current location to get the proposed new location
    let py = this.getInt(this.state.location.text_position_y + d3.event.dy);
    let px = this.getInt(this.state.location.text_position_x + d3.event.dx);

    let next_state = {};
    // Label Y coordinate has to account for the text_height at the top edge, and the bounding-box height at the bottom edge
    // Top edge has an 8px hack included because SVG text wants to render a little extra space at the top edge for readability
    if(py > this.getInt(this.state.location.position_y + (this.state.location.text_height - 8)) && py < this.getInt(this.state.location.position_y + this.state.location.height)){
      next_state = Object.assign(next_state, { hasChanges: true, text_position_y: py });
    }
    // Label X coordinate shares the same left edge, but needs to account for the text width on the right edge
    if(px > this.state.location.position_x && px < this.getInt(this.state.location.position_x + this.state.location.width - this.state.location.text_width)){
      next_state = Object.assign(next_state, { hasChanges: true, text_position_x: px });
    }
    this.setStateWithChanges(next_state);
  }

  draggedIcon = d => {
    // Add the diff pixels to the current location to get the proposed new location
    let py = this.getInt(this.state.location.icon_position_y + d3.event.dy);
    let px = this.getInt(this.state.location.icon_position_x + d3.event.dx);

    let next_state = {};
    //New icon position checks to see if it is at the top of the location box
    //and whether or not its at the bottom of the location box minus the height
    //of the icon itself
    if((py > this.getInt(this.state.location.position_y)) && (py < this.getInt(this.state.location.position_y + this.state.location.height - this.state.location.icon_height))){
      next_state = Object.assign(next_state, { hasChanges: true, icon_position_y: py });
    }
    // Icon X coordinate shares the same left edge, but needs to account for the text width on the right edge
    if(px > this.state.location.position_x && px < this.getInt(this.state.location.position_x + this.state.location.width - this.state.location.icon_width)){
      next_state = Object.assign(next_state, { hasChanges: true, icon_position_x: px });
    }
    this.setStateWithChanges(next_state);
  }

  clickedBox = (e) => {
    let location = this.state.location;
    if(location.polygonClosed || !location.isNew) {
      return null;
    }
    let mouse = d3.mouse(e);
    let x = this.getInt(mouse[0]);
    let y = this.getInt(mouse[1]);
    let points = Location.addPolygonPoint(x, y, location.polygon_points);
    this.setStateWithChanges({
      hasChanges: true,
      polygon_points: points
    });
  }

  /*
   * Merge next_state into the current location object and pass that to the edit location handler, this ensures
   * that all of the necessary properties are available for the editLocationHandler to update the application state. (ie. internal_id)
   */
  setStateWithChanges = (next_state) => {
    if(Object.keys(next_state).length) {
      this.props.editLocationHandler({...this.state.location, ...next_state});
    }
  }

  deleteLocation = (e) => {
    e.preventDefault();
    if(!this.state.location.isNew) {
      this.state.location.delete(this.state.csrf, this.props.deleteLocationHandler, this.setStateWithChanges);
    } else {
      this.props.deleteLocationHandler(this.state.location.id);
    }
  }

  saveLocation = (e) => {
    if(e !== null) {
      e.preventDefault();
    }
    this.setState({
      location: update(this.state.location, {
        hasError: { $set: false },
        isSaving: { $set: true }
      })
    });
    let success_callback = (result) => {
      this.props.successNotificationHandler(result.location);
      this.setStateWithChanges(result.next_state);
    }
    this.state.location.save(this.state.csrf, success_callback, this.setStateWithChanges);
  }

  locationBoxStyles = () => {
    let styles = ['location-box'];
    if(this.state.edit_mode) {
      if((this.state.location.isNew && !this.state.location.didSave) || this.state.location.hasChanges) {
        styles.push('location-box-new');
      }
      if(this.state.location.isSaving) {
        styles.push('location-box-saving');
      }
      if(this.state.location.didSave) {
        styles.push('location-box-saved');
      }
      if(this.state.location.hasError) {
        styles.push('location-box-error');
      }
    }
    return styles.join(' ');
  }

  boundingBoxStyles = () => {
    let styles = ['bounding-box'];
    if(this.state.edit_mode) {
      styles.push('edit');
    }
    if(this.state.highlight) {
      styles.push('highlight');
    }
    return styles.join(' ');
  }

  editControls = () => {
    if(this.state.edit_mode) {
      return (
        <g className="edit-controls">
          <circle className="drag-circle" r="8px" cx={this.state.location.position_x + this.state.location.width + "px"} cy={this.state.location.position_y + this.state.location.height + "px"}/>
          <ActionButton key={`action-button-${this.state.location.internal_id}`}
                        admin_url={this.state.location.admin_url}
                        didSave={this.state.location.didSave}
                        hasChanges={this.state.location.hasChanges}
                        hasError={this.state.location.hasError}
                        isSaving={this.state.location.isSaving}
                        new_location={this.state.location.isNew}
                        position_x={this.state.location.position_x}
                        position_y={this.state.location.position_y}
                        saveLocationHandler={this.saveLocation}/>
          <a href={this.props.delete_location_url} onClick={this.deleteLocation} className='material-icons delete-location'>
            <circle className='link-circle delete-location' r="8px" cx={(this.state.location.position_x + this.state.location.width) + "px"} cy={this.state.location.position_y + "px"}/>
            <text x={(this.state.location.position_x + this.state.location.width - 6) + "px"} y={(this.state.location.position_y + 6) + "px"} fontSize="0.75rem" fill="#fff">clear</text>
          </a>
          <SavingIndicator height={this.state.location.height}
                           isSaving={this.state.location.isSaving}
                           position_x={this.state.location.position_x + (this.state.location.width/2)}
                           position_y={this.state.location.position_y + (this.state.location.height/2)}
                           width={this.state.location.width} />
        </g>
      );
    } else {
      return null;
    }
  }

  boxContents = () => {
    if(this.state.location.isDragging) {
      return null;
    }
    return (
      <g className='box-content'>
        <Polygon key={`polygon-${this.state.location.internal_id}`}
                 box_height={this.state.location.height}
                 box_position_x={this.state.location.position_x}
                 box_position_y={this.state.location.position_y}
                 box_width={this.state.location.width}
                 draggedPolygonPointHandler={this.draggedPolygonPoint}
                 edit_mode={this.state.edit_mode}
                 location_id={this.state.location.internal_id}
                 points={this.state.location.polygon_points}
                 polygonClosed={this.state.location.isNew ? this.state.location.polygonClosed : true}
                 setStateWithChangesHandler={this.setStateWithChanges}
                 styles={this.getStyles()} />
        <text className='label'
              fontFamily='-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"'
              fontSize='20px'
              x={this.state.location.text_position_x}
              y={this.state.location.text_position_y}>
          {this.state.location.text}
        </text>
        <image className={`icon ${this.state.location.icon_url != '' ? '' : 'd-none'}`}
               width={this.state.location.icon_width}
               height={this.state.location.icon_height}
               x={this.state.location.icon_position_x}
               xlinkHref={this.props.location.icon_url}
               y={this.state.location.icon_position_y}>
        </image> </g>
    );
  }

  getStyles = () => {
    let styles = { fillShape: {}, polygonSvg: {}};
    if(!this.state.edit_mode) {
      styles = Object.assign(styles, { fillShape: { fill: Location.backgroundColorRGB(this.state.location, this.props.highlight),
                                                    opacity: 0.75 },
                                       polygonSvg: { stroke: 'black', strokeWidth: '1px'}
                                     });
    }
    return styles;
  }

  render = () => {
    return (
      <g className={this.locationBoxStyles()} id={`location-box-${this.state.location.internal_id}`}>
        <rect className={this.boundingBoxStyles()}
              data-name={this.props.location.name}
              height={this.state.location.height + "px"}
              style={this.state.location.polygon_points === '' ? this.getStyles().fillShape : {}}
              width={this.state.location.width + "px"}
              x={this.state.location.position_x + "px"}
              y={this.state.location.position_y} />
        { this.boxContents() }
        { this.editControls() }
      </g>
    )
  }
}

export default LocationBox;
