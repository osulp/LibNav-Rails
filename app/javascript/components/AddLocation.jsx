import React from 'react';
import PropTypes from 'prop-types';
import Location from './Location';
class AddLocation extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      buttonActive: false,
      icon_id: 0,
      icon_url: '',
      label: null,
      name: null
    }
  }

  addLocationBox = (e) => {
    if(this.state.buttonActive) {
      this.props.addLocationHandler(e, new Location({
        icon_id: this.state.icon_id,
        icon_url: this.state.icon_url,
        name: this.state.name,
        new_location: true,
        text: this.state.label
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

  iconChanged = (e) => {
    if(e.target.selectedIndex > 0) {
      this.setState({
        icon_id: e.target.selectedOptions[0].value,
        icon_url: e.target.selectedOptions[0].dataset.url
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
      <div className='row'>
        <div className='col-12'>
          <div className='row add-location-row'>
            <div className='col-12 add-location-buttons'>
              <input className='col-12' type='text' onChange={(e) => this.nameChanged(e)} onKeyUp={(e) => this.keyUp(e)} placeholder='Name' />
              <select className='col-12' onChange={this.iconChanged} >
                <option value='0'>Icon (optional)</option>
                {this.props.icons.map(i => <option key={`icon-${i.id}`} value={i.id} data-url={i.icon_url}>{i.name}</option>)}
              </select>
              <input className='col-12' type='text' onChange={(e) => this.labelChanged(e)} placeholder='Label (optional)' />
            </div>
          </div>
          <div className='row mt-1 mb-2'>
            <div className='col-12'>
              <button type='button'
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
  addLocationHandler: PropTypes.func,
  icons: PropTypes.array
};
export default AddLocation;
