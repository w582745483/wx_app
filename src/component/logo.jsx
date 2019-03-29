import React, { Component} from 'react';
import '../assets/css/main.css'
import logo from '../assets/img/ng-scope.jpg'
export default class Logo extends Component{
    state={
        src:""
    }
    handleClick1=()=>{
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
       

        fetch("http://47.93.189.47:8818/WebService1.asmx/GetLoginQrcode")
            .then(res=>res.text())
            .then(data=>{
                 console.log('data',data)
               this.setState({
                   src:"data:image/jpg;base64,"+data
               })
              
            })
     }
     handleClick2=()=>{

        fetch("http://47.93.189.47:8818/WebService1.asmx/SendTimeLine")
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
                <button onClick={this.handleClick1}>按钮11</button>
                <button onClick={this.handleClick2}>按钮22</button>
                </div>
            </div>
        )
    }
        
   
}
