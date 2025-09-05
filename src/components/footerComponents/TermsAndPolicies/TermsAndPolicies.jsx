import React from 'react';
import { Card, Typography, Row, Col, Space, Divider, Button } from 'antd';
import { TeamOutlined, FileProtectOutlined } from '@ant-design/icons';
import "antd/dist/reset.css";
import './TermsAndPolicies.css';

const { Title, Paragraph } = Typography;

const TermsAndPolicies = ({ isLightTheme }) => {
    const themeClass = isLightTheme ? 'light-theme' : 'dark-theme';

    const teamMembers = [
        { name: "Іван Коваль", position: "Генеральний директор", photo: `${process.env.PUBLIC_URL}/images/man1.png` },
        { name: "Олена Петренко", position: "Головний менеджер", photo: `${process.env.PUBLIC_URL}/images/woman.png` },
        { name: "Олександр Шевченко", position: "Технічний директор", photo: `${process.env.PUBLIC_URL}/images/man2.png` },
    ];

    return (
        <div className={`teams-and-policies-page ${themeClass}`}>
            <Card className="teams-and-policies-card">
                <Title level={2} className="main-title">Наша команда та політика</Title>
                <Paragraph className="main-text">
                    Ми будуємо прозору та надійну спільноту. Нижче ви знайдете інформацію про команду **House24** та наші основні політики.
                </Paragraph>

                <div className="section-container">
                    <Title level={3} className="section-title">
                        <TeamOutlined className="section-icon" /> Наша команда
                    </Title>
                    <Paragraph className="section-text">
                        Знайомтеся з людьми, які стоять за успіхом House24.
                    </Paragraph>
                    <Row gutter={[24, 24]} justify="center">
                        {teamMembers.map((member, index) => {
                            const nameParts = member.name.split(' ');
                            const firstName = nameParts[0];
                            const lastName = nameParts.slice(1).join(' ');

                            return (
                                <Col xs={24} sm={12} md={8} key={index}>
                                    <Card className="team-member-card" hoverable>
                                        <img src={member.photo} alt={member.name} className="member-photo" />
                                        <Title level={4} className="member-first-name">{firstName}</Title>
                                        <Title level={4} className="member-first-name" style={{marginTop: -12}}>{lastName}</Title>
                                        <Paragraph className="member-position">{member.position}</Paragraph>
                                    </Card>
                                </Col>
                            );
                        })}
                    </Row>
                </div>

                <Divider className="page-divider" />

                <div className="section-container">
                    <Title level={3} className="section-title">
                        <FileProtectOutlined className="section-icon" /> Наша політика
                    </Title>
                    <Paragraph className="section-text">
                        Ми дбаємо про вашу безпеку та інформуємо про наші принципи роботи. Ознайомтеся з ключовими документами.
                    </Paragraph>
                    <Space direction="vertical" size="middle" style={{ width: '100%', textAlign: 'center', marginTop: 10 }}>
                        <a href="/private-policy">
                            <Button size="large" className="policy-btn">Політика конфіденційності</Button>
                        </a>
                        <a href="/copyright">
                            <Button size="large" className="policy-btn">Авторське право</Button>
                        </a>
                        <a href="/cooperation">
                            <Button size="large" className="policy-btn">Умови співпраці</Button>
                        </a>
                    </Space>
                </div>
            </Card>
        </div>
    );
};

export default TermsAndPolicies;