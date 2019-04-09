import React, { Component } from 'react';
import { Modal, Avatar, List } from 'antd'

import Logo from '../component/logo'
import '../assets/css/main.css'
import logo from '../assets/img/ng-scope.jpg'
import ninevideo from '../assets/img/ninevideo.png'
import bigvideo from '../assets/img/bigvideo.png'
import customer from '../assets/img/customer.png'
import develop from '../assets/img/develop.png'
import login from '../assets/img/login.png'
import fridrend from '../assets/img/fridrend.png'
const Item = List.Item
const data = [
    {
        title: '九宫格',
        img: ninevideo,
        url: '/ninevideo'
    },
    {
        title: '长视频',
        img: bigvideo,
        url: '/bigvideo'
    },
    {
        title: '客服',
        img: customer
    },
];
export default class Menu extends Component {
    state = {
        wxid: '',
        header: '',
        isShow: false
    }
    handleClick = (url) => {
        if (!this.state.wxid) {
            this.warning()
            return
        }
        this.props.history.push(url)
    }
    componentWillMount() {
        fetch("http://47.93.189.47:8818/WebService1.asmx/GetUserWxidAndHeadImageUrl", {
            credentials: 'include',
            mode: 'cors'
        })
            .then(res => res.text())
            .then(data => {
                console.log(data)
                if (data != "Please make sure you have loggined" && data.length > 2) {
                    const wxid = data.substring(0, data.lastIndexOf('&'))
                    const header = data.substr(data.lastIndexOf('&') + 1, data.length)
                    this.setState({
                        wxid,
                        header,
                        isShow: false
                    })
                }

            })
    }
    warning = () => {
        Modal.warning({
            content: '用户未登录，请登录用户！',
        });
    }

    render() {
        const { header, wxid ,isShow} = this.state

        return (
            <div>
                <img src={logo} alt='logo' className='logo-img' />
                <div className='login_box'>
                    <div style={{ background: '#666', width: '100%', height: '20%' }}>
                        <Avatar src={header} style={{ backgroundColor: '#87d068', marginTop: '25px', marginLeft: '10px' }} size="large" icon="user" />
                        <span style={{ color: 'white', paddingLeft: '10px' }}>{header.length > 2 && header != "Please make sure you have loggined" ? '已登录' : '未登录'}</span>
                        <div onClick={() => { this.setState({ isShow: true }) }} style={{ marginTop: '-30px', marginLeft: '300px', textAlign: 'center' }}>
                            <img style={{ width: '30px' }} src={login} ></img>
                            <span style={{ display: 'block', lineHeight: '1.15', fontSize: '1rem', color: 'white' }}>扫码登陆</span>
                        </div>

                    </div>
                    <div style={{ background: '#ddd', height: '65%' }}>
                        <List
                            split={false}
                            grid={{ gutter: 16, column: 3 }}
                            dataSource={data}
                            renderItem={item => (
                                <List.Item>
                                    <div >
                                        <img onClick={() => this.handleClick(item.url)} style={{ width: '50px', marginLeft: '30px', marginTop: '20px' }} src={item.img}></img>
                                        <div style={{ textAlign: 'center' }}>
                                            <span style={{ lineHeight: '1.15', fontSize: '1rem', marginLeft: '-10px' }}>{item.title}</span>
                                        </div>
                                    </div>
                                </List.Item>
                            )}
                        />
                    </div>
                    {isShow?<Logo />:null}
                </div>

            </div>
        )
    }


}
