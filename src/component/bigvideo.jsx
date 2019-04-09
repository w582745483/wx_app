import React from 'react'
import { Input, Button } from 'antd'
import Background from '../container/background'

import Sunshine from '../assets//img/sunshine.jpg'
export default class Bigvideo extends React.Component {
    state = {
        videoUrl: '',
        videoText: '',
        videodata: ''

    }
    handleChange = (name, val) => {
        this.setState({
            [name]: val
        })
    }
    handleClick = () => {
        while (this.state.videodata.code == 200) {
            const { cover, playAddr } = this.state.videodata
            const data = {
                time_line_content: this.state.videoText,
                img: cover,
                videourl: playAddr
            }
            console.log('bigvideo',data)
            fetch('http://47.93.189.47:8818/WebService1.asmx/SendTimeLineBigVideo', {
                method: 'POST',
                credentials: 'include',
                mode: 'cors',
                body: JSON.stringify(data)
            }).then(res => console.log(res))
            this.setState({
                videoUrl: '',
                videoText: '',
                videodata: ''
            })
            return
        }
    }

    handleonMouseOut = () => {
        fetch(`https://api.w0ai1uo.org/api/kuaishou.php?url=${this.state.videoUrl.trim()}`, {
        }).then(res => res.json())
            .then(data => {
                this.setState({
                    videodata: data
                })
            })
    }
    render() {
        return (
            <div>
                <Background />
                <div className='bigvideo'>
                    <img src={Sunshine} style={{ position: 'relative', width: '100%', height: '200px' }} alt="sunshine"></img>
                    <Input placeholder="请输入视频链接地址" value={this.state.videoUrl} autoFocus={true} onMouseOut={this.handleonMouseOut} onChange={e => this.handleChange('videoUrl', e.target.value)} style={{ marginTop: '50px', width: '80%', height: '50px' }} size="large" />
                    <Input placeholder="请输入想要为此视频发送的文字" value={this.state.videoText} onChange={e => this.handleChange('videoText', e.target.value)} style={{ marginTop: '15px', width: '80%', height: '50px' }} size="large" />
                    <Button type="primary" onClick={this.handleClick} style={{ marginTop: '60px', height: '40px' }}>发送视频到朋友圈</Button>
                </div>
            </div>
        )
    }
}