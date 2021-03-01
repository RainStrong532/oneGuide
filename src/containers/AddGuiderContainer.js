import { connect } from 'react-redux';
import AddGuiderComponent from '../component/AddGuiderComponent'
import { getGudierMatchTour, invitedTour } from '../actions'


const mapStateToProps = (state) => {
    const { tours, user } = state

    return {
        listGuider: tours.listGuider,
        user: user.me
    }

};

const AddGuiderContainer = connect(
    mapStateToProps, {

    getGudierMatchTour,
    invitedTour

}
)(AddGuiderComponent);

export default AddGuiderContainer;