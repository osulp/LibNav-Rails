import React from "react"
import PropTypes from "prop-types"
import FloorButton from "./FloorButton"
import MapView from "./MapView"
class MapAndButtons extends React.Component {
  searched_floor(search_result_floors, floor_index) {

    if(search_result_floors == null){
      return false
    } else if (search_result_floors[floor_index]) {
      return true
    } else {
      return false
    }

  }

  render () {
    return (
      <main className="floor-index">
        <div className="row">
          <div className="col-xl-3 col-lg-4 col-3">
            {this.props.floors.map((floor, i) => {
              return (
                <div key={`floor.${i}`} className="row right-padding">
                  <FloorButton key={`floor.${i}`} floor={floor} was_searched_floor={this.searched_floor(this.props.search_result_floors, i)}/>
                </div>
              )
            })}
          </div>
          <div className="col-9">
            <MapView mapUrl={this.props.map} locations={this.props.locations}/>
          </div>
        </div>
      </main>
    );
  }
}
export default MapAndButtons

