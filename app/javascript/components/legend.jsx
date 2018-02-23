import React from "react"
import PropTypes from "prop-types"
import LegendListElement from './legend_list_element'

class Legend extends React.Component {

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
                    {this.props.icon_set.map((icon, i) => {
                      return(
                        <LegendListElement key={"searched_" + i} icon_url={icon.icon_url} icon_name={icon.icon_name} />
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
  icon_set: PropTypes.array,
  current_selected_floor: PropTypes.string
};
export default Legend
