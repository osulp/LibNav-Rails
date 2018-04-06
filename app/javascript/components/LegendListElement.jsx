import React from "react"
import PropTypes from "prop-types"

class LegendListElement extends React.Component {

  build_search_url = (icon_name) => {
    if (window.location.href.includes("search")){
      return window.location.href.replace(/(search=).*?(&|$)/,'$1' + icon_name.replace(" ", "+") + '$2');
    } else if(window.location.href.includes("?")) {
      return window.location.href.toString() + '&search=' + icon_name.replace(" ", "+") + '&commit=Search'
    } else {
      return window.location.href.toString() + '?search=' + icon_name.replace(" ", "+") + '&commit=Search'
    }
  }

  render() {
    return (<div className={`col-4 legend_container ${(this.props.selected_element ? "selected_element" : "")}`}>
                  <a href={this.build_search_url(this.props.icon_name)}>
                      <img className="legend_icon_image legend_padding" src={ this.props.icon_url }></img>
                      <span>{ this.props.icon_name }</span>
                  </a>
            </div>
    );
  }
}
LegendListElement.propTypes = {
  icon_url: PropTypes.string,
  icon_name: PropTypes.string,
  selected_element: PropTypes.bool
};
export default LegendListElement
