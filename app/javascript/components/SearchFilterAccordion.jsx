import React from "react"
class SearchFilterAccordion extends React.Component {
  render() {
    return (
      <div className="row">
        <div id="accordion" role="tablist" className="col-12">
          <div className="card">
            <div className="card-header" role="tab" id="headingOne">
              <h5 className="mb-0">
                <a data-toggle="collapse" href="#collapseOne" aria-expanded="true" aria-controls="collapseOne">
                  Services
                </a>
              </h5>
            </div>
            <div id="collapseOne" className="collapse show" role="tabpanel" aria-labelledby="headingOne" data-parent="#accordion">
              <div className="card-body">
                <a href="?utf8=✓&search=circ&commit=Search"> Circulation </a>
              </div>
            </div>
          </div>
          <div className="card">
            <div className="card-header" role="tab" id="headingTwo">
              <h5 className="mb-0">
                <a data-toggle="collapse" href="#collapseTwo" aria-expanded="true" aria-controls="collapseTwo">
                  Facilities
                </a>
              </h5>
            </div>
            <div id="collapseTwo" className="collapse" role="tabpanel" aria-labelledby="headingTwo" data-parent="#accordion">
              <div className="card-body">
                <a href="?utf8=✓&search=Restroom&commit=Search"> Restrooms </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
export default SearchFilterAccordion;
