import React, { useState, useEffect, useCallback } from 'react';
import { Card, Button, Input, Space, Spin, Image, Typography } from 'antd';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { message } from 'antd';
import debounce from 'lodash/debounce';
import './Profile.css';
import { dispatchFavoriteUpdate } from '../../layout/header&footer/Header';

const { Text } = Typography;

const MainContent = ({
  activePage,
  isLightTheme,
  profileData,
  handleProfileChange,
  passwordData,
  handlePasswordChange,
  saveProfileChanges,
  changePassword,
  profileCacheInvalidated,
  setProfileCacheInvalidated,
}) => {
  const [myListings, setMyListings] = useState([]);
  const [mySalesListings, setMySalesListings] = useState([]);
  const [loadingListings, setLoadingListings] = useState(false);
  const [hasFetchedListings, setHasFetchedListings] = useState(false);

  const themeClass = isLightTheme ? 'light-theme' : 'dark-theme';
  const baseUrl = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080';

  // Debounced fetch for listings
  const debouncedFetchListings = useCallback(
    debounce(async () => {
      let isMounted = true;
      setLoadingListings(true);
      try {
        const listingsResponse = await axios.get(
          `${baseUrl}/api/daily-listings/user/me`,
          { withCredentials: true }
        );
        console.log('Орендні оголошення:', listingsResponse.data);
        if (isMounted) setMyListings(listingsResponse.data);

        const salesListingsResponse = await axios.get(
          `${baseUrl}/api/sales/user/me`,
          { withCredentials: true }
        );
        console.log('Оголошення про продаж:', salesListingsResponse.data);
        if (isMounted) {
          setMySalesListings(salesListingsResponse.data);
          setHasFetchedListings(true);
        }
      } catch (error) {
        if (isMounted) {
          console.error('Помилка завантаження оголошень:', error);
          if (error.response?.status === 401 || error.response?.status === 403) {
            message.error('Сесія закінчилася. Будь ласка, увійдіть знову.');
          } else {
            message.error('Не вдалося завантажити ваші оголошення. Спробуйте ще раз.');
          }
        }
      } finally {
        if (isMounted) setLoadingListings(false);
      }
      return () => {
        isMounted = false;
      };
    }, 300),
    [baseUrl]
  );

  // Fetch listings when activePage changes or cache is invalidated
  useEffect(() => {
    if ((activePage === 'my-listings' || activePage === 'my-sales-listings') && (!hasFetchedListings || profileCacheInvalidated)) {
      debouncedFetchListings();
    }
    return () => {
      debouncedFetchListings.cancel();
    };
  }, [activePage, hasFetchedListings, profileCacheInvalidated, debouncedFetchListings]);

  // Reset profile cache invalidated flag after handling
  useEffect(() => {
    if (profileCacheInvalidated) {
      setProfileCacheInvalidated(false);
    }
  }, [profileCacheInvalidated, setProfileCacheInvalidated]);

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

  const renderListingActions = (item, isSales) => {
    const baseEndpoint = isSales ? 'sales' : 'daily-listings';
    const viewLink = isSales ? `/sale/${item.id}` : `/listing-daily/${item.id}`;
    const editLink = isSales ? `/edit-sale/${item.id}` : `/edit-listing/${item.id}`;

    const handleAction = async (action) => {
      const url = `${baseUrl}/api/${baseEndpoint}/${item.id}${action === 'delete' ? '' : `/${action}`}`;
      const method = action === 'delete' ? 'DELETE' : 'PUT';
      const confirmMessage = action === 'delete' ?
        "Ви впевнені, що хочете видалити це оголошення? Цю дію неможливо скасувати." :
        `Ви впевнені, що хочете ${action === 'activate' ? 'активувати' : 'деактивувати'} це оголошення?`;

      if (!window.confirm(confirmMessage)) {
        return;
      }

      try {
        await axios({
          method: method,
          url: url,
          withCredentials: true,
        });

        message.success(`Оголошення успішно ${action === 'activate' ? 'активовано' : action === 'deactivate' ? 'деактивовано' : 'видалено'}!`);
        if (isSales) {
          setMySalesListings((prev) =>
            action === 'delete'
              ? prev.filter((l) => l.id !== item.id)
              : prev.map((l) => (l.id === item.id ? { ...l, status: action === 'activate' ? 'active' : 'hidden' } : l))
          );
        } else {
          setMyListings((prev) =>
            action === 'delete'
              ? prev.filter((l) => l.id !== item.id)
              : prev.map((l) => (l.id === item.id ? { ...l, status: action === 'activate' ? 'active' : 'hidden' } : l))
          );
        }
        setHasFetchedListings(false); // Invalidate listings cache
        dispatchFavoriteUpdate();
      } catch (error) {
        console.error(`Помилка при ${action}:`, error);
        if (error.response?.status === 401 || error.response?.status === 403) {
          message.error('Сесія закінчилася. Будь ласка, увійдіть знову.');
        } else {
          message.error(`Помилка при ${action === 'activate' ? 'активації' : action === 'deactivate' ? 'деактивації' : 'видаленні'} оголошення.`);
        }
      }
    };

    return (
      <div className="list-item-actions" style={{ marginTop: 30 }}>
        {item.status === 'active' && (
          <>
            <Link to={editLink}>
              <Button type="default">Редагувати</Button>
            </Link>
            <Link to={viewLink}>
              <Button type="default" style={{ marginLeft: 5, marginTop: 5 }}>
                Переглянути
              </Button>
            </Link>
            <Button type="default" onClick={() => handleAction('deactivate')} style={{ marginLeft: 5, marginTop: 5 }}>
              Деактивувати
            </Button>
            <Button type="default" onClick={() => handleAction('delete')} style={{ marginLeft: 5, marginTop: 5 }}>
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
              <Button type="default" style={{ marginLeft: 5, marginTop: 5 }}>
                Переглянути
              </Button>
            </Link>
            <Button type="default" onClick={() => handleAction('activate')} style={{ marginLeft: 5, marginTop: 5 }}>
              Активувати
            </Button>
            <Button type="default" onClick={() => handleAction('delete')} style={{ marginLeft: 5, marginTop: 5 }}>
              Видалити
            </Button>
          </>
        )}
        {item.status === 'sold' && (
          <>
            <Button type="default" onClick={() => handleAction('activate')} style={{ marginLeft: 5, marginTop: 5 }}>
              Активувати
            </Button>
            <Link to={viewLink}>
              <Button type="default" style={{ marginLeft: 5, marginTop: 5 }}>
                Переглянути
              </Button>
            </Link>
            <Button type="default" onClick={() => handleAction('delete')} style={{ marginLeft: 5, marginTop: 5 }}>
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

  const renderListingCard = (item, isSales) => {
    const statusStyles = getStatusStyles(item.status);
    // Дебаг-логіка для перевірки вмісту photos і location
    console.log(`Оголошення ${item.id}:`, { photos: item.photos, location: item.location });

    // Формуємо повний URL для фотографії
    const photoUrl = item.photos && Array.isArray(item.photos) && item.photos.length > 0 && item.photos[0]
      ? item.photos[0].startsWith('http')
        ? item.photos[0]
        : `${baseUrl}${item.photos[0]}`
      : null;

    return (
      <Card key={item.id} className={`list-item-card ${themeClass}`} style={{ marginBottom: 16 }}>
        <div style={{ display: 'flex', gap: 16 }}>
          {photoUrl ? (
            <Image
              src={photoUrl}
              alt={item.title}
              width={150}
              height={100}
              style={{ objectFit: 'cover', borderRadius: 8 }}
              preview={false}
              fallback="https://via.placeholder.com/150?text=Немає+зображення"
              onError={() => console.error(`Помилка завантаження зображення для оголошення ${item.id}: ${photoUrl}`)}
            />
          ) : (
            <Image
              src="https://via.placeholder.com/150?text=Немає+зображення"
              alt="Немає зображення"
              width={150}
              height={100}
              style={{ objectFit: 'cover', borderRadius: 8 }}
              preview={false}
            />
          )}
          <div style={{ flex: 1 }}>
            <div className="list-item-header">
              <h3 className="list-item-title">{item.title}</h3>
              <div className="status-indicator">
                <div className="status-dot" style={{ backgroundColor: statusStyles.color }}></div>
                <span style={{ color: statusStyles.color }}>{statusStyles.text}</span>
              </div>
            </div>
            <Text>
              {isSales ? `Ціна: $${item.basePrice.toLocaleString()}` : `Ціна за ніч: ${item.basePrice.toLocaleString()} UAH`}
            </Text>
            <br />
            <Text>{item.location?.city || 'Адреса не вказана'}</Text>
            {renderListingActions(item, isSales)}
          </div>
        </div>
      </Card>
    );
  };

  if ((activePage === 'my-listings' && loadingListings && myListings.length === 0) ||
      (activePage === 'my-sales-listings' && loadingListings && mySalesListings.length === 0)) {
    return (
      <div style={{ textAlign: 'center', marginTop: '50px' }}>
        <Spin size="large" tip="Завантаження оголошень..." />
      </div>
    );
  }

  return (
    <div className={`account-content-card ${themeClass}`}>
      {activePage === 'profile' && (
        <>
          <h2 className="account-content-title">Профіль</h2>
          <Space direction="vertical" style={{ width: '100%' }}>
            {profileData?.email ? (
              <div className="user-info-container">
                <div className={`user-info-item ${themeClass}`} style={{ backgroundColor: isLightTheme ? 'white' : null }}>
                  <p className="user-info-label">Прізвище та Ім'я:</p>
                  <p className="user-info-value">{profileData.firstName} {profileData.lastName}</p>
                </div>
                <div className={`user-info-item ${themeClass}`} style={{ backgroundColor: isLightTheme ? 'white' : null }}>
                  <p className="user-info-label">Електронна пошта:</p>
                  <p className="user-info-value">{profileData.email}</p>
                </div>
                <div className={`user-info-item ${themeClass}`} style={{ backgroundColor: isLightTheme ? 'white' : null }}>
                  <p className="user-info-label">Номер телефону:</p>
                  <p className="user-info-value">{profileData.phone || 'Не вказано'}</p>
                </div>
              </div>
            ) : (
              <p style={{ textAlign: 'center' }}>Дані профілю недоступні.</p>
            )}
          </Space>
        </>
      )}

      {activePage === 'my-listings' && (
        <>
          <h2 className="account-content-title">Мої оголошення про оренду</h2>
          <Space direction="vertical" style={{ width: '100%' }}>
            {myListings.length > 0 ? (
              myListings.map((item) => renderListingCard(item, false))
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
              mySalesListings.map((item) => renderListingCard(item, true))
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
                disabled
              />
              <Input
                className={`ant-input-themed ${themeClass}`}
                placeholder="Номер телефону"
                name="phone"
                value={profileData.phone}
                onChange={handleProfileChange}
                allowClear
              />
              <Button type="primary" onClick={saveProfileChanges} style={{ width: '100%', marginTop: '1rem' }}>
                Зберегти зміни
              </Button>
            </Space>
          </div>

          <h2 className="account-content-title" style={{ marginTop: '2rem' }}>Зміна пароля</h2>
          <div className="settings-section">
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
                placeholder="Підтвердити новий пароль"
                name="confirmNewPassword"
                value={passwordData.confirmNewPassword}
                onChange={handlePasswordChange}
              />
              <Button type="primary" onClick={changePassword} style={{ width: '100%', marginTop: '1rem' }}>
                Змінити пароль
              </Button>
            </Space>
          </div>
        </>
      )}
    </div>
  );
};

export default MainContent;