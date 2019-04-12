import React from 'react'
import { List, message, Input, Button,Modal } from 'antd'
import Background from '../container/background'
import PubSub from 'pubsub-js'

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

    warning = (text) => {
        Modal.warning({
            content: text,
            onOk(){window.location.assign('/menu')}
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
        message.loading('正在发送朋友圈，请等候...', 0)
        for (const key in this.state) {
            this.ParseVideoAddress(key, this.state[key])
        }
        new Promise((resolve, reject) => {
            this.intelval = setInterval(() => {
                let postData = {}
                for (const key in this.state) {
                    Object.assign(postData, this.state[key])
                }
                var arr = Object.keys(postData);
                console.log(arr.length)
                console.log('postData', postData)
                if (this.state.time_line_content == "" && arr.length == 18 || this.state.time_line_content != "" && arr.length == 19) {
                    clearInterval(this.intelval)
                    resolve(postData)
                }
                else {
                    clearInterval(this.intelval)
                }

            }, 1500)
        }).then((postData) => {
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
    ParseVideoAddress = (key, val) => {
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
    componentDidMount() {
        this.pubsub_token2=PubSub.subscribe('logout', (topic, data) => {
            this.warning('检测到用户登出,请重新登录!')
        })
    }
    componentWillUnmount(){
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
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}