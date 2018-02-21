import React from "react"
import PropTypes from "prop-types"
import LegendListElement from './legend_list_element'

class Legend extends React.Component {

  filter_selected_floor_and_no_icon(locations){
    return locations.filter(url => url.split(":")[2] == this.props.current_selected_floor).filter(url => url.split(":")[1] !== "")
  }

  render() {
    return (
        <div className="row">
          <div className="col-4"></div>
          <div className="col-4">
            <div>
              <div className="card">
                <div className="card-header" id="headingOne">
                  <h5 className="mb-0">
                    Map Legend
                  </h5>
                </div>
                <div>
                  <div className="card-block">
                    <ul className="list-unstyled">
                    {this.filter_selected_floor_and_no_icon(this.props.persistent_locations).map((location, i) => {
                      return(
                        <LegendListElement key={"persistent_" + i} location_url={location.split(":")[0]} location_name={location.split(":")[1]} />
                      );
                    })}
                    {this.filter_selected_floor_and_no_icon(this.props.searched_locations).map((location, i) => {
                      return(
                        <LegendListElement key={"searched_" + i} location_url={location.split(":")[0]} location_name={location.split(":")[1]} />
                      );
                    })}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-4"></div>
        </div>
    );
  }
}
Legend.propTypes = {
  persistent_locations: PropTypes.array,
  searched_locations: PropTypes.array,
  current_selected_floor: PropTypes.string
};
export default Legend
