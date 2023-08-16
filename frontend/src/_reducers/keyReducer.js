import { GET_KEY, CLEAR_KEY } from '../_actions/types';

const keyReducer = (state = "", action) => {
    switch (action.type) {
        case GET_KEY.SUCCESS:
            window.sessionStorage.setItem("enc-key", action.payload)
            return action.payload
        case CLEAR_KEY.SUCCESS:
            window.sessionStorage.removeItem("enc-key")
            window.sessionStorage.removeItem("loggedIn")
            return ""
        default:
            return state
    }
}

export default keyReducer;