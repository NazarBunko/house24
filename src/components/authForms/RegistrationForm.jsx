import React from 'react';
import { Card, Typography, Form, Input, Button } from 'antd';
import { UserOutlined, MailOutlined, LockOutlined } from '@ant-design/icons';
import "antd/dist/reset.css";
import './AuthForms.css';

const { Title, Paragraph } = Typography;

const RegistrationForm = ({ isLightTheme }) => {
    const [form] = Form.useForm();
    const themeClass = isLightTheme ? 'light-theme' : 'dark-theme';

    const onFinish = (values) => {
        console.log('Дані для реєстрації:', values);
        // Тут можна додати логіку для відправки даних на бекенд
    };

    return (
        <div className={`form-container ${themeClass}`}>
            <Card className="form-card">
                <Title level={3} className="form-title">Реєстрація</Title>
                <Paragraph className="form-text">
                    Створіть свій обліковий запис, щоб почати.
                </Paragraph>
                <Form
                    form={form}
                    name="register_form"
                    onFinish={onFinish}
                    autoComplete="off"
                >
                    <Form.Item
                        name="name"
                        rules={[{ required: true, message: "Будь ласка, введіть ваше ім'я!" }]}
                    >
                        <Input prefix={<UserOutlined />} placeholder="Ваше ім'я" />
                    </Form.Item>
                    <Form.Item
                        name="email"
                        rules={[
                            { required: true, message: "Будь ласка, введіть email!" },
                            { type: 'email', message: "Будь ласка, введіть коректний email!" }
                        ]}
                    >
                        <Input prefix={<MailOutlined />} placeholder="Email" />
                    </Form.Item>
                    <Form.Item
                        name="password"
                        rules={[
                            { required: true, message: "Будь ласка, введіть пароль!" },
                            { min: 6, message: "Пароль має містити щонайменше 6 символів!" }
                        ]}
                    >
                        <Input.Password prefix={<LockOutlined />} placeholder="Пароль" />
                    </Form.Item>
                    <Form.Item
                        name="confirm"
                        dependencies={['password']}
                        hasFeedback
                        rules={[
                            { required: true, message: "Будь ласка, підтвердіть пароль!" },
                            ({ getFieldValue }) => ({
                                validator(_, value) {
                                    if (!value || getFieldValue('password') === value) {
                                        return Promise.resolve();
                                    }
                                    return Promise.reject(new Error("Паролі не збігаються!"));
                                },
                            }),
                        ]}
                    >
                        <Input.Password prefix={<LockOutlined />} placeholder="Підтвердіть пароль" />
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit" className="form-button">
                            Зареєструватися
                        </Button>
                    </Form.Item>
                </Form>
                <div className="form-link-wrapper">
                    <Paragraph>
                        Вже маєте обліковий запис? <a href='/login'>Увійти</a>
                    </Paragraph>
                </div>
            </Card>
        </div>
    );
};

export default RegistrationForm;