import React from "react"
import ReactDom from "react-dom"
import PropTypes from "prop-types"
import JQuery from "jquery"
require('d3');

class LocationBox extends React.Component {
  static PropTypes = {
    add_location_url: PropTypes.string.optional,
    delete_location_url: PropTypes.string.optional,
    deleteLocationHandler: PropTypes.func.optional,
    didSave: PropTypes.bool.optional,
    edit_mode: PropTypes.bool.optional,
    editLocationHandler: PropTypes.func.optional,
    floor_id: PropTypes.string.optional,
    highlight: PropTypes.bool.optional,
    isSaving: PropTypes.bool.optional,
    shouldSave: PropTypes.bool.optional
  }

  static defaultProps = {
    admin_url: null,
    add_location_url: null,
    delete_location_url: null,
    didSave: false,
    edit_mode: false,
    floor_id: null,
    hasChanges: false,
    hasError: false,
    height: 50,
    highlight: false,
    isSaving: false,
    icon_url: null,
    id: null,
    new_location: false,
    shouldSave: false,
    position_x: 0,
    position_y: 0,
    text_height: 0,
    text_position_x: 0,
    text_position_y: 0,
    text_width: 0,
    width: 50
  }

  constructor(props) {
    super(props);
    this.state = {
      admin_url: this.props.admin_url,
      edit_mode: this.props.edit_mode,
      hasChanges: this.props.hasChanges,
      height: this.props.height,
      highlight: this.props.highlight,
      id: this.props.id,
      name: this.props.name,
      new_location: this.props.new_location,
      position_x: this.props.position_x,
      position_y: this.props.position_y,
      text_height: this.props.text_height,
      text_position_y: this.props.text_position_y,
      text_position_x: this.props.text_position_x,
      text_width: this.props.text_width,
      width: this.props.width
    }
  }

  componentDidMount = () => {
    if(this.state.edit_mode) {
      let box_selector = `#location-box-${this.props.id}`;

      // Tooltip visibility
      $(box_selector).find('.bounding-box').on('mousedown', (event) => { $(box_selector).find('.bounding-box').tooltip('hide') });
      $(box_selector).find('.bounding-box').tooltip({ title: this.props.name }).attr('tabindex', '0');

      // Provide keyboard positioning with arrows, ctrl, and shift for fine tuning location position
      $(box_selector).find('.bounding-box').on('keydown', this.handleKeyPress);

      // Bind D3 drag events
      d3.select(box_selector).select('rect').call(d3.drag().on('drag', this.draggedBox));
      d3.select(box_selector).select('circle').call(d3.drag().on('drag', this.draggedCircle));
      d3.select(box_selector).select('.label').call(d3.drag().on('drag', this.draggedText));

      let text = $(box_selector).find('.label');
      this.setState({
        text_height: text[0].getBBox().height,
        text_width: text[0].getBBox().width
      });
    }
  }

  componentWillReceiveProps = (nextProps) => {
    if(nextProps.shouldSave && !this.state.isSaving) {
      this.saveLocation(null);
    }
    this.setState({
      hasChanges: nextProps.hasChanges,
      highlight: nextProps.highlight
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
        this.setStateWithChanges({ hasChanges: true, position_y: this.getNewPosition(this.state.position_y, (change * -1), this.state.height)});
        break;
      case 'ArrowDown':
        this.setStateWithChanges({ hasChanges: true, position_y: this.getNewPosition(this.state.position_y, change, this.state.height)});
        break;
      case 'ArrowLeft':
        this.setStateWithChanges({ hasChanges: true, position_x: this.getNewPosition(this.state.position_x, (change * -1), this.state.width)});
        break;
      case 'ArrowRight':
        this.setStateWithChanges({ hasChanges: true, position_x: this.getNewPosition(this.state.position_x, change, this.state.width)});
        break;
    }
  }

  getNewPosition = (px, offset, boundary) => {
    return Math.max(Math.min(px + offset, 800 - boundary), 0);
  }

  /*
   * When resizing the location box, keep the label within the boundaries of the location box. Have to determine
   * the 4 edges of both the location box and the label to reposition the label when the location box is being dragged.
   * Prevent the location from being smaller than the size of the label.
   */
  draggedCircle = d => {
    let diffX = d3.event.dx;
    let diffY = d3.event.dy;
    let box_width = this.state.width + diffX;
    let box_height = this.state.height + diffY;
    let box_max_x = this.state.position_x + box_width;
    let box_max_y = this.state.position_y + box_height;
    let text_max_x = this.state.text_position_x + this.state.text_width;
    let text_max_y = this.state.text_position_y;
    let text_min_x = this.state.text_position_x;
    let text_min_y = this.state.text_position_y - this.state.text_height;
    let next_state = {};
    if(box_max_x < text_max_x){
      // box is resizing and pushing text toward the left edge, but not past the left edge (accounting for text_width)
      next_state = Object.assign(next_state, { hasChanges: true, text_position_x: box_max_x <= this.state.position_x + this.state.text_width ? this.state.position_x : box_max_x - this.state.text_width });
    }
    if(box_max_y < text_max_y){
      // box is resizing and pushing text toward the top edge, but not past the top edge (accounting for the text_height)
      next_state = Object.assign(next_state, { hasChanges: true, text_position_y: box_max_y <= this.state.position_y + this.state.text_height ? this.state.position_y + this.state.text_height : box_max_y });
    }
    if(box_width > this.state.text_width) {
      // the box shouldn't be narrower than the width of the text
      next_state = Object.assign(next_state, { hasChanges: true, width: Math.max(Math.min(box_width, 800), 0), });
    }
    if(box_height > this.state.text_height) {
      // the box shouldn't be shorter than the height of the text
      next_state = Object.assign(next_state, { hasChanges: true, height: Math.max(Math.min(box_height, 800), 0), });
    }
    this.setStateWithChanges(next_state);
  }

  draggedBox = d => {
    let diffX = d3.event.dx;
    let diffY = d3.event.dy;
    this.setStateWithChanges({
      hasChanges: true,
      position_y: this.getNewPosition(this.state.position_y, diffY, this.state.height),
      position_x: this.getNewPosition(this.state.position_x, diffX, this.state.width),
      text_position_x: this.state.text_position_x + diffX,
      text_position_y: this.state.text_position_y + diffY
    });
  }

  /*
   * Keep label text coordinates within the bounding-box that it is located in.
   * Bounding box x,y relative to upper left corner of the element.
   * Label box x,y relative to lower left corner of the element. (Text baseline)
   */
  draggedText = d => {
    // Add the diff pixels to the current location to get the proposed new location
    let py = this.state.text_position_y + d3.event.dy;
    let px = this.state.text_position_x + d3.event.dx;

    let next_state = {};
    // Label Y coordinate has to account for the text_height at the top edge, and the bounding-box height at the bottom edge
    // Top edge has an 8px hack included because SVG text wants to render a little extra space at the top edge for readability
    if(py > (this.state.position_y + (this.state.text_height - 8)) && py < (this.state.position_y + this.state.height)){
      next_state = Object.assign(next_state, { hasChanges: true, text_position_y: py });
    }
    // Label X coordinate shares the same left edge, but needs to account for the text width on the right edge
    if(px > this.state.position_x && px < (this.state.position_x + this.state.width - this.state.text_width)){
      next_state = Object.assign(next_state, { hasChanges: true, text_position_x: px });
    }
    this.setStateWithChanges(next_state);
  }

  setStateWithChanges = (next_state) => {
    if(Object.keys(next_state).length) {
      next_state = Object.assign(next_state, { id: this.state.id } )
      this.setState(Object.assign(next_state));
      if(this.state.new_location === false) {
        this.props.editLocationHandler(next_state);
      }
    }
  }

  deleteLocation = (e) => {
    e.preventDefault();
    if(!this.state.new_location) {
      let delete_location_url = this.props.delete_location_url.replace('FLOORID', this.props.floor_id).replace('LOCATIONID', this.state.id);
      let token = $('meta[name="csrf-token"]').attr('content');
      $.ajax({
        url: delete_location_url,
        type: 'delete',
        beforeSend: (xhr) => {
          xhr.setRequestHeader('X-CSRF-Token', token);
        }
      }).done((data, status, xhr) => {
        this.props.deleteLocationHandler(this.state.id);
      }).fail((xhr, status, error) => {
        this.setStateWithChanges({
          didSave: false,
          hasChanges: false,
          hasError: true,
          isSaving: false,
          new_location: false,
          shouldSave: false
        });
      });
    } else {
      this.props.deleteLocationHandler(this.state.id);
    }
  }

  saveLocation = (e) => {
    if(e !== null) {
      e.preventDefault();
    }
    let locations = [{
      height: this.state.height,
      name: this.state.name,
      position_x: this.state.position_x,
      position_y: this.state.position_y,
      text_position_x: this.state.text_position_x,
      text_position_y: this.state.text_position_y,
      width: this.state.width
    }];
    if(!this.state.new_location) {
      locations[0] = Object.assign(locations[0], { id: this.state.id });
    }

    let add_location_url = this.props.add_location_url.replace('FLOORID', this.props.floor_id);
    let token = $('meta[name="csrf-token"]').attr('content');
    this.setState({
      hasError: false,
      isSaving: true
    });
    setTimeout(() =>   {
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
        this.setStateWithChanges({
          admin_url: data[0].admin_url,
          didSave: true,
          hasChanges: false,
          hasError: false,
          isSaving: false,
          id: data[0].id,
          new_location: false,
          shouldSave: false
        });
      }).fail((xhr, status, error) => {
        this.setStateWithChanges({
          didSave: false,
          hasChanges: false,
          hasError: true,
          isSaving: false,
          new_location: false,
          shouldSave: false
        });
        // TODO: Add a handler to propagate the error to an element for displaying these to user
      });
    }, 1000);
  }

  actionButton = () => {
    if(this.state.isSaving) {
      return this.buildButton({
        className: 'is-saving',
        href: '#',
        icon: 'sync',
        onClick: () => { return false; }
      });
    } else if((this.state.new_location && !this.state.didSave && !this.state.hasError) || this.state.hasChanges ) {
      return this.buildButton({
        className: 'save-location',
        href: '#',
        icon: 'save',
        onClick: this.saveLocation
      });
    } else if(this.state.hasError) {
      return this.buildButton({
        className: 'has-error',
        href: '#',
        icon: 'sync',
        onClick: this.saveLocation
      });
    } else {
      return this.buildButton({
        className: '',
        href: this.state.admin_url,
        icon: 'settings',
        onClick: () => { return true; }
      });
    }
  }

  buildButton = (options) => {
    return(
      <a href={options.href} target='_blank' onClick={options.onClick} className='material-icons'>
        <circle className={`link-circle ${options.className}`} r="8px" cx={this.state.position_x + "px"} cy={this.state.position_y + "px"}/>
        <text x={(this.state.position_x - 6) + "px"} y={(this.state.position_y + 6) + "px"} fontSize="0.75rem" fill="#fff">{options.icon}</text>
      </a>
    );
  }

  locationBoxStyles = () => {
    let styles = ['location-box'];
    if(this.state.edit_mode) {
      if((this.state.new_location && !this.state.didSave) || this.state.hasChanges) {
        styles.push('location-box-new');
      }
      if(this.state.isSaving) {
        styles.push('location-box-saving');
      }
      if(this.state.didSave) {
        styles.push('location-box-saved');
      }
      if(this.state.hasError) {
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
          <circle className="drag-circle" r="8px" cx={this.state.position_x + this.state.width + "px"} cy={this.state.position_y + this.state.height + "px"}/>
          { this.actionButton() }
          <a href={this.props.delete_location_url} onClick={this.deleteLocation} className='material-icons delete-location'>
            <circle className='link-circle delete-location' r="8px" cx={(this.state.position_x + this.state.width) + "px"} cy={this.state.position_y + "px"}/>
            <text x={(this.state.position_x + this.state.width - 6) + "px"} y={(this.state.position_y + 6) + "px"} fontSize="0.75rem" fill="#fff">clear</text>
          </a>
        </g>
      );
    } else {
      return null;
    }
  }

  render = () => {
    return (
      <g className={this.locationBoxStyles()} id={`location-box-${this.props.id}`}>
        <image width={this.state.width}
               x={this.state.position_x}
               xlinkHref={this.props.icon_url}
               y={this.state.position_y}>
        </image>
        <rect className={this.boundingBoxStyles()}
              data-name={this.props.name}
              height={this.state.height + "px"}
              width={this.state.width + "px"}
              x={this.state.position_x + "px"}
              y={this.state.position_y} />
        <text className='label'
              fontFamily='-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"'
              fontSize='20px'
              x={this.state.text_position_x}
              y={this.state.text_position_y}>
          {this.props.label_text}
        </text>
        { this.editControls() }
      </g>
    )
  }
}

export default LocationBox;
