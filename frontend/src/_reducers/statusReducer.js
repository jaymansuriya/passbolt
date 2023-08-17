import { REQUEST } from '../_actions/types';

const initialState = {
    code: 0,
    msg: "",
}

const statusReducer = (state = initialState, action) => {
    switch (action.type) {
        case REQUEST.DISPLAY:
            return {
                code: action.payload.code,
                msg: action.payload.msg,
            }
        case REQUEST.CLEAR:
            return initialState
        default:
            return state
    }
}

export default statusReducer;