import React from "react";
import PropTypes from "prop-types";
import NotificationListItem from "./NotificationListItem";

class NotificationList extends React.Component {
  static PropTypes = {
    errors: PropTypes.array.optional,
    successes: PropTypes.array.optional,
    success_notification_fade_delay: PropTypes.number
  }

  static defaultProps = {
    errors: [],
    successes: [],
    success_notification_fade_delay: 3000
  }

  constructor(props) {
    super(props);
    this.state = {
      errors: props.errors,
      errorNotificationListItem: this.errorNotificationListItem(props.errors),
      successes: props.successes,
      successNotificationListItems: props.successes.map(location => this.notificationListItem(location))
    };
  }

  componentWillReceiveProps = (nextProps) => {
    this.setState({
      errors: nextProps.errors,
      errorNotificationListItem: this.errorNotificationListItem(nextProps.errors),
      successes: nextProps.successes,
      successNotificationListItems: nextProps.successes.map(location => this.notificationListItem(location))
    });
  }

  notificationListItem = (location) => {
    return (<NotificationListItem key={`success-${location.id}`} className='alert alert-success' location={location} delay={this.props.success_notification_fade_delay} />);
  }

  errorNotificationListItem = (errors) => {
    if(errors.length === 0){
      return null;
    }
    let message = `${errors.length} location${errors.length !== 1 ? 's' : ''} failed to save.`;
    return (<NotificationListItem key='error-notification-list-item' className='alert alert-danger' text={ message } />);
  }

  containerStyles = () => {
    let styles = ['notification-list'];
    styles.push(this.state.errors.length > 0 || this.state.successes.length > 0 ? 'visible' : 'invisible');
    return styles.join(' ');
  }

  render() {
    return (
      <div className={this.containerStyles()}>
        <ul>
          { this.state.errorNotificationListItem }
          { this.state.successNotificationListItems }
        </ul>
      </div>
    );
  }
}
export default NotificationList;
