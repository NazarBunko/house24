import React from 'react';
import { Card, Typography, Collapse, Form, Input, Button, Divider } from 'antd';
import { QuestionCircleOutlined, MessageOutlined } from '@ant-design/icons';
import "antd/dist/reset.css";
import './Support.css';

const { Title, Paragraph } = Typography;
const { TextArea } = Input;

const faqItems = [
    {
        key: '1',
        label: 'Як мені забронювати житло?',
        children: (
            <Paragraph>
                Для бронювання виберіть об'єкт, який вам сподобався, вкажіть дати заїзду та виїзду, кількість гостей і натисніть "Забронювати". Далі дотримуйтесь інструкцій для оплати.
            </Paragraph>
        ),
    },
    {
        key: '2',
        label: 'Які умови скасування бронювання?',
        children: (
            <Paragraph>
                Умови скасування можуть відрізнятися для кожного об'єкта. Будь ласка, уважно ознайомтеся з політикою скасування, яка вказана на сторінці оголошення перед бронюванням.
            </Paragraph>
        ),
    },
    {
        key: '3',
        label: 'Як я можу зв’язатися з орендодавцем?',
        children: (
            <Paragraph>
                Після підтвердження бронювання ви отримаєте контактні дані орендодавця для обговорення деталей вашого заїзду.
            </Paragraph>
        ),
    },
    {
        key: '4',
        label: 'Чи можна розмістити своє оголошення на сайті?',
        children: (
            <Paragraph>
                Так, ми запрошуємо до співпраці. Будь ласка, перейдіть на сторінку "Співпраця" у футері, щоб дізнатися більше і відправити нам запит.
            </Paragraph>
        ),
    },
];

const Support = ({ isLightTheme }) => {
    const themeClass = isLightTheme ? 'light-theme' : 'dark-theme';
    const [form] = Form.useForm();

    const onFinish = async (values) => {
        try {
            // Додаємо тему листа до даних форми
            const formData = {
                ...values,
                _subject: 'Запит з підтримки',
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
                form.resetFields(); // Очищуємо поля форми
            } else {
                alert('Сталася помилка при відправленні. Спробуйте пізніше.');
            }
        } catch (error) {
            alert('Помилка мережі. Перевірте з’єднання та спробуйте знову.');
        }
    };

    return (
        <div className={`support-page ${themeClass}`}>
            <Card className="support-card">
                <Title level={2} className="support-title">Центр підтримки</Title>
                <Paragraph className="support-text">
                    Ми тут, щоб допомогти вам. Перш ніж зв'язатися з нами, ознайомтеся з розділом найпоширеніших запитань.
                </Paragraph>

                <div className="faq-section">
                    <Title level={3} className="support-subtitle">
                        <QuestionCircleOutlined className="section-icon" /> Поширені запитання (FAQ)
                    </Title>
                    <Collapse accordion items={faqItems} className="faq-collapse" />
                </div>

                <Divider className="support-divider" />

                <div className="contact-support-section">
                    <Title level={3} className="support-subtitle">
                        <MessageOutlined className="section-icon" /> Не знайшли відповіді?
                    </Title>
                    <Paragraph className="support-text">
                        Заповніть форму нижче, і наша команда підтримки зв’яжеться з вами протягом 24 годин.
                    </Paragraph>
                    <Form
                        form={form} // Прив'язуємо форму для можливості очищення
                        layout="vertical"
                        onFinish={onFinish} // Використовуємо функцію для відправки
                        className="support-form"
                    >
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
                            rules={[{ required: true, message: "Будь ласка, введіть ваше повідомлення" }]}
                        >
                            <TextArea rows={4} placeholder="Опишіть вашу проблему або запитання..." />
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

export default Support;