import { combineReducers } from 'redux'

import { GET_QR,GET_HEADER,GET_WXID,GET_NICK_NAME } from './action-types'
const initQr = {
    qr: "",
    uuid:''
}

function Qr(state = initQr, action) {
    switch (action.type) {
        case GET_QR:
            return {...initQr,...action.data}
        case GET_HEADER:
            return action.data
        case GET_NICK_NAME:
            return action.data
        case GET_WXID:
            return action.data
        default:
            return state
    }
}

export default combineReducers({
    Qr
})