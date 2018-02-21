import React from "react"
import PropTypes from "prop-types"
class LegendListElement extends React.Component {
  render() {
    return (<li>
              <img width="50" height="50" src={ this.props.location_url }></img>{ this.props.location_name }
            </li>
    );
  }
}
LegendListElement.propTypes = {
  location_url: PropTypes.string,
  location_name: PropTypes.string
};
export default LegendListElement
