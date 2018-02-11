import React from "react"
import PropTypes from "prop-types"
class AddLocation extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      buttonActive: false,
      name: null
    }
  }

  guid = () => {
    let s4 = () => {
      return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
    }
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
      s4() + '-' + s4() + s4() + s4();
  }

  addLocationBox = (e) => {
    if(this.state.buttonActive) {
      let id = this.guid();
      this.props.addLocationHandler(e, {
        admin_url: null,
        height: 50,
        icon_url: null,
        id: id,
        name: this.state.name,
        new_location: true,
        position_x: 10,
        position_y: 10,
        width: 50
      });
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
                Add New Location
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
