
import { connect } from 'react-redux';
import ShowImageCheckInComponent from '../component/ShowImageCheckInComponent'

const mapStateToProps = state => {
  const { user } = state
  return {
    user,
  };
};

const ShowImageCheckInContainer = connect(
  mapStateToProps,
  {
   
  }
)(ShowImageCheckInComponent);

export default ShowImageCheckInContainer;
