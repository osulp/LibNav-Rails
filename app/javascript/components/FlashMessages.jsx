import React from "react"
import PropTypes from "prop-types"
class FlashMessages extends React.Component {
  render() {
    return Object.keys(this.props.messages).map(flash =>
      <div key={flash + 'flash'} role='alert' className={`alert alert-${flash} alert-dismissible fade show`}>
        {this.props.messages[flash]}
        <button type="button" className="close" data-dismiss="alert" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
    );
  }
}
FlashMessages.propTypes = {
  messages: PropTypes.object
};
export default FlashMessages;
