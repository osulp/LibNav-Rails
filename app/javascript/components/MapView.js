import React from "react"
import PropTypes from "prop-types"
import * as d3 from "d3";

class MapView extends React.Component {

  render_svg(props) {
    $(document).ready(function () {

      if (d3.select('.map-svg')) {
        d3.select('.map-svg').remove();
      }

      var svgContainer = d3.select(".svgContainer").append("svg")
        .attr("class", "map-svg")
        .attr("width", 800)
        .attr("height", 800);


      svgContainer.append('svg:image')
        .attr("class", "map_image")
        .attr("xlink:href", props.mapUrl)
        .attr("x", 0)
        .attr("y", 0)
        .attr("width", 800)
        .attr("height", 800);


      var arrayLength = props.locations.length;
      for (var i = 0; i < arrayLength; i++) {
        if (props.locations[i].floor_id == props.current_selected_floor) {
          svgContainer.append("rect")
            .attr("x", props.locations[i].position_x)
            .attr("y", props.locations[i].position_y)
            .attr("width", props.locations[i].width)
            .attr("height", props.locations[i].height)
            .attr("class", "bounding-box")
            .attr("data-name", props.locations[i].name)
            .style("fill", "yellow")
            .style("opacity", .75);
        }
      }
    });
  }

  render() {
    return (
      <div className="svgContainer">
        {this.render_svg(this.props)}
      </div>
    );
  }
}
MapView.propTypes = {
  mapUrl: PropTypes.string,
  locations: PropTypes.array,
  current_selected_floor: PropTypes.string
};
export default MapView
