import React, { useState } from 'react';
import { Card, Tabs, List, Button, Typography } from 'antd';
import { CheckCircleOutlined, UserOutlined, MailOutlined, PhoneOutlined } from '@ant-design/icons';
import './AdminPanel.css';

const { TabPane } = Tabs;
const { Title, Text } = Typography;

const mockViewings = [
    { id: 1, clientName: 'Іван Петров', phone: '+380991234567', email: 'ivan.petrov@example.com', status: 'pending', property: 'Квартира на Хрещатику', date: '25.09.2025', time: '14:30' },
    { id: 2, clientName: 'Марія Коваль', phone: '+380679876543', email: 'mariya.k@example.com', status: 'pending', property: 'Будинок в Карпатах', date: '26.09.2025', time: '11:00' },
    { id: 3, clientName: 'Олександр Сидоренко', phone: '+380501112233', email: 'o.sydorenko@example.com', status: 'accepted', property: 'Котедж на озері', date: '27.09.2025', time: '16:45' },
];

const mockRentals = [
    { id: 1, clientName: 'Олена Іванова', phone: '+380631234567', email: 'olena.i@example.com', status: 'pending', dates: '10.09.2025 - 15.09.2025', property: 'Квартира в центрі Львова' },
    { id: 2, clientName: 'Віктор Кравченко', phone: '+380687654321', email: 'viktor.k@example.com', status: 'pending', dates: '20.09.2025 - 22.09.2025', property: 'Апартаменти біля моря' },
];

const mockInquiries = [
    { id: 1, clientName: 'Дмитро Шевченко', phone: '+380961234567', email: 'dmytro.s@example.com', message: 'Хочу дізнатися більше про подобову оренду.' },
    { id: 2, clientName: 'Наталія Мороз', phone: '+380509876543', email: 'nataliya.m@example.com', message: 'Чи можна забронювати квартиру на наступний місяць?' },
];

const AdminPanel = ({ isLightTheme }) => {
    const [viewings, setViewings] = useState(mockViewings);
    const [rentals, setRentals] = useState(mockRentals);
    const [activeTab, setActiveTab] = useState('1');

    const handleAcceptRequest = (listType, id) => {
        if (listType === 'viewings') {
            setViewings(prev => prev.map(item => item.id === id ? { ...item, status: 'accepted' } : item));
        } else if (listType === 'rentals') {
            setRentals(prev => prev.map(item => item.id === id ? { ...item, status: 'accepted' } : item));
        }
    };
    
    const renderStatus = (status) => {
        const statusMap = {
            'accepted': { text: 'Прийнято', dotClass: 'accepted-dot', textClass: 'accepted-text' },
            'pending': { text: 'Очікує', dotClass: 'pending-dot', textClass: '' },
        };
        const currentStatus = statusMap[status] || { text: status, dotClass: 'default-dot', textClass: '' };

        return (
            <span className={`status-tag ${currentStatus.dotClass}`}>
                <span className={currentStatus.textClass}>
                    {currentStatus.text}
                </span>
            </span>
        );
    };

    const renderList = (dataSource, listType) => (
        <List
            itemLayout="horizontal"
            dataSource={dataSource}
            renderItem={item => (
                <List.Item
                    actions={[
                        item.status === 'pending' ? (
                            <Button type="primary" onClick={() => handleAcceptRequest(listType, item.id)} icon={<CheckCircleOutlined />}>
                                Прийняти
                            </Button>
                        ) : (
                            renderStatus(item.status)
                        )
                    ]}
                >
                    <List.Item.Meta
                        avatar={<UserOutlined style={{ fontSize: 24, color: '#1890ff' }} />}
                        title={<Text strong>{item.clientName}</Text>}
                        description={
                            <div className="client-info">
                                {item.date && item.time && <p>Дата: <b>{item.date}</b>, Час: <b>{item.time}</b></p>}
                                {item.dates && <p>Дати: {item.dates}</p>}
                                {item.property && <p>Об'єкт: <b>{item.property}</b></p>}
                                {item.message && <p>Повідомлення: {item.message}</p>}
                                <p>
                                    <MailOutlined /> {item.email}, <PhoneOutlined /> {item.phone}
                                </p>
                            </div>
                        }
                    />
                </List.Item>
            )}
        />
    );

    const themeClass = isLightTheme ? '' : 'dark-theme';

    return (
        <div className={`admin-panel-container ${themeClass}`} style={{borderRadius: 10}}>
            <Title level={2} style={{ textAlign: 'center', marginBottom: '30px' }}>Панель адміністратора</Title>
            <Card className="admin-panel-card">
                <div className="desktop-tabs">
                    <Tabs defaultActiveKey="1" activeKey={activeTab} onChange={setActiveTab}>
                        <TabPane tab="Записи на перегляд" key="1">
                            {renderList(viewings, 'viewings')}
                        </TabPane>
                        <TabPane tab="Запити на подобову оренду" key="2">
                            {renderList(rentals, 'rentals')}
                        </TabPane>
                    </Tabs>
                </div>

                <div className="mobile-buttons">
                    <Button
                        block
                        size="large"
                        type={activeTab === '1' ? 'primary' : 'default'}
                        onClick={() => setActiveTab('1')}
                        className={`mobile-tab-button ${activeTab === '1' ? 'active-button' : ''}`}
                        style={{marginTop: 8}}
                    >
                        Записи на перегляд
                    </Button>
                    <Button
                        block
                        size="large"
                        type={activeTab === '2' ? 'primary' : 'default'}
                        onClick={() => setActiveTab('2')}
                        className={`mobile-tab-button ${activeTab === '2' ? 'active-button' : ''}`}
                        style={{marginTop: 8}}
                    >
                        Запити на подобову оренду
                    </Button>
                    <Button
                        block
                        size="large"
                        type={activeTab === '3' ? 'primary' : 'default'}
                        onClick={() => setActiveTab('3')}
                        className={`mobile-tab-button ${activeTab === '3' ? 'active-button' : ''}`}
                        style={{marginTop: 8, marginBottom: 5}}
                    >
                        Звернення від клієнтів
                    </Button>
                </div>

                <div className="mobile-content-container">
                    {activeTab === '1' && renderList(viewings, 'viewings')}
                    {activeTab === '2' && renderList(rentals, 'rentals')}
                    {activeTab === '3' && (
                        <List
                            itemLayout="horizontal"
                            dataSource={mockInquiries}
                            renderItem={item => (
                                <List.Item>
                                    <List.Item.Meta
                                        avatar={<UserOutlined style={{ fontSize: 24, color: '#1890ff' }} />}
                                        title={<Text strong>{item.clientName}</Text>}
                                        description={
                                            <div className="client-info">
                                                <p>Повідомлення: {item.message}</p>
                                                <p>Контакти: {item.phone}, {item.email}</p>
                                            </div>
                                        }
                                    />
                                </List.Item>
                            )}
                        />
                    )}
                </div>
            </Card>
        </div>
    );
};

export default AdminPanel;