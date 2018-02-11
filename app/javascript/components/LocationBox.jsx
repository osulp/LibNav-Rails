import React from "react"
import ReactDom from "react-dom"
import PropTypes from "prop-types"
import JQuery from "jquery"
require('d3');

class LocationBox extends React.Component {
  static PropTypes = {
    add_location_url: PropTypes.string.optional,
    didSave: PropTypes.bool.optional,
    floor_id: PropTypes.string.optional,
    isSaving: PropTypes.bool.optional,
    shouldSave: PropTypes.bool.optional
  }

  static defaultProps = {
    admin_url: null,
    add_location_url: null,
    didSave: false,
    floor_id: null,
    hasError: false,
    height: 50,
    isSaving: false,
    icon_url: null,
    id: null,
    new_location: false,
    shouldSave: false,
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

  componentWillReceiveProps = (nextProps) => {
    if(nextProps.shouldSave) {
      this.saveLocation(null);
    }
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
    if(e !== null) {
      e.preventDefault();
    }
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
        console.log(data, status, xhr);
        this.setState({
          admin_url: data[0].admin_url,
          didSave: true,
          hasError: false,
          isSaving: false,
          new_location: false
        });
      }).fail((xhr, status, error) => {
        this.setState({
          didSave: false,
          hasError: true,
          isSaving: false
        });
        console.log('failed', xhr, status, error);
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
    } else if(this.state.new_location && !this.state.didSave && !this.state.hasError ) {
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
      <a href={options.href} target='_blank' onClick={options.onClick}>
        <circle className={`link-circle ${options.className}`} r="8px" cx={this.state.position_x + "px"} cy={this.state.position_y + "px"}/>
        <text x={(this.state.position_x - 6) + "px"} y={(this.state.position_y + 6) + "px"} fontSize="0.75rem" fill="#fff">{options.icon}</text>
      </a>
    );
  }

  newLocationBoxStyles = () => {
    let styles = [];
    if(this.state.new_location && !this.state.didSave) {
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
    return styles.join(' ');
  }

  render = () => {
    return (
      <g className={`location-box material-icons ${this.newLocationBoxStyles()}`} id={`location-box-${this.props.id}`}>
        <image x={this.state.position_x} y={this.state.position_y} width={this.state.width} xlinkHref={this.props.icon_url}></image>
        <rect className="bounding-box edit" data-name={this.props.name} height={this.state.height + "px"} width={this.state.width + "px"} x={this.state.position_x + "px"} y={this.state.position_y} />
        <circle className="drag-circle" r="8px" cx={this.state.position_x + this.state.width + "px"} cy={this.state.position_y + this.state.height + "px"}/>
        { this.actionButton() }
      </g>
    )
  }
}

export default LocationBox;
