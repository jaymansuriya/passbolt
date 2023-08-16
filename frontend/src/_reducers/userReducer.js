import { FETCH_USER, CLEAR_USER, EDIT_USER } from '../_actions/types';

const userReducer = (state={}, action) => {
    switch(action.type) {
        case FETCH_USER.SUCCESS:
            return action.payload
        case CLEAR_USER.SUCCESS:
            return {}
        case EDIT_USER.SUCCESS:
            return action.payload
        default:
            return state
    }
}

export default userReducer;