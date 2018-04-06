import React from "react"
import PropTypes from "prop-types"
import LegendListElement from './LegendListElement'

class Legend extends React.Component {

  render_column = (icon, i) => {
    if(icon != undefined) {
      return(
          <LegendListElement key={"searched_" + i}
                             icon_url={icon.icon_url}
                             icon_name={icon.icon_name}
                             selected_element={this.selected_element(icon.icon_name)}
          />
      );
    }
  }

  render_two_column_list = () => {
    let table_array = [];
    for (let i = 0 ; i < this.props.icon_set.length ; i+=3) {
      table_array.push(
        <div className={"row"}>
          {this.render_column(this.props.icon_set[i], i)}
          {this.render_column(this.props.icon_set[i + 1], i + 1)}
          {this.render_column(this.props.icon_set[i + 2], i + 2)}
        </div>
      );
    }
    return(table_array);
  }

  hidden_class_name = () => {
    if (this.props.icon_set.length == 0) {
      return 'd-none'
    } else {
      return ''
    }
  }

  selected_element = (icon_name) => {
    if (icon_name == this.props.active_search) {
      return true;
    } else {
      return false;
    }
  }

  render() {
    return (
        <div className={`row ${this.hidden_class_name()}`}>
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
                    <div className={"container"}>
                      {this.render_two_column_list()}
                    </div>
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
  active_search: PropTypes.string,
  current_selected_floor: PropTypes.string
};
export default Legend
