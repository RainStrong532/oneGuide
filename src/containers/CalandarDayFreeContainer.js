
import { connect } from 'react-redux';
import { getListFreeday, getListCalendar, updateProfileInfo } from '../actions';
import CalandarDayFreeComponent from '../component/CalandarDayFreeComponent'

const mapStateToProps = state => {
  const { user, posts } = state
  return {
    user,
  };
};

const CalandarDayFreeContainer = connect(
  mapStateToProps,
  {
    getListFreeday,
    getListCalendar,
    updateProfileInfo
  }
)(CalandarDayFreeComponent);

export default CalandarDayFreeContainer;
