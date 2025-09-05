import React, { useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
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

// The Header component now receives props for login state and logout function
function Header({ isLightTheme, setIsLightTheme, isLoggedIn, onLogout, favoriteCount = 99 }) {
    const navigate = useNavigate();
    const dropdownRef = useRef(null);
    const dropdownTriggerRef = useRef(null);

    // This useEffect is for Materialize sidenavs and collapsibles, which are always present.
    useEffect(() => {
        const sidenavs = document.querySelectorAll(".sidenav");
        M.Sidenav.init(sidenavs, { edge: "right" });

        const collapsibles = document.querySelectorAll(".collapsible");
        M.Collapsible.init(collapsibles);
    }, []);

    // This useEffect handles the Materialize Dropdown, which is only present when logged in.
    useEffect(() => {
        let dropdownInstance = null;

        if (isLoggedIn && dropdownTriggerRef.current) {
            dropdownInstance = M.Dropdown.init(dropdownTriggerRef.current, {
                coverTrigger: false,
                alignment: "right",
            });
        }

        return () => {
            try {
                if (dropdownInstance) {
                    const instance = M.Dropdown.getInstance(dropdownTriggerRef.current);
                    if (instance) {
                        instance.destroy();
                    }
                }
            } catch (e) {
                console.warn("Dropdown cleanup skipped:", e.message);
            }
        };
    }, [isLoggedIn]); // Dependency on isLoggedIn ensures the effect re-runs when login state changes

    const handleCreateListingClick = (e) => {
        if (!isLoggedIn) {
            e.preventDefault();
            navigate('/login');
        }
    };

    const handleAvatarClick = (e) => {
        if (!isLoggedIn) {
            e.preventDefault();
            navigate('/login');
        }
    };

    const getLogoSrc = () => {
        return isLightTheme
            ? "https://placehold.co/200x50/transparent/000000?text=House24"
            : "https://placehold.co/200x50/transparent/FFFFFF?text=House24";
    };

    return (
        <div>
            {isLoggedIn && (
                <ul
                    ref={dropdownRef}
                    id="dropdown1"
                    className={`dropdown-content ${isLightTheme ? 'light-theme-dropdown' : 'dark-theme-dropdown'}`}
                >
                    <li><Link to="/account?tab=dashboard" className={isLightTheme ? 'light-theme-text' : 'dark-theme-text'}><UserOutlined /> Мій профіль</Link></li>
                    <li><Link to="/account?tab=my-listings" className={isLightTheme ? 'light-theme-text' : 'dark-theme-text'}><ContainerOutlined /> Мої оголошення</Link></li>
                    <li><Link to="/account?tab=favorites" className={isLightTheme ? 'light-theme-text' : 'dark-theme-text'}><HeartOutlined /> Обрані помешкання</Link></li>
                    <li><Link to="/account?tab=notifications" className={isLightTheme ? 'light-theme-text' : 'dark-theme-text'}><BellOutlined /> Сповіщення</Link></li>
                    <li><Link to="/account?tab=settings" className={isLightTheme ? 'light-theme-text' : 'dark-theme-text'}><SettingOutlined /> Налаштування</Link></li>
                    <li className="divider"></li>
                    <li><a href="#!" onClick={onLogout} className={isLightTheme ? 'light-theme-text' : 'dark-theme-text'}><LogoutOutlined /> Вийти</a></li>
                </ul>
            )}

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
                        <li><Link to="/daily" className={isLightTheme ? 'light-theme-text' : 'dark-theme-text'}><HomeOutlined /> Подобово</Link></li>
                        <li><Link to="/monthly" className={isLightTheme ? 'light-theme-text' : 'dark-theme-text'}><CalendarOutlined /> Помісячно</Link></li>
                        <li>
                            <Link to={isLoggedIn ? "/create-listing" : "#!"} onClick={handleCreateListingClick} className={`waves-effect waves-light btn ${isLightTheme ? 'btn-light' : 'btn-dark'}`}>Розмістити оголошення</Link>
                        </li>
                        <li className="heart-logo hide-on-med-and-down">
                            <Link className="heart-trigger" to="/wishlist">
                                <Badge count={favoriteCount} overflowCount={99} offset={[-9, 9]}>
                                    <Avatar size={50} icon={<HeartOutlined />} className={isLightTheme ? 'light-theme-icon' : 'dark-theme-icon'} />
                                </Badge>
                            </Link>
                        </li>
                        <li>
                            {isLoggedIn ? (
                                <a ref={dropdownTriggerRef} className="dropdown-trigger" href="#!" data-target="dropdown1">
                                    <Avatar size={40} icon={<UserOutlined />} className={isLightTheme ? 'light-theme-icon' : 'dark-theme-icon'} />
                                </a>
                            ) : (
                                <a href="#!" onClick={handleAvatarClick}>
                                    <Avatar size={40} icon={<UserOutlined />} className={isLightTheme ? 'light-theme-icon' : 'dark-theme-icon'} />
                                </a>
                            )}
                        </li>
                        <li><Switch checkedChildren={<BulbOutlined style={{ color: 'white' }} />} unCheckedChildren={<BulbOutlined style={{ color: 'black' }} />} checked={isLightTheme} onChange={setIsLightTheme} /></li>
                    </ul>
                </div>
            </nav>

            <ul className={`sidenav ${isLightTheme ? 'light-theme-sidenav' : 'dark-theme-sidenav'}`} id="mobile-menu">
                <li><Link to="/daily" className={isLightTheme ? 'light-theme-text' : 'dark-theme-text'}>Подобово</Link></li>
                <li><Link to="/monthly" className={isLightTheme ? 'light-theme-text' : 'dark-theme-text'}>Помісячно</Link></li>
                <li>
                    <Link to={isLoggedIn ? "/create-listing" : "#!"} onClick={handleCreateListingClick} className={isLightTheme ? 'light-theme-text' : 'dark-theme-text'}>Розмістити оголошення</Link>
                </li>
                <li className="divider"></li>
                {isLoggedIn ? (
                    <>
                        <li><Link to="/account?tab=dashboard" className={isLightTheme ? 'light-theme-text' : 'dark-theme-text'}><UserOutlined /> Мій профіль</Link></li>
                        <li><Link to="/account?tab=my-listings" className={isLightTheme ? 'light-theme-text' : 'dark-theme-text'}><ContainerOutlined /> Мої оголошення</Link></li>
                        <li><Link to="/account?tab=favorites" className={isLightTheme ? 'light-theme-text' : 'dark-theme-text'}><HeartOutlined /> Обрані помешкання</Link></li>
                        <li><Link to="/account?tab=notifications" className={isLightTheme ? 'light-theme-text' : 'dark-theme-text'}><BellOutlined /> Сповіщення</Link></li>
                        <li><Link to="/account?tab=settings" className={isLightTheme ? 'light-theme-text' : 'dark-theme-text'}><SettingOutlined /> Налаштування</Link></li>
                        <li className="divider"></li>
                        {/* Now calling the onLogout prop */}
                        <li><a href="/" onClick={onLogout} className={isLightTheme ? 'light-theme-text' : 'dark-theme-text'}><LogoutOutlined /> Вийти</a></li>
                    </>
                ) : (
                    <li><a href="#!" onClick={handleAvatarClick} className={isLightTheme ? 'light-theme-text' : 'dark-theme-text'}><UserOutlined /> Увійти</a></li>
                )}
            </ul>
        </div>
    );
}

export default Header;