import React, { useState, useEffect } from 'react';
import { Card, Button, Input, Space, Spin, Modal } from 'antd';
import { Link } from 'react-router-dom';
import './Profile.css';
import { dispatchFavoriteUpdate } from '../../layout/header&footer/Header';

const MainContent = ({ activePage, isLightTheme }) => {
    const [profileData, setProfileData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
    });
    const [myListings, setMyListings] = useState([]);
    const [mySalesListings, setMySalesListings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [userId, setUserId] = useState(null);

    const themeClass = isLightTheme ? 'light-theme' : 'dark-theme';

    useEffect(() => {
        const storedUserId = localStorage.getItem('userId');
        if (storedUserId) {
            setUserId(storedUserId);
        } else {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            if (!userId) {
                return;
            }
            
            setLoading(true);

            try {
                // Завантаження даних профілю
                const profileResponse = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/users/${userId}`);
                if (profileResponse.ok) {
                    const user = await profileResponse.json();
                    setProfileData({
                        firstName: user.firstName,
                        lastName: user.lastName,
                        email: user.email,
                        phone: user.phone,
                    });
                } else {
                    console.error("Не вдалося завантажити дані профілю");
                }

                // Завантаження оголошень про оренду
                const listingsResponse = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/daily-listings/user/${userId}`);
                if (listingsResponse.ok) {
                    const listings = await listingsResponse.json();
                    setMyListings(listings);
                } else if (listingsResponse.status !== 204) {
                    console.error("Не вдалося завантажити оголошення про оренду");
                }

                // Завантаження оголошень про продаж
                const salesListingsResponse = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/sales/user/${userId}`);
                if (salesListingsResponse.ok) {
                    const salesListings = await salesListingsResponse.json();
                    setMySalesListings(salesListings);
                } else if (salesListingsResponse.status !== 204) {
                    console.error("Не вдалося завантажити оголошення про продаж");
                }

            } catch (error) {
                console.error("Помилка з'єднання з сервером:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [userId]);

    const handleProfileChange = (e) => {
        const { name, value } = e.target;
        setProfileData(prevState => ({
            ...prevState,
            [name]: value,
        }));
    };

    const saveProfileChanges = async () => {
        if (!userId) {
            Modal.error({ content: "Помилка: ID користувача не знайдено." });
            return;
        }
        try {
            const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/users/${userId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(profileData),
            });
            if (response.ok) {
                Modal.success({
                    content: 'Дані профілю успішно оновлено!',
                });
            } else {
                const errorText = await response.text();
                Modal.error({
                    content: `Помилка оновлення: ${errorText}`,
                });
            }
        } catch (error) {
            console.error("Помилка при збереженні змін:", error);
            Modal.error({
                content: "Помилка при з'єднанні з сервером.",
            });
        }
    };
    
    // Функція для активації оголошень про оренду
    const activateListing = async (listingId) => {
        if (!window.confirm("Ви впевнені, що хочете активувати це оголошення?")) {
            return;
        }
        try {
            const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/daily-listings/${listingId}/activate`, {
                method: 'PUT',
            });
            if (response.ok) {
                Modal.success({ content: 'Оголошення успішно активовано!' });
                setMyListings(prevListings =>
                    prevListings.map(item =>
                        item.id === listingId ? { ...item, status: 'active' } : item
                    )
                );
                // Dynamically update favorites list
                dispatchFavoriteUpdate();
            } else {
                Modal.error({ content: 'Помилка при активації оголошення.' });
            }
        } catch (error) {
            Modal.error({ content: 'Помилка з\'єднання з сервером.' });
        }
    };

    const deactivateListing = async (listingId) => {
        if (!window.confirm("Ви впевнені, що хочете деактивувати це оголошення?")) {
            return;
        }
        try {
            const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/daily-listings/${listingId}/deactivate`, {
                method: 'PUT',
            });
            if (response.ok) {
                Modal.success({ content: 'Оголошення успішно деактивовано!' });
                setMyListings(prevListings =>
                    prevListings.map(item =>
                        item.id === listingId ? { ...item, status: 'hidden' } : item
                    )
                );
                // Dynamically update favorites list
                dispatchFavoriteUpdate();
            } else {
                Modal.error({ content: 'Помилка при деактивації оголошення.' });
            }
        } catch (error) {
            Modal.error({ content: 'Помилка з\'єднання з сервером.' });
        }
    };

    const deleteListing = async (listingId) => {
        if (!window.confirm("Ви впевнені, що хочете видалити це оголошення? Цю дію неможливо скасувати.")) {
            return;
        }
        try {
            const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/daily-listings/${listingId}`, {
                method: 'DELETE',
            });
            if (response.ok) {
                Modal.success({ content: 'Оголошення успішно видалено!' });
                setMyListings(prevListings => prevListings.filter(item => item.id !== listingId));
            } else {
                Modal.error({ content: 'Помилка при видаленні оголошення.' });
            }
        } catch (error) {
            Modal.error({ content: 'Помилка з\'єднання з сервером.' });
        }
    };

    // Функція для активації оголошень про продаж
    const activateSalesListing = async (listingId) => {
        if (!window.confirm("Ви впевнені, що хочете активувати це оголошення?")) {
            return;
        }
        try {
            const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/sales/${listingId}/activate`, {
                method: 'PUT',
            });
            if (response.ok) {
                Modal.success({ content: 'Оголошення про продаж успішно активовано!' });
                setMySalesListings(prevListings =>
                    prevListings.map(item =>
                        item.id === listingId ? { ...item, status: 'active' } : item
                    )
                );
                // Dynamically update favorites list
                dispatchFavoriteUpdate();
            } else {
                Modal.error({ content: 'Помилка при активації оголошення.' });
            }
        } catch (error) {
            Modal.error({ content: 'Помилка з\'єднання з сервером.' });
        }
    };

    const deactivateSalesListing = async (listingId) => {
        if (!window.confirm("Ви впевнені, що хочете деактивувати це оголошення?")) {
            return;
        }
        try {
            const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/sales/${listingId}/deactivate`, {
                method: 'PUT',
            });
            if (response.ok) {
                Modal.success({ content: 'Оголошення про продаж успішно деактивовано!' });
                setMySalesListings(prevListings =>
                    prevListings.map(item =>
                        item.id === listingId ? { ...item, status: 'hidden' } : item
                    )
                );
                // Dynamically update favorites list
                dispatchFavoriteUpdate();
            } else {
                Modal.error({ content: 'Помилка при деактивації оголошення.' });
            }
        } catch (error) {
            Modal.error({ content: 'Помилка з\'єднання з сервером.' });
        }
    };

    const deleteSalesListing = async (listingId) => {
        if (!window.confirm("Ви впевнені, що хочете видалити це оголошення? Цю дію неможливо скасувати.")) {
            return;
        }
        try {
            const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/sales/${listingId}`, {
                method: 'DELETE',
            });
            if (response.ok) {
                Modal.success({ content: 'Оголошення про продаж успішно видалено!' });
                setMySalesListings(prevListings => prevListings.filter(item => item.id !== listingId));
            } else {
                Modal.error({ content: 'Помилка при видаленні оголошення.' });
            }
        } catch (error) {
            Modal.error({ content: 'Помилка з\'єднання з сервером.' });
        }
    };
    
    const getStatusStyles = (status) => {
        let text;
        let color;
        switch (status) {
            case 'active':
                color = '#4CAF50';
                text = 'Активне';
                break;
            case 'pending':
                color = '#ffc107';
                text = 'На перевірці';
                break;
            case 'sold':
                color = '#dc3545';
                text = 'Продано';
                break;
            case 'hidden':
            default:
                color = '#6c757d';
                text = 'Неактивне';
                break;
        }
        return { color, text };
    };

    if (loading) {
        return <div style={{ textAlign: 'center', marginTop: '50px' }}><Spin size="large" /></div>;
    }

    // Компонент-рендер для кнопок дій
    const renderListingActions = (item, isSales) => {
        const deactivateFunc = isSales ? deactivateSalesListing : deactivateListing;
        const deleteFunc = isSales ? deleteSalesListing : deleteListing;
        const activateFunc = isSales ? activateSalesListing : activateListing;
        const viewLink = isSales ? `/sale/${item.id}` : `/listing-daily/${item.id}`;
        const editLink = isSales ? `/edit-sales-listing/${item.id}` : `/edit-listing/${item.id}`;

        return (
            <div className="list-item-actions" style={{ marginTop: 30 }}>
                {item.status === 'active' && (
                    <>
                        <Link to={editLink}>
                            <Button type="default">Редагувати</Button>
                        </Link>
                        <Link to={viewLink}>
                            <Button type="default" style={{ marginLeft: 5, marginTop: 5 }}>Переглянути</Button>
                        </Link>
                        <Button 
                            type="default" 
                            onClick={() => deactivateFunc(item.id)}
                            style={{ marginLeft: 5, marginTop: 5 }}
                        >
                            Деактивувати
                        </Button>
                        <Button 
                            type="default" 
                            onClick={() => deleteFunc(item.id)}
                            style={{ marginLeft: 5, marginTop: 5 }}
                        >
                            Видалити
                        </Button>
                    </>
                )}
                {item.status === 'hidden' && (
                    <>
                        <Link to={editLink}>
                            <Button type="default">Редагувати</Button>
                        </Link>
                        <Link to={viewLink}>
                            <Button type="default" style={{ marginLeft: 5, marginTop: 5 }}>Переглянути</Button>
                        </Link>
                        <Button 
                            type="default" 
                            onClick={() => activateFunc(item.id)}
                            style={{ marginLeft: 5, marginTop: 5 }}
                        >
                            Активувати
                        </Button>
                        <Button 
                            type="default" 
                            onClick={() => deleteFunc(item.id)}
                            style={{ marginLeft: 5, marginTop: 5 }}
                        >
                            Видалити
                        </Button>
                    </>
                )}
                {item.status === 'sold' && (
                    <>
                        <Button 
                            type="default" 
                            onClick={() => activateFunc(item.id)}
                            style={{ marginLeft: 5, marginTop: 5 }}
                        >
                            Активувати
                        </Button>
                        <Link to={viewLink}>
                            <Button type="default" style={{ marginLeft: 5, marginTop: 5 }}>Переглянути</Button>
                        </Link>
                        <Button 
                            type="default" 
                            onClick={() => deleteFunc(item.id)}
                            style={{ marginLeft: 5, marginTop: 5 }}
                        >
                            Видалити
                        </Button>
                    </>
                )}
                {item.status === 'pending' && (
                    <p style={{ color: isLightTheme ? 'black' : 'white', margin: 0 }}>
                        Оголошення на перевірці. Зміни поки що недоступні.
                    </p>
                )}
            </div>
        );
    };

    return (
        <div className={`account-content-card ${themeClass}`}>
            {activePage === 'profile' && (
                <>
                    <h2 className="account-content-title">Профіль</h2>
                    <div className="user-info-container">
                        <div className={`user-info-item ${themeClass}`} style={{ backgroundColor: isLightTheme ? "white" : null }}>
                            <p className="user-info-label">Прізвище та Ім'я:</p>
                            <p className="user-info-value">{profileData.firstName} {profileData.lastName}</p>
                        </div>
                        <div className={`user-info-item ${themeClass}`} style={{ backgroundColor: isLightTheme ? "white" : null }}>
                            <p className="user-info-label">Електронна пошта:</p>
                            <p className="user-info-value">{profileData.email}</p>
                        </div>
                        <div className={`user-info-item ${themeClass}`} style={{ backgroundColor: isLightTheme ? "white" : null }}>
                            <p className="user-info-label">Номер телефону:</p>
                            <p className="user-info-value">{profileData.phone}</p>
                        </div>
                    </div>
                </>
            )}

            {activePage === 'my-listings' && (
                <>
                    <h2 className="account-content-title">Мої оголошення про оренду</h2>
                    <Space direction="vertical" style={{ width: '100%' }}>
                        {myListings.length > 0 ? (
                            myListings.map(item => {
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
                                        {renderListingActions(item, false)}
                                    </Card>
                                );
                            })
                        ) : (
                            <p style={{ textAlign: 'center' }}>У вас немає жодних оголошень про оренду.</p>
                        )}
                    </Space>
                </>
            )}

            {activePage === 'my-sales-listings' && (
                <>
                    <h2 className="account-content-title">Мої оголошення про продаж</h2>
                    <Space direction="vertical" style={{ width: '100%' }}>
                        {mySalesListings.length > 0 ? (
                            mySalesListings.map(item => {
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
                                        {renderListingActions(item, true)}
                                    </Card>
                                );
                            })
                        ) : (
                            <p style={{ textAlign: 'center' }}>У вас немає жодних оголошень про продаж.</p>
                        )}
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
                </>
            )}
        </div>
    );
};

export default MainContent;