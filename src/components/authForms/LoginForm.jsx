import React from 'react';
import { Card, Typography, Form, Input, Button } from 'antd';
import { MailOutlined, LockOutlined } from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import "antd/dist/reset.css";
import './AuthForms.css';

const { Title, Paragraph } = Typography;

const LoginForm = ({ isLightTheme, setUser }) => {
    const navigate = useNavigate();
    const themeClass = isLightTheme ? 'light-theme' : 'dark-theme';

    const onFinish = async (values) => {
        try {
            const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: values.email,
                    password: values.password,
                }),
            });

            if (response.ok) {
                const data = await response.json();
                console.log(data.userId);
                setUser(data.userId);
                navigate('/');
            } else {
                const errorText = await response.text();
                alert(`Помилка авторизації: ${errorText}`);
            }
        } catch (error) {
            console.error("Помилка при з'єднанні з сервером:", error);
            alert("Помилка при з'єднанні з сервером.");
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