import React from 'react';
import { Card, Typography, Form, Input, Button, message } from 'antd';
import { UserOutlined, MailOutlined, LockOutlined, PhoneOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import "antd/dist/reset.css";
import './AuthForms.css';
import axios from 'axios';

const { Title, Paragraph } = Typography;

const RegistrationForm = ({ isLightTheme }) => {
    const [form] = Form.useForm();
    const navigate = useNavigate();
    const themeClass = isLightTheme ? 'light-theme' : 'dark-theme';

    const onFinish = async (values) => {
        try {
            const response = await axios.post(
                `${process.env.REACT_APP_API_BASE_URL}/api/users/register`,
                {
                    firstName: values.firstName, // Змінено на firstName
                    lastName: values.lastName,   // Додано поле lastName
                    email: values.email,
                    phone: values.phone,
                    password: values.password,
                },
                {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }
            );

            if (response.status === 201) {
                message.success('Реєстрація успішна! Будь ласка, увійдіть.');
                navigate('/login');
            }
        } catch (error) {
            console.error("Помилка при реєстрації:", error);
            if (error.response && error.response.status === 409) {
                message.error('Користувач з таким email вже існує.');
            } else {
                message.error('Помилка при з’єднанні з сервером. Спробуйте пізніше.');
            }
        }
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
                        name="firstName" // Змінено
                        rules={[{ required: true, message: "Будь ласка, введіть ваше ім'я!" }]}
                    >
                        <Input prefix={<UserOutlined />} placeholder="Ім'я" />
                    </Form.Item>
                    <Form.Item
                        name="lastName" // Додано
                        rules={[{ required: true, message: "Будь ласка, введіть ваше прізвище!" }]}
                    >
                        <Input prefix={<UserOutlined />} placeholder="Прізвище" />
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
                        name="phone"
                        rules={[
                            { required: true, message: "Будь ласка, введіть номер телефону!" },
                            { pattern: /^\+?\d{10,14}$/, message: "Будь ласка, введіть коректний номер телефону!" },
                        ]}
                    >
                        <Input prefix={<PhoneOutlined />} placeholder="Номер телефону" />
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