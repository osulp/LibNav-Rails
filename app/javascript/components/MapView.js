import React from "react"
import PropTypes from "prop-types"
import * as d3 from "d3";
class MapView extends React.Component {
  
  render () {
    var width = d3.select("img").node().getBoundingClientRect().width
    var height = d3.select("img").node().getBoundingClientRect().height

    var svgContainer = d3.select("svg").append("svg")
      .attr("width", width)
      .attr("height", height);
    var rectangle = svgContainer.append("rect")
      .attr("x", 10)
      .attr("y", 10)
      .attr("width", 50)
      .attr("height", 100);
    return (
      <div>
        <img src={this.props.mapUrl || this.props.map}></img>
      </div>
    );
  }
}
MapView.propTypes = {
  mapUrl: PropTypes.string
};
export default MapView
