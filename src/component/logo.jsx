import React, { Component } from 'react';
import $ from 'jquery'

import '../assets/css/main.css'
import logo from '../assets/img/ng-scope.jpg'
import refresh from '../assets/img/refresh.jpg'
export default class Logo extends Component {
    state = {
        src: "",
        qr: '使用手机微信扫码登录',
        opacity: '1',
        isshow: false
    }

    handleClick2 = () => {

        fetch("http://47.93.189.47:8818/WebService1.asmx/SendTimeLine")
            .then(res => res.text())
            .then(data => {
                console.log('data', data)
            })


    }
    handleClick3 = () => {
        this.props.history.push('/video')
    }
    handleClick4 = () => {
        var xhr = new XMLHttpRequest()
        let postData = {
            time_line_content: 'ceshi1',
            video_address: 'http://jsmov2.a.yximgs.com/upic/2019/02/22/20/BMjAxOTAyMjIyMDEzNTRfMjUzNzYzNjM1XzEwOTU1MDk1MzE1XzFfMw==_b_B9d6964c263cd934fd550c340e20d64ec.mp4?tag=1-1553492747-sp-0-ihsdp6lffb-13faf7ace9e0a5a9&type=hot',
            video_pic_address: 'http://js2.a.yximgs.com/upic/2019/02/22/20/BMjAxOTAyMjIyMDEzNTRfMjUzNzYzNjM1XzEwOTU1MDk1MzE1XzFfMw==_Bf76625cd00d95bd7f77bbcc4461b7865.jpg?tag=1-1553492747-sp-0-vqrv2btwym-2dec32ecaadb7859&type=hot'
        }
        xhr.open('POST', "http://47.93.189.47:8818/WebService1.asmx/SendTimeLineBigVideo", true)
        xhr.onreadystatechange = function () {
            if (this.readyState == 4) {
                console.log(this.responseText)
            }
        }
        xhr.send(JSON.stringify(postData));
    }
    handleRefresh = () => {
        fetch("http://47.93.189.47:8818/WebService1.asmx/GetUuidAndLoginQrcode")
            .then(res => res.text())
            .then(data => {
                console.log('data', data)
                this.setState({
                    src: "data:image/jpg;base64," + data.substr(data.lastIndexOf('_Qk') + 1, data.length)
                })

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
    }
    componentWillMount() {
        fetch("http://47.93.189.47:8818/WebService1.asmx/GetUuidAndLoginQrcode")
            .then(res => res.text())
            .then(data => {
                //console.log('data', data)
                this.setState({
                    src: "data:image/jpg;base64," + data.substr(data.lastIndexOf('_Qk') + 1, data.length)
                })
                let uuid = {
                    uuid: data.substr(0, data.lastIndexOf('_Qk'))
                }
                // $.ajax({
                 
                //     crossDomain: true,
                //     type: "POST",
                //     contentType: "application/json",
                //     url: "http://47.93.189.47:8818/WebService1.asmx/checkLogin",
                //     data: JSON.stringify(uuid),
                //     dataType: 'json',
                //     success: function(result) {
                //         console.log(result)
                //     }
                // });
           
                fetch('http://47.93.189.47:8818/WebService1.asmx/checkLogin', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json', 
                    },
                    body: JSON.stringify(uuid)
                }).then(res => console.log(res.text()))

                var xhr = new XMLHttpRequest()

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
            fetch("http://47.93.189.47:8818/WebService1.asmx/GetWxid")
                .then(data => {
                    console.log('data', data.text())
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
                        {this.state.isshow ? <img className="refresh" onClick={this.handleRefresh} src={refresh}></img> : null}
                    </div>
                    <div className='sub_title'>
                        <p >{this.state.qr}</p>
                        <button onClick={this.handleClick2}>发朋友圈</button>
                        <button onClick={this.handleClick3}>添加视频连接</button>
                        <button onClick={this.handleClick4}>发送视频</button>
                    </div>


                </div>

            </div>
        )
    }


}
