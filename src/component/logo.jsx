import React, { Component } from 'react';
import $ from 'jquery'

import '../assets/css/main.css'
import logo from '../assets/img/ng-scope.jpg'
import refresh from '../assets/img/refresh.jpg'
import Menu from './menu'
export default class Logo extends Component {
    state = {
        src: "",
        qr: '使用手机微信扫码登录',
        opacity: '1',
        isshow: false,
        wxid:'',
        header:''
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
        this.props.history.push('/video')
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
        fetch("http://47.93.189.47:8818/WebService1.asmx/GetUuidAndLoginQrcode")
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
                // let uuid = {
                //     uuid: data.substring(0, data.lastIndexOf('_Qk'))
                // }
                // $.ajax({

                //     crossDomain: true,
                //     xhrFields:{withCredentials: true} ,
                //     type: "POST",
                //     contentType: "application/json",
                //     url: "http://47.93.189.47:8818/WebService1.asmx/CheckLoginProcess",
                //     data: JSON.stringify(uuid),
                //     dataType: 'json',
                //     success: function (result) {
                //         console.log(result)
                //     }
                // });

                // fetch('http://47.93.189.47:8818/WebService1.asmx/checkLogin', {
                //     method: 'POST',
                //     credentials:'include',
                //     headers: {
                //         'Content-Type': 'application/json', 
                //     },
                //     body: JSON.stringify(uuid)
                // }).then(res => console.log(res.text()))

                //var xhr = new XMLHttpRequest()

                // xhr.open('POST', "http://47.93.189.47:8818/WebService1.asmx/checkLogin", true)
                // xhr.onreadystatechange = function () {
                //     if (this.readyState == 4) {
                //         console.log(this.responseText)
                //     }
                // }
                // xhr.send(uuid);
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
                .then(data => {
                    const wxid = data.substring(0, data.lastIndexOf('&'))
                  
                    const header = data.substr(data.lastIndexOf('&') + 1, data.length)
                    this.setState({
                        wxid,
                        header
                    })
                   
                    console.log('wxid', wxid)
                    console.log('header', header)

                })
        }, 3000)
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
            <div>
                <img src={logo} alt='logo' className='logo-img' />
                <div className='login_box'>
                    <img className="imgqr" style={{ opacity: this.state.opacity }} src={this.state.src}></img>
                    <div style={{ marginTop: '-213px', paddingBottom: '70px', }}>
                        {this.state.isshow ? <img className="refresh" style={{ transform: this.state.transform }} onClick={this.handleRefresh} src={refresh}></img> : null}
                    </div>
                    <div className='sub_title'>
                        <p >{this.state.qr}</p>
                        <button onClick={this.handleClick2}>发朋友圈</button>
                        <button onClick={this.handleClick3}>添加视频连接</button>
                        <button onClick={this.handleClick4}>发送视频</button>
                    </div>
                    <Menu  wxid={this.state.wxid} header={this.state.header}/>

                </div>

            </div>
        )
    }


}
