import React from 'react'
import {Button,Icon,Input} from 'antd'

import background from '../assets/img/background.jpg'
import { relative } from 'path';
export default class Login extends React.Component {
  
    render() {
        const style={ 
             marginTop:350,
             marginLeft:30
        }

        
 
        return (
            <div>
                <img src={background} alt='logo' className='login-background' />
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