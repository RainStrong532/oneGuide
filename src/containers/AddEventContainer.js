import { connect } from 'react-redux';
import { addEvent ,editEvent } from '../actions';
import AddEventComponent from '../component/AddEventComponent'

const mapStateToProps = state => {
  const { user } = state
  return {
    user
  };
};

const AddEventContainer = connect(
  mapStateToProps,
  {
    addEvent,
    editEvent
  }
)(AddEventComponent);

export default AddEventContainer;
