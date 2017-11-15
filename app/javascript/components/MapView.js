import React from "react"
import PropTypes from "prop-types"
class MapView extends React.Component {
  render () {
    return (
      <img src={this.props.mapUrl} />
    );
  }
}
MapView.propTypes = {
  mapUrl: PropTypes.string
};
export default MapView
