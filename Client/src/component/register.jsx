import {Form, Input, Button,Select} from 'antd';
import React from 'react'
import Background from '../container/background'
const { Option } = Select;
class RegistrationForm extends React.Component {
    state = {
        confirmDirty: false,
        autoCompleteResult: [],
    };
    
    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                console.log('Received values of form: ', values);
            }
        });
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

    validateToNextPassword = (rule, value, callback) => {
        const form = this.props.form;
        if (value && this.state.confirmDirty) {
            form.validateFields(['confirm'], { force: true });
        }
        callback();
    }

    render() {
        const { getFieldDecorator } = this.props.form;
        const formItemLayout = {
            labelCol: {
                xs: { span: 24 },
                sm: { span: 8 },
            },
            wrapperCol: {
                xs: { span: 24 },
                sm: { span: 16 },
            },
        };
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
                    <div style={{ margin: '40px 10px' }}>
                        <Form {...formItemLayout} onSubmit={this.handleSubmit}>
                            <Form.Item
                                label="邮箱"
                            >
                                {getFieldDecorator('email', {
                                    rules: [{
                                        type: 'email', message: '该输入不是有效的电子邮件!',
                                    }, {
                                        required: true, message: '请输入你的邮箱!',
                                    }],
                                })(
                                    <Input />
                                )}
                            </Form.Item>
                            <Form.Item
                                label="密码"
                            >
                                {getFieldDecorator('password', {
                                    rules: [{
                                        required: true, message: '请输入密码!',
                                    }, {
                                        validator: this.validateToNextPassword,
                                    }],
                                })(
                                    <Input type="password" />
                                )}
                            </Form.Item>
                            <Form.Item
                                label="确认密码"
                            >
                                {getFieldDecorator('confirm', {
                                    rules: [{
                                        required: true, message: '请确认您的密码!',
                                    }, {
                                        validator: this.compareToFirstPassword,
                                    }],
                                })(
                                    <Input type="password" onBlur={this.handleConfirmBlur} />
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
                            </Form.Item>
                            <Form.Item style={{ textAlign: 'center' }}>
                                <Button type="primary" htmlType="submit">注册</Button>
                            </Form.Item>
                        </Form>
                      
                    </div>
                </div>
            </div>

        );
    }
}

export const Register = Form.create({ name: 'register' })(RegistrationForm);
