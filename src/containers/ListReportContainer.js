import { connect } from 'react-redux'
import ListReportComponent from '../component/ListReportComponent'
import { getListReport } from '../actions'

const mapStateToProps = state => {
    const { tours } = state
    return {
        listReport: tours.listReport || []
    }
}

const ListReportContainer = connect(
    mapStateToProps,
    {
        getListReport
    }
)(ListReportComponent)

export default ListReportContainer