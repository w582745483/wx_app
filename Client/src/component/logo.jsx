import React, { Component } from 'react';
import PubSub from 'pubsub-js'
import io from 'socket.io-client'

import '../assets/css/main.css'
import refresh from '../assets/img/refresh.jpg'

export default class Logo extends Component {
    state = {
        src: "",
        qr: '使用手机微信扫码登录',
        opacity: '1',
        isshow: false,
    }

    handleClick2 = () => {
       
        fetch("http://47.93.189.47:8818/WebService1.asmx/SendTimeLine", {
            method: 'POST',
            credentials: 'include',
            mode: 'cors'
        })
            .then(res => res.text())
            .then(data => {
                console.log('data', data)
            })


    }
     uuid=()=> {
        var s = [];
        var hexDigits = "0123456789abcdef";
        for (var i = 0; i < 36; i++) {
            s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
        }
        s[14] = "4";  // bits 12-15 of the time_hi_and_version field to 0010
        s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1);  // bits 6-7 of the clock_seq_hi_and_reserved to 01
        s[8] = s[13] = s[18] = s[23] = "-";

        var uuid = s.join("");
        return uuid;
    }
    handleRefresh = () => {
        let current = 0;
        this.timer1 = setInterval(() => {
            current = (current + 30) % 360;
            this.setState({
                transform: 'rotate(' + current + 'deg)'
            })
        }, 10)
        fetch("http://47.93.189.47:8818/WebService1.asmx/GetLoginQrcode")
            .then(res => res.text())
            .then(data => {
                clearInterval(this.timer1)
                this.setState({
                    src: "data:image/jpg;base64," + data.substr(data.lastIndexOf('_Qk') + 1, data.length)
                })
                this.setState({
                    qr: '使用手机微信扫码登录',
                    opacity: '1',
                    isshow: false
                })
                this.timeInit=setTimeout(() => {
                    this.setState({
                        qr: '二维码失效，点击刷新',
                        opacity: '0.4',
                        isshow: true
                    })
                }, 200000)
                this.timeGetGetWxid = setInterval(() => {
                    fetch("http://47.93.189.47:8818/WebService1.asmx/GetUserWxidAndHeadImageUrl", {
                        credentials: 'include',
                        mode: 'cors'
                    })
                        .then(res => res.text())
                        .then(data => {
                            if (data != "logout" && data != "Please make sure you have loggined" && data.length > 2) {
                                PubSub.publish('wxid_header', data)
                                console.log('setInterval if')  
                                clearTimeout(this.timeInit)               
                            }
                            if (data == 'logout') {
                                console.log('setInterval else')
                                PubSub.publish('logout', data)
                                clearInterval(this.timeGetGetWxid)
                            }
                        })
                }, 3000)
            })
    }
    handleClick3=()=> {
        // if(!io.socket){
        //     let uuid=this.uuid()
        //    let host = "ws://localhost:4000";
        //     const socket=io("ws://localhost:4000")
        
        //    socket.on('message',(data)=>{
        //         console.log('data',data)
        //     })
        //     socket.send('hello')
        // }
        if(!io.socket){
            let uuid=this.uuid()
            let host = "47.93.189.47:22222";
            //const socket=io("ws://" + host + "/?action=scan&uuid=" + uuid + "&devicename=xzy-ipad&isreset=true")
            var ws = new WebSocket("ws://" + host + "/?action=scan&uuid=" + uuid + "&devicename=xzy-ipad&isreset=true");
            
            ws.onmessage=(evt)=>{
                console.log(JSON.parse(evt.data))
                var msg = JSON.parse( evt.data); 
                if(msg.action=="qrcode"){
                    console.log('msg',msg)
                    this.setState({
                        src: "data:image/jpg;base64,"+msg.context
                    })
                }
            }
        //    socket.on('connect',(data)=>{
        //         console.log('data',data)
        //     })
        }
        // fetch("http://47.93.189.47:8818/WebService1.asmx/GetLoginQrcode", {
        //     credentials: 'include',
        //     mode: 'cors'
        // })
        //     .then(res => res.text())
        //     .then(data => {
        //         this.setState({
        //             src: "data:image/jpg;base64," + data.substr(data.lastIndexOf('_Qk') + 1, data.length)
        //         })
        //     })
        //     .catch(error => {
        //         this.setState({
        //             qr: error
        //         })
        //     })

        // this.timeGetGetWxid = setInterval(() => {
        //     fetch("http://47.93.189.47:8818/WebService1.asmx/GetUserWxidAndHeadImageUrl", {
        //         credentials: 'include',
        //         mode: 'cors'
        //     })
        //         .then(res => res.text())
        //         .then(data => {
        //             if (data != "logout" && data != "Please make sure you have loggined" && data.length > 2) {
        //                 PubSub.publish('wxid_header', data)
        //                 clearTimeout(this.timeInit)                   
        //             }
        //             if (data == 'logout') {
        //                 PubSub.publish('logout', data)
        //                 clearInterval(this.timeGetGetWxid)
        //             }
        //         })
        // }, 3000)
        this.timeInit = setTimeout(() => {
            this.setState({
                qr: '二维码失效，点击刷新',
                opacity: '0.4',
                isshow: true
            })
        }, 200000)
    }
    render() {
        return (
            <div style={{ marginTop: '-320px' }}>

                <img className="imgqr" style={{ opacity: this.state.opacity }} src={this.state.src}></img>
                <div style={{ marginTop: '-213px', paddingBottom: '70px', }}>
                    {this.state.isshow ? <img className="refresh" style={{ transform: this.state.transform }} onClick={this.handleRefresh} src={refresh}></img> : null}
                </div>
                <div className='sub_title'>
                    <p >{this.state.qr}</p>
                    <button onClick={this.handleClick2}>发朋友圈</button>
                    <button onClick={this.handleClick3}>获取二维码</button>
                </div>

            </div>
        )
    }


}
