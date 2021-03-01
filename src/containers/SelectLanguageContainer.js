
import { connect } from 'react-redux';
import { login, getMyInfo} from '../actions';
import SelectLanguageComponent from '../component/SelectLanguageComponent'

const mapStateToProps = state => {
  const { user, auth } = state
  return {
    user: user,
    auth: auth,
  };
};

const SelectLanguageContainer = connect(
  mapStateToProps,
  {
    login,
    getMyInfo
  }
)(SelectLanguageComponent);

export default SelectLanguageContainer;