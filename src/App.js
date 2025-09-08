import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from "react-router-dom";
import Header from "./layout/header&footer/Header";
import Footer from "./layout/header&footer/Footer";
import Main from "./layout/main/Main";
import DailyPage from "./components/daily/DailyPage";
import Sellings from "./components/sellings/Sellings";
import WishList from "./components/wishlist/WishList";
import Profile from "./components/profile/Profile";
import CreateListing from "./components/createListing/CreateListing";
import AboutUs from "./components/footerComponents/AboutUs/AboutUs";
import Copyright from "./components/footerComponents/Copyright/Copyright";
import PrivatePolicy from './components/footerComponents/PrivatePolicy/PrivatePolicy';
import Support from "./components/footerComponents/Support/Support";
import SupportForm from "./components/footerComponents/SupportForm/SupportForm";
import TermsAndPolicies from './components/footerComponents/TermsAndPolicies/TermsAndPolicies';
import TermsOfService from './components/footerComponents/TermsOfService/TermsOfService';
import "./App.css";
import LoginForm from "./components/authForms/LoginForm";
import RegistrationForm from "./components/authForms/RegistrationForm";
import ListingDailyPage from "./components/listingDaily/ListingDailyPage";
import SellingPage from "./components/sellingPage/SellingPage";
import NotFound from "./components/notFound/NotFound";
import AdminPanel from "./components/adminPanel/AdminPanel";
import CreateSelling from "./components/createSelling/CreateSelling";

const PrivateRoute = ({ children, loggedInUserId }) => {
    return loggedInUserId ? children : <Navigate to="/login" replace />;
};

function App() {
    const [isLightTheme, setIsLightTheme] = useState(() => {
        const savedTheme = localStorage.getItem('isLightTheme');
        return savedTheme !== null ? JSON.parse(savedTheme) : true;
    });

    const [loggedInUserId, setLoggedInUserId] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        localStorage.setItem('isLightTheme', JSON.stringify(isLightTheme));
    }, [isLightTheme]);

    useEffect(() => {
        const userId = localStorage.getItem('userId');
        if (userId) {
            setLoggedInUserId(userId);
        }
        setIsLoading(false);
    }, []);

    const handleLogin = (userId) => {
        localStorage.setItem('userId', userId);
        setLoggedInUserId(userId);
    };
    
    const handleLogout = () => {
        localStorage.removeItem('userId');
        setLoggedInUserId(null);
        window.location.reload();
    };

    if (isLoading) {
        return <div>Завантаження...</div>; // Або будь-який інший компонент завантаження
    }

    return (
        <Router>
            <AppContent
                isLightTheme={isLightTheme}
                setIsLightTheme={setIsLightTheme}
                loggedInUserId={loggedInUserId}
                handleLogin={handleLogin}
                handleLogout={handleLogout}
            />
        </Router>
    );
}

function AppContent({ isLightTheme, setIsLightTheme, loggedInUserId, handleLogin, handleLogout }) {
    const navigate = useNavigate();
    
    // --- NEW: Add state for search filters and mode
    const [dailySearchFilters, setDailySearchFilters] = useState(null);
    const [sellingsSearchFilters, setSellingsSearchFilters] = useState(null);

    // This function will be passed to Main to handle searches
    const handleSearch = (mode, filters) => {
        if (mode === 'daily') {
            setDailySearchFilters(filters);
            navigate('/daily'); // Redirect to the daily page
        } else if (mode === 'sellings') {
            setSellingsSearchFilters(filters);
            navigate('/sellings'); // Redirect to the sales page
        }
    };
    // --- END NEW

    const onLogoutAndRedirect = () => {
        handleLogout();
        navigate('/');
    };

    return (
        <div className={isLightTheme ? "light-theme-wrapper" : "dark-theme-wrapper"}>
            <Header
                isLightTheme={isLightTheme}
                setIsLightTheme={setIsLightTheme}
                isLoggedIn={!!loggedInUserId}
                onLogout={onLogoutAndRedirect}
            />

            <main>
                <Routes>
                    {/* --- MODIFIED: Pass the handleSearch function down to Main */}
                    <Route 
                        path="/" 
                        element={
                            <Main 
                                isLightTheme={isLightTheme} 
                                loggedInUserId={loggedInUserId} 
                                onSearch={handleSearch} 
                            />
                        } 
                    />
                    
                    {/* --- MODIFIED: Pass the search filters to the DailyPage */}
                    <Route 
                        path="/daily" 
                        element={
                            <DailyPage 
                                isLightTheme={isLightTheme} 
                                loggedInUserId={loggedInUserId} 
                                searchFilters={dailySearchFilters} 
                            />
                        } 
                    />
                    
                    {/* --- MODIFIED: Pass the search filters to the Sellings page */}
                    <Route 
                        path="/sellings" 
                        element={
                            <Sellings 
                                isLightTheme={isLightTheme} 
                                loggedInUserId={loggedInUserId} 
                                searchFilters={sellingsSearchFilters} 
                            />
                        } 
                    />

                    <Route path="/wishlist" element={<WishList isLightTheme={isLightTheme} loggedInUserId={loggedInUserId} />} />
                    <Route path="/about-us" element={<AboutUs isLightTheme={isLightTheme} loggedInUserId={loggedInUserId} />} />
                    <Route path="/copyright" element={<Copyright isLightTheme={isLightTheme} loggedInUserId={loggedInUserId} />} />
                    <Route path="/private-policy" element={<PrivatePolicy isLightTheme={isLightTheme} loggedInUserId={loggedInUserId} />} />
                    <Route path="/support" element={<Support isLightTheme={isLightTheme} loggedInUserId={loggedInUserId} />} />
                    <Route path="/support-form" element={<SupportForm isLightTheme={isLightTheme} loggedInUserId={loggedInUserId} />} />
                    <Route path="/terms-and-policies" element={<TermsAndPolicies isLightTheme={isLightTheme} loggedInUserId={loggedInUserId} />} />
                    <Route path="/terms-of-service" element={<TermsOfService isLightTheme={isLightTheme} loggedInUserId={loggedInUserId} />} />
                    <Route path="/login" element={<LoginForm isLightTheme={isLightTheme} onLogin={handleLogin} setUser={handleLogin} />} />
                    <Route path="/register" element={<RegistrationForm isLightTheme={isLightTheme} />} />
                    <Route path="/listing-daily/:id" element={<ListingDailyPage isLightTheme={isLightTheme} loggedInUserId={loggedInUserId} />} />
                    <Route path="/selling/:id" element={<SellingPage isLightTheme={isLightTheme} loggedInUserId={loggedInUserId} />} />
                    <Route path="/admin" element={<AdminPanel isLightTheme={isLightTheme} loggedInUserId={loggedInUserId} />} />
                    
                    <Route
                        path="/account"
                        element={<PrivateRoute loggedInUserId={loggedInUserId}><Profile isLightTheme={isLightTheme} onLogout={onLogoutAndRedirect} loggedInUserId={loggedInUserId} /></PrivateRoute>}
                    />
                    <Route
                        path="/create-listing"
                        element={<PrivateRoute loggedInUserId={loggedInUserId}><CreateListing isLightTheme={isLightTheme} loggedInUserId={loggedInUserId} /></PrivateRoute>}
                    />
                    <Route
                        path="/create-selling"
                        element={<PrivateRoute loggedInUserId={loggedInUserId}><CreateSelling isLightTheme={isLightTheme} loggedInUserId={loggedInUserId} /></PrivateRoute>}
                    />
                    <Route
                        path="/edit-listing/:id"
                        element={<PrivateRoute loggedInUserId={loggedInUserId}><CreateListing isLightTheme={isLightTheme} loggedInUserId={loggedInUserId} /></PrivateRoute>}
                    />
                    <Route
                        path="/edit-selling/:id"
                        element={<PrivateRoute loggedInUserId={loggedInUserId}><CreateSelling isLightTheme={isLightTheme} loggedInUserId={loggedInUserId} /></PrivateRoute>}
                    />
                    <Route path="*" element={<NotFound isLightTheme={isLightTheme} loggedInUserId={loggedInUserId} />} />
                </Routes>
            </main>
            <Footer isLightTheme={isLightTheme} />
        </div>
    );
}

export default App;