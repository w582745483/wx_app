import React, { Component } from 'react';
import { Card, Avatar, List } from 'antd'

import '../assets/css/main.css'
import logo from '../assets/img/ng-scope.jpg'
import ninevideo from '../assets/img/ninevideo.png'
import bigvideo from '../assets/img/bigvideo.png'
import customer from '../assets/img/customer.png'
import develop from '../assets/img/develop.png'
const Item = List.Item
const data = [
    {
        title: '九宫格',
        img:ninevideo,
        url: '/ninevideo'
    },
    {
        title: '长视频',
        img:bigvideo,
        url: '/bigvideo'
    },
    {
        title: '开发中',
        img:customer
    },
    {
        title: '客服',
        img:develop
    },
];
export default class Menu extends Component {
    state = {
        wxid: '',
        header: ''
    }
    handleClick=(url)=>{
        this.props.history.push(url)
    }
    componentWillMount() {
        fetch("http://47.93.189.47:8818/WebService1.asmx/GetUserWxidAndHeadImageUrl", {
            credentials: 'include',
            mode: 'cors'
        })
            .then(res => res.text())
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
    }


    render() {
        return (
            <div>
                <img src={logo} alt='logo' className='logo-img' />
                <div className='login_box'>
                    <div style={{ background: '#666', width: '100%', height: '25%' }}>
                        <Avatar src={this.state.header} style={{ backgroundColor: '#87d068', marginTop: '25px', marginLeft: '10px' }} size="large" icon="user" />
                    </div>
                    <div  style={{background:'#ddd',height:'65%'}}>
                        <List
                            split={false}
                            grid={{ gutter: 16, column: 3 }}
                            dataSource={data}
                            renderItem={item => (
                                <List.Item>
                                    <div >
                                        <img onClick={()=>this.handleClick(item.url)} style={{width:'50px',marginLeft:'30px',marginTop:'20px'}} src={item.img}></img>
                                        <div style={{textAlign:'center'}}>
                                            <span style={{lineHeight:'1.15',fontSize:'1rem',marginLeft:'-10px'}}>{item.title}</span>
                                        </div>
                                    </div>
                                </List.Item>
                            )}
                        />
                    </div>
                </div>

            </div>
        )
    }


}
