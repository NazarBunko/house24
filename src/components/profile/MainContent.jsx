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
            {activePage === 'profile' && (
                <>
                    <h2 className="account-content-title">Профіль</h2>
                    <div className="user-info-container">
                        <div className={`user-info-item ${themeClass}`} style={{backgroundColor: isLightTheme ? "white" : null}}>
                            <p className="user-info-label">Прізвище та Ім'я:</p>
                            <p className="user-info-value">Іваненко Іван</p>
                        </div>
                        <div className={`user-info-item ${themeClass}`} style={{backgroundColor: isLightTheme ? "white" : null}}>
                            <p className="user-info-label">Електронна пошта:</p>
                            <p className="user-info-value">ivan.ivanenko@example.com</p>
                        </div>
                        <div className={`user-info-item ${themeClass}`} style={{backgroundColor: isLightTheme ? "white" : null}}>
                            <p className="user-info-label">Номер телефону:</p>
                            <p className="user-info-value">+380 99 123 4567</p>
                        </div>
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