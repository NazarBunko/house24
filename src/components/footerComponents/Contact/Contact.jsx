import React from 'react';
import { Card, Typography, Form, Input, Button, Row, Col, Space } from 'antd';
import { MailOutlined, PhoneOutlined, InstagramOutlined, FacebookOutlined, YoutubeOutlined, TwitterOutlined, TikTokOutlined, SendOutlined } from '@ant-design/icons';
import "antd/dist/reset.css";
import './Contact.css';

const { Title, Paragraph } = Typography;
const { TextArea } = Input;

const Contact = ({ isLightTheme }) => {
    const themeClass = isLightTheme ? 'light-theme' : 'dark-theme';
    const [form] = Form.useForm();

    const onFinish = async (values) => {
        try {
            const formData = new FormData();
            formData.append('name', values.name);
            formData.append('phone', values.phone);
            formData.append('message', values.message);
            // Додаємо тему листа для Formspree
            formData.append('_subject', 'Новий запит з Контактів');
            
            const response = await fetch('https://formspree.io/f/movnpzje', {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            });

            if (response.ok) {
                alert('Дякуємо! Ваше повідомлення відправлено. Ми зв’яжемося з вами найближчим часом.');
                form.resetFields(); // Очищуємо поля форми
            } else {
                alert('Сталася помилка при відправленні. Спробуйте пізніше.');
            }
        } catch (error) {
            alert('Помилка мережі. Перевірте з’єднання та спробуйте знову.');
        }
    };

    return (
        <div className={`contact-page ${themeClass}`}>
            <Card className="contact-card">
                <Title level={2} className="contact-title">Зв'яжіться з нами</Title>
                <Paragraph className="contact-text">
                    Ми завжди раді відповісти на ваші запитання. Заповніть форму нижче, щоб відправити нам повідомлення, або скористайтеся іншими контактними даними.
                </Paragraph>

                <Row gutter={[32, 32]} justify="center">
                    <Col xs={24} md={12}>
                        <div className="contact-info">
                            <Title level={4} className="contact-subtitle">Наші контакти</Title>
                            <Space direction="vertical" size="middle" className="contact-space">
                                <div className="contact-item">
                                    <MailOutlined className="contact-icon" />
                                    <Paragraph className="contact-text-item" style={{marginTop: 14}}>
                                        Email: <a href="mailto:contact@house24.ua" className="contact-link">contact@house24.ua</a>
                                    </Paragraph>
                                </div>
                                <div className="contact-item" style={{marginTop: -20}}>
                                    <PhoneOutlined className="contact-icon"/>
                                    <Paragraph className="contact-text-item" style={{marginTop: 14}}>
                                        Телефон: <a href="tel:+380123456789" className="contact-link">+380 (12) 345 67 89</a>
                                    </Paragraph>
                                </div>
                                <div className="social-links-container" style={{marginTop: -15}}>
                                    <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
                                        <FacebookOutlined className="social-icon" />
                                    </a>
                                    <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
                                        <InstagramOutlined className="social-icon" />
                                    </a>
                                    <a href="https://t.me/" target="_blank" rel="noopener noreferrer">
                                        <SendOutlined className="social-icon" />
                                    </a>
                                    <a href="https://youtube.com" target="_blank" rel="noopener noreferrer">
                                        <YoutubeOutlined className="social-icon" />
                                    </a>
                                    <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
                                        <TwitterOutlined className="social-icon" />
                                    </a>
                                    <a href="https://tiktok.com" target="_blank" rel="noopener noreferrer">
                                        <TikTokOutlined className="social-icon" />
                                    </a>
                                </div>
                            </Space>
                        </div>
                    </Col>
                    <Col xs={24} md={12}>
                        <div className="contact-form-container">
                            <Title level={4} className="contact-subtitle">Відправити повідомлення</Title>
                            <Form
                                form={form}
                                layout="vertical"
                                onFinish={onFinish} // Використовуємо функцію onFinish
                            >
                                <Form.Item
                                    name="name"
                                    label="Ваше ім'я"
                                    rules={[{ required: true, message: "Будь ласка, введіть ваше ім'я" }]}
                                >
                                    <Input placeholder="Іван" allowClear />
                                </Form.Item>
                                <Form.Item
                                    name="phone"
                                    label="Телефон"
                                    rules={[{ required: true, message: "Будь ласка, введіть ваш телефон" }]}
                                >
                                    <Input placeholder="+380 (50) 123-45-67" allowClear />
                                </Form.Item>
                                <Form.Item
                                    name="message"
                                    label="Повідомлення"
                                    rules={[{ required: true, message: "Будь ласка, введіть ваше повідомлення" }]}
                                >
                                    <TextArea rows={4} placeholder="Ваше повідомлення..." />
                                </Form.Item>
                                <Form.Item>
                                    <Button type="primary" htmlType="submit" style={{ width: '100%' }}>
                                        Відправити
                                    </Button>
                                </Form.Item>
                            </Form>
                        </div>
                    </Col>
                </Row>
            </Card>
        </div>
    );
};

export default Contact;