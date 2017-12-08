import React from "react"
import PropTypes from "prop-types"
import FloorButton from "./FloorButton"
import MapView from "./MapView"
import MapEdit from "./MapEdit"
class MapAndButtons extends React.Component {

  handler(e, selected_floor) {
    e.preventDefault()
    this.setState({
      current_selected_floor: selected_floor
    })
  }

  constructor(props) {
    super(props)
    this.handler = this.handler.bind(this)
    this.state = { current_selected_floor: 2 }
  }

  componentDidMount = () => {
    $(document).ready(() => {
      $('.bounding-box').each((index, element) => {
        let name = element.dataset.name;
        $(element).tooltip({ title: name });
        $(element).attr('tabindex', '0');
      })
    });
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
          </div>
          <div className="col-9">
            <MapEdit mapUrl={this.props.maps[this.state.current_selected_floor - 1]}
              locations={this.props.locations}
              id={this.props.floors[this.state.current_selected_floor - 1].id.toString()}
              current_selected_floor={this.state.current_selected_floor.toString()} />
          </div>
        </div>
      </main>
    );
  }
}
export default MapAndButtons

