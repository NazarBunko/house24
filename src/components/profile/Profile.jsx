import React, {useState} from 'react';
import { useSearchParams } from 'react-router-dom';
import AccountSidebar from './AccountSidebar';
import MainContent from './MainContent';
import './styles/Profile.css';

const mockRentals = [
    { id: 1, title: 'Затишна квартира на Подолі', date: '01.09.2024 - 15.09.2024', rent: '21 000 грн', status: 'Активна' },
    { id: 2, title: 'Квартира-студія в центрі', date: '01.08.2024 - 31.08.2024', rent: '15 500 грн', status: 'Завершена' },
];

const mockMyListings = [
    { id: 1, title: 'Квартира-студія в центрі', status: 'Активне', views: 150 },
    { id: 2, title: 'Двокімнатна квартира біля парку', status: 'На перевірці', views: 0 },
    { id: 3, title: 'Затишний будинок з терасою', status: 'Активне', views: 320 },
];

const mockFavorites = [
    { id: 1, title: 'Будинок з видом на озеро', city: 'Одеса', price_per_day: '2 500 грн/доба' },
    { id: 2, title: 'Квартира в історичному центрі', city: 'Львів', price_per_month: '20 000 грн/міс' },
];

const mockNotifications = [
    { id: 1, text: 'Ваше бронювання на квартиру №1 успішно підтверджено.', date: '12.08.2024' },
    { id: 2, text: 'Залишився 1 день до закінчення терміну оренди помешкання №2.', date: '10.08.2024' },
];

const Profile = ({ isLightTheme }) => {
    const [searchParams, setSearchParams] = useSearchParams();
    const activePage = searchParams.get('tab') || 'dashboard'; // Встановлюємо 'dashboard' як вкладку за замовчуванням

    const [profileData, setProfileData] = useState({
        firstName: 'Іван',
        lastName: 'Іваненко',
        email: 'ivan.ivanenko@example.com',
        phone: '+380991234567',
    });
    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmNewPassword: '',
    });

    const handleProfileChange = (e) => {
        const { name, value } = e.target;
        setProfileData(prevData => ({ ...prevData, [name]: value }));
    };

    const handlePasswordChange = (e) => {
        const { name, value } = e.target;
        setPasswordData(prevData => ({ ...prevData, [name]: value }));
    };

    const saveProfileChanges = () => {
        console.log('Профіль оновлено:', profileData);
    };

    const changePassword = () => {
        if (passwordData.newPassword !== passwordData.confirmNewPassword) {
            console.error('Нові паролі не збігаються!');
        } else {
            console.log('Пароль оновлено:', passwordData);
            setPasswordData({ currentPassword: '', newPassword: '', confirmNewPassword: '' });
        }
    };

    return (
        <div className={`account-container ${isLightTheme ? 'light-theme-container' : 'dark-theme-container'}`}>
            <AccountSidebar
                activePage={activePage}
                isLightTheme={isLightTheme}
            />
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
                    mockRentals={mockRentals}
                    mockMyListings={mockMyListings}
                    mockFavorites={mockFavorites}
                    mockNotifications={mockNotifications}
                />
            </div>
        </div>
    );
};

export default Profile;