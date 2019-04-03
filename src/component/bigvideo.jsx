import React from 'react'
import { List, Card, Input, Button } from 'antd'
import Background from '../container/background'

export default class Bigvideo extends React.Component {
    state = {
      

    }
    handleChange = (key, val) => {
        this.setState({
            [key]: val
        })
    }

    handleClick = () => {
        let postData = {
            time_line_content: 'ceshi1',
            video_address: 'ceshi2',
            video_pic_address: 'ceshi3'
        }
        fetch('http://47.93.189.47:8818/WebService1.asmx/SendTimeLineBigVideo', {
            method: 'POST',
           
            body: JSON.stringify(postData)
        }).then(res => console.log(res.json()))
           .then(data=>console.log(data))
    }

    render() {
       
        
        return (
            <div>
                <Background />
              
                   <div className='bigvideo'>
                        <Input placeholder="Basic usage"  />
                        <Button type="primary">按钮</Button>
                   </div>


            </div>
        )
    }
}