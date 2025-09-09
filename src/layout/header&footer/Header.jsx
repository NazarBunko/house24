import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Avatar, Badge, Switch } from "antd";
import {
    UserOutlined,
    HeartOutlined,
    CalendarOutlined,
    HomeOutlined,
    MenuOutlined,
    BulbOutlined,
    SettingOutlined,
    LogoutOutlined
} from "@ant-design/icons";
import M from "materialize-css";
import "./styles/Header.css";

const API_URL = process.env.REACT_APP_API_URL;

const UserDropdown = ({ isLightTheme, onLogout, handleLinkClick }) => {
    return (
        <ul id="user-dropdown" className={`user-dropdown ${isLightTheme ? 'light-theme-dropdown' : 'dark-theme-dropdown'}`}>
            <li><Link to="/create-listing" onClick={handleLinkClick} className={isLightTheme ? 'light-theme-text' : 'dark-theme-text'}><CalendarOutlined /> Здати в оренду</Link></li>
            <li><Link to="/create-sale" onClick={handleLinkClick} className={isLightTheme ? 'light-theme-text' : 'dark-theme-text'}><HomeOutlined /> Розмістити продаж</Link></li>
            <li><Link to="/account?tab=profile" onClick={handleLinkClick} className={isLightTheme ? 'light-theme-text' : 'dark-theme-text'}><UserOutlined /> Мій профіль</Link></li>
            <li><Link to="/account?tab=my-listings" onClick={handleLinkClick} className={isLightTheme ? 'light-theme-text' : 'dark-theme-text'}><CalendarOutlined /> Мої оголошення оренди</Link></li>
            <li><Link to="/account?tab=my-sales-listings" onClick={handleLinkClick} className={isLightTheme ? 'light-theme-text' : 'dark-theme-text'}><HomeOutlined /> Мої оголошення продажу</Link></li>
            <li><Link to="/account?tab=settings" onClick={handleLinkClick} className={isLightTheme ? 'light-theme-text' : 'dark-theme-text'}><SettingOutlined /> Налаштування</Link></li>
            <li className="divider"></li>
            <li><a href="#!" onClick={(e) => { e.preventDefault(); onLogout(); handleLinkClick(); }} className={isLightTheme ? 'light-theme-text' : 'dark-theme-text'}><LogoutOutlined /> Вийти</a></li>
        </ul>
    );
};

export const dispatchFavoriteUpdate = () => {
    window.dispatchEvent(new Event('favoriteUpdate'));
};

// Нова функція для підрахунку
const getActiveFavoritesCount = async () => {
    try {
        const [dailyResponse, salesResponse] = await Promise.all([
            fetch(`${API_URL}/daily-listings`),
            fetch(`${API_URL}/sales`)
        ]);

        const dailyData = dailyResponse.ok ? await dailyResponse.json() : [];
        const salesData = salesResponse.ok ? await salesResponse.json() : [];

        const likedDailyIds = new Set(JSON.parse(localStorage.getItem('likedItemsDaily') || '[]'));
        const likedSalesIds = new Set(JSON.parse(localStorage.getItem('likedItemsSales') || '[]'));

        const activeDailyCount = dailyData.filter(item => likedDailyIds.has(String(item.id)) && item.status === 'active').length;
        const activeSalesCount = salesData.filter(item => likedSalesIds.has(String(item.id)) && item.status === 'active').length;

        return activeDailyCount + activeSalesCount;
    } catch (error) {
        console.error("Помилка при підрахунку активних обраних оголошень:", error);
        return 0;
    }
};

function Header({ isLightTheme, setIsLightTheme, isLoggedIn, onLogout }) {
    const navigate = useNavigate();
    const location = useLocation();
    const [isDropdownVisible, setDropdownVisible] = useState(false);
    const [favoriteCount, setFavoriteCount] = useState(0);
    const dropdownRef = useRef(null);
    const avatarRef = useRef(null);

    useEffect(() => {
        const sidenavs = document.querySelectorAll(".sidenav");
        M.Sidenav.init(sidenavs, { edge: "right" });
    }, []);

    useEffect(() => {
        setDropdownVisible(false);
    }, [location.pathname]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target) &&
                avatarRef.current &&
                !avatarRef.current.contains(event.target)
            ) {
                setDropdownVisible(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    useEffect(() => {
        const updateFavoriteCount = async () => {
            const count = await getActiveFavoritesCount();
            setFavoriteCount(count);
        };

        window.addEventListener('favoriteUpdate', updateFavoriteCount);
        updateFavoriteCount();

        return () => {
            window.removeEventListener('favoriteUpdate', updateFavoriteCount);
        };
    }, []);

    const handleAvatarClick = (e) => {
        e.preventDefault();
        if (!isLoggedIn) {
            navigate('/login');
        } else {
            setDropdownVisible(prev => !prev);
        }
    };

    const handleLinkClick = () => {
        setDropdownVisible(false);
    };

    const getLogoSrc = () => {
        return isLightTheme
            ? "https://placehold.co/200x50/transparent/000000?text=House24"
            : "https://placehold.co/200x50/transparent/FFFFFF?text=House24";
    };

    const dropdownStyle = {};
    if (avatarRef.current) {
        const rect = avatarRef.current.getBoundingClientRect();
        dropdownStyle.top = rect.bottom + window.scrollY;
        dropdownStyle.right = window.innerWidth - rect.right;
    }

    return (
        <>
            <nav className={isLightTheme ? 'light-theme-navbar' : 'dark-theme-navbar'}>
                <div className="nav-wrapper" style={{ padding: "0 1rem" }}>
                    <div className="hide-on-large-only mobile-header-container">
                        <div className="mobile-header-left">
                            <a href="#!" data-target="mobile-menu" className="sidenav-trigger" style={{ right: 1, top: -18 }}><MenuOutlined style={{ fontSize: 24, color: isLightTheme ? '#333' : 'white' }} /></a>
                            <Switch checkedChildren={<BulbOutlined style={{ color: 'white' }} />} unCheckedChildren={<BulbOutlined style={{ color: 'black' }} />} checked={isLightTheme} onChange={setIsLightTheme} style={{ marginLeft: '1rem' }} />
                        </div>
                        <div className="mobile-logo-wrapper">
                            <Link to="/" className="brand-logo"><img src={getLogoSrc()} alt="House24" style={{ height: "50px", objectFit: "contain" }} /></Link>
                        </div>
                    </div>

                    <Link to="/" className="brand-logo hide-on-med-and-down">
                        <img src={getLogoSrc()} alt="House24" style={{ height: "50px", objectFit: "contain" }} />
                    </Link>

                    <ul className="right hide-on-med-and-down nav-list" style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                        <li><Link to="/daily" className={isLightTheme ? 'light-theme-text' : 'dark-theme-text'}><CalendarOutlined /> Подобово</Link></li>
                        <li><Link to="/sales" className={isLightTheme ? 'light-theme-text' : 'dark-theme-text'}><HomeOutlined /> Продаж</Link></li>
                        <li className="heart-logo hide-on-med-and-down">
                            <Link className="heart-trigger" to="/wishlist">
                                <Badge count={favoriteCount} overflowCount={99} offset={[-9, 9]}>
                                    <Avatar size={50} icon={<HeartOutlined />} className={isLightTheme ? 'light-theme-icon' : 'dark-theme-icon'} />
                                </Badge>
                            </Link>
                        </li>
                        <li>
                            <a href="#!" onClick={handleAvatarClick} ref={avatarRef} className="dropdown-trigger">
                                <Avatar size={40} icon={<UserOutlined />} className={isLightTheme ? 'light-theme-icon' : 'dark-theme-icon'} />
                            </a>
                        </li>
                        <li><Switch checkedChildren={<BulbOutlined style={{ color: 'white' }} />} unCheckedChildren={<BulbOutlined style={{ color: 'black' }} />} checked={isLightTheme} onChange={setIsLightTheme} /></li>
                    </ul>
                </div>
            </nav>
            {isLoggedIn && isDropdownVisible && (
                <div ref={dropdownRef} className="dropdown-wrapper" style={dropdownStyle}>
                    <UserDropdown isLightTheme={isLightTheme} onLogout={onLogout} handleLinkClick={handleLinkClick} />
                </div>
            )}
            <ul className={`sidenav ${isLightTheme ? 'light-theme-sidenav' : 'dark-theme-sidenav'}`} id="mobile-menu">
                <li><Link to="/daily" className={isLightTheme ? 'light-theme-text' : 'dark-theme-text'}>Подобово</Link></li>
                <li><Link to="/sales" className={isLightTheme ? 'light-theme-text' : 'dark-theme-text'}>Продаж</Link></li>
                <li className="divider"></li>
                {isLoggedIn ? (
                    <>
                        <li>
                            <Link to={isLoggedIn ? "/create-listing" : "#!"} className={isLightTheme ? 'light-theme-text' : 'dark-theme-text'}><CalendarOutlined /> Здати в оренду</Link>
                        </li>
                        <li>
                            <Link to={isLoggedIn ? "/create-sale" : "#!"} className={isLightTheme ? 'light-theme-text' : 'dark-theme-text'}><HomeOutlined /> Розмістити продаж</Link>
                        </li>
                        <li><Link to="/account?tab=profile" onClick={handleLinkClick} className={isLightTheme ? 'light-theme-text' : 'dark-theme-text'}><UserOutlined /> Мій профіль</Link></li>
                        <li><Link to="/account?tab=my-listings" onClick={handleLinkClick} className={isLightTheme ? 'light-theme-text' : 'dark-theme-text'}><CalendarOutlined /> Мої оголошення оренди</Link></li>
                        <li><Link to="/account?tab=my-sales-listings" onClick={handleLinkClick} className={isLightTheme ? 'light-theme-text' : 'dark-theme-text'}><HomeOutlined /> Мої оголошення продажу</Link></li>
                        <li><Link to="/account?tab=settings" onClick={handleLinkClick} className={isLightTheme ? 'light-theme-text' : 'dark-theme-text'}><SettingOutlined /> Налаштування</Link></li>
                        <li className="divider"></li>
                        <li><a href="/" onClick={(e) => { e.preventDefault(); onLogout(); handleLinkClick(); }} className={isLightTheme ? 'light-theme-text' : 'dark-theme-text'}><LogoutOutlined /> Вийти</a></li>
                    </>
                ) : (
                    <li><a href="#!" onClick={handleAvatarClick} className={isLightTheme ? 'light-theme-text' : 'dark-theme-text'}><UserOutlined /> Увійти</a></li>
                )}
            </ul>
        </>
    );
}

export default Header;