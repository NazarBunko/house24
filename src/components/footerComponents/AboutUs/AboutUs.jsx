import React from 'react';
import { Card, Typography, Row, Col, Space } from 'antd';
import { TeamOutlined, HeartOutlined, HomeOutlined } from '@ant-design/icons';
import "antd/dist/reset.css";
import './AboutUs.css'; // Імпортуйте файл стилів

const { Title, Paragraph } = Typography;

const AboutUs = ({ isLightTheme }) => {
    const themeClass = isLightTheme ? 'light-theme' : 'dark-theme';

    return (
        <div className={`about-us-page ${themeClass}`}>
            <Card className="about-us-card">
                <Title level={2} className="about-us-title">Про нас</Title>
                <Paragraph className="about-us-text">
                    **House24** — це сучасна платформа для подобової та помісячної оренди житла. Наша місія — спростити процес пошуку та бронювання ідеального помешкання, забезпечуючи максимальний комфорт і безпеку для кожного клієнта.
                </Paragraph>

                <Title level={3} className="about-us-subtitle">Наша місія</Title>
                <Paragraph className="about-us-text">
                    Ми прагнемо створити надійну спільноту, де кожен може легко знайти житло, що відповідає його потребам, чи то затишну квартиру на вихідні, чи довгострокове помешкання для роботи. Ми віримо, що доступ до якісного житла є ключем до щасливих подорожей та успішних починань.
                </Paragraph>

                <Title level={3} className="about-us-subtitle">Наші цінності</Title>
                <Row gutter={[16, 16]} justify="center" style={{ marginBottom: '20px' }}>
                    <Col xs={24} md={8}>
                        <Card className="value-card" hoverable>
                            <Space direction="vertical" align="center">
                                <HomeOutlined className="value-icon" />
                                <Title level={4}>Комфорт</Title>
                                <Paragraph className="value-text">
                                    Ми гарантуємо, що кожне оголошення на платформі відповідає високим стандартам якості та зручності.
                                </Paragraph>
                            </Space>
                        </Card>
                    </Col>
                    <Col xs={24} md={8}>
                        <Card className="value-card" hoverable>
                            <Space direction="vertical" align="center">
                                <HeartOutlined className="value-icon" />
                                <Title level={4}>Надійність</Title>
                                <Paragraph className="value-text">
                                    Безпека наших користувачів — наш пріоритет. Ми перевіряємо оголошення, щоб ви почувалися впевнено.
                                </Paragraph>
                            </Space>
                        </Card>
                    </Col>
                    <Col xs={24} md={8}>
                        <Card className="value-card" hoverable>
                            <Space direction="vertical" align="center">
                                <TeamOutlined className="value-icon" />
                                <Title level={4}>Спільнота</Title>
                                <Paragraph className="value-text">
                                    Ми будуємо відкриту та дружню спільноту орендодавців і орендарів, засновану на довірі.
                                </Paragraph>
                            </Space>
                        </Card>
                    </Col>
                </Row>
            </Card>
        </div>
    );
};

export default AboutUs;