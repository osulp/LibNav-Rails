import update from 'immutability-helper';
import React from 'react';
import PropTypes from 'prop-types';
import FlashMessages from './FlashMessages';
import FloorButton from './FloorButton';
import Location from './Location';
import MapEdit from './MapEdit';
import MapEditButtons from './MapEditButtons';
import MapView from './MapView';
import NotificationList from './NotificationList';
import SearchFilterAccordion from './SearchFilterAccordion';
import SplashPage from './SplashPage';
import Legend from './Legend'
class MapAndButtons extends React.Component {

  constructor(props) {
    super(props)
    this.timer_handle
    this.state = {
      active_search: this.props.active_search,
      csrf: $('meta[name="csrf-token"]').attr('content'),
      current_selected_floor: this.pick_floor(),
      edit_locations: this.props.edit_locations.map(l => new Location({...l,
                                                                       add_location_url: this.props.add_location_url,
                                                                       delete_location_url: this.props.delete_location_url })),
      edit_mode: false,
      flash_messages: this.props.flash_messages,
      map_height: 0,
      modal_popup: true,
      map_marker_path: this.props.map_marker_path,
      result_hit_counts: this.props.floors.map((floor, index) => {
        let count = 0;
        if (this.props.locations) {
          this.props.locations.forEach((location) => {
            if (location.floor_id == floor.id) count++;
          })
        }
        return count;
      }),
      success_notifications: [],
      success_notification_fade_delay: 3000
    }
    $(window).resize(this.mapResizeHandler);
  }

  componentDidMount = () => {
    $(() => {
      $('.modal').modal({show: true});
    });
    this.mapResizeHandler();
  }

  componentDidUpdate = () => this.mapResizeHandler();

  // Action Handlers

  addLocationHandler = (e, location) => {
    let updated_location = Object.assign(location, { add_location_url: this.props.add_location_url,
                                                     delete_location_url: this.props.delete_location_url,
                                                     floor_id: this.props.floors[this.state.current_selected_floor - 1].id,
                                                     isNew: true
                                                   });

    this.setState({
      edit_locations: update(this.state.edit_locations, {
        $push: [updated_location]
      })
    });
  }

  deleteLocationHandler = (id) => {
    this.setState({
      edit_locations: update(this.state.edit_locations, {
        $apply: locations => locations.filter(el => el.id !== id)
      })
    });
  }

  /*
   * Merge next_state into the targeted location and ensure additional properties are set.
   */
  editLocationHandler = (next_state) => {
    let indexOfLocation = this.state.edit_locations.findIndex(el => el.internal_id === next_state.internal_id);
    let updated_location = Object.assign(this.state.edit_locations[indexOfLocation], next_state);
    this.setState({
      edit_locations: update(this.state.edit_locations, {
        [indexOfLocation]: { $set: updated_location }
      })
    });
  }

  mapResizeHandler = (e) => {
    let heights = [];
    let visible_elements = ['nav.navbar', '.sub-nav', '.search-nav', '.floor-buttons', 'main > .header-row'];
    visible_elements.forEach((s) => {
      if($(s) !== null && $(s).length) {
        heights.push($(s).height())
      }
    });
    let height_sum = heights.reduce((p,c) => c + p);
    let window_height = window.innerHeight;
    $('.svgContainer.map').attr('max-height', `${window_height - height_sum - 10}px`);
    $('.svgContainer.map').attr('height', `${window_height - height_sum - 10}px`);
  }

  removeSuccessNotification = (id) => {
    this.setState({
      success_notifications: update(this.state.success_notifications, { $apply: n => n.filter(l => l.id !== id) })
    });
  }

  /*
   * For the current floor, find all locations that have an error or changes pending and
   * set each to save on the next cycle.
   */
  saveClickedHandler = (e) => {
    let floor_id = this.props.floors[this.state.current_selected_floor - 1].id;
    let success_callback = (result) => {
      this.successNotificationHandler(result.location);
      this.editLocationHandler(result.next_state);
    }
    let should_save = (l, floor_id) => {
      return (l.hasChanges || l.hasError) && l.floor_id === floor_id;
    }

    // Fire off async calls to save each location for this floor that has changes or an error to retry saving
    this.state.edit_locations.filter(l => should_save(l, floor_id)).forEach(l => {
      l.save(this.state.csrf, success_callback, this.editLocationHandler);
    });

    // Update the edit_locations such that the targeted locations for saving will render with the proper styles
    // to show that they are attempting to save.
    this.setState({
      edit_locations: update(this.state.edit_locations, {
        $apply: el => el.map(l => {
          if(should_save(l, floor_id)) {
            return {...l, isSaving: true, hasError: false};
          }
          return l;
        })
      })
    });
  }

  selectFloorHandler = (e, floor) => this.setState( { current_selected_floor: floor })

  successNotificationHandler = (l) => {
    this.setState({
      success_notifications: update(this.state.success_notifications, { $push: [l] })
    });
    setTimeout(() => this.removeSuccessNotification(l.id), this.state.success_notification_fade_delay + 500);
  }

  toggleEditHandler = (e) => this.setState({ edit_mode: !this.state.edit_mode })

  build_per_floor_icon_set = (locations) => {
    return locations.filter(l => (l.floor_id === this.props.floors[this.state.current_selected_floor - 1].id) && (l.icon_name != null || l.icon_name != undefined)).map(loc => Object.assign({}, {icon_url: loc.icon_url, icon_name: loc.icon_name}))
  }
  // End Action Handlers
  create_legend_set = () => {
    let persistent_icons = this.build_per_floor_icon_set(this.props.persistent_locations);
    let icons = this.build_per_floor_icon_set(this.props.locations)
    let combined_icons = persistent_icons.concat(icons);
    let urls = new Set(combined_icons.map(i => i.icon_url));
    return [...urls.values()].map(u => combined_icons.find(c => c.icon_url === u));
  }

  set_or_reset_timer() {
    if(this.timer_handle > 0) {
      window.clearTimeout(this.time_handle);
    }
    this.timer_handle = window.setTimeout(() => { location.reload() }, 600000);
  }

  pick_floor = () => {
    if(this.props.search_result_floors.filter(floor => floor != undefined).length){
      return this.props.search_result_floors.filter(floor => floor != undefined)[0].level
    } else {
      return this.props.floor
    }
  }

  searched_floor(search_result_floors, floor_index) {
    if (search_result_floors == null) {
      return false;
    } else if (search_result_floors[floor_index]) {
      return true;
    } else {
      return false;
    }
  }

  render_map_view = () => {
    if (this.state.edit_mode == true) {
      return <MapEdit current_selected_floor={this.state.current_selected_floor.toString()}
                      editLocationHandler={this.editLocationHandler}
                      deleteLocationHandler={this.deleteLocationHandler}
                      delete_location_url={this.props.delete_location_url}
                      id={this.props.floors[this.state.current_selected_floor - 1].id.toString()}
                      locations={this.state.edit_locations}
                      mapUrl={this.props.maps[this.state.current_selected_floor - 1]}
                      successNotificationHandler={this.successNotificationHandler}
                      map_marker_path={this.state.map_marker_path}/>
    } else {
      return <MapView {...this.props}
                      current_selected_floor={this.state.current_selected_floor.toString()}
                      edit_locations={this.state.edit_locations}
                      mapUrl={this.props.maps[this.state.current_selected_floor - 1]}
                      map_marker_path={this.state.map_marker_path}/>
    }
  }

  render_modal = () => {
    if (window.location.href.includes("?") == false) {
      return <SplashPage />
    }
  }

  render() {
    return (
      <main className="container-fluid" id="main-content">
        <FlashMessages messages={this.state.flash_messages} />
        <div className="row header-row">
          <div className="col-12">
            <h2 className="text-center">{this.props.floors[this.state.current_selected_floor - 1].name}</h2>
          </div>
        </div>
        <div className="row floor-buttons">
          <div className="col-12 col-lg-2">
              <ul className="nav justify-content-center flex-sm-column flex-md-row">
                  {this.props.floors.map((floor, i) => {
                      return (<FloorButton key={`floor.${i}`}
                                           active={i == this.state.current_selected_floor - 1}
                                           floor={floor}
                                           was_searched_floor={this.searched_floor(this.props.search_result_floors, i)}
                                           hit_count={this.state.result_hit_counts[i]}
                                           handler={this.selectFloorHandler} />)
                  })
                  }
              </ul>
          </div>

          <div className="col-12 col-lg-7">
            <div className="row">
              <div className="col-12">
                {this.render_map_view()}
              </div>
            </div>

          </div>

          <div className="col-12 col-lg-3">
            <Legend icon_set={this.create_legend_set()} active_search={this.state.active_search} />
            <MapEditButtons addLocationHandler={this.addLocationHandler}
                            edit_mode={this.state.edit_mode}
                            saveClickedHandler={this.saveClickedHandler}
                            toggleEditHandler={this.toggleEditHandler}
                            {...this.props} />
          </div>

        </div>
        { this.render_modal() }
        <NotificationList errors={this.state.edit_locations.filter(l => l.hasError === true)} successes={this.state.success_notifications} success_notification_fade_delay={this.success_notification_fade_delay} />
      </main>
    );
  }
}

export default MapAndButtons;
