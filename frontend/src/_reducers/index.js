import { combineReducers } from 'redux';
import tokenReducer from './tokenReducer';
import keyReducer from './keyReducer';
import userReducer from './userReducer';
import folderReducer from './folderReducer';
import vaultReducer from './vaultReducer';
import statusReducer from './statusReducer';

export default combineReducers({
    token: tokenReducer,
    key: keyReducer,
    user: userReducer,
    folders: folderReducer,
    vaults: vaultReducer,
    status: statusReducer,
})