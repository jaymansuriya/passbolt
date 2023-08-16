import { FETCH_FOLDERS, CLEAR_FOLDERS, EDIT_FOLDER, DELETE_FOLDER, ADD_FOLDER } from '../_actions/types';

const folderReducer = (state=[], action) => {
    switch(action.type) {
        case FETCH_FOLDERS.SUCCESS:
            return action.payload
        case ADD_FOLDER.SUCCESS:
            return [
                ...state,
                action.payload
            ]
        case EDIT_FOLDER.SUCCESS:
            return [
                ...state.filter(folder => folder._id !== action.payload._id),
                action.payload,
            ].sort((a, b) => a._id - b._id)
        case DELETE_FOLDER.SUCCESS:
            return state.filter(folder => folder._id !== action.payload)
        case CLEAR_FOLDERS.SUCCESS:
            return []
        default:
            return state
    }
}

export default folderReducer;