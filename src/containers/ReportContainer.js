import { connect } from 'react-redux';
import { sendReport, getListReport } from '../actions';
import ReportComponent from '../component/ReportComponent'

const mapStateToProps = state => {
    const { user, tours } = state
    return {
        user: user,
        listReport: tours ? tours.listReport : []
    };
};

const ReportContainer = connect(
    mapStateToProps,
    {
        sendReport,
        getListReport
    }
)(ReportComponent);

export default ReportContainer;

