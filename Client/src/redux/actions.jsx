import { GET_QR, GET_HEADER, GET_NICK_NAME, GET_WXID, GET_LOGIN, REGISTER} from './action-types'
import { ws, heartCheck } from '../component/socket'



const getQr = ({ qr, uuid }) => ({ type: GET_QR, data: { qr, uuid } })
const getWxID = (wxid) => ({ type: GET_WXID, data: { wxid } })
const getHeader = (header) => ({ type: GET_HEADER, data: { header } })
const getNickname = (nickname) => ({ type: GET_NICK_NAME, data: { nickname } })
const getloginSuccess = (loginSuccess) => ({ type: GET_LOGIN, data: { loginSuccess } })
const getregister=user=>({type:REGISTER,data:user})
export const WxLogin = (uuid) => {

    return dispatch => {
        ws(uuid).onmessage = (evt) => {
            heartCheck.reset();
            var msg = JSON.parse(evt.data);
            switch (msg.action) {
                case 'log':
                    const loginSuccess = msg.context
                    if (loginSuccess == '登录成功') {
                        dispatch(getloginSuccess({loginSuccess:true}))
                    }
                    if(loginSuccess=='正在登录中'){
                        dispatch(getloginSuccess({loginSuccess:'正在登录中'}))
                    }
                    break;
                case 'qrcode'://返回二维码
                    const qr = msg.context
                    dispatch(getQr({ qr, uuid }))
                    break;
                case 'wxid':
                    const wxid = msg.context//wxid
                    dispatch(getWxID(wxid))
                    break;
                case 'headimgurl':
                    const header = msg.context//头像
                    dispatch(getHeader(header))
                    break;
                case 'nickname':
                    const nickname = msg.context//昵称
                    dispatch(getNickname(nickname))
                    break;
            }
        };
    }
}
export const register=({username,password,email,phone,uuid})=>{
    return async dispatch=>{
        const response=await fetch('http://e24589943k.wicp.vip/users/register',{
            method: 'POST',
            //credentials: 'include',
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json',
                'Accept': ' application/json'
            },
            body: JSON.stringify({username,password,email,phone,uuid})
        })
        dispatch(getregister({username,password,phone,uuid}))
        console.log({username,password,phone,uuid})

    }
}
export const Sendline=()=>{
    return dispatch=>{
        
    }
}