
import { connect } from 'react-redux';
import { login, getMyInfo, getHotPostRelated } from '../actions';
import HotPostRelatedComponent from '../component/HotPostRelatedComponent'

const mapStateToProps = state => {
    const { tours } = state
    return {

        // listDataHot: tours && tours.listTrackingHistory ? tours.listTrackingHistory : []
    };
};

const HotPostRelatedContainer = connect(
    mapStateToProps,
    {
        getHotPostRelated
    }
)(HotPostRelatedComponent);

export default HotPostRelatedContainer;