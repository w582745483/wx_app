import React from 'react'
import { List, Card, Input, Button } from 'antd'
import Background from '../container/background'
import { resolve } from 'path';

const Meta = List.Item.Meta
export default class NineVideo extends React.Component {
    state = {
        value1: '',
        value2: '',
        value3: '',
        value4: '',
        value5: '',
        value6: '',
        value7: '',
        value8: '',
        value9: '',
        time_line_content: '',
    }
    handleChange = (key, val) => {
        this.setState({
            [key]: {
                value: val
            }
        })
    }
    handleChangeText = (key, val) => {
        this.setState({
            [key]: {
                time_line_content: val
            }
        })
    }
    handleClick = () => {
        let postData = {}
        const ninevideo = this.state

        for (const key in ninevideo) {
            this.handleonMouseOut(key, ninevideo[key].value)
            Object.assign(postData, ninevideo[key])
        }       
        
       
       new Promise((resolve,reject)=>{
           
        this.intelval=setInterval(()=>{
            for (const key in ninevideo) { 
                Object.assign(postData, ninevideo[key])
            }  
            var arr = Object.keys(postData);
            console.log(arr.length)
            console.log('postData', this.state)
             console.log('ninevideo', this.state)
            if(ninevideo.time_line_content == "" && arr.length > 17 || ninevideo.time_line_content != "" && arr.length > 18){
                clearInterval(this.intelval)
                resolve('123')
               
            }
           
        },500)
       }).then((v)=>{
        console.log(v)
       })
        // while (ninevideo.time_line_content == "" && arr.length > 17 || ninevideo.time_line_content != "" && arr.length > 18) {
        //     console.log(123)
        //     fetch('http://47.93.189.47:8818/WebService1.asmx/SendTimeLineNineVedio', {
        //         method: 'POST',
        //         credentials: 'include',
        //         mode: 'cors',
        //         body: JSON.stringify(postData)
        //     }).then(res => console.log(res.text()))
        //     return
        // }
    }
    handleonMouseOut = (key, val) => {
        fetch(`https://api.w0ai1uo.org/api/kuaishou.php?url=${val}`, {
        }).then(res => res.json())
            .then(data => {
                data.code == 200 && this.setState({
                    [key]: {
                        ["video_pic_address_" + key.substr(key.length - 1, 1)]: data.cover,
                        ["video_address_" + key.substr(key.length - 1, 1)]: data.playAddr,
                    }
                })
            })
    }
    render() {
        const data = [
            { title: '快手视频1', key: 'value1' }, { title: '快手视频2', key: 'value2' },
            { title: '快手视频3', key: 'value3' }, { title: '快手视频4', key: 'value4' },
            { title: '快手视频5', key: 'value5' }, { title: '快手视频6', key: 'value6' },
            { title: '快手视频7', key: 'value7' }, { title: '快手视频8', key: 'value8' },
            { title: '快手视频9', key: 'value9' },
        ]
        return (
            <div>
                <Background />
                <div className='login_box'>
                    <div style={{ marginTop: '25px', marginLeft: '5px' }}>
                        <List
                            grid={{ gutter: 20, column: 1 }}
                            dataSource={data}
                            renderItem={item => (
                                <List.Item>
                                    <Meta title={item.title}></Meta>
                                    <div style={{ position: 'absolute', marginLeft: '-90px', marginTop: '-16px', width: '69%' }}>
                                        <Input placeholder="请输入视频链接" onChange={e => this.handleChange(item.key, e.target.value)} />
                                    </div>
                                </List.Item>
                            )}
                        />
                        <Input style={{ width: '80%', left: '10%' }} placeholder="请输入为九宫格视频发送的文字内容" onChange={e => this.handleChangeText('time_line_content', e.target.value)} />
                        <div style={{ textAlign: 'center', marginTop: '30px' }}>
                            <Button onClick={this.handleClick} style={{ width: '300px', height: '40px', fontSize: '20px', border: 'none' }} size='large' type='primary' onClick={this.handleClick}>发送九宫格视频到朋友圈</Button>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}