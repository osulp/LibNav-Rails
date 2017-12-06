import React from "react"
import PropTypes from "prop-types"
import * as d3 from "d3";

class MapView extends React.Component {

  render_svg(props) {
    $(document).ready(function() {

      if(d3.select('svg')) {
        d3.select('svg').remove();
      }

      var svgContainer = d3.select(".svgContainer").append("svg")
        .attr("width", 800)
        .attr("height", 800);


      svgContainer.append('svg:image')
        .attr("class", "map_image")
        .attr("xlink:href", props.mapUrl)
        .attr("x", 0)
        .attr("y", 0)
        .attr("width", 800)
        .attr("height", 800);

      var arrayLength = props.locations[0].length;
      for (var i = 0; i < arrayLength; i++) {
        if (props.locations[0][i].floor_id == this.props.current_selected_floor){
          svgContainer.append("rect")
            .attr("x", props.locations[0][i].position_x)
            .attr("y", props.locations[0][i].position_y)
            .attr("width", props.locations[0][i].width)
            .attr("height", props.locations[0][i].height)
            .style("fill", "yellow")
            .style("opacity", .75);
        }      
      }
      if (props.locations[0].floor_id == this.props.current_selected_floor) {
        svgContainer.append("rect")
          .attr("x", props.locations[0].position_x)
          .attr("y", props.locations[0].position_y)
          .attr("width", props.locations[0].width)
          .attr("height", props.locations[0].height)
          .style("fill", "yellow")
          .style("opacity", .75);
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
  locations: PropTypes.array,
  current_selected_floor: PropTypes.number
};
export default MapView
