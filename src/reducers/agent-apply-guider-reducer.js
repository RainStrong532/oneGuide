import {
    GET_TOUR_APPLY_GUIDER,
    SUCCESS, GET_LIST_TOUR_INVITE,
    GUIDE_CONFIMR,
    GET_LIST_GUIDE_INVITE,
    GET_LIST_GUIDE_APPLY_TOUR,
    GET_LIST_GUIDE_TOUR,
    GET_GUIDE_TOUR_FINISH
} from '../actions/action-types'
import _ from 'lodash';
const initialState = {
    //listTourAgentApplyGuider: [],
    listTourInvite: [],
    listGuideInvited: [],
    listGuideApply: [],
    listGuideTour: [],
    listGuideFinish: []
};

const agentApplyGuiderReducer = (state = initialState, action) => {

    switch (action.type) {
        case `${GET_TOUR_APPLY_GUIDER}_${SUCCESS}`:
            // console.log("data ve reducer", action.payload);
            return {
                ...state,
                // listTourAgentApplyGuider: action.payload.data
            }
        case `${GET_LIST_TOUR_INVITE}_${SUCCESS}`:
            // console.log("list tour invite tra ve reducer", action.payload);
            let newStateTourInvite = { ...state, listTourInvite: action.payload };
            newStateTourInvite = _.cloneDeep(newStateTourInvite);
            return newStateTourInvite

        case `${GUIDE_CONFIMR}_${SUCCESS}`:
            let newStateTourInviteCancel = { ...state, listTourInvite: action.payload };
            newStateTourInviteCancel = _.cloneDeep(newStateTourInviteCancel);
            return newStateTourInviteCancel

        case `${GET_LIST_GUIDE_INVITE}_${SUCCESS}`:
            // console.log("action . payload treen reduce", action.payload);
            let newListGuideInvite = { ...state, listGuideInvited: action.payload };
            newListGuideInvite = _.cloneDeep(newListGuideInvite);
            return newListGuideInvite

        case `${GET_LIST_GUIDE_APPLY_TOUR}_${SUCCESS}`:

            let newListGuideApply = { ...state, listGuideApply: action.payload };
            newListGuideApply = _.cloneDeep(newListGuideApply);
            return newListGuideApply
        case `${GET_LIST_GUIDE_TOUR}_${SUCCESS}`:
            // console.log("action . payload treen reduce", action.payload);
            let newListGuideTour = { ...state, listGuideTour: action.payload };
            newListGuideTour = _.cloneDeep(newListGuideTour);
            return newListGuideTour

        case `${GET_GUIDE_TOUR_FINISH}_${SUCCESS}`:
            // console.log("action . payload guide finish treen reduce", action.payload);
            let newListGuideFinish = { ...state, listGuideFinish: action.payload };
            newListGuideFinish = _.cloneDeep(newListGuideFinish);
            return newListGuideFinish
        default:
            return state
    }
}
export default agentApplyGuiderReducer

