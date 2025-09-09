import React from 'react';
import { Card, Typography, Row, Col } from 'antd';
import { ClockCircleOutlined, PhoneFilled, MailOutlined, EnvironmentOutlined } from '@ant-design/icons';
import { FaTelegramPlane, FaViber, FaWhatsapp } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import "antd/dist/reset.css";
import './Support.css';

const { Title, Paragraph } = Typography;

const Support = ({ isLightTheme }) => {
    const themeClass = isLightTheme ? 'light-theme' : 'dark-theme';

    return (
        <div 
            className={`support-page ${themeClass}`} 
            style={{ backgroundImage: `url(${process.env.PUBLIC_URL}/images/carpathian-mountains-blur.jpg)` }}
        >
            <div className="support-overlay">
                <Title level={2} className="support-title dark-theme" style={{backgroundColor: "transparent"}}>Центр підтримки</Title>
                <Paragraph className="support-text dark-theme" style={{backgroundColor: "transparent"}}>
                    Ми тут, щоб допомогти вам.
                </Paragraph>

                <div className="contact-info-container">
                    <Row gutter={[16, 16]} justify="center">
                        <Col xs={24} sm={12} lg={6}>
                            <Card className="contact-info-card dark-theme">
                                <ClockCircleOutlined className="contact-icon" />
                                <Title level={4}>Графік роботи</Title>
                                <Paragraph>Пн-Пт: 9:00-18:00</Paragraph>
                                <Paragraph>Сб: 10:00-13:00</Paragraph>
                                <Paragraph>Нд: вихідний</Paragraph>
                            </Card>
                        </Col>
                        <Col xs={24} sm={12} lg={6}>
                            <Card className="contact-info-card dark-theme">
                                <PhoneFilled className="contact-icon" />
                                <Title level={4}>Контакти підтримки</Title>
                                <Paragraph><a href="tel:+380501234567">+380 (50) 123-45-67</a></Paragraph>
                                <div className="social-icons">
                                    <Link to="https://t.me/" target="_blank" rel="noopener noreferrer">
                                        <FaTelegramPlane className="social-icon" />
                                    </Link>
                                    <Link to="https://www.whatsapp.com/" target="_blank" rel="noopener noreferrer">
                                        <FaWhatsapp className="social-icon" />
                                    </Link>
                                    <Link to="https://www.viber.com" target="_blank" rel="noopener noreferrer">
                                        <FaViber className="social-icon" />
                                    </Link>
                                </div>
                            </Card>
                        </Col>
                        <Col xs={24} sm={12} lg={6}>
                            <Card className="contact-info-card dark-theme">
                                <MailOutlined className="contact-icon" />
                                <Title level={4}>E-mail</Title>
                                <Paragraph>Обслуговування клієнтів</Paragraph>
                                <Paragraph><a href="mailto:support@house24.com">support@house24.com</a></Paragraph>
                                <Paragraph>Технічна підтримка</Paragraph>
                                <Paragraph><a href="mailto:support@house24.com">support@house24.com</a></Paragraph>
                            </Card>
                        </Col>
                        <Col xs={24} sm={12} lg={6}>
                            <Card className="contact-info-card dark-theme">
                                <EnvironmentOutlined className="contact-icon" />
                                <Title level={4}>Розташування</Title>
                                <Paragraph>Ми не прив'язані до певного міста чи місця, наші послуги доступні для вас по всій території України.</Paragraph>
                            </Card>
                        </Col>
                    </Row>
                </div>
            </div>
        </div>
    );
};

export default Support;