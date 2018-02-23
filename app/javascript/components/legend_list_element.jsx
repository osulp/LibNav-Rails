import React from "react"
import PropTypes from "prop-types"
class LegendListElement extends React.Component {
  render() {
    return (<li>
              <img width="50" height="50" src={ this.props.icon_url }></img>{ this.props.icon_name }
            </li>
    );
  }
}
LegendListElement.propTypes = {
  icon_url: PropTypes.string,
  icon_name: PropTypes.string
};
export default LegendListElement
