import { GET_QR } from './action-types'
import { ws, heartCheck } from '../component/socket'
import { resolve } from 'path';


const getQr1 = (qr) => ({ type: GET_QR, data: qr })
export const getQr = () => { 
    return dispatch => {
        ws().onmessage = (evt) => {
            heartCheck.reset();
            var msg = JSON.parse(evt.data);
            if (msg.action == "qrcode") {
                console.log('qrcode', msg.context)
                dispatch(getQr1(msg.context))
            }
        };
    }


}