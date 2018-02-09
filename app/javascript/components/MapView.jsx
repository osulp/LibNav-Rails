import React from "react"
import PropTypes from "prop-types"
import * as d3 from "d3";

class MapView extends React.Component {

  constructor(props) {
    super(props);
  }

  appendLocation = (svg, location) => {
    let g = svg.append("g")
       .attr('class', 'location-container')
       .attr("x", location.position_x)
       .attr("y", location.position_y)
       .attr("width", location.width)
       .attr("height", location.height);
    // icon
    g.append('svg:image')
      .attr("x", location.position_x)
      .attr("y", location.position_y)
      .attr("width", location.width)
      .attr("xlink:href", location.icon_url);
    // label
    g.append('text')
      .attr("x", location.position_x + (location.width / 2))
      .attr("y", location.position_y)
      .attr("text-anchor", "middle")
      .text(location.label_text);
    // tooltip target
    g.append('svg:image')
      .attr("x", location.position_x)
      .attr("y", location.position_y)
      .attr("width", location.width)
      .attr("height", location.height)
      .attr('class', 'tooltip')
      .attr("data-name", location.name);
  }

  setTooltips = () => {
    $('.tooltip').each((index, element) => {
      let name = element.dataset.name;
      $(element).tooltip({ title: name });
      $(element).attr('tabindex', '0');
    });
  }

  renderMap = (props) => {
    $(() => {
      if (d3.select('.map-svg')) {
        d3.select('.map-svg').remove();
      }

      let svgContainer = d3.select('.svgContainer');
      svgContainer.append('svg:image')
                  .attr('class', 'map_image')
                  .attr('xlink:href', props.mapUrl)
                  .attr('x', 0)
                  .attr('y', 0)
                  .attr('width', '100%');

      if (props.locations) {
        props.locations.filter(l => l.floor_id.toString() === props.current_selected_floor).forEach(location => {
          this.appendLocation(svgContainer, location);
        });
      }
      if (props.persistent_locations) {
        props.persistent_locations.filter(l => l.floor_id.toString() === props.current_selected_floor).forEach(location => {
          this.appendLocation(svgContainer, location);
        });
      }
      this.setTooltips();
    });
  }

  render() {
    return (
      <svg width="100%" viewBox="0 0 800 650" className="svgContainer">
        {this.renderMap(this.props)}
      </svg>
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
