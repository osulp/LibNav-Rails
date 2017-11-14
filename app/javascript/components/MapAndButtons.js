import React from "react"
import PropTypes from "prop-types"
class MapAndButtons extends React.Component {
  render () {
    return (
      <main className="floor-index">
        <div className="row">
          <div className="col-xl-3 col-lg-4 col-12 tabs">
            <p style={divStyle}> {this.props.user.email} </p>
            <p style={divStyle}> {this.props.floors.toString()} </p>
          </div>
          <div className="col-12 col-xl-9 col-lg-8 tab-content" id="floors-tabContent">
          </div>
        </div>
      </main>
    );
  }
}
var divStyle = {
  color: 'white',
};
export default MapAndButtons
