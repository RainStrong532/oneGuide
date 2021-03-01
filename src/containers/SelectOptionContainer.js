
import { connect } from 'react-redux';
import { getListLanguage } from '../actions';
import SelectOptionsComponent from '../component/SelectOptionsComponent'

const mapStateToProps = state => {
  const { user } = state
  return {
    user
  };
};

const SelectOptionContainer = connect(
  mapStateToProps,
  {
    getListLanguage
  }
)(SelectOptionsComponent);

export default SelectOptionContainer;