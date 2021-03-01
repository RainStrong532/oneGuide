import { connect } from 'react-redux';
import {
  deleteEvent,
} from '../actions';
import FreeDayListComponent from '../component/FreeDayListComponent'

const mapStateToProps = state => {
  const { user, tours } = state
  return {
    user,
    tours
  };
};

const FreeDayListContainer = connect(
  mapStateToProps,
  {
    deleteEvent,
  }
)(FreeDayListComponent);

export default FreeDayListContainer;
