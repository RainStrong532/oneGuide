import { TEST_ACTION ,SUCCESS} from '../actions/action-types'

const initialState = {
    mess: ''
};

const testReduecr = (state = initialState, action) => {
  switch (action.type) {
    case `${TEST_ACTION}_${SUCCESS}`:
      return {
        ...state,
        mess: action.payload
      }
    default:
      return state
  }
}

export default testReduecr
