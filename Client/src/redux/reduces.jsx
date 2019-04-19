import { combineReducers } from 'redux'

import { GET_QR } from './action-types'
const initQr = {
    qr: "",
    uuid:''
}

function Qr(state = initQr, action) {
    switch (action.type) {
        case GET_QR:
        console.log('GET_QR',action.data)
            return {...initQr,src:action.data}
        default:
            return state
    }
}

export default combineReducers({
    Qr
})