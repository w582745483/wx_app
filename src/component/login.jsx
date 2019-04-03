import React from 'react'
import {Button,Icon,Input} from 'antd'

import Background from '../container/background'

export default class Login extends React.Component {
  
    render() {
        const style={ 
             marginTop:300,
             marginLeft:20,
        }
        return (
            <div>
                <Background/>
                <div className="login">
                    <div style={style}>
                        <Icon type="user"  style={{fontSize:'30px',color: '#FFFFFF' }}/>
                        <Input placeholder="请输入卡密" style={{marginLeft:'15px',marginTop: '10px',width:'75%',position:'absolute'}}/>
                    </div>
                    <Button type='default' style={{marginTop:'60px',marginLeft: '36%',width:'30%'}}>登录</Button>
                </div>
            </div>

        )
    }
}