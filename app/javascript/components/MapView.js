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


      if (props.locations) {
        var arrayLength = props.locations.length;
        for (var i = 0; i < arrayLength; i++) {
          if (props.locations[i].floor_id == props.current_selected_floor) {
            svgContainer.append("svg:image")
              .attr("x", props.locations[i].position_x)
              .attr("y", props.locations[i].position_y)
              .attr("width", props.locations[i].width)
              .attr("height", props.locations[i].height)
              .attr("class", "bounding-box")
              .attr("data-name", props.locations[i].name)
            svgContainer.append('svg:image') 
              .attr("x", props.locations[i].position_x)
              .attr("y", props.locations[i].position_y + 20)
              .attr("width", props.locations[i].width)
              .attr("height", props.locations[i].height - 20)
              .attr("class", "bounding-box")
              .attr("xlink:href", props.locations[i].icon_url)
            svgContainer.append('svg:image') 
              .attr("x", props.locations[i].position_x)
              .attr("y", props.locations[i].position_y + 20)
              .attr("width", props.locations[i].width)
              .attr("height", props.locations[i].height - 20)
              .attr("class", "bounding-box")
              .attr("xlink:href", props.locations[i].icon_url)
            svgContainer.append('text') 
              .attr("x", props.locations[i].position_x + (props.locations[i].width / 2))
              .attr("y", props.locations[i].position_y)
              .attr("text-anchor", "middle")
              .text(props.locations[i].label_text)
          }
        }
        $('.bounding-box').each((index, element) => {
          let name = element.dataset.name;
          $(element).tooltip({ title: name });
          $(element).attr('tabindex', '0');
        })
      }
      if (props.persistent_locations) {
        var arrayLength = props.persistent_locations.length;
        for (var i = 0; i < arrayLength; i++) {
          if (props.persistent_locations[i].floor_id == props.current_selected_floor) {
            svgContainer.append("svg:image")
              .attr("x", props.persistent_locations[i].position_x)
              .attr("y", props.persistent_locations[i].position_y)
              .attr("width", props.persistent_locations[i].width)
              .attr("height", props.persistent_locations[i].height)
              .attr("class", "bounding-box")
              .attr("data-name", props.persistent_locations[i].name)
            svgContainer.append('svg:image') 
              .attr("x", props.persistent_locations[i].position_x)
              .attr("y", props.persistent_locations[i].position_y + 20)
              .attr("width", props.persistent_locations[i].width)
              .attr("height", props.persistent_locations[i].height - 20)
              .attr("class", "bounding-box")
              .attr("xlink:href", props.persistent_locations[i].icon_url)
            svgContainer.append('svg:image') 
              .attr("x", props.persistent_locations[i].position_x)
              .attr("y", props.persistent_locations[i].position_y + 20)
              .attr("width", props.persistent_locations[i].width)
              .attr("height", props.persistent_locations[i].height - 20)
              .attr("class", "bounding-box")
              .attr("xlink:href", props.persistent_locations[i].icon_url)
            svgContainer.append('text') 
              .attr("x", props.persistent_locations[i].position_x + (props.persistent_locations[i].width / 2))
              .attr("y", props.persistent_locations[i].position_y)
              .attr("text-anchor", "middle")
              .text(props.persistent_locations[i].label_text)
          }
        }
        $('.bounding-box').each((index, element) => {
          let name = element.dataset.name;
          $(element).tooltip({ title: name });
          $(element).attr('tabindex', '0');
        })
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
  current_selected_floor: PropTypes.string,
  persistent_locations: PropTypes.array
};
export default MapView
