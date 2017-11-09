import React from "react"
import PropTypes from "prop-types"
class HelloWorld extends React.Component {
  render () {
    return (
      <main className="floor-index">
        <div className="row">
          <div className="col-xl-3 col-lg-4 col-12 tabs">
            <p> Hello World!!!!!!!!!!!!!! </p>
          </div>
          <div className="col-12 col-xl-9 col-lg-8 tab-content" id="floors-tabContent">
          </div>
        </div>
      </main>
    );
  }
}

HelloWorld.propTypes = {
  greeting: PropTypes.string
};
export default HelloWorld
