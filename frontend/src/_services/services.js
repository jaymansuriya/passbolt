import CryptoJS from 'crypto-js';
import axios from 'axios';
import store from '../store';
const dotenv = require("dotenv");
dotenv.config();
const BACKEND_URL =  "https://passbolt.onrender.com"

export const encrypt = text => {
    let key = store.getState().key
    let res = CryptoJS.AES.encrypt(text, key)
    return res.toString()
}

export const decrypt = text => {
    let key = store.getState().key
    let res = CryptoJS.AES.decrypt(text, key)
    return res.toString(CryptoJS.enc.Utf8)
}

export const produceKey = (username, password) => {
    let hash = CryptoJS.SHA256(username)
    return CryptoJS.PBKDF2(password, hash, { keySize: 256 / 32, iteration: 100 }).toString()
}

export const login = (username, password) => {
    return axios.post(`${BACKEND_URL}/api/v1/auth/login`, {
        username: username,
        password: password,
    })
}

export const logout = () => {
    return true
}

export const fetchData = (url, token) => {
    return axios.get(`${BACKEND_URL}/api/v1/${url}`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
}

export const addData = (url, data) => {
    const token = store.getState().token
    return axios.post(`${BACKEND_URL}/api/v1/${url}/add`, data, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
}

export const editData = (url, data) => {
    const token = store.getState().token
    return axios.put(`${BACKEND_URL}/api/v1/${url}`, data, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
}

export const deleteData = (url, data) => {
    const token = store.getState().token
    return axios.delete(`${BACKEND_URL}/api/v1/${url}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
        data: {
            current_password: data,
        }
    })
}

export const encryptAllVaults = () => {
    const vaults = store.getState().vaults
    let newVaults = vaults.map(vault => ({
        ...vault,
        username: encrypt(vault.username),
        password: encrypt(vault.password),
    }))
    newVaults.map(async vault => {
        await editData(`vaults/${vault._id}/`, vault)
    })
    return newVaults
}

export const shouldUpdateVaults = (v1, v2) => {
    return !(v1.username === v2.username && v1.password === v2.password && v1.name === v2.name && v1.fid === v2.fid)
}

export const mapFolders = (folders, vaults) => {
    let newFolders = store.getState().folders
    let map = {}
    folders.map(f => {
        newFolders.map(nf => {
            if (nf.name === f.name) {
                map[f._id] = nf._id
            }
            return nf
        })
        return f
    })
    return map
}

export const saveImportedVaults = async vaults => {
    let encryptedVaults = vaults.map(vault => ({
        ...vault,
        username: encrypt(vault.username),
        password: encrypt(vault.password),
    }))
    encryptedVaults.map(async v => {
        return addData('vaults/', v)
    })
    return encryptedVaults
}