import React, { Component } from 'react';
import $ from 'jquery'

import '../assets/css/main.css'
import logo from '../assets/img/ng-scope.jpg'
import refresh from '../assets/img/refresh.jpg'
export default class Menu extends Component {
    state = {
        

    }

   
    
    render() {
        return (
            <div>
                <img src={logo} alt='logo' className='logo-img' />
                <div className='login_box'>
                <p>{this.props.wxid}</p>
                    <img className="imgqr"  src={this.props.header}></img>
                </div>

            </div>
        )
    }


}
