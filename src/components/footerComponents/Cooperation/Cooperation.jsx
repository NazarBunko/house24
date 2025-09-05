import React from 'react';
import { Card, Typography, Row, Col, Button, Form, Input, Space, message } from 'antd';
import { CheckCircleOutlined, DollarCircleOutlined, RocketOutlined } from '@ant-design/icons';
import "antd/dist/reset.css";
import './Cooperation.css';

const { Title, Paragraph } = Typography;
const { TextArea } = Input;

const Cooperation = ({ isLightTheme }) => {
    const themeClass = isLightTheme ? 'light-theme' : 'dark-theme';
    const [form] = Form.useForm();

    const onFinish = async (values) => {
        try {
            // Додаємо тему листа до даних форми
            const formData = {
                ...values,
                _subject: `Запит на співпрацю від: ${values.name}`,
            };

            const response = await fetch('https://formspree.io/f/movnpzje', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                alert('Дякуємо! Ваш запит відправлено. Ми зв’яжемося з вами найближчим часом.');
                form.resetFields(); // Очищаємо поля форми
            } else {
                message.error('Сталася помилка при відправленні. Спробуйте пізніше.');
            }
        } catch (error) {
            message.error('Помилка мережі. Перевірте з’єднання та спробуйте знову.');
        }
    };

    return (
        <div className={`cooperation-page ${themeClass}`}>
            <Card className="cooperation-card">
                <Title level={2} className="cooperation-title">Співпраця з House24</Title>
                <Paragraph className="cooperation-text">
                    Станьте нашим партнером і розмістіть своє житло на платформі **House24**, щоб отримати доступ до тисяч потенційних клієнтів. Ми пропонуємо прозорі умови та зручні інструменти для ефективного управління вашими оголошеннями.
                </Paragraph>

                <Title level={3} className="cooperation-subtitle">Чому варто співпрацювати з нами?</Title>
                <Row gutter={[16, 16]} justify="center" style={{ marginBottom: '2rem' }}>
                    <Col xs={24} md={8}>
                        <Card className="cooperation-advantage-card" hoverable>
                            <Space direction="vertical" align="center">
                                <RocketOutlined className="advantage-icon" />
                                <Title level={4}>Збільшення доходу</Title>
                                <Paragraph className="advantage-text">
                                    Розширте аудиторію та отримуйте більше бронювань завдяки нашій активній маркетинговій стратегії.
                                </Paragraph>
                            </Space>
                        </Card>
                    </Col>
                    <Col xs={24} md={8}>
                        <Card className="cooperation-advantage-card" hoverable>
                            <Space direction="vertical" align="center">
                                <CheckCircleOutlined className="advantage-icon" />
                                <Title level={4}>Простота управління</Title>
                                <Paragraph className="advantage-text">
                                    Зручний інтерфейс для керування календарем, цінами та деталями вашого помешкання.
                                </Paragraph>
                            </Space>
                        </Card>
                    </Col>
                    <Col xs={24} md={8}>
                        <Card className="cooperation-advantage-card" hoverable>
                            <Space direction="vertical" align="center">
                                <DollarCircleOutlined className="advantage-icon" />
                                <Title level={4}>Безпечні платежі</Title>
                                <Paragraph className="advantage-text">
                                    Ми гарантуємо безпечні та швидкі виплати за всіма підтвердженими бронюваннями.
                                </Paragraph>
                            </Space>
                        </Card>
                    </Col>
                </Row>
                
                <Title level={3} className="cooperation-subtitle">Зацікавились? Зв'яжіться з нами!</Title>
                <div className="cooperation-form-container">
                    <Form
                        form={form}
                        layout="vertical"
                        onFinish={onFinish}
                    >
                        {/* Приховане поле для Formspree, щоб задати тему листа */}
                        <Input type="hidden" name="_subject" value="Новий запит на співпрацю з сайту" />
                        
                        <Form.Item
                            name="name"
                            label="Ваше ім'я"
                            rules={[{ required: true, message: "Будь ласка, введіть ваше ім'я" }]}
                        >
                            <Input placeholder="Іван" allowClear/>
                        </Form.Item>
                        <Form.Item
                            name="phone"
                            label="Телефон"
                            rules={[
                                { 
                                    required: true, 
                                    message: "Будь ласка, введіть номер телефону" 
                                },
                                {
                                    pattern: /^\+?[0-9()\s-]+$/,
                                    message: "Будь ласка, введіть коректний номер телефону"
                                }
                            ]}
                        >
                            <Input placeholder="+380 (50) 123-45-67" allowClear/>
                        </Form.Item>
                        <Form.Item
                            name="message"
                            label="Повідомлення"
                            rules={[{ required: true, message: "Будь ласка, розкажіть про ваше житло" }]}
                        >
                            <TextArea rows={4} placeholder="Напишіть, яке житло ви хочете розмістити та як ми можемо зв'язатися з вами." />
                        </Form.Item>
                        <Form.Item>
                            <Button type="primary" htmlType="submit" style={{ width: '100%' }}>
                                Відправити запит
                            </Button>
                        </Form.Item>
                    </Form>
                </div>
            </Card>
        </div>
    );
};

export default Cooperation;