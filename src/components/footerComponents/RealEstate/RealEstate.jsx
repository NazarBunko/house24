import React from 'react';
import { Card, Typography, Row, Col, Button, Space } from 'antd';
import { HomeOutlined, ApartmentOutlined, BankOutlined, PlusCircleOutlined } from '@ant-design/icons';
import "antd/dist/reset.css";
import './RealEstate.css';

const { Title, Paragraph } = Typography;

const RealEstate = ({ isLightTheme }) => {
    const themeClass = isLightTheme ? 'light-theme' : 'dark-theme';

    return (
        <div className={`real-estate-page ${themeClass}`}>
            <Card className="real-estate-card">
                <Title level={2} className="real-estate-title">Каталог нерухомості</Title>
                <Paragraph className="real-estate-text">
                    Відкрийте для себе широкий вибір житла для подобової та довгострокової оренди на платформі **House24**. Ми пропонуємо різноманітні варіанти, щоб ви знайшли ідеальне місце для проживання чи відпочинку.
                </Paragraph>

                <Title level={3} className="real-estate-subtitle">Наші категорії</Title>
                <Row gutter={[24, 24]} justify="center" style={{ marginBottom: '2rem' }}>
                    <Col xs={24} md={8}>
                        <Card className="category-card" hoverable>
                            <Space direction="vertical" align="center">
                                <HomeOutlined className="category-icon" />
                                <Title level={4}>Будинки та котеджі</Title>
                                <Paragraph className="category-text">
                                    Ідеально для сімейного відпочинку або великої компанії.
                                </Paragraph>
                            </Space>
                        </Card>
                    </Col>
                    <Col xs={24} md={8}>
                        <Card className="category-card" hoverable>
                            <Space direction="vertical" align="center">
                                <ApartmentOutlined className="category-icon" />
                                <Title level={4}>Квартири</Title>
                                <Paragraph className="category-text">
                                    Комфортні квартири в центрі міста та спальних районах.
                                </Paragraph>
                            </Space>
                        </Card>
                    </Col>
                    <Col xs={24} md={8}>
                        <Card className="category-card" hoverable>
                            <Space direction="vertical" align="center">
                                <BankOutlined className="category-icon" />
                                <Title level={4}>Вілли та маєтки</Title>
                                <Paragraph className="category-text">
                                    Ексклюзивні варіанти для тих, хто цінує розкіш і приватність.
                                </Paragraph>
                            </Space>
                        </Card>
                    </Col>
                </Row>

                <div className="call-to-action">
                    <Title level={3} className="real-estate-subtitle">Хочете додати свою нерухомість?</Title>
                    <Paragraph className="real-estate-text">
                        Приєднуйтесь до нашої спільноти орендодавців і почніть заробляти на своїй власності вже сьогодні. Розміщення оголошень на нашій платформі — це легко і вигідно.
                    </Paragraph>
                    <Button 
                        type="primary" 
                        size="large"
                        icon={<PlusCircleOutlined />}
                        className="add-listing-btn"
                        // Тут можна додати посилання на сторінку "Співпраця"
                    >
                        Додати оголошення
                    </Button>
                </div>
            </Card>
        </div>
    );
};

export default RealEstate;