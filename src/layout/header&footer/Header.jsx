import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { Avatar, Badge, Switch } from "antd";
import {
    UserOutlined,
    HeartOutlined,
    CalendarOutlined,
    HomeOutlined,
    MenuOutlined,
    BulbOutlined,
    ContainerOutlined,
    BellOutlined,
    SettingOutlined,
    LogoutOutlined
} from "@ant-design/icons";
import M from "materialize-css";
import "./styles/Header.css";

function Header({ isLightTheme, setIsLightTheme, favoriteCount = 99 }) {
    useEffect(() => {
        const dropdowns = document.querySelectorAll(".dropdown-trigger");
        M.Dropdown.init(dropdowns, {
            coverTrigger: false,
            alignment: "right",
        });

        const sidenavs = document.querySelectorAll(".sidenav");
        M.Sidenav.init(sidenavs, { edge: "right" });

        const collapsibles = document.querySelectorAll(".collapsible");
        M.Collapsible.init(collapsibles);
    }, [isLightTheme]);

    const handleThemeToggle = (checked) => {
        setIsLightTheme(checked);
    };

    const getLogoSrc = () => {
        return isLightTheme
            ? "https://placehold.co/200x50/transparent/000000?text=House24"
            : "https://placehold.co/200x50/transparent/FFFFFF?text=House24";
    };

    return (
        <div>
            {/* Випадаюче меню для профілю (ПК) */}
            <ul
                id="dropdown1"
                className={`dropdown-content ${isLightTheme ? 'light-theme-dropdown' : 'dark-theme-dropdown'}`}
            >
                <li>
                    <Link to="/account?tab=dashboard" className={isLightTheme ? 'light-theme-text' : 'dark-theme-text'}>
                        <UserOutlined /> Мій профіль
                    </Link>
                </li>
                <li>
                    <Link to="/account?tab=my-listings" className={isLightTheme ? 'light-theme-text' : 'dark-theme-text'}>
                        <ContainerOutlined /> Мої оголошення
                    </Link>
                </li>
                <li>
                    <Link to="/account?tab=rentals" className={isLightTheme ? 'light-theme-text' : 'dark-theme-text'}>
                        <CalendarOutlined /> Мої оренди
                    </Link>
                </li>
                <li>
                    <Link to="/account?tab=favorites" className={isLightTheme ? 'light-theme-text' : 'dark-theme-text'}>
                        <HeartOutlined /> Обрані помешкання
                    </Link>
                </li>
                <li>
                    <Link to="/account?tab=notifications" className={isLightTheme ? 'light-theme-text' : 'dark-theme-text'}>
                        <BellOutlined /> Сповіщення
                    </Link>
                </li>
                <li>
                    <Link to="/account?tab=settings" className={isLightTheme ? 'light-theme-text' : 'dark-theme-text'}>
                        <SettingOutlined /> Налаштування
                    </Link>
                </li>
                <li className="divider"></li>
                <li>
                    <a href="#!" className={isLightTheme ? 'light-theme-text' : 'dark-theme-text'}>
                        <LogoutOutlined /> Вийти
                    </a>
                </li>
            </ul>

            {/* Навігаційна панель */}
            <nav className={isLightTheme ? 'light-theme-navbar' : 'dark-theme-navbar'}>
                <div className="nav-wrapper" style={{ padding: "0 1rem" }}>
                    {/* Мобільна версія хедера - оновлена */}
                    <div className="hide-on-large-only mobile-header-container">
                        {/* Бургер-кнопка та перемикач теми - зліва */}
                        <div className="mobile-header-left">
                            <a
                                href="#!"
                                data-target="mobile-menu"
                                className="sidenav-trigger"
                                style={{right: 1, top: -18}}
                            >
                                <MenuOutlined style={{ fontSize: 24, color: isLightTheme ? '#333' : 'white' }} />
                            </a>
                            <Switch
                                checkedChildren={<BulbOutlined style={{ color: 'white' }} />}
                                unCheckedChildren={<BulbOutlined style={{ color: 'black' }} />}
                                checked={isLightTheme}
                                onChange={handleThemeToggle}
                                style={{ marginLeft: '1rem' }}
                            />
                        </div>
                        {/* Лого в центрі */}
                        <div className="mobile-logo-wrapper">
                            <Link to="/" className="brand-logo">
                                <img
                                    src={getLogoSrc()}
                                    alt="House24"
                                    style={{ height: "50px", objectFit: "contain" }}
                                />
                            </Link>
                        </div>
                    </div>

                    {/* Лого для ПК */}
                    <Link to="/" className="brand-logo hide-on-med-and-down">
                        <img
                            src={getLogoSrc()}
                            alt="House24"
                            style={{ height: "50px", objectFit: "contain" }}
                        />
                    </Link>

                    {/* Меню для ПК */}
                    <ul
                        className="right hide-on-med-and-down nav-list"
                        style={{ display: "flex", alignItems: "center", gap: "1rem" }}
                    >
                        <li>
                            <Link to="/daily" className={isLightTheme ? 'light-theme-text' : 'dark-theme-text'}>
                                <HomeOutlined /> Подобово
                            </Link>
                        </li>
                        <li>
                            <Link to="/monthly" className={isLightTheme ? 'light-theme-text' : 'dark-theme-text'}>
                                <CalendarOutlined /> Помісячно
                            </Link>
                        </li>
                        <li>
                            <Link to="/create-listing" className={`waves-effect waves-light btn ${isLightTheme ? 'btn-light' : 'btn-dark'}`}>
                                Розмістити оголошення
                            </Link>
                        </li>
                        <li className="heart-logo hide-on-med-and-down">
                            <Link className="heart-trigger" to="/wishlist">
                                <Badge count={favoriteCount} overflowCount={99} offset={[-9, 9]}>
                                    <Avatar
                                        size={50}
                                        icon={<HeartOutlined />}
                                        className={isLightTheme ? 'light-theme-icon' : 'dark-theme-icon'}
                                    />
                                </Badge>
                            </Link>
                        </li>
                        <li>
                            <a className="dropdown-trigger" href="#!" data-target="dropdown1">
                                <Avatar
                                    size={40}
                                    icon={<UserOutlined />}
                                    className={isLightTheme ? 'light-theme-icon' : 'dark-theme-icon'}
                                />
                            </a>
                        </li>
                        <li>
                            <Switch
                                checkedChildren={<BulbOutlined style={{ color: 'white' }} />}
                                unCheckedChildren={<BulbOutlined style={{ color: 'black' }} />}
                                checked={isLightTheme}
                                onChange={handleThemeToggle}
                            />
                        </li>
                    </ul>

                </div>
            </nav>

            {/* Мобільне меню */}
            <ul
                className={`sidenav ${isLightTheme ? 'light-theme-sidenav' : 'dark-theme-sidenav'}`}
                id="mobile-menu"
            >
                <li>
                    <Link to="/daily" className={isLightTheme ? 'light-theme-text' : 'dark-theme-text'}>
                        Подобово
                    </Link>
                </li>
                <li>
                    <Link to="/monthly" className={isLightTheme ? 'light-theme-text' : 'dark-theme-text'}>
                        Помісячно
                    </Link>
                </li>
                <li>
                    <Link to="/create-listing" className={isLightTheme ? 'light-theme-text' : 'dark-theme-text'}>
                        Розмістити оголошення
                    </Link>
                </li>
                <li className="divider"></li>
                <li>
                    <Link to="/account?tab=dashboard" className={isLightTheme ? 'light-theme-text' : 'dark-theme-text'}>
                        <UserOutlined /> Мій профіль
                    </Link>
                </li>
                <li>
                    <Link to="/account?tab=my-listings" className={isLightTheme ? 'light-theme-text' : 'dark-theme-text'}>
                        <ContainerOutlined /> Мої оголошення
                    </Link>
                </li>
                <li>
                    <Link to="/account?tab=rentals" className={isLightTheme ? 'light-theme-text' : 'dark-theme-text'}>
                        <CalendarOutlined /> Мої оренди
                    </Link>
                </li>
                <li>
                    <Link to="/account?tab=favorites" className={isLightTheme ? 'light-theme-text' : 'dark-theme-text'}>
                        <HeartOutlined /> Обрані помешкання
                    </Link>
                </li>
                <li>
                    <Link to="/account?tab=notifications" className={isLightTheme ? 'light-theme-text' : 'dark-theme-text'}>
                        <BellOutlined /> Сповіщення
                    </Link>
                </li>
                <li>
                    <Link to="/account?tab=settings" className={isLightTheme ? 'light-theme-text' : 'dark-theme-text'}>
                        <SettingOutlined /> Налаштування
                    </Link>
                </li>
                <li className="divider"></li>
                <li>
                    <a href="#!" className={isLightTheme ? 'light-theme-text' : 'dark-theme-text'}>
                        <LogoutOutlined /> Вийти
                    </a>
                </li>
            </ul>
        </div>
    );
}

export default Header;