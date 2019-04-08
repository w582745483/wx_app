import React, { Component } from 'react';
import { Card, Avatar, List } from 'antd'

import '../assets/css/main.css'
import logo from '../assets/img/ng-scope.jpg'


const Item = List.Item
const data = [
    {
        title: 'Title 1',
    },
    {
        title: 'Title 2',
    },
    {
        title: 'Title 3',
    },
    {
        title: 'Title 4',
    },
];
export default class Menu extends Component {
    state = {
        wxid: '',
        header: ''
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
                    <div>
                        <List
                            grid={{ gutter: 16, column: 2 }}
                            dataSource={data}
                            renderItem={item => (
                                <List.Item>
                                    <List.Item.Meta
                                        avatar={<Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />}
                                        title={<a href="https://ant.design"></a>}
                                      
                                    />
                                  
                                </List.Item>
                            )}
                        />
                    </div>
                </div>

            </div>
        )
    }


}
