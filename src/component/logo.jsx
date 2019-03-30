import React, { Component } from 'react';
import { Redirect } from 'react-router-dom'
import {Icon} from 'antd'

import '../assets/css/main.css'
import logo from '../assets/img/ng-scope.jpg'
import refresh from '../assets/img/refresh.jpg'
export default class Logo extends Component {
    state = {
        src: ""
    }
    handleClick1 = () => {



        fetch("http://47.93.189.47:8818/WebService1.asmx/GetLoginQrcode")
            .then(res => res.text())
            .then(data => {
                console.log('data', data)
                this.setState({
                    src: "data:image/jpg;base64," + data
                })

            })
    }
    handleClick2 = () => {

        fetch("http://47.93.189.47:8818/WebService1.asmx/SendTimeLine")
            .then(res => res.text())
            .then(data => {
                console.log('data', data)
            })


    }
    handleClick3 = () => {
        this.props.history.replace('/video')
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
    componentWillMount() {
        fetch("http://47.93.189.47:8818/WebService1.asmx/GetLoginQrcode")
            .then(res => res.text())
            .then(data => {
                console.log('data', data)
                this.setState({
                    src: "data:image/jpg;base64," + data
                })

            })
    }
    render() {

        return (
            <div>
                <img src={logo} alt='logo' className='logo-img' />
                <div className='login_box'>
                    <img className="img" src={this.state.src}></img>
                   
                   
                    <div className='icons-list'  style={{marginTop:'-173px',paddingBottom:'120px',}}>
                        {/* <img className="refresh" src={refresh}></img> */}
                        <Icon type="sync" rotate={180}  theme="outlined" className='icons-list' spin style={{fontSize:'50px',paddingLeft:'163px'}}/>
                    </div>
                    <p className='sub_title'>使用手机微信扫码登录</p>
                    <button onClick={this.handleClick1}>重新获取二维码</button>
                    <button onClick={this.handleClick2}>发朋友圈</button>
                    <button onClick={this.handleClick3}>添加视频连接</button>
                    <button onClick={this.handleClick4}>发送视频</button>

                </div>
               
            </div>
        )
    }


}
