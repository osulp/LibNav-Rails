import React from "react"
import PropTypes from "prop-types"
class AddLocationButton extends React.Component {
  guid = () => {
    let s4 = () => {
      return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
    }
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
      s4() + '-' + s4() + s4() + s4();
  }

  addLocationBox = (e) => {
    let id = this.guid();
    this.props.handler(e, {
      admin_url: null,
      height: 50,
      icon_url: null,
      id: id,
      name: 'New Location',
      new_location: true,
      position_x: 10,
      position_y: 10,
      width: 50
    });
  }

  render() {
    return (
      <button type="button"
        onClick={this.addLocationBox}
        className="btn btn-primary center-block">
        Add New Location
      </button>
    );
  }
}
AddLocationButton.propTypes = {
  handler: PropTypes.func
};
export default AddLocationButton;
