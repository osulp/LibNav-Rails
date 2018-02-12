import React from "react"
import PropTypes from "prop-types"
import AddLocation from './AddLocation';
import EditButton from './EditButton';
import SaveButton from './SaveButton';
class MapEditButtons extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      edit_mode: props.edit_mode
    };
  }

  componentWillReceiveProps = (nextProps) => this.setState({ edit_mode: nextProps.edit_mode })

  render() {
    return (
      <div className="row">
        <div className="d-none d-lg-block col-12">
          <div className="row mt-2">
            <div className="col-12">
              { this.state.edit_mode && this.props.admin_user ? <AddLocation {...this.props} /> : '' }
            </div>
          </div>
          <div className="row mt-3">
            <div className="col-4">
              { this.props.admin_user ? <EditButton edit_mode={this.state.edit_mode} {...this.props} /> : '' }
            </div>
            <div className="col-4">
              { this.props.admin_user && this.state.edit_mode ? <SaveButton /> : '' }
            </div>
          </div>
          { this.state.edit_mode && this.props.admin_user ? <div className="alert save-result hidden" /> : '' }
        </div>
      </div>
    );
  }
}

MapEditButtons.propTypes = {
  addLocationHandler: PropTypes.func,
  admin_user: PropTypes.bool,
  edit_mode: PropTypes.bool,
  toggleEditHandler: PropTypes.func,
};
export default MapEditButtons;
