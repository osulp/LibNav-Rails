import React from "react"
import PropTypes from "prop-types"
import * as d3 from "d3";

class MapView extends React.Component {

  render_svg(props) {
    $(document).ready(function() {

      var svgContainer = d3.select(".svgContainer").append("svg")
        .attr("width", 800)
        .attr("height", 800);

      svgContainer.append('svg:image')
        .attr("xlink:href", props.mapUrl || props.map)  // can also add svg file here
        .attr("x", 0)
        .attr("y", 0)
        .attr("width", 800)
        .attr("height", 800);

      var arrayLength = props.locations[0].length;
      for (var i = 0; i < arrayLength; i++) {
        if (props.locations[0][i].floor_id == 2){
          svgContainer.append("rect")
            .attr("x", props.locations[0][i].position_x)
            .attr("y", props.locations[0][i].position_y)
            .attr("width", props.locations[0][i].width)
            .attr("height", props.locations[0][i].height)
            .style("fill", "yellow")
            .style("opacity", .75);
        }
      }
    });
  }

  render () {
    return (
      <div className="svgContainer">
        {this.render_svg(this.props)}
      </div>
    );
  }
}
MapView.propTypes = {
  mapUrl: PropTypes.string,
  locations: PropTypes.array
};
export default MapView
