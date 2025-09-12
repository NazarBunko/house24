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
    LogoutOutlined,
    CrownOutlined
} from "@ant-design/icons";
import M from "materialize-css";
import "./styles/Header.css";

const API_URL = process.env.REACT_APP_API_BASE_URL;

const UserDropdown = ({ isLightTheme, onLogout, handleLinkClick, userRole }) => {
    return (
        <ul id="user-dropdown" className={`user-dropdown ${isLightTheme ? 'light-theme-dropdown' : 'dark-theme-dropdown'}`}>
            {userRole === "ROLE_ADMIN" && (
                <li>
                    <Link to="/admin" onClick={handleLinkClick} className={isLightTheme ? 'light-theme-text' : 'dark-theme-text'}>
                        <CrownOutlined /> Панель Адміністратора
                    </Link>
                </li>
            )}
            <li><Link to="/create-listing" onClick={handleLinkClick} className={isLightTheme ? 'light-theme-text' : 'dark-theme-text'}><CalendarOutlined /> Здати в оренду</Link></li>
            <li><Link to="/create-sale" onClick={handleLinkClick} className={isLightTheme ? 'light-theme-text' : 'dark-theme-text'}><HomeOutlined /> Розмістити продаж</Link></li>
            <li><Link to="/account?tab=profile" onClick={handleLinkClick} className={isLightTheme ? 'light-theme-text' : 'dark-theme-text'}><UserOutlined /> Мій профіль</Link></li>
            <li><Link to="/account?tab=my-listings" onClick={handleLinkClick} className={isLightTheme ? 'light-theme-text' : 'dark-theme-text'}><CalendarOutlined /> Мої оголошення оренди</Link></li>
            <li><Link to="/account?tab=my-sales-listings" onClick={handleLinkClick} className={isLightTheme ? 'light-theme-text' : 'dark-theme-text'}><HomeOutlined /> Мої оголошення продажу</Link></li>
            <li><Link to="/account?tab=settings" onClick={handleLinkClick} className={isLightTheme ? 'light-theme-text' : 'dark-theme-text'}><SettingOutlined /> Налаштування</Link></li>
            <li className="divider"></li>
            <li><a href="#" onClick={(e) => { e.preventDefault(); onLogout(); handleLinkClick(); }} className={isLightTheme ? 'light-theme-text' : 'dark-theme-text'}><LogoutOutlined /> Вийти</a></li>
        </ul>
    );
};

export const dispatchFavoriteUpdate = () => {
    window.dispatchEvent(new Event('favoriteUpdate'));
};

const getActiveFavoritesCount = async () => {
    try {
        const [dailyResponse, salesResponse] = await Promise.all([
            fetch(`${API_URL}/api/daily-listings/all`),
            fetch(`${API_URL}/api/sales`)
        ]);

        const dailyData = dailyResponse.ok ? await dailyResponse.json() : [];
        const salesData = salesResponse.ok ? await salesResponse.json() : [];

        const likedDailyIds = new Set(JSON.parse(localStorage.getItem('likedItemsDaily') || '[]'));
        const likedSalesIds = new Set(JSON.parse(localStorage.getItem('likedItemsSales') || '[]'));

        const activeDailyCount = dailyData.filter(item => likedDailyIds.has(String(item.id)) && item.status === 'active').length;
        const activeSalesCount = salesData.filter(item => likedSalesIds.has(String(item.id)) && item.status === 'active').length;

        return activeDailyCount + activeSalesCount;
    } catch (error) {
        return 0;
    }
};

function Header({ isLightTheme, setIsLightTheme, isLoggedIn, onLogout, userRole }) {
    const navigate = useNavigate();
    const location = useLocation();
    const [isDropdownVisible, setDropdownVisible] = useState(false);
    const [favoriteCount, setFavoriteCount] = useState(0);
    const dropdownRef = useRef(null);
    const avatarRef = useRef(null);
    const [dropdownStyles, setDropdownStyles] = useState({});
    const sidenavRef = useRef(null);
    const sidenavInstanceRef = useRef(null);

    useEffect(() => {
        if (sidenavRef.current) {
            sidenavInstanceRef.current = M.Sidenav.init(sidenavRef.current, { edge: "right" });
        }
        return () => {
            if (sidenavInstanceRef.current) {
                sidenavInstanceRef.current.destroy();
            }
        };
    }, []);

    useEffect(() => {
        if (sidenavInstanceRef.current) {
            sidenavInstanceRef.current.destroy();
        }
        if (sidenavRef.current) {
            sidenavInstanceRef.current = M.Sidenav.init(sidenavRef.current, { edge: "right" });
        }
    }, [isLightTheme]);

    useEffect(() => {
        setDropdownVisible(false);
    }, [location.pathname]);

    useEffect(() => {
        setDropdownVisible(false);
    }, [isLightTheme]);

    useEffect(() => {
        if (isDropdownVisible && avatarRef.current) {
            const rect = avatarRef.current.getBoundingClientRect();
            setDropdownStyles({
                top: rect.bottom + window.scrollY,
                right: window.innerWidth - rect.right,
            });
        }
    }, [isDropdownVisible]);

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
            ? "https://placehold.co/200x50/transparent/000000?text=24House"
            : "https://placehold.co/200x50/transparent/FFFFFF?text=24House";
    };

    return (
        <>
            <nav className={isLightTheme ? 'light-theme-navbar' : 'dark-theme-navbar'}>
                <div className="nav-wrapper" style={{ padding: "0 1rem" }}>
                    <div className="hide-on-large-only mobile-header-container">
                        <div className="mobile-header-left">
                            <button className="sidenav-trigger btn-flat waves-effect" data-target="mobile-menu" style={{ right: 1, top: -18 }}>
                                <MenuOutlined style={{ fontSize: 24, color: isLightTheme ? '#333' : 'white' }} />
                            </button>
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
                        <li><Link to="/orenda-podobovo" className={isLightTheme ? 'light-theme-text' : 'dark-theme-text'}><CalendarOutlined /> Подобово</Link></li>
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
                <div ref={dropdownRef} className="dropdown-wrapper" style={dropdownStyles}>
                    <UserDropdown isLightTheme={isLightTheme} onLogout={onLogout} handleLinkClick={handleLinkClick} userRole={userRole} />
                </div>
            )}
            <ul ref={sidenavRef} className={`sidenav ${isLightTheme ? 'light-theme-sidenav' : 'dark-theme-sidenav'}`} id="mobile-menu">
                <li><Link to="/orenda-podobovo" className={`${isLightTheme ? 'light-theme-text' : 'dark-theme-text'} sidenav-close`}>Подобово</Link></li>
                <li><Link to="/sales" className={`${isLightTheme ? 'light-theme-text' : 'dark-theme-text'} sidenav-close`}>Продаж</Link></li>
                <li className="divider"></li>
                {isLoggedIn ? (
                    <>
                        {userRole === "ROLE_ADMIN" && (
                            <li>
                                <Link to="/admin" className={`${isLightTheme ? 'light-theme-text' : 'dark-theme-text'} sidenav-close`}>
                                    <CrownOutlined /> Панель Адміністратора
                                </Link>
                            </li>
                        )}
                        <li><Link to="/create-listing" className={`${isLightTheme ? 'light-theme-text' : 'dark-theme-text'} sidenav-close`}><CalendarOutlined /> Здати в оренду</Link></li>
                        <li><Link to="/create-sale" className={`${isLightTheme ? 'light-theme-text' : 'dark-theme-text'} sidenav-close`}><HomeOutlined /> Розмістити продаж</Link></li>
                        <li><Link to="/account?tab=profile" className={`${isLightTheme ? 'light-theme-text' : 'dark-theme-text'} sidenav-close`}><UserOutlined /> Мій профіль</Link></li>
                        <li><Link to="/account?tab=my-listings" className={`${isLightTheme ? 'light-theme-text' : 'dark-theme-text'} sidenav-close`}><CalendarOutlined /> Мої оголошення оренди</Link></li>
                        <li><Link to="/account?tab=my-sales-listings" className={`${isLightTheme ? 'light-theme-text' : 'dark-theme-text'} sidenav-close`}><HomeOutlined /> Мої оголошення продажу</Link></li>
                        <li><Link to="/account?tab=settings" className={`${isLightTheme ? 'light-theme-text' : 'dark-theme-text'} sidenav-close`}><SettingOutlined /> Налаштування</Link></li>
                        <li className="divider"></li>
                        <li><a href="#" onClick={(e) => { e.preventDefault(); onLogout(); }} className={`${isLightTheme ? 'light-theme-text' : 'dark-theme-text'} sidenav-close`}><LogoutOutlined /> Вийти</a></li>
                    </>
                ) : (
                    <li><Link to="/login" className={`${isLightTheme ? 'light-theme-text' : 'dark-theme-text'} sidenav-close`}><UserOutlined /> Увійти</Link></li>
                )}
            </ul>
        </>
    );
}

export default Header;