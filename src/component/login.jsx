import React from 'react'
import {Button,Icon,Input} from 'antd'

import Background from '../container/background'

export default class Login extends React.Component {
  
    render() {
        const style={ 
             marginTop:350,
             marginLeft:30
        }
        return (
            <div>
                <Background/>
                <div className="login">
                    <div style={style}>
                        <Icon type="user"  style={{fontSize:'30px',color: '#FFFFFF',}}/>
                        <Input className="login_input" placeholder="请输入卡密" style={{}}/>
                    </div>
                </div>
            </div>

        )
    }
}