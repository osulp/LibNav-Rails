import React from "react"
import PropTypes from "prop-types"
class SavingIndicator extends React.Component {
  static PropTypes = {
    height: PropTypes.number,
    isSaving: PropTypes.bool,
    position_x: PropTypes.number,
    position_y: PropTypes.number,
    width: PropTypes.number
  }

  constructor(props) {
    super(props);
    let height = Math.min(props.height, 30);
    let width = Math.min(props.width, 120);
    this.state = {
      height: height,
      isSaving: props.isSaving,
      position_x: props.position_x - (width / 2),
      position_y: props.position_y - (height / 2),
      width: width
    };
  }

  componentWillReceiveProps = (nextProps) => {
    let height = Math.min(nextProps.height, 30);
    let width = Math.min(nextProps.width, 120);
    this.setState({
      height: height,
      isSaving: nextProps.isSaving,
      position_x: nextProps.position_x - (width / 2),
      position_y: nextProps.position_y - (height / 2),
      width: width
    });
  }

  renderIndicator() {
    if(!this.state.isSaving) {
      return null;
    }
    return (
      <svg width={this.state.width}
           height={this.state.height}
           viewBox={`0 0 ${this.state.width} ${this.state.height}`}
           xmlns="http://www.w3.org/2000/svg"
           fill="#fff"
           x={this.state.position_x}
           y={this.state.position_y}>
          <circle cx={(this.state.width / 3) - 7 } cy='15' r="15">
              <animate attributeName="r" from="15" to="15"
                      begin="0s" dur="0.8s"
                      values="15;9;15" calcMode="linear"
                      repeatCount="indefinite" />
              <animate attributeName="fill-opacity" from="1" to="1"
                      begin="0s" dur="0.8s"
                      values="1;.5;1" calcMode="linear"
                      repeatCount="indefinite" />
          </circle>
          <circle cx={((this.state.width / 3) - 7) * 2} cy="15" r="9" fillOpacity="0.3">
              <animate attributeName="r" from="9" to="9"
                      begin="0s" dur="0.8s"
                      values="9;15;9" calcMode="linear"
                      repeatCount="indefinite" />
              <animate attributeName="fill-opacity" from="0.5" to="0.5"
                      begin="0s" dur="0.8s"
                      values=".5;1;.5" calcMode="linear"
                      repeatCount="indefinite" />
          </circle>
          <circle cx={((this.state.width / 3) - 7) * 3} cy="15" r="15">
              <animate attributeName="r" from="15" to="15"
                      begin="0s" dur="0.8s"
                      values="15;9;15" calcMode="linear"
                      repeatCount="indefinite" />
              <animate attributeName="fill-opacity" from="1" to="1"
                      begin="0s" dur="0.8s"
                      values="1;.5;1" calcMode="linear"
                      repeatCount="indefinite" />
          </circle>
      </svg>
    );
  }

  render = () => this.renderIndicator()
}
export default SavingIndicator;
