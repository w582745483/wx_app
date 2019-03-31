import React from 'react'
import { List, Card, Input, Button } from 'antd'
import Background from '../container/background'

export default class Video extends React.Component {
    state = {
        value1: '',
        value2: '',
        value3: '',
        value4: '',
        value5: '',
        value6: '',
        value7: '',
        value8: '',
        value9: ''

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
        //   .then(data=>console.log(data))
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
                <div style={{textAlign:'center',position:'absolute',top:'30%',left:'40%',margin:'-100px 0 0 -100px',height:'100%'}}>
                    <List
                      
                        grid={{ gutter: 16, column: 4 }}
                        dataSource={data}
                        renderItem={item => (
                            <List.Item>
                                <Card style={{ fontSize: '30px', color: 'red' }} title={item.title}></Card>
                                <Input onChange={e => this.handleChange(item.key, e.target.value)} style={{ width: '400px', height: '30px' }} />
                            </List.Item>
                        )}
                    />
                    <div style={{ textAlign: 'center', marginTop: '30px' }}>
                        <Button onClick={this.handleClick} style={{ width: '200px', height: '40px', fontSize: '20px', background: '#1890ff', border: 'none' }} size='large' type='primary' onClick={this.handleClick}>确定</Button>
                    </div>
                </div>



            </div>
        )
    }
}