import { GET_QR } from './action-types'
import { ws, heartCheck } from '../component/socket'



const getQr1 = ({ qr, uuid }) => ({ type: GET_QR, data: { qr, uuid } })
export const getQr = (uuid) => {

    return dispatch => {
        ws(uuid).onmessage = (evt) => {
            heartCheck.reset();
            var msg = JSON.parse(evt.data);
            if (msg.action == "qrcode") {
                const qr = msg.context
                dispatch(getQr1({ qr, uuid }))
            }
        };
    }


}