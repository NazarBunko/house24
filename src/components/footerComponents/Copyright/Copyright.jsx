import React from 'react';
import { Card, Typography, Space, Divider } from 'antd';
import { CopyrightOutlined, TrademarkOutlined, WarningOutlined } from '@ant-design/icons';
import "antd/dist/reset.css";
import './Copyright.css';

const { Title, Paragraph } = Typography;

const Copyright = ({ isLightTheme }) => {
    const themeClass = isLightTheme ? 'light-theme' : 'dark-theme';

    return (
        <div className={`copyright-page ${themeClass}`}>
            <Card className="copyright-card">
                <Title level={2} className="copyright-title">Авторське право та умови використання</Title>
                <Paragraph className="copyright-text">
                    Ця сторінка містить важливу інформацію щодо авторських прав, торгових марок та правил використання контенту, розміщеного на сайті **House24**.
                </Paragraph>

                <Space direction="vertical" size="large" style={{ width: '100%' }}>
                    <div className="section">
                        <Title level={3} className="section-title">
                            <CopyrightOutlined className="section-icon" /> Авторське право
                        </Title>
                        <Paragraph className="section-text">
                            Весь контент, включаючи текст, зображення, графіку, логотипи, відео та інші матеріали на сайті house24.ua, є власністю **House24** або його ліцензіарів і захищений законами про авторське право.
                        </Paragraph>
                        <Paragraph className="section-text">
                            Копіювання, відтворення, розповсюдження або будь-яке інше використання контенту без письмового дозволу власника заборонено.
                        </Paragraph>
                    </div>

                    <Divider className="copyright-divider" />

                    <div className="section">
                        <Title level={3} className="section-title">
                            <TrademarkOutlined className="section-icon" /> Торгові марки
                        </Title>
                        <Paragraph className="section-text">
                            Назва **"House24"** та логотип є зареєстрованими торговими марками. Використання цих торгових марок без попередньої письмової згоди заборонено.
                        </Paragraph>
                    </div>

                    <Divider className="copyright-divider" />

                    <div className="section">
                        <Title level={3} className="section-title">
                            <WarningOutlined className="section-icon" /> Повідомлення про порушення
                        </Title>
                        <Paragraph className="section-text">
                            Якщо ви вважаєте, що ваш контент був використаний на сайті з порушенням авторських прав, будь ласка, надішліть нам повідомлення, вказавши наступну інформацію:
                        </Paragraph>
                        <ul className="violation-list">
                            <li className="list-item">Ваші контактні дані.</li>
                            <li className="list-item">Опис матеріалу, захищеного авторським правом, який було порушено.</li>
                            <li className="list-item">Посилання на місце, де цей матеріал розміщено на нашому сайті.</li>
                        </ul>
                        <Paragraph className="section-text">
                            Ми серйозно ставимося до всіх повідомлень про порушення авторських прав і вживатимемо заходів для їх усунення.
                        </Paragraph>
                    </div>
                </Space>
            </Card>
        </div>
    );
};

export default Copyright;