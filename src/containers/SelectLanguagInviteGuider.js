
import { connect } from 'react-redux';
import { getListLanguage } from '../actions';
import SelectLanguageInviteGuiderComponent from '../component/SelectLanguageInviteGuider'

const mapStateToProps = state => {
    const { user } = state
    return {
        user
    };
};

const SelectLanguageInviteGuiderContainer = connect(
    mapStateToProps,
    {
        getListLanguage
    }
)(SelectLanguageInviteGuiderComponent);

export default SelectLanguageInviteGuiderContainer;