import { connect } from 'react-redux';
import { login, getMyInfo} from '../actions';
import SelectProviderComponent from '../component/SelectProviderComponent'

const mapStateToProps = state => {
  const { user, auth } = state
  return {
    user: user,
    auth: auth,
  };
};

const SelectProviderContainer = connect(
  mapStateToProps,
  {
    login,
    getMyInfo
  }
)(SelectProviderComponent);

export default SelectProviderContainer;
