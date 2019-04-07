import React, { Component } from 'react';
import $ from 'jquery'

import '../assets/css/main.css'
import logo from '../assets/img/ng-scope.jpg'
import refresh from '../assets/img/refresh.jpg'
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
                    <p>{this.props.wxid}</p>
                    <img className="imgqr" src={this.props.header}></img>
                </div>

            </div>
        )
    }


}
