import React from "react"
import PropTypes from "prop-types"
class MapView extends React.Component {
  render () {
    return (
      <div>
        <img src={this.props.mapUrl || this.props.map} />
      </div>
    );
  }
}
MapView.propTypes = {
  mapUrl: PropTypes.string
};
export default MapView
