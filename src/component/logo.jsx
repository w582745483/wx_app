import React, { Component } from 'react';
import PubSub from 'pubsub-js'

import '../assets/css/main.css'
import logo from '../assets/img/ng-scope.jpg'
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
    handleClick3 = () => {
        this.props.history.push('/ninevideo')
    }
    handleClick4 = () => {
        this.props.history.push('/bigvideo')
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
                this.setState({
                    src: "data:image/jpg;base64," + data.substr(data.lastIndexOf('_Qk') + 1, data.length)
                })
                this.setState({
                    qr: '使用手机微信扫码登录',
                    opacity: '1',
                    isshow: false
                })
                setTimeout(() => {
                    this.setState({
                        qr: '二维码失效，点击刷新',
                        opacity: '0.4',
                        isshow: true
                    })
                }, 200000)
                this.timeGetGetWxid()
            })
    }
    componentWillMount() {
        fetch("http://47.93.189.47:8818/WebService1.asmx/GetLoginQrcode", {
            credentials: 'include',
            mode: 'cors'
        })
            .then(res => res.text())
            .then(data => {
                this.setState({
                    src: "data:image/jpg;base64," + data.substr(data.lastIndexOf('_Qk') + 1, data.length)
                }) 
            })
            .catch(error => {
                this.setState({
                    qr: error
                })
            })

        this.timeGetGetWxid = setInterval(() => {
            fetch("http://47.93.189.47:8818/WebService1.asmx/GetUserWxidAndHeadImageUrl", {
                credentials: 'include',
                mode: 'cors'
            })
                .then(res=>res.text())
                .then(data => {
                    if(data!="logout"&&data!="Please make sure you have loggined"){
                        PubSub.publish('wxid_header',data)
                        this.props.GetUserWxidAndHeadImageUrl(data)
                        //clearInterval(this.timeGetGetWxid)
                        // const wxid = data.substring(0, data.lastIndexOf('&'))
                        //const header = data.substring(data.lastIndexOf('&') + 1, data.length)                     
                    }
                    else{
                        PubSub.publish('logout',data)
                    }
                })
        },3000)
        this.timeInit = setTimeout(() => {
            clearInterval(this.timeGetGetWxid)
            this.setState({
                qr: '二维码失效，点击刷新',
                opacity: '0.4',
                isshow: true
            })
        }, 200000)
    }
    render() {
        return (
            <div style={{marginTop:'-320px'}}>
               
                    <img className="imgqr" style={{ opacity: this.state.opacity }} src={this.state.src}></img>
                    <div style={{ marginTop: '-213px', paddingBottom: '70px', }}>
                        {this.state.isshow ? <img className="refresh" style={{ transform: this.state.transform }} onClick={this.handleRefresh} src={refresh}></img> : null}
                    </div>
                    <div className='sub_title'>
                        <p >{this.state.qr}</p>
                        <button onClick={this.handleClick2}>发朋友圈</button>       
                    </div>         
              
            </div>
        )
    }


}
