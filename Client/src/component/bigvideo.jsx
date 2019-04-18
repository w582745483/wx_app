import React from 'react'
import { Input, Button, message, Modal, List } from 'antd'
import Background from '../container/background'
import PubSub from 'pubsub-js'

import Sunshine from '../assets//img/sunshine.jpg'
export default class Bigvideo extends React.Component {
    state = {
        videoUrl: '',
        videoText: '',
        videodata:[],
        visible:false
    }
    warning = (text) => {
        Modal.warning({
            content: text,
            onOk() { window.history.pushState('/menu') }
        });
    }
    showModal = () => {
        fetch(`https://api.w0ai1uo.org/api/kuaishou.php?url=${this.state.videoUrl.trim()}`, {
        }).then(res => res.json())
            .then(data => {
                if(data.code==200){
                    console.log('data',data)
                    this.setState({
                        videodata: [data]
                    })
                }
              
            })
        this.setState({
            visible: true,
        });
    }

    handleCancel = (e) => {
        this.setState({
            visible: false,
        });
    }
    handleChange = (name, val) => {
        this.setState({
            [name]: val
        })
    }
    handleClick = () => {
        message.destroy()
        message.loading('正在发送朋友圈，请等候...', 0)
        const { cover, playAddr } = this.state.videodata
        const bigvideo = {
            time_line_content: this.state.videoText,
            img: cover,
            videourl: playAddr
        }
        console.log('bigvideo', bigvideo)
        fetch('http://47.93.189.47:8818/WebService1.asmx/SendTimeLineBigVideo', {
            method: 'POST',
            credentials: 'include',
            mode: 'cors',
            body: JSON.stringify(bigvideo)
        }).then(res => {
            message.destroy()
            message.success('发送成功！', 1)
            console.log(res)
        })
        this.setState({
            videoUrl: '',
            videoText: '',
            videodata:[]
        })

    }
    componentDidMount() {
        this.pubsub_token2 = PubSub.subscribe('logout', (topic, data) => {
            this.warning('检测到用户登出,请重新登录!')
        })
    }
    componentWillUnmount() {
        PubSub.unsubscribe(this.pubsub_token2)
    }
    render() {
        return (
            <div>
                <Background />
                <div className='bigvideo'>
                    <img src={Sunshine} style={{ position: 'relative', width: '100%', height: '200px' }} alt="sunshine"></img>
                    <Input placeholder="请输入视频链接地址" value={this.state.videoUrl} autoFocus={true} onChange={e => this.handleChange('videoUrl', e.target.value)} style={{ marginTop: '70px', width: '80%', height: '50px' }} size="large" />
                    <Button type="primary" onClick={this.showModal} style={{ marginTop: '60px', height: '40px' }}>查看视频</Button>
                </div>
                <div>
                    <Modal
                        cancelText='取消'
                        okText='发表'
                        title="视频预览"
                        visible={this.state.visible}
                        onOk={this.handleClick}
                        onCancel={this.handleCancel}
                        centered={true}
                        closable={false}

                    >
                        <Input.TextArea rows={3} style={{ width: '100%', marginBottom: '20px' }} value={this.state.videoText} placeholder="请输入心情！" onChange={e => this.handleChange('videoText', e.target.value)} />
                        <List
                            okText='发表'
                            split={false}
                            grid={{ gutter: 16, column: 1 }}
                            dataSource={this.state.videodata}
                            renderItem={item => (
                                <List.Item>
                                    <div>
                                        <div >
                                            <video style={{ width: '100%', height: '200px' }} x5-video-player-fullscreen="true" x5-video-player-fullscreen="portraint" controls preload="true" controlsList="nodownload nofullscreen" poster={item.cover} src={item.playAddr}>
                                            </video>
                                        </div>
                                    </div>
                                </List.Item>
                            )}
                        />
                    </Modal>
                </div>
            </div>
        )
    }
}