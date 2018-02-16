import React from 'react';
import PropTypes from 'prop-types';
import Location from './Location';
class AddLocation extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      buttonActive: false,
      name: null
    }
  }

  addLocationBox = (e) => {
    if(this.state.buttonActive) {
      this.props.addLocationHandler(e, new Location({
        name: this.state.name,
        new_location: true,
      }));
    }
  }

  buttonStyles = () => {
    return `btn center-block col-12 ${this.state.buttonActive ? 'btn-primary' : 'btn-secondary'}`;
  }

  textChanged = (e) => {
    if(e.target.value.length > 2) {
      this.setState({
        buttonActive: true,
        name: e.target.value
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
              <input className="col-12" type='text' onChange={(e) => this.textChanged(e)} onKeyUp={(e) => this.keyUp(e)} placeholder='Enter Name' />
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
