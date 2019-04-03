import React from 'react'
import { Input, Button } from 'antd'
import Background from '../container/background'

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
        const { cover, playAddr } = this.state.videodata
        const data = {
            time_line_content: this.state.videoText,
            img: cover,
            videourl: playAddr
        }
        console.log(data)
        fetch('http://47.93.189.47:8818/WebService1.asmx/SendTimeLineBigVideo', {
            method: 'POST',
            body: JSON.stringify(data)
        }).then(res => console.log(res))
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
                    <Input placeholder="请输入视频链接地址" autoFocus={true} onMouseOut={this.handleonMouseOut} onChange={e => this.handleChange('videoUrl', e.target.value)} style={{ marginTop: '150px', width: '80%', height: '50px' }} size="large" />
                    <Input placeholder="请输入想要为此视频发送的文字" onChange={e => this.handleChange('videoText', e.target.value)} style={{ marginTop: '15px', width: '80%', height: '50px' }} size="large" />
                    <Button type="primary" onClick={this.handleClick} style={{ marginTop: '60px', height: '40px' }}>发送视频到朋友圈</Button>
                </div>
            </div>
        )
    }
}