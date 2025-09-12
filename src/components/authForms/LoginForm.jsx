import React from 'react';
import { Card, Typography, Form, Input, Button, message } from 'antd';
import { MailOutlined, LockOutlined } from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import "antd/dist/reset.css";
import './AuthForms.css';
import axios from 'axios';

const { Title, Paragraph } = Typography;

const LoginForm = ({ isLightTheme, setIsLoggedIn }) => {
    const navigate = useNavigate();
    const themeClass = isLightTheme ? 'light-theme' : 'dark-theme';

    const onFinish = async (values) => {
        try {
            console.log('Sending login request with:', values);
            const response = await axios.post(
                `${process.env.REACT_APP_API_BASE_URL}/api/auth/login`,
                {
                    email: values.email,
                    password: values.password,
                },
                {
                    withCredentials: true,
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }
            );

            console.log('Login response:', response);
            if (response.status === 200) {
                setIsLoggedIn(true);
                message.success('Вхід успішний!');
                navigate('/');
            }
        } catch (error) {
            console.error("Помилка при авторизації:", error);
            if (error.response) {
                console.log('Response data:', error.response.data);
                console.log('Response status:', error.response.status);
                if (error.response.status === 401) {
                    message.error('Неправильний email або пароль.');
                } else if (error.response.status === 403) {
                    message.error('Доступ заборонено. Перевірте налаштування CORS або сервера.');
                } else {
                    message.error('Помилка при з\'єднанні з сервером.');
                }
            } else {
                message.error('Помилка мережі. Перевірте підключення.');
            }
        }
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
                <Link to="/register" style={{color: isLightTheme ? "black" : "white", display: "flex", justifyContent: "center"}}>
                    Немає облікового запису? Зареєструватися
                </Link>
            </Card>
        </div>
    );
};

export default LoginForm;