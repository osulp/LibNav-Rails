import React from "react"
import PropTypes from "prop-types"
class EditButton extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      edit_mode: props.edit_mode
    };
  }

  componentWillReceiveProps = (nextProps) => {
    this.setState({
      edit_mode: nextProps.edit_mode
    });
  }

  render() {
    return (
      <button type="button"
        onClick={this.props.toggleEditHandler}
        className="btn btn-primary center-block">
        {this.state.edit_mode ? "Exit" : "Edit"}
      </button>
    );
  }
}
EditButton.propTypes = {
  edit_mode: PropTypes.bool,
  toggleEditHandler: PropTypes.func
};
export default EditButton;
