import { GET_TOKEN, CLEAR_TOKEN, GET_KEY, CLEAR_KEY, REQUEST } from './types';
import { FETCH_VAULTS, CLEAR_VAULTS, ADD_VAULT, EDIT_VAULT, DELETE_VAULT } from './types'
import { FETCH_FOLDERS, CLEAR_FOLDERS, ADD_FOLDER, EDIT_FOLDER, DELETE_FOLDER } from './types'
import { FETCH_USER, CLEAR_USER, EDIT_USER } from './types'
import { produceKey, login, logout, fetchData, deleteData, decrypt, encryptAllVaults, addData, mapFolders, saveImportedVaults } from '../_services/services';

export const getToken = data => dispatch => {
    dispatch({ type: GET_TOKEN.SUCCESS, payload: data })
}

export const getKey = data => dispatch => {
    dispatch({ type: GET_KEY.SUCCESS, payload: data })
}

export const loginUser = (username, password, token) => dispatch => {
    dispatch(getToken(token))
    dispatch(getKey(produceKey(username, password)))
    dispatch(fetchUser(token))
    dispatch(fetchFolders(token))
    dispatch(fetchVaults(token))

}

export const continueSession = token => dispatch => {
    dispatch(fetchUser(token))
    dispatch(fetchFolders(token))
    dispatch(fetchVaults(token))
}

export const logoutUser = isDelete => dispatch => {
    if (!isDelete)
        logout()
    dispatch({ type: CLEAR_TOKEN.SUCCESS })
    dispatch({ type: CLEAR_KEY.SUCCESS })
    dispatch({ type: CLEAR_USER.SUCCESS })
    dispatch({ type: CLEAR_FOLDERS.SUCCESS })
    dispatch({ type: CLEAR_VAULTS.SUCCESS })
}

export const fetchUser = token => dispatch => {
    fetchData('users/', token)
        .then(res => {
            dispatch({ type: FETCH_USER.SUCCESS, payload: res.data })
        })
        .catch(res => {
            console.log(res.response)
            if (res.response.status === 500) {
                dispatch(displayError({ code: res.response.status, msg: "Server is Unreachable. Please try again later." }))
            }
        })
}

export const fetchFolders = token => dispatch => {
    fetchData('folders/', token)
        .then(res => {
            dispatch({ type: FETCH_FOLDERS.SUCCESS, payload: res.data })
        })
        .catch(res => {
            console.log(res.response)
            if (res.response.status === 500) {
                dispatch(displayError({ code: res.response.status, msg: "Server is Unreachable. Please try again later." }))
            }
        })
}

export const fetchVaults = token => dispatch => {
    fetchData('vaults/', token)
        .then(res => {
            let data = res.data.map(vault => ({
                ...vault,
                username: decrypt(vault.username),
                password: decrypt(vault.password),
            }))
            dispatch({ type: FETCH_VAULTS.SUCCESS, payload: data })
        })
        .catch(res => {
            console.log(res.response)
            if (res.response.status === 500) {
                dispatch(displayError({ code: res.response.status, msg: "Server is Unreachable. Please try again later." }))
            }
        })
}

export const addVault = data => dispatch => {
    dispatch({
        type: ADD_VAULT.SUCCESS, payload: {
            ...data,
            username: decrypt(data.username),
            password: decrypt(data.password),
        }
    })
}

export const editVault = data => dispatch => {
    dispatch({
        type: EDIT_VAULT.SUCCESS, payload: {
            ...data,
            username: decrypt(data.username),
            password: decrypt(data.password),
        }
    })
}

export const deleteVault = data => dispatch => {
    deleteData(`vaults/${data}/`)
        .then(res => {
            dispatch({ type: DELETE_VAULT.SUCCESS, payload: data })
            dispatch(displayError({ code: 200, msg: "Vault Deleted" }))
        })
        .catch(res => {
            if (res.response.status === 500) {
                dispatch(displayError({ code: res.response.status, msg: "Server is Unreachable. Please try again later." }))
            }
        })
}

export const addFolder = data => dispatch => {
    dispatch({ type: ADD_FOLDER.SUCCESS, payload: data })
}

export const editFolder = data => dispatch => {
    console.log("editFolder action", data)
    dispatch({ type: EDIT_FOLDER.SUCCESS, payload: data })
}

export const deleteFolder = data => dispatch => {
    deleteData(`folders/${data}/`)
        .then(res => {
            dispatch({ type: DELETE_FOLDER.SUCCESS, payload: data })
            dispatch(displayError({ code: 200, msg: "Folder Deleted" }))
        })
        .catch(res => {
            if (res.response.status === 500) {
                dispatch(displayError({ code: res.response.status, msg: "Server is Unreachable. Please try again later." }))
            }
        })
}

export const addUser = (username, password) => dispatch => {
    login(username, password)
        .then(res => {
            dispatch(loginUser(username, password, res.data.auth_token))
        })
}

export const editUser = data => dispatch => {
    dispatch({ type: EDIT_USER.SUCCESS, payload: data })
}

export const updateVaultsAfterUserChange = (username, password) => dispatch => {
    let newKey = produceKey(username, password)
    dispatch(getKey(newKey))
    let newVaults = encryptAllVaults()
    newVaults.map(vault => dispatch(editVault(vault)))
}

export const displayError = data => dispatch => {
    dispatch({ type: REQUEST.DISPLAY, payload: data })
}

export const clearError = data => dispatch => {
    dispatch({ type: REQUEST.CLEAR, paylad: data })
}

export const importFolders = (folders, vaults) => dispatch => {
    folders.map((f, index) => {
        addData('folders/', { name: f.name })
            .then(res => {
                dispatch(addFolder(res.data))
                if (index === folders.length - 1) {
                    dispatch(importVaults(folders, vaults))
                }
            })
        return f
    })
    // dispatch(importVaults(folders, vaults))
}

export const importVaults = (folders, vaults) => dispatch => {
    let newFolders = mapFolders(folders)
    let newVaults = vaults.map(v => ({
        ...v,
        folder: newFolders[v.folder],
    }))
    let flag = true
    newVaults.map(v => {
        if (!v.folder)
            flag = false
        return v
    })
    if (flag) {
        saveImportedVaults(newVaults)
            .then(res => res.map(v => dispatch(addVault(v))))
            .then(() => dispatch(displayError({ code: 201, msg: "Import Successful" })))
    }
}