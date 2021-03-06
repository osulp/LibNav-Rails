import React from 'react'
import PropTypes from 'prop-types'
import * as d3 from 'd3';
import Location from './Location';
import LocationBox from './LocationBox/LocationBox';

class MapView extends React.Component {

  constructor(props) {
    super(props);
    this.state = this.getLocationsState(props, props.floors[props.current_selected_floor - 1].id);
  }

  componentWillReceiveProps = (nextProps) => {
    this.renderSvg(nextProps.mapUrl);
    this.setState(this.getLocationsState(nextProps, this.props.floors[nextProps.current_selected_floor - 1].id));
  }

  componentDidMount = () => {
    this.renderSvg(this.props.mapUrl);
    this.setTooltips();
  }

  componentDidUpdate = () => {
    this.setTooltips();
  }

  locationBox = (l, result_type) => {
    return (<LocationBox key={l.id} highlight={result_type.highlight} search={result_type.search}location={l} map_marker_path={this.props.map_marker_path} />);
  }

  getLocationsState = (props, floor_id) => {
    let search_result_location_ids = props.locations.filter(l => l.floor_id.toString() === floor_id.toString()).map(l => l.id);
    let persistent_location_ids = props.persistent_locations.filter(l => l.floor_id.toString() === floor_id.toString() && !search_result_location_ids.some(srl_id => srl_id === l.id)).map(l => l.id);
    return {
      locationsBoxes: props.edit_locations.filter(el => search_result_location_ids.includes(el.id)).map(l => this.locationBox(l, { highlight: true, search: true })),
      persistentLocationsBoxes: props.edit_locations.filter(el => persistent_location_ids.includes(el.id)).map(l => this.locationBox(l, { highlight: false, search: search_result_location_ids == 0 ? false : true}))
    };
  }

  setTooltips = () => {
    $('.tooltip').each((index, element) => {
      let name = element.dataset.name;
      $(element).tooltip({ title: name });
      $(element).attr('tabindex', '0');
    });
  }

  searchResultOverlay = () => {
    if(this.state.locationsBoxes.length) {
      return(<rect width='100%' height='100%' style={{fill: 'white', fillOpacity: '0.5'}} />)
    } else {
      return null;
    }
  }

  renderSvg = (mapUrl) => {
    let svgContainer = d3.select('.svgContainer');
    if (d3.select('.map_image')) {
      d3.select('.map_image').remove();
    }

    svgContainer.append('svg:image')
      .attr('class', 'map_image')
      .attr('xlink:href', mapUrl)
      .attr('x', 0)
      .attr('y', 0)
      .attr('height', '100%')
      .attr('width', '100%')
      .lower();
  }

  render() {
    return (
      <svg width='100%' viewBox='0 0 800 650' className='svgContainer map' id={`floor-${this.props.current_selected_floor}-svg`}>
        {this.state.persistentLocationsBoxes}
        {this.searchResultOverlay()}
        {this.state.locationsBoxes}
      </svg>
    );
  }
}
MapView.propTypes = {
  mapUrl: PropTypes.string,
  locations: PropTypes.array,
  current_selected_floor: PropTypes.string,
  persistent_locations: PropTypes.array,
  map_marker_path: PropTypes.string
};
export default MapView;
