import React from 'react'
import { Form, Icon, Input, Button, Checkbox, Modal, Select } from 'antd'

import Background from '../container/background'
const { Option } = Select;
class NormalLoginForm extends React.Component {
    state = {
        visible: false,
        changePassword: false

    }
    showModal = () => {
        this.setState({
            visible: true,
        });
    }
    changePassword = () => {
        this.setState({
            changePassword: true
        })
    }
    handleCancel = (e) => {
        this.setState({
            visible: false,
            changePassword: false
        });
    }
    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            console.log(err)
            if (!err) {
                console.log('Received values of form: ', values);
            }
        });
        this.props.form.resetFields()
        this.setState({
            visible: false,
            changePassword: false
        })
    }
    handleConfirmBlur = (e) => {
        const value = e.target.value;
        this.setState({ confirmDirty: this.state.confirmDirty || !!value });
    }

    compareToFirstPassword = (rule, value, callback) => {
        const form = this.props.form;
        if (value && value !== form.getFieldValue('password')) {
            callback('您输入的两个密码不一致!');
        } else {
            callback();
        }
    }
    render() {
        const { getFieldDecorator } = this.props.form;
        const { visible } = this.state
        const prefixSelector = getFieldDecorator('prefix', {
            initialValue: '86',
        })(
            <Select style={{ width: 70 }}>
                <Option value="86">+86</Option>
                <Option value="87">+87</Option>
            </Select>
        );
        return (
            <div>
                <Background />
                <div className="login_box">

                    <div style={{ marginLeft: '40px', marginTop: '100px' }}>
                        {visible ?
                            <div>
                                <Modal
                                    cancelText='取消'
                                    okText='确定'
                                    title="修改密码"
                                    visible={this.state.visible}
                                    onOk={this.state.changePassword ? this.handleSubmit : this.changePassword}
                                    onCancel={this.handleCancel}
                                    centered={true}
                                    closable={false}

                                >
                                    <div style={{ marginLeft: '80px' }}>

                                        <Form onSubmit={this.handleSubmit} className="login-form">
                                            {
                                                this.state.changePassword ?
                                                    (
                                                        <div>
                                                            <Form.Item>
                                                                {getFieldDecorator('password', {
                                                                    rules: [{ required: true, message: '请输入密码!' }],
                                                                })(
                                                                    <Input prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />} type="password" placeholder="密码" />
                                                                )}
                                                            </Form.Item>
                                                            <Form.Item>
                                                                {getFieldDecorator('confirm', {
                                                                    rules: [{
                                                                        required: true, message: '请确认您的密码!',
                                                                    }, {
                                                                        validator: this.compareToFirstPassword,
                                                                    }],
                                                                })(
                                                                    <Input prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />} type="password" placeholder="确认密码" onBlur={this.handleConfirmBlur} />
                                                                )}
                                                            </Form.Item> </div>) : (<div>
                                                                <Form.Item>
                                                                    {getFieldDecorator('userName', {
                                                                        rules: [{ required: true, message: '请输入用户名!' }],
                                                                    })(
                                                                        <Input prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="用户名" />
                                                                    )}
                                                                </Form.Item>

                                                                <Form.Item
                                                                    label="电话号码"
                                                                >
                                                                    {getFieldDecorator('phone', {
                                                                        rules: [{ required: true, message: '请输入你的电话号码!' }],
                                                                    })(
                                                                        <Input addonBefore={prefixSelector} style={{ width: '100%' }} />
                                                                    )}
                                                                </Form.Item> </div>)

                                            }
                                        </Form>
                                    </div>
                                </Modal>
                            </div>
                            : <div>
                                <Form onSubmit={this.handleSubmit} className="login-form">
                                    <Form.Item>
                                        {getFieldDecorator('userName', {
                                            rules: [{ required: true, message: '请输入用户名!' }],
                                        })(
                                            <Input prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="用户名" />
                                        )}
                                    </Form.Item>
                                    <Form.Item>
                                        {getFieldDecorator('password', {
                                            rules: [{ required: true, message: '请输入密码!' }],
                                        })(
                                            <Input prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />} type="password" placeholder="密码" />
                                        )}
                                    </Form.Item>
                                    <Form.Item>
                                        {getFieldDecorator('remember', {
                                            valuePropName: 'checked',
                                            initialValue: true,
                                        })(
                                            <Checkbox>记住密码</Checkbox>
                                        )}
                                        <a className="login-form-forgot" onClick={this.showModal}>忘记密码</a>
                                        <Button type="primary" htmlType="submit" className="login-form-button">
                                            登录
                            </Button>
                                        <a href="/register">立即注册</a>
                                    </Form.Item>
                                </Form>
                            </div>}



                    </div>
                </div>
            </div>

        )
    }
}
export const Login = Form.create({ name: 'normal_login' })(NormalLoginForm);
