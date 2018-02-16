import React from "react"
import PropTypes from "prop-types"
class ActionButton extends React.Component {
  static PropTypes = {
    admin_url: PropTypes.string,
    didSave: PropTypes.bool,
    hasChanges: PropTypes.bool,
    hasError: PropTypes.bool,
    isSaving: PropTypes.bool,
    new_location: PropTypes.bool,
    position_x: PropTypes.number,
    position_y: PropTypes.number,
    saveLocationHandler: PropTypes.func
  }

  constructor(props) {
    super(props);
    this.state = {
      admin_url: props.admin_url,
      didSave: props.didSave,
      hasChanges: props.hasChanges,
      hasError: props.hasError,
      isSaving: props.isSaving,
      new_location: props.new_location,
      position_x: props.position_x,
      position_y: props.position_y,
      saveLocationHandler: props.saveLocationHandler
    };
  }

  componentWillReceiveProps = (nextProps) => {
    this.setState({
      admin_url: nextProps.admin_url,
      didSave: nextProps.didSave,
      hasChanges: nextProps.hasChanges,
      hasError: nextProps.hasError,
      isSaving: nextProps.isSaving,
      new_location: nextProps.new_location,
      position_x: nextProps.position_x,
      position_y: nextProps.position_y,
      saveLocationHandler: nextProps.saveLocationHandler
    });
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
        onClick: this.state.saveLocationHandler
      });
    } else if(this.state.hasError) {
      return this.buildButton({
        className: 'has-error',
        href: '#',
        icon: 'sync',
        onClick: this.state.saveLocationHandler
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

  render() {
    return this.actionButton();
  }
}
export default ActionButton;
