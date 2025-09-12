import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import AccountSidebar from './AccountSidebar';
import MainContent from './MainContent';
import axios from 'axios';
import { message } from 'antd';
import './Profile.css';

const Profile = ({ isLightTheme, onLogout }) => {
  const [searchParams] = useSearchParams();
  const activePage = searchParams.get('tab') || 'profile';

  const [profileData, setProfileData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: '',
  });
  const [isLoading, setIsLoading] = useState(true);
  const [profileCacheInvalidated, setProfileCacheInvalidated] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/users/me`, {
          withCredentials: true,
        });
        setProfileData(response.data);
      } catch (error) {
        console.error('Помилка при отриманні даних користувача:', error);
        message.error('Не вдалося завантажити дані профілю. Будь ласка, увійдіть знову.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, []); // Empty dependency array to fetch only on mount

  const handleProfileChange = useCallback((e) => {
    const { name, value } = e.target;
    setProfileData((prevData) => ({ ...prevData, [name]: value }));
  }, []);

  const handlePasswordChange = useCallback((e) => {
    const { name, value } = e.target;
    setPasswordData((prevData) => ({ ...prevData, [name]: value }));
  }, []);

  const saveProfileChanges = useCallback(async () => {
    try {
      const response = await axios.put(
        `${process.env.REACT_APP_API_BASE_URL}/api/users/me`,
        profileData,
        { withCredentials: true }
      );
      if (response.status === 200) {
        message.success('Профіль успішно оновлено!');
        setProfileCacheInvalidated(true); // Invalidate cache in MainContent
      }
    } catch (error) {
      console.error('Помилка оновлення профілю:', error);
      message.error('Помилка оновлення профілю. Спробуйте пізніше.');
    }
  }, [profileData]);

  const changePassword = useCallback(async () => {
    if (passwordData.newPassword !== passwordData.confirmNewPassword) {
      message.error('Нові паролі не збігаються!');
      return;
    }

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_BASE_URL}/api/users/change-password`,
        passwordData,
        { withCredentials: true }
      );

      if (response.status === 200) {
        message.success('Пароль успішно змінено!');
        setPasswordData({ currentPassword: '', newPassword: '', confirmNewPassword: '' });
        setProfileCacheInvalidated(true); // Invalidate cache in case password change affects session
      }
    } catch (error) {
      console.error('Помилка зміни пароля:', error);
      if (error.response && error.response.status === 401) {
        message.error('Неправильний поточний пароль.');
      } else {
        message.error('Помилка зміни пароля. Спробуйте пізніше.');
      }
    }
  }, [passwordData]);

  if (isLoading) {
    return <div>Завантаження профілю...</div>;
  }

  return (
    <div className={`account-container ${isLightTheme ? 'light-theme-container' : 'dark-theme-container'}`}>
      <AccountSidebar activePage={activePage} isLightTheme={isLightTheme} onLogout={onLogout} />
      <div className="account-main-content">
        <MainContent
          activePage={activePage}
          isLightTheme={isLightTheme}
          profileData={profileData}
          handleProfileChange={handleProfileChange}
          passwordData={passwordData}
          handlePasswordChange={handlePasswordChange}
          saveProfileChanges={saveProfileChanges}
          changePassword={changePassword}
          profileCacheInvalidated={profileCacheInvalidated}
          setProfileCacheInvalidated={setProfileCacheInvalidated}
        />
      </div>
    </div>
  );
};

export default Profile;