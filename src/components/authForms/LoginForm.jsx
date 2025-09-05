import React from 'react';
import { Card, Typography, Form, Input, Button } from 'antd';
import { MailOutlined, LockOutlined } from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import "antd/dist/reset.css";
import './AuthForms.css';

const { Title, Paragraph } = Typography;

const LoginForm = ({ isLightTheme }) => {
    const navigate = useNavigate();
    const themeClass = isLightTheme ? 'light-theme' : 'dark-theme';

    const onFinish = (values) => {
        console.log('Дані для входу:', values);
        
        const fakeUserId = 'user_123';
        localStorage.setItem('userId', fakeUserId);
        navigate('/');
        window.location.reload();
    };

    return (
        <div className={`form-container ${themeClass}`}>
            <Card className="form-card">
                <Title level={3} className="form-title">Вхід</Title>
                <Paragraph className="form-text">
                    Увійдіть, щоб отримати доступ до вашого профілю.
                </Paragraph>
                <Form
                    name="login_form"
                    initialValues={{ remember: true }}
                    onFinish={onFinish}
                    autoComplete="off"
                >
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
                        rules={[{ required: true, message: "Будь ласка, введіть пароль!" }]}
                    >
                        <Input.Password prefix={<LockOutlined />} placeholder="Пароль" />
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit" className="form-button">
                            Увійти
                        </Button>
                    </Form.Item>
                </Form>
                <div className="form-link-wrapper">
                    <Link to="/register">
                        Немає облікового запису? Зареєструватися
                    </Link>
                </div>
            </Card>
        </div>
    );
};

export default LoginForm;