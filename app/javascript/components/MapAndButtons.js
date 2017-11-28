import React from "react"
import PropTypes from "prop-types"
import FloorButton from "./FloorButton"
import MapView from "./MapView"
class MapAndButtons extends React.Component {
  render () {
    return (
      <main className="floor-index">
        <div className="row">
          <div className="col-xl-3 col-lg-4 col-3">
            {this.props.floors.map((floor, i) => {
              return (
                <div key={`floor.${i}`} className="row right-padding">
                  <FloorButton key={`floor.${i}`} floor={floor}/>
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

