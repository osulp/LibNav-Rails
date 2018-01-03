import React from "react"
import PropTypes from "prop-types"
class SplashPage extends React.Component {

  componentDidMount = () => {
    $(document).on('click', (event) => {
      $('.modal').modal('toggle');
    });
  }

  render() {
    return (
        <div className="modal fade" id="exampleModal" tabIndex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-body">
                <h1><p className="modal_text"> Welcome to LibNav </p></h1>
                <p className="modal_text"> To begin using LibNav search a location within the library (E.g. Circulation) or search for an areas trait (E.g. Natural Lighting) </p>
                <p className="modal_text"> Or use the quick links on the right hand of the screen to find some common places around the library! </p>
                <p className="modal_text"> Happy Navigation! </p>
                <p className="modal_text"> Tap anywhere to continue. </p>
              </div>
            </div>
          </div>
        </div>
    );
  }
}
SplashPage.propTypes = {
  edit_state: PropTypes.bool,
  handler: PropTypes.func
};
export default SplashPage
