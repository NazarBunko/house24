import React from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import {
    HomeOutlined,
    CalendarOutlined,
    SettingOutlined,
    LogoutOutlined,
} from '@ant-design/icons';
import './Profile.css';

const AccountSidebar = ({ isLightTheme, onLogout }) => {
    const [searchParams] = useSearchParams();
    const activePage = searchParams.get('tab') || 'profile';

    const themeClass = isLightTheme ? 'light-theme' : 'dark-theme';

    return (
        <div style={{ backgroundColor: isLightTheme ? "#fff" : "#333" }} className={`account-sidebar ${isLightTheme ? 'light-theme-sidebar' : 'dark-theme-sidebar'}`}>
            <ul className="sidebar-menu">
                <li>
                    <Link
                        to="/account?tab=profile"
                        className={`${themeClass} ${activePage === 'profile' ? 'active' : ''}`}
                    >
                        <HomeOutlined /> Мій профіль
                    </Link>
                </li>
                <li>
                    <Link
                        to="/account?tab=my-listings"
                        className={`${themeClass} ${activePage === 'my-listings' ? 'active' : ''}`}
                    >
                        <CalendarOutlined /> Мої оголошення оренди
                    </Link>
                </li>
                <li>
                    <Link
                        to="/account?tab=my-sales-listings"
                        className={`${themeClass} ${activePage === 'my-sales-listings' ? 'active' : ''}`}
                    >
                        <HomeOutlined /> Мої оголошення продажу
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
                    <a
                        href="/"
                        onClick={onLogout}
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