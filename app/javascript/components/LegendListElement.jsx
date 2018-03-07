import React from "react"
import PropTypes from "prop-types"
class LegendListElement extends React.Component {
  render() {
    return (<li>
              <div className="container">
                <div className="row">
                  <img className="legend_icon_image legend_padding" src={ this.props.icon_url }></img>
                </div>
                <div className="row">
                  <div className="legend_padding">
                    { this.props.icon_name }
                  </div>
                </div>
              </div>
            </li>

    );
  }
}
LegendListElement.propTypes = {
  icon_url: PropTypes.string,
  icon_name: PropTypes.string
};
export default LegendListElement
