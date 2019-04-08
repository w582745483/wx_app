import React, { Component } from 'react';
import { Button,Avatar,List} from 'antd'

import '../assets/css/main.css'
import logo from '../assets/img/ng-scope.jpg'


const Item=List.Item
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
                    <div style={{ background: '#666',width:'100%',height:'25%'}}>
                    <Avatar src={this.state.header} style={{ backgroundColor: '#87d068',marginTop:'25px', marginLeft:'10px'}} size="large" icon="user" /> 
                    </div>
                    <div>
                        <List >
                            <Item>
                                <span>1232132</span>
                            </Item>
                            <Item>
                                <span>1232132</span>
                            </Item>  <Item>
                                <span>1232132</span>
                            </Item>
                        </List>
                    </div>
                </div>

            </div>
        )
    }


}
