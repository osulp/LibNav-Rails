import React from 'react';
import PropTypes from 'prop-types';
import FloorButton from './FloorButton';
import ToggleEditButton from './ToggleEditButton';
import LocationBox from './LocationBox';
import AddLocationButton from './AddLocationButton';
import SearchFilterAccordion from './SearchFilterAccordion';
import MapView from './MapView';
import MapEdit from './MapEdit';
import Map from './Map';
import SplashPage from './SplashPage';
class MapAndButtons extends React.Component {

  toggleHandler(e, edit_state) {
    if (edit_state == true) {
      this.setState({
        edit_mode: false
      })
    } else {
      this.setState({
        edit_mode: true
      })
    }
  }

  addLocationHandler = (e, l) => {
    let added_locations = this.state.added_locations;
    l.add_location_url = this.props.add_location_url;
    let floor_id = this.state.current_selected_floor;
    l.floor_id = floor_id.toString();
    added_locations.push(l);
    this.setState({ added_locations: added_locations });
  }

  handler(e, selected_floor) {
    e.preventDefault()
    this.setState({
      current_selected_floor: selected_floor
    })
  }

  set_or_reset_timer() {
    if(this.timer_handle > 0) {
      window.clearTimeout(this.time_handle);
    }
    this.timer_handle = window.setTimeout(function(){
      location.reload();
    },600000);
  }

  constructor(props) {
    super(props)
    this.timer_handle
    this.handler = this.handler.bind(this)
    this.toggleHandler = this.toggleHandler.bind(this)
    this.state = {
      added_locations: [],
      current_selected_floor: this.props.floor,
      edit_mode: false,
      modal_popup: true,
      result_hit_counts: this.props.floors.map((floor, index) => {
        let count = 0;
        if (this.props.locations) {
          this.props.locations.forEach((location) => {
            if (location.floor_id == floor.id) count++;
          })
        }
        return count;
      })
    }
    console.log(this.state.result_hit_counts);
  }

  searched_floor(search_result_floors, floor_index) {
    if (search_result_floors == null) {
      return false
    } else if (search_result_floors[floor_index]) {
      return true
    } else {
      return false
    }
  }

  render_map_view = () => {
    if (this.state.edit_mode == true) {
      return <MapEdit mapUrl={this.props.maps[this.state.current_selected_floor - 1]}
        locations={this.props.edit_locations}
        added_locations={this.state.added_locations}
        id={this.props.floors[this.state.current_selected_floor - 1].id.toString()}
        current_selected_floor={this.state.current_selected_floor.toString()}/>
    } else {
      return <MapView mapUrl={this.props.maps[this.state.current_selected_floor - 1]}
        locations={this.props.locations}
        current_selected_floor={this.state.current_selected_floor.toString()}
        persistent_locations={this.props.persistent_locations}/>

    }
  }

  render_modal = () => {
    if (window.location.href.includes("?") == false) {
      return <SplashPage />
    }
  }

  componentDidMount = () => {
    $(document).on('click', (event) => {
      document.body.addEventListener('click', this.set_or_reset_timer);
      if (event.target.id == 'floor-save-btn') {
        this.saveFloor(event);
      }
    })
    $(document).ready(function () {
      $('.modal').modal({show: true});
    })
  }

  saveAddedLocations = (e) => {
    let added_locations = this.state.added_locations;
    added_locations.filter(l => l.floor_id === this.props.floors[this.state.current_selected_floor - 1].id.toString()).forEach(l => {
      l.shouldSave = true;
    });
    this.setState({
      added_locations: added_locations
    });
  }

  saveFloor = (event) => {
    console.log('saving . . .');
    let locations = this.props.edit_locations.filter((location) => location.floor_id == this.props.floors[this.state.current_selected_floor - 1].id);
    let floorId = this.props.floors[this.state.current_selected_floor - 1].id;
    let token = $('meta[name="csrf-token"]').attr('content');
    let locations_attributes = []
    locations.forEach((location) => {
      let id = location.id;
      let group = $(`#location-box-${id}`);
      let new_attributes = {};
      new_attributes.id = id;
      new_attributes.height = parseInt(group.find('rect').attr('height'));
      new_attributes.width = parseInt(group.find('rect').attr('width'));
      new_attributes.position_x = parseInt(group.find('rect').attr('x'));
      new_attributes.position_y = parseInt(group.find('rect').attr('y'));
      locations_attributes.push(new_attributes);
    })
    $('.save-btn').find('.icon-container').addClass('active');
    $('.save-btn').find('.fa-times').removeClass('active');
    $('.save-btn').find('.fa-check').removeClass('active');
    $.ajax({
      url: `floors/${floorId}.json`,
      type: 'patch',
      beforeSend: (xhr) => {
        xhr.setRequestHeader('X-CSRF-Token', token);
      },
      data: {
        floor: {
          locations_attributes: locations_attributes
        }
      }
    }).done((data) => {
      $('.save-btn').find('.fa-spin').removeClass('active');
      $('.save-btn').find('.fa-times').removeClass('active');
      $('.save-btn').find('.fa-check').addClass('active');
      $('.save-btn').find('.fa-check').slideDown();
      $('.save-btn').removeClass('btn-danger').addClass('btn-success');
      $('.save-result').removeClass('alert-danger')
        .removeClass('hidden')
        .addClass('alert-success')
        .text('Map saved successfully')
    }).fail((error, textStatus) => {
      $('.save-btn').find('.fa-spin').removeClass('active');
      $('.save-btn').find('.fa-times').addClass('active');
      $('.save-btn').find('.fa-check').removeClass('active');
      $('.save-btn').find('.fa-times').slideDown();
      $('.save-btn').removeClass('btn-success').addClass('btn-danger');
      $('.save-result').removeClass('alert-success')
        .removeClass('hidden')
        .addClass('alert-danger')
        .text('There was an error');
    }).then(() => this.saveAddedLocations(event));
  }

  render() {
    return (
      <main className="floor-index" id="main-content">
        <div className="row map-and-buttons">
          <div className="map-row">
            <div className="info-col col-12">
              <h2>{this.props.floors[this.state.current_selected_floor - 1].name}</h2>
            </div>
          </div>
          <div className="map-row">
            <div className="map-col col-10">
              {this.render_map_view()}
            </div>
            <div className="col-2">
              <SearchFilterAccordion />
              <div className="info-col col-2 save-edit-buttons">
                {this.state.edit_mode && this.props.admin_user ? <button id={`floor-save-btn`} className="btn btn-success save-btn">Save
                  <span className="icon-container">
                    <i className="fa fa-spin fa-circle-o-notch icon active" />
                    <i className="fa fa-check icon" />
                    <i className="fa fa-times icon" />
                  </span>
                </button> : ''}
                {this.props.admin_user ? <ToggleEditButton handler={this.toggleHandler} edit_state={this.state.edit_mode} /> : '' }
                {this.state.edit_mode && this.props.admin_user ? <AddLocationButton handler={this.addLocationHandler} /> : '' }
                {this.state.edit_mode && this.props.admin_user ? <div className="alert save-result hidden" /> : ''}
              </div>
            </div>
          </div>
          <div className="buttons-row">
            {this.props.floors.map((floor, i) => {
              return (
                <FloorButton key={`floor.${i}`}
                  active={i == this.state.current_selected_floor - 1}
                  floor={floor}
                  was_searched_floor={this.searched_floor(this.props.search_result_floors, i)}
                  hit_count={this.state.result_hit_counts[i]}
                  handler={this.handler} />
              )
            })}
          </div>
        </div>
        { this.render_modal() }
      </main>
    );
  }
}
export default MapAndButtons

