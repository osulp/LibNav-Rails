import React from 'react'
import PropTypes from 'prop-types'
import * as d3 from 'd3';
import Location from './Location';
import LocationBox from './LocationBox/LocationBox';

class MapView extends React.Component {

  constructor(props) {
    super(props);
    this.state = this.getLocationsState(props, props.floor);
  }

  componentWillReceiveProps = (nextProps) => {
    this.renderSvg(nextProps.mapUrl);
    this.setState(this.getLocationsState(nextProps, nextProps.current_selected_floor));
  }

  componentDidMount = () => {
    this.renderSvg(this.props.mapUrl);
    this.setTooltips();
  }

  componentDidUpdate = () => {
    this.setTooltips();
  }

  locationBox = (l, result_type) => {
    return (<LocationBox key={l.id} highlight={result_type.highlight} location={l} />);
  }

  getLocationsState = (props, floor) => {
    let search_result_location_ids = props.locations.filter(l => l.floor_id.toString() === floor.toString()).map(l => l.id);
    let persistent_location_ids = props.persistent_locations.filter(l => l.floor_id.toString() === floor.toString() && !search_result_location_ids.some(srl => srl.id === l.id)).map(l => l.id);
    return {
      locationsBoxes: props.edit_locations.filter(el => search_result_location_ids.includes(el.id)).map(l => this.locationBox(l, { highlight: true })),
      persistentLocationsBoxes: props.edit_locations.filter(el => persistent_location_ids.includes(el.id)).map(l => this.locationBox(l, { highlight: false }))
    };
  }

  setTooltips = () => {
    $('.tooltip').each((index, element) => {
      let name = element.dataset.name;
      $(element).tooltip({ title: name });
      $(element).attr('tabindex', '0');
    });
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
        {this.state.locationsBoxes}
        {this.state.persistentLocationsBoxes}
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
export default MapView;
