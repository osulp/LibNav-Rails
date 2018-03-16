import React from "react"
import PropTypes from "prop-types"
class LegendListElement extends React.Component {

  build_search_url = (icon_name) => {
    if (window.location.href.includes("search")){
      return window.location.href.replace(/(search=).*?(&|$)/,'$1' + icon_name.replace(" ", "+") + '$2');
    } else {
      return window.location.href.toString() + '?search=' + icon_name.replace(" ", "+") + '&commit=Search'
    }
  }

  render() {
    return (<li>
              <div className="container">
                <div className="row">
                  <img className="legend_icon_image legend_padding" src={ this.props.icon_url }></img>
                </div>
                <div className="row">
                  <div className="legend_padding">
                    <a href={this.build_search_url(this.props.icon_name)}> { this.props.icon_name } </a>
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
