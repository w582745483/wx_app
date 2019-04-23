import React, { Component } from 'react';
import PubSub from 'pubsub-js'
import { uuid } from './socket'
import { connect } from 'react-redux'

import '../assets/css/main.css'
import { WxLogin } from '../redux/actions'

class Logo extends Component {
    state = {
        qr: '',
        timeout: '使用手机微信扫码登录',
        opacity: '1',
        isshow: false,
        uuid: ''
    }

    handleClick2 = () => {
        console.log('uuid', this.state.uuid)
        var content = {
            text: "hello",
            uuid: this.state.uuid
        }
        fetch("http://47.93.189.47:22221/api/sns/sendtext", {
            headers: {
                'Content-Type': 'application/json',
                'Accept': ' application/json'
            },
            method: 'POST',
            mode: 'cors',
            body: JSON.stringify(content)
        })
            .then(res => res.json())
            .then(data => {
                console.log('sendtext', data)
            })
    }

    handleRefresh = () => {
        let current = 0;
        
        this.timer1 = setInterval(() => {
            current = (current + 30) % 360;
            this.setState({
                transform: 'rotate(' + current + 'deg)'
            })
        }, 10)
        //this.props.getQr(uuid())
        
        this.setState({
            timeout: '',
            opacity: '1',
            isshow: false
        })
        this.timeInit = setTimeout(() => {
            this.setState({
                timeout: '二维码失效，点击刷新',
                opacity: '0.4',
                isshow: true
            })
        }, 5000)

    }

    componentWillReceiveProps(nextProps) { 
        this.setState({
            qr: "data:image/jpg;base64," + nextProps.qr,
            uuid: nextProps.uuid
        })
    }
    componentWillMount() {

        this.props.WxLogin(uuid())



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
                timeout: '二维码失效，点击刷新',
                opacity: '0.4',
                isshow: true
            })
        }, 200000)
    }
    render() {
        return (
            <div style={{ marginTop: '-320px' }}>
                <img className="imgqr" style={{ opacity: this.state.opacity }} src={this.state.qr}></img>
                <div style={{ marginTop: '-213px', paddingBottom: '70px', }}>
                    {this.state.isshow ? <img className="refresh" style={{ transform: this.state.transform }} onClick={this.handleRefresh} src={require('../assets/img/refresh.jpg')}></img> : null}
                </div>
                <div className='sub_title'>
                    <p >{this.state.timeout}</p>
                    <button onClick={this.handleClick2}>发朋友圈</button>
                    <button onClick={this.handleClick3}>获取二维码</button>
                </div>

            </div>
        )
    }
}
export default connect(
    state => state.Qr,
    { WxLogin }
)(Logo)
