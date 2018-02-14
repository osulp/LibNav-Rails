import React from "react"
import PropTypes from "prop-types"
import { isNullOrUndefined } from "util";

class NotificationListItem extends React.Component {
  static PropTypes = {
    className: PropTypes.string,
    delay: PropTypes.number.optional,
    text: PropTypes.string.optional,
    location: PropTypes.shape({
      id: PropTypes.integer,
      name: PropTypes.string
    }).optional
  }

  static defaultProps = {
    className: null,
    delay: 3000,
    text: null,
    location: null
  }

  constructor(props) {
    super(props);
    this.state = {
      fadeOutClassName: '',
      text: this.getText(props)
    }
  }

  componentWillReceiveProps = (nextProps) => {
    this.setState({
      text: this.getText(nextProps)
    });
  }

  componentDidMount = () => {
    let id_selector = this.getIdSelector(this.props);
    if(!isNullOrUndefined(id_selector)){
      setTimeout(() => {
        this.setState({ fadeOutClassName: 'fade-out' });
      }, this.props.delay);
    }
  }

  getIdSelector = (props) => {
    if(!isNullOrUndefined(props.location)){
      return `#notification_location_${props.location.id}`;
    } else {
      return null;
    }
  }

  getText = (props) => {
    if(!isNullOrUndefined(props.location) && isNullOrUndefined(props.text)){
      return `${props.location.name} saved.`;
    } else {
      return props.text;
    }
  }

  render() {
    return (
      <li id={this.getIdSelector(this.props)} className={`${this.props.className} ${this.state.fadeOutClassName }`}>
        <span>
          { this.state.text }
        </span>
      </li>
    );
  }
}
export default NotificationListItem;
