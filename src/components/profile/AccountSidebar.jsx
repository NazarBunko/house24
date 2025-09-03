import React from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import {
    HomeOutlined,
    ContainerOutlined,
    CalendarOutlined,
    HeartOutlined,
    BellOutlined,
    SettingOutlined,
    LogoutOutlined,
} from '@ant-design/icons';
import './styles/Profile.css';

const AccountSidebar = ({ isLightTheme }) => {
    const [searchParams] = useSearchParams();
    const activePage = searchParams.get('tab') || 'dashboard';

    const themeClass = isLightTheme ? 'light-theme' : 'dark-theme';

    return (
        <div className={`account-sidebar ${isLightTheme ? 'light-theme-sidebar' : 'dark-theme-sidebar'}`}>
            <ul className="sidebar-menu">
                <li>
                    <Link
                        to="/account?tab=dashboard"
                        className={`${themeClass} ${activePage === 'dashboard' ? 'active' : ''}`}
                    >
                        <HomeOutlined /> Панель управління
                    </Link>
                </li>
                <li>
                    <Link
                        to="/account?tab=my-listings"
                        className={`${themeClass} ${activePage === 'my-listings' ? 'active' : ''}`}
                    >
                        <ContainerOutlined /> Мої оголошення
                    </Link>
                </li>
                <li>
                    <Link
                        to="/account?tab=rentals"
                        className={`${themeClass} ${activePage === 'rentals' ? 'active' : ''}`}
                    >
                        <CalendarOutlined /> Мої оренди
                    </Link>
                </li>
                <li>
                    <Link
                        to="/account?tab=favorites"
                        className={`${themeClass} ${activePage === 'favorites' ? 'active' : ''}`}
                    >
                        <HeartOutlined /> Обрані помешкання
                    </Link>
                </li>
                <li>
                    <Link
                        to="/account?tab=notifications"
                        className={`${themeClass} ${activePage === 'notifications' ? 'active' : ''}`}
                    >
                        <BellOutlined /> Сповіщення
                    </Link>
                </li>
                <li>
                    <Link
                        to="/account?tab=settings"
                        className={`${themeClass} ${activePage === 'settings' ? 'active' : ''}`}
                    >
                        <SettingOutlined /> Налаштування
                    </Link>
                </li>
                <li>
                    {/* Вихід не змінює вкладку, а перенаправляє на іншу сторінку або виконує дію */}
                    <a
                        href="/logout"
                        className={`${themeClass}`}
                    >
                        <LogoutOutlined /> Вийти
                    </a>
                </li>
            </ul>
        </div>
    );
};

export default AccountSidebar;