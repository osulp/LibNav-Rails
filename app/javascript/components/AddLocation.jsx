import React from 'react';
import PropTypes from 'prop-types';
import Location from './Location';
class AddLocation extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      buttonActive: false,
      label: null,
      name: null
    }
  }

  addLocationBox = (e) => {
    if(this.state.buttonActive) {
      this.props.addLocationHandler(e, new Location({
        text: this.state.label,
        name: this.state.name,
        new_location: true,
      }));
    }
  }

  buttonStyles = () => {
    return `btn center-block col-12 ${this.state.buttonActive ? 'btn-primary' : 'btn-secondary'}`;
  }

  nameChanged = (e) => {
    if(e.target.value.length > 2) {
      this.setState({
        buttonActive: true,
        name: e.target.value
      });
    }
  }

  labelChanged = (e) => {
    if(e.target.value.length > 2) {
      this.setState({
        label: e.target.value
      });
    }
  }

  keyUp = (e) => {
    if(e.key === 'Enter') {
      this.addLocationBox();
    }
  }

  render() {
    return (
      <div className="row">
        <div className="col-12">
          <div className="row">
            <div className="col-12">
              <input className="col-12" type='text' onChange={(e) => this.nameChanged(e)} onKeyUp={(e) => this.keyUp(e)} placeholder='Enter Name' />
              <input className="col-12" type='text' onChange={(e) => this.labelChanged(e)} placeholder='Label Text (optional)' />
            </div>
          </div>
          <div className="row mt-1 mb-2">
            <div className="col-12">
              <button type="button"
                onClick={this.addLocationBox}
                disabled={!this.state.buttonActive}
                className={this.buttonStyles()}>
                New Location
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
AddLocation.propTypes = {
  addLocationHandler: PropTypes.func
};
export default AddLocation;
