import { connect } from 'react-redux'
import SeeAllPostTip from '../component/SeeAllPostTip'
import { getListPostTip } from '../actions';
const mapStateToProps = state => {
    const { tours } = state
    return {
        listPostTips: tours && tours.listPostTip ? tours.listPostTip : []
    }
}

const SeeAllPostTipContainer = connect(
    mapStateToProps,
    {
        getListPostTip,
    }
)(SeeAllPostTip)
export default SeeAllPostTipContainer