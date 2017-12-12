import React from "react"
import PropTypes from "prop-types"
import FloorButton from "./FloorButton"
import ToggleEditButton from './ToggleEditButton'
import MapView from "./MapView"
import MapEdit from "./MapEdit"
import Map from "./Map"
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

  handler(e, selected_floor) {
    e.preventDefault()
    this.setState({
      current_selected_floor: selected_floor
    })
  }

  constructor(props) {
    super(props)
    this.handler = this.handler.bind(this)
    this.toggleHandler = this.toggleHandler.bind(this)
    this.state = { current_selected_floor: 2, edit_mode: false }
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

  render_map_view() {
    if (this.state.edit_mode == true) {
      return <MapEdit mapUrl={this.props.maps[this.state.current_selected_floor - 1]}
        locations={this.props.edit_locations}
        id={this.props.floors[this.state.current_selected_floor - 1].id.toString()}
        current_selected_floor={this.state.current_selected_floor.toString()} />
    } else {
      return <MapView mapUrl={this.props.maps[this.state.current_selected_floor - 1]}
        locations={this.props.locations}
        current_selected_floor={this.state.current_selected_floor.toString()} />

    }
  }

  render() {
    return (
      <main className="floor-index">
        <div className="row">
          <div className="col-xl-3 col-lg-4 col-3">
            {this.props.floors.map((floor, i) => {
              return (
                <div key={`floor.${i}`} className="row right-padding">
                  <FloorButton key={`floor.${i}`}
                    floor={floor}
                    was_searched_floor={this.searched_floor(this.props.search_result_floors, i)}
                    handler={this.handler} />
                </div>
              )
            })}
            <ToggleEditButton handler={this.toggleHandler} edit_state={this.state.edit_mode} />
          </div>
          <div className="col-9">
            <h2>{this.props.floors[this.state.current_selected_floor - 1].name}</h2>
            {this.render_map_view()}
          </div>
        </div>
      </main>
    );
  }
}
export default MapAndButtons

