import { connect } from 'react-redux';
import {
  getMyInfo,
  getListNotifications,
  deleteNotification,
  likePostNotification,
  getInfomationGroup
} from '../actions';
import NotificationComponent from '../component/NotificationComponent'

const mapStateToProps = state => {
  const { user, notification } = state
  return {
    user,
    notification,
  };
};

const NotificationContainer = connect(
  mapStateToProps,
  {
    getMyInfo,
    getListNotifications,
    deleteNotification,
    likePostNotification,
    getInfomationGroup
  }
)(NotificationComponent);

export default NotificationContainer;
