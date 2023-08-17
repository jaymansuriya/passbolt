import { GET_TOKEN, CLEAR_TOKEN } from '../_actions/types';

const tokenReducer = (state="", action) => {
    switch(action.type){
        case GET_TOKEN.SUCCESS:
            window.sessionStorage.setItem("access_token", action.payload)
            return action.payload
        case CLEAR_TOKEN.SUCCESS:
            window.sessionStorage.removeItem("access_token")
            return ""
        default:
            return state
    }
}

export default tokenReducer;