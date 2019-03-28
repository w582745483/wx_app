import React, { Component} from 'react';
import '../assets/css/main.css'
import logo from '../assets/img/ng-scope.jpg'
export default class Logo extends Component{
    state={
        src:""
    }
    handleClick=()=>{
        // var xhr=new XMLHttpRequest()
        // xhr.open('GET',"http://47.93.189.47:8818/WebService1.asmx/HelloWorld",true)
        // xhr.onreadystatechange=function(){
        //     if(this.readyState==4){
        //         console.log(this.responseText)

        //         this.setState({
        //             src
        //         })
        //     }
        // }
        // xhr.send();
       

        fetch("http://47.93.189.47:8818/WebService1.asmx/HelloWorld")
            .then(res=>res.text())
            .then(data=>{
                 console.log('data',data)
               this.setState({
                   src:"data:image/jpg;base64,"+data
               })
              
            })
     }
    render(){
        return(
            <div>
                <img src={logo}  alt='logo' className='logo-img'/>
                <div className='login_box'>
                <img class="img" src={this.state.src}></img>
                <p className='sub_title'>使用手机微信扫码登录</p>
                <button onClick={this.handleClick}>按钮</button>
                </div>
            </div>
        )
    }
        
   
}
