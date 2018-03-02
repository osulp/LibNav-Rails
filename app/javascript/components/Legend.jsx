import React from "react"
import PropTypes from "prop-types"
import LegendListElement from './LegendListElement'

class Legend extends React.Component {

  render_column = (icon, i) => {
    if(icon != undefined) {
      return(
        <div className="col-6">
          <LegendListElement key={"searched_" + i}
                             icon_url={icon.icon_url}
                             icon_name={icon.icon_name} />
        </div> 
      );
    }
  }

  render_two_column_list = () => {
    let table_array = []
    for (let i = 0 ; i < this.props.icon_set.length ; i+=2) {
      table_array.push(
        <div className="row">
          {this.render_column(this.props.icon_set[i], i)}
          {this.render_column(this.props.icon_set[i + 1], i + 1)}
        </div>
      );
    }
    return(table_array);
  }

  render() {
    return (
        <div className="row">
          <div className="col-12">
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
                      {this.render_two_column_list()}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
    );
  }
}
Legend.propTypes = {
  icon_set: PropTypes.array,
  current_selected_floor: PropTypes.string
};
export default Legend
