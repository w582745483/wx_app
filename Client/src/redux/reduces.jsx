import { combineReducers } from 'redux'

import { GET_QR,GET_HEADER,GET_WXID,GET_NICK_NAME,GET_LOGIN} from './action-types'
const initQr = {
    qr: "",
    uuid:'',
    wxid:'',
    header:'',
    nickname:'',
    loginSuccess:false
}

function Qr(state = initQr, action) {
    switch (action.type) {
        case GET_QR:
            return {...state,...action.data}
        case GET_HEADER:
            return  {...state,...action.data}
        case GET_NICK_NAME:
            return  {...state,...action.data}
        case GET_WXID:
            return  {...state,...action.data}
        case GET_LOGIN:
            return  {...state,...action.data}
        default:
            return state
    }
}

export default combineReducers({
    Qr
})