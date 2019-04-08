import React from 'react'
import { List, Card, Input, Button } from 'antd'
import Background from '../container/background'

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
        time_line_content: ''

    }
    handleChange = (key, val) => {
        this.setState({
            [key]: val
        })
    }

    handleClick = () => {

        const postData = {
            time_line_content: '',
            video_address: 'ceshi2',
            video_pic_address: 'ceshi3'
        }
        fetch('http://47.93.189.47:8818/WebService1.asmx/SendTimeLineNineVedio', {
            method: 'POST',
            credentials: 'include',
            mode: 'cors',
            body: JSON.stringify(postData)
        }).then(res => console.log(res.json()))
        //   .then(data=>console.log(data))
    }
    handleonMouseOut = (e) => {
        console.log(e.target.value)
        // fetch(`https://api.w0ai1uo.org/api/kuaishou.php?url=${this.state.videoUrl.trim()}`, {
        // }).then(res => res.json())
        //     .then(data => {
        //         this.setState({
        //             videodata: data
        //         })
        //     })
    }
    render() {
        const style = {
            textAlign: 'center',
            paddingTop: '200px'
        }
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
                    <div style={{ marginTop: '25px',marginLeft: '5px' }}>
                        <List
                            grid={{ gutter: 20, column: 1 }}
                            dataSource={data}
                            renderItem={item => (
                                <List.Item>
                                    <Meta title={item.title}></Meta>
                                    <div style={{ position: 'absolute', marginLeft: '-90px', marginTop: '-16px', width: '69%' }}>
                                        <Input placeholder="请输入视频链接"  onMouseOut={this.handleonMouseOut} onChange={e => this.handleChange(item.key, e.target.value)} />
                                    </div>
                                </List.Item>
                            )}
                        />
                        <Input style={{ width: '80%', left: '10%' }}  placeholder="请输入为九宫格视频发送的文字内容" onChange={e => this.handleChange('time_line_content', e.target.value)} />
                        <div style={{ textAlign: 'center', marginTop: '30px' }}>
                            <Button onClick={this.handleClick} style={{ width: '300px', height: '40px', fontSize: '20px', border: 'none' }} size='large' type='primary' onClick={this.handleClick}>发送九宫格视频到朋友圈</Button>
                        </div>
                    </div>

                </div>



            </div>
        )
    }
}