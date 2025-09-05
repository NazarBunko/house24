import React from 'react';
import { Card, Typography, Space, Divider } from 'antd';
import { SafetyOutlined, UserOutlined, FileProtectOutlined, InfoCircleOutlined } from '@ant-design/icons';
import "antd/dist/reset.css";
import './TermsOfService.css';

const { Title, Paragraph } = Typography;

const TermsOfService = ({ isLightTheme }) => {
    const themeClass = isLightTheme ? 'light-theme' : 'dark-theme';

    return (
        <div className={`terms-of-service-page ${themeClass}`}>
            <Card className="terms-of-service-card">
                <Title level={2} className="main-title">Умови користування</Title>
                <Paragraph className="main-text">
                    Ласкаво просимо на **House24**! Користуючись цим веб-сайтом, ви погоджуєтеся дотримуватися наших Умов користування. Якщо ви не згодні з будь-якою частиною цих умов, будь ласка, не користуйтеся нашим сайтом.
                </Paragraph>

                <Space direction="vertical" size="large" style={{ width: '100%' }}>
                    {/* --- Загальні умови --- */}
                    <div className="section">
                        <Title level={3} className="section-title">
                            <InfoCircleOutlined className="section-icon" /> Загальні умови
                        </Title>
                        <Paragraph className="section-text">
                            Ці Умови регулюють ваш доступ до сайту та його використання. Ми залишаємо за собою право змінювати ці Умови в будь-який час. Продовжуючи використовувати сайт після внесення змін, ви погоджуєтеся з оновленими умовами.
                        </Paragraph>
                    </div>

                    <Divider className="page-divider" />

                    {/* --- Обов'язки користувача --- */}
                    <div className="section">
                        <Title level={3} className="section-title">
                            <UserOutlined className="section-icon" /> Обов'язки користувача
                        </Title>
                        <ul className="terms-list">
                            <li className="list-item">Ви повинні надати точну та повну інформацію під час реєстрації та бронювання.</li>
                            <li className="list-item">Ви несете відповідальність за збереження конфіденційності ваших облікових даних.</li>
                            <li className="list-item">Заборонено використовувати сайт для будь-якої незаконної або забороненої цими Умовами діяльності.</li>
                        </ul>
                    </div>
                    
                    <Divider className="page-divider" />

                    {/* --- Інтелектуальна власність --- */}
                    <div className="section">
                        <Title level={3} className="section-title">
                            <FileProtectOutlined className="section-icon" /> Інтелектуальна власність
                        </Title>
                        <Paragraph className="section-text">
                            Весь контент на сайті, включаючи текст, зображення, логотипи, є нашою власністю або власністю наших ліцензіарів і захищений авторським правом. Ви не можете відтворювати, поширювати або іншим чином використовувати контент без нашої письмової згоди.
                        </Paragraph>
                    </div>

                    <Divider className="page-divider" />

                    {/* --- Відмова від гарантій --- */}
                    <div className="section">
                        <Title level={3} className="section-title">
                            <SafetyOutlined className="section-icon" /> Відмова від гарантій та обмеження відповідальності
                        </Title>
                        <Paragraph className="section-text">
                            Сайт надається на умовах "як є". Ми не гарантуємо, що сайт буде працювати безперебійно або без помилок. Ми не несемо відповідальності за будь-які збитки, прямі чи непрямі, що виникли в результаті використання сайту.
                        </Paragraph>
                    </div>
                </Space>
            </Card>
        </div>
    );
};

export default TermsOfService;