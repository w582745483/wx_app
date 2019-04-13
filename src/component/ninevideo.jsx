import React from 'react'
import { List, message, Input, Button, Modal } from 'antd'
import Background from '../container/background'
import PubSub from 'pubsub-js'
import {draw} from './canvas'

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
        visible: false,
        videodata:[]
    }

    warning = (text) => {
        Modal.warning({
            content: text,
            onOk() { window.location.assign('/menu') }
        });
    }
    showModal = () => {
        this.setState({
            visible: true,
        });
        this.AsyncPromise('videodata').then(() => {
          
        })
       
    }

    handleOk = (e) => {
        console.log(e);
        this.setState({
            visible: false,
        });
    }

    handleCancel = (e) => {
        console.log(e);
        this.setState({
            visible: false,
        });
    }
    handleChange = (key, val) => {
        this.setState({
            [key]: val
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
        message.loading('正在发送朋友圈，请等候...', 30)
        this.AsyncPromise('postData').then((postData) => {
            console.log('postData', postData)
            fetch('http://47.93.189.47:8818/WebService1.asmx/SendTimeLineNineVedio', {
                method: 'POST',
                credentials: 'include',
                mode: 'cors',
                body: JSON.stringify(postData)
            }).then(res => {
                message.destroy()
                message.success('发送成功！', 1)
                console.log(res.text())
            })
        })
    }

    AsyncPromise = (dataType) => {
        for (const key in this.state) {
            this.ParseVideoAddress(key, this.state[key])
        }
        return new Promise((resolve, reject) => {
            this.intelval = setInterval(() => {
                let postData = {}
                for (const key in this.state) {
                    Object.assign(postData, this.state[key])
                }
                var arr = Object.keys(postData);
                console.log(arr.length)


                if (this.state.time_line_content == "" && arr.length == 18 || this.state.time_line_content != "" && arr.length == 19) {
                    clearInterval(this.intelval)
                    resolve(postData)
                }
            }, 1500)
        })
    }

    ParseVideoAddress = (key, val) => {
        fetch(`https://api.w0ai1uo.org/api/kuaishou.php?url=${val}`, {
        }).then(res => res.json())
            .then(data => {
                if (data.code == 200) {
                    this.setState({
                        [key]: {
                            ["video_pic_address_" + key.substr(key.length - 1, 1)]: data.cover,
                            ["video_address_" + key.substr(key.length - 1, 1)]: data.playAddr,
                        }
                    })
                    this.setState({
                        videodata:this.state.videodata.concat(data)
                    })

                }
            })
    }
    componentDidMount() {
        if(this.canvas){
            draw(this.canvas)
        }
        this.pubsub_token2 = PubSub.subscribe('logout', (topic, data) => {
            this.warning('检测到用户登出,请重新登录!')
        })
    }
    componentWillUnmount() {
        PubSub.unsubscribe(this.pubsub_token2)
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
                            <Button type='danger' onClick={this.showModal} size='large' style={{ marginTop: '10px', border: 'none' }}>查看视频</Button>
                        </div>
                        <div>
                            <Modal
                                title="视频预览"
                                visible={this.state.visible}
                                onOk={this.handleOk}
                                onCancel={this.handleCancel}
                                centered={true}
                                closable={false}

                            >
                                <List
                                    split={false}
                                    grid={{ gutter: 16, column: 2 }}
                                    dataSource={this.state.videodata}
                                    renderItem={item => (                               
                                        <List.Item>
                                            <div>                                       
                                                <div >
                                              

                                                <video  style={{width:'100%',height:'200px'}}  controls preload autoplay controlslist="nodownload nofullscreen" poster={item.cover} src={item.playAddr}>
                                                </video>
                                               
                                                    </div>

                                            {/* <img onClick={() => this.handleClick(item.url)} style={{ width: '50px', marginLeft: '30px', marginTop: '20px' }} src={item.cover}></img> */}
                                            {/* <div style={{ textAlign: 'center' }}>
                                                    <span style={{ lineHeight: '1.15', fontSize: '1rem', marginLeft: '-10px' }}>{item.title}</span>
                                                </div> */}
                                            </div>
                                        </List.Item>
                            )}
                        />
                            </Modal>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}