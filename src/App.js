import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from "react-router-dom";
import Header from "./layout/header&footer/Header";
import Footer from "./layout/header&footer/Footer";
import Main from "./layout/main/Main";
import DailyPage from "./components/daily/DailyPage";
import SalesPage from "./components/sales/SalesPage";
import WishList from "./components/wishlist/WishList";
import Profile from "./components/profile/Profile";
import CreateListing from "./components/createListing/CreateListing";
import AboutUs from "./components/footerComponents/aboutUs/AboutUs";
import Copyright from "./components/footerComponents/copyright/Copyright";
import PrivatePolicy from './components/footerComponents/privatePolicy/PrivatePolicy';
import Support from "./components/footerComponents/support/Support";
import SupportForm from "./components/footerComponents/supportForm/SupportForm";
import TermsAndPolicies from './components/footerComponents/termsAndPolicies/TermsAndPolicies';
import TermsOfService from './components/footerComponents/termsOfService/TermsOfService';
import "./App.css";
import LoginForm from "./components/authForms/LoginForm";
import RegistrationForm from "./components/authForms/RegistrationForm";
import ListingDailyPage from "./components/listingDaily/ListingDailyPage";
import Sale from "./components/sale/Sale";
import NotFound from "./components/notFound/NotFound";
import AdminPanel from "./components/adminPanel/AdminPanel";
import CreateSale from "./components/createSale/CreateSale";
import axios from 'axios';
import { Spin, message } from "antd";

const PrivateRoute = ({ children, isLoggedIn }) => {
    return isLoggedIn ? children : <Navigate to="/login" replace />;
};

const AdminRoute = ({ children, isLoggedIn, userRole }) => {
    return isLoggedIn && userRole === "ROLE_ADMIN" ? children : <Navigate to="/" replace />;
};

function App() {
    const [isLightTheme, setIsLightTheme] = useState(() => {
        const savedTheme = localStorage.getItem('isLightTheme');
        return savedTheme !== null ? JSON.parse(savedTheme) : true;
    });
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userRole, setUserRole] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        localStorage.setItem('isLightTheme', JSON.stringify(isLightTheme));
    }, [isLightTheme]);

    useEffect(() => {
        const checkAuthStatus = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/users/me`, { withCredentials: true });
                console.log('checkAuthStatus response:', response.data);
                if (response.status === 200) {
                    setIsLoggedIn(true);
                    const role = response.data.role || (Array.isArray(response.data.roles) && response.data.roles.includes("ROLE_ADMIN") ? "ROLE_ADMIN" : "user");
                    setUserRole(role === "ROLE_ADMIN" ? "ROLE_ADMIN" : "user");
                }
            } catch (error) {
                console.error('checkAuthStatus error:', error);
                setIsLoggedIn(false);
                setUserRole(null);
            } finally {
                setIsLoading(false);
            }
        };
        checkAuthStatus();
    }, []);

    const handleLogin = (role) => {
        console.log('handleLogin called with role:', role); // Debug log
        setIsLoggedIn(true);
        setUserRole(role);
    };

    const handleLogout = async () => {
        try {
            await axios.post(`${process.env.REACT_APP_API_BASE_URL}/api/auth/logout`, {}, { withCredentials: true });
            setIsLoggedIn(false);
            setUserRole(null);
            message.success('Вихід успішний!');
            window.location.reload(); // Ensure full page reload to reset state
        } catch (error) {
            console.error('Logout failed:', error);
            message.error('Помилка при виході. Спробуйте пізніше.');
            setIsLoggedIn(false);
            setUserRole(null);
            window.location.reload();
        }
    };

    if (isLoading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: isLightTheme ? '#f0f2f5' : '#121212' }}>
                <Spin size="large" tip="Завантаження..." />
            </div>
        );
    }

    return (
        <Router>
            <AppContent
                isLightTheme={isLightTheme}
                setIsLightTheme={setIsLightTheme}
                isLoggedIn={isLoggedIn}
                userRole={userRole}
                handleLogin={handleLogin}
                handleLogout={handleLogout}
            />
        </Router>
    );
}

function AppContent({ isLightTheme, setIsLightTheme, isLoggedIn, userRole, handleLogin, handleLogout }) {
    const navigate = useNavigate();

    console.log('AppContent - isLoggedIn:', isLoggedIn, 'userRole:', userRole); // Debug log
    
    const [dailySearchFilters, setDailySearchFilters] = useState(null);
    const [sellingsSearchFilters, setSellingsSearchFilters] = useState(null);

    const handleSearch = (mode, filters) => {
        if (mode === 'daily') {
            setDailySearchFilters(filters);
            navigate('/daily');
        } else if (mode === 'sellings') {
            setSellingsSearchFilters(filters);
            navigate('/sales');
        }
    };

    const onLogoutAndRedirect = async () => {
        await handleLogout();
        navigate('/');
    };

    return (
        <div className={isLightTheme ? "light-theme-wrapper" : "dark-theme-wrapper"}>
            <Header
                isLightTheme={isLightTheme}
                setIsLightTheme={setIsLightTheme}
                isLoggedIn={isLoggedIn}
                onLogout={onLogoutAndRedirect}
                userRole={userRole}
            />
            <main>
                <Routes>
                    <Route 
                        path="/" 
                        element={<Main isLightTheme={isLightTheme} isLoggedIn={isLoggedIn} onSearch={handleSearch} />} 
                    />
                    <Route 
                        path="/orenda-podobovo" 
                        element={<DailyPage isLightTheme={isLightTheme} isLoggedIn={isLoggedIn} searchFilters={dailySearchFilters} />} 
                    />
                    <Route 
                        path="/sales" 
                        element={<SalesPage isLightTheme={isLightTheme} isLoggedIn={isLoggedIn} searchFilters={sellingsSearchFilters} />} 
                    />
                    <Route path="/wishlist" element={<WishList isLightTheme={isLightTheme} isLoggedIn={isLoggedIn} />} />
                    <Route path="/about-us" element={<AboutUs isLightTheme={isLightTheme} isLoggedIn={isLoggedIn} />} />
                    <Route path="/copyright" element={<Copyright isLightTheme={isLightTheme} isLoggedIn={isLoggedIn} />} />
                    <Route path="/private-policy" element={<PrivatePolicy isLightTheme={isLightTheme} isLoggedIn={isLoggedIn} />} />
                    <Route path="/support" element={<Support isLightTheme={isLightTheme} isLoggedIn={isLoggedIn} />} />
                    <Route path="/support-form" element={<SupportForm isLightTheme={isLightTheme} isLoggedIn={isLoggedIn} />} />
                    <Route path="/terms-and-policies" element={<TermsAndPolicies isLightTheme={isLightTheme} isLoggedIn={isLoggedIn} />} />
                    <Route path="/terms-of-service" element={<TermsOfService isLightTheme={isLightTheme} isLoggedIn={isLoggedIn} />} />
                    <Route path="/login" element={<LoginForm isLightTheme={isLightTheme} setIsLoggedIn={handleLogin} />} /> 
                    <Route path="/register" element={<RegistrationForm isLightTheme={isLightTheme} />} />
                    <Route path="/listing-daily/:id" element={<ListingDailyPage isLightTheme={isLightTheme} isLoggedIn={isLoggedIn} />} />
                    <Route path="/sale/:id" element={<Sale isLightTheme={isLightTheme} isLoggedIn={isLoggedIn} />} />
                    <Route 
                        path="/admin" 
                        element={
                            <AdminRoute isLoggedIn={isLoggedIn} userRole={userRole}>
                                <AdminPanel isLightTheme={isLightTheme} isLoggedIn={isLoggedIn} />
                            </AdminRoute>
                        } 
                    />
                    <Route
                        path="/account"
                        element={<PrivateRoute isLoggedIn={isLoggedIn}><Profile isLightTheme={isLightTheme} onLogout={onLogoutAndRedirect} /></PrivateRoute>}
                    />
                    <Route
                        path="/create-listing"
                        element={<PrivateRoute isLoggedIn={isLoggedIn}><CreateListing isLightTheme={isLightTheme} /></PrivateRoute>}
                    />
                    <Route
                        path="/create-sale"
                        element={<PrivateRoute isLoggedIn={isLoggedIn}><CreateSale isLightTheme={isLightTheme} /></PrivateRoute>}
                    />
                    <Route
                        path="/edit-listing/:id"
                        element={<PrivateRoute isLoggedIn={isLoggedIn}><CreateListing isLightTheme={isLightTheme} /></PrivateRoute>}
                    />
                    <Route
                        path="/edit-sale/:id"
                        element={<PrivateRoute isLoggedIn={isLoggedIn}><CreateSale isLightTheme={isLightTheme} /></PrivateRoute>}
                    />
                    <Route path="*" element={<NotFound isLightTheme={isLightTheme} isLoggedIn={isLoggedIn} />} />
                </Routes>
            </main>
            <Footer isLightTheme={isLightTheme} />
        </div>
    );
}

export default App;