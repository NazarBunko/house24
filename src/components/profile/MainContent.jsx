import React from 'react';
import { Card, Button, Input, Space } from 'antd';
import { Link } from 'react-router-dom';
import './Profile.css';

const MainContent = ({
    activePage,
    isLightTheme,
    profileData,
    handleProfileChange,
    passwordData,
    handlePasswordChange,
    saveProfileChanges,
    changePassword,
    mockRentals,
    mockMyListings,
    mockFavorites,
    mockNotifications,
}) => {
    const themeClass = isLightTheme ? 'light-theme' : 'dark-theme';

    const getStatusStyles = (status, itemType) => {
        let text;
        let color;

        switch (status) {
            case 'Активне':
                color = '#4CAF50';
                text = 'Активне';
                break;
            case 'На перевірці':
                color = '#ffc107';
                text = 'На перевірці';
                break;
            case 'Не активне':
                color = '#666';
                text = 'Не активне';
                break;
            default:
                color = '#666';
                text = status;
        }
        return { color, text };
    };

    return (
        <div className={`account-content-card ${themeClass}`}>
            {activePage === 'dashboard' && (
                <>
                    <h2 className="account-content-title">Панель управління</h2>
                    <div className="account-dashboard-grid">
                        <Link to="/account?tab=my-listings" className="dashboard-link">
                            <Card className={`dashboard-card ${themeClass}`}>
                                <p>Активні оголошення</p>
                                <h3>{mockMyListings.filter(r => r.status === 'Активне').length}</h3>
                            </Card>
                        </Link>
                        <Link to="/account?tab=favorites" className="dashboard-link">
                            <Card className={`dashboard-card ${themeClass}`}>
                                <p>Збережені помешкання</p>
                                <h3>{mockFavorites.length}</h3>
                            </Card>
                        </Link>
                        <Link to="/account?tab=notifications" className="dashboard-link">
                            <Card className={`dashboard-card ${themeClass}`}>
                                <p>Непрочитані сповіщення</p>
                                <h3>{mockNotifications.length}</h3>
                            </Card>
                        </Link>
                    </div>
                </>
            )}

            {activePage === 'my-listings' && (
                <>
                    <h2 className="account-content-title">Мої оголошення</h2>
                    <Space direction="vertical" style={{ width: '100%' }}>
                        {mockMyListings.map(item => {
                            const statusStyles = getStatusStyles(item.status);
                            return (
                                <Card key={item.id} className={`list-item-card ${themeClass}`}>
                                    <div className="list-item-header">
                                        <h3 className="list-item-title">{item.title}</h3>
                                        <div className="status-indicator">
                                            <div className="status-dot" style={{ backgroundColor: statusStyles.color }}></div>
                                            <span style={{ color: statusStyles.color }}>{statusStyles.text}</span>
                                        </div>
                                    </div>
                                    <div className="list-item-details">
                                        <span className={isLightTheme ? '' : 'dark-theme-secondary-text'}>Перегляди: {item.views}</span>
                                    </div>
                                    <div className="list-item-actions" style={{ marginTop: 10}}>
                                        {/* Кнопка редагування */}
                                        <Link to={`/edit-listing/${item.id}`}>
                                            <Button type="primary">Редагувати</Button>
                                        </Link>
                                    </div>
                                </Card>
                            );
                        })}
                    </Space>
                </>
            )}

            {activePage === 'favorites' && (
                <>
                    <h2 className="account-content-title">Обрані помешкання</h2>
                    <Space direction="vertical" style={{ width: '100%' }}>
                        {mockFavorites.map(item => (
                            <Card key={item.id} className={`list-item-card ${themeClass}`}>
                                <div className="list-item-header">
                                    <h3 className="list-item-title">{item.title}</h3>
                                    <span className={`price-text ${isLightTheme ? '' : 'dark-theme-price-text'}`}>{item.price_per_day || item.price_per_month}</span>
                                </div>
                                <div className="list-item-details">
                                    <span className={isLightTheme ? '' : 'dark-theme-secondary-text'}>{item.city}</span>
                                </div>
                            </Card>
                        ))}
                    </Space>
                </>
            )}

            {activePage === 'notifications' && (
                <>
                    <h2 className="account-content-title">Сповіщення</h2>
                    <Space direction="vertical" style={{ width: '100%' }}>
                        {mockNotifications.map(item => (
                            <Card key={item.id} className={`list-item-card ${themeClass}`}>
                                <div className="notification-item">
                                    <div className="notification-content">
                                        <p className={isLightTheme ? '' : 'dark-theme-text'}>{item.text}</p>
                                        <span className={`notification-date ${isLightTheme ? '' : 'dark-theme-secondary-text'}`}>{item.date}</span>
                                    </div>
                                </div>
                            </Card>
                        ))}
                    </Space>
                </>
            )}

            {activePage === 'settings' && (
                <>
                    <h2 className="account-content-title">Особисті дані</h2>
                    <div className="settings-section">
                        <Space direction="vertical" style={{ width: '100%' }}>
                            <Input
                                className={`ant-input-themed ${themeClass}`}
                                placeholder="Ім'я"
                                name="firstName"
                                value={profileData.firstName}
                                onChange={handleProfileChange}
                                allowClear
                            />
                            <Input
                                className={`ant-input-themed ${themeClass}`}
                                placeholder="Прізвище"
                                name="lastName"
                                value={profileData.lastName}
                                onChange={handleProfileChange}
                                allowClear
                            />
                            <Input
                                className={`ant-input-themed ${themeClass}`}
                                placeholder="Email"
                                name="email"
                                value={profileData.email}
                                onChange={handleProfileChange}
                                allowClear
                            />
                            <Input
                                className={`ant-input-themed ${themeClass}`}
                                placeholder="Номер телефону"
                                name="phone"
                                value={profileData.phone}
                                onChange={handleProfileChange}
                                allowClear
                            />
                            <Button type="primary" onClick={saveProfileChanges} style={{ width: '100%', marginTop: '1rem' }}>Зберегти зміни</Button>
                        </Space>
                    </div>
                    <h2 className="account-content-title" style={{ marginTop: '3rem' }}>Змінити пароль</h2>
                    <div className="settings-section" style={{ marginTop: '1rem' }}>
                        <Space direction="vertical" style={{ width: '100%' }}>
                            <Input.Password
                                className={`ant-input-themed ${themeClass}`}
                                placeholder="Поточний пароль"
                                name="currentPassword"
                                value={passwordData.currentPassword}
                                onChange={handlePasswordChange}
                            />
                            <Input.Password
                                className={`ant-input-themed ${themeClass}`}
                                placeholder="Новий пароль"
                                name="newPassword"
                                value={passwordData.newPassword}
                                onChange={handlePasswordChange}
                            />
                            <Input.Password
                                className={`ant-input-themed ${themeClass}`}
                                placeholder="Повторіть новий пароль"
                                name="confirmNewPassword"
                                value={passwordData.confirmNewPassword}
                                onChange={handlePasswordChange}
                            />
                            <Button type="primary" danger onClick={changePassword} style={{ width: '100%', marginTop: '1rem' }}>Змінити пароль</Button>
                        </Space>
                    </div>
                </>
            )}
        </div>
    );
};

export default MainContent;