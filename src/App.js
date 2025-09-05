import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from "react-router-dom";
import Header from "./layout/header&footer/Header";
import Footer from "./layout/header&footer/Footer";
import Main from "./layout/Main";
import DailyPage from "./components/daily/DailyPage";
import MonthlyPage from "./components/monthly/MonthlyPage";
import WishList from "./components/wishlist/WishList";
import Profile from "./components/profile/Profile";
import CreateListing from "./components/createListing/CreateListing";
import AboutUs from "./components/footerComponents/AboutUs/AboutUs";
import Contact from "./components/footerComponents/Contact/Contact";
import Cooperation from "./components/footerComponents/Cooperation/Cooperation";
import Copyright from "./components/footerComponents/Copyright/Copyright";
import PrivatePolicy from './components/footerComponents/PrivatePolicy/PrivatePolicy';
import RealEstate from "./components/footerComponents/RealEstate/RealEstate";
import Support from "./components/footerComponents/Support/Support";
import TermsAndPolicies from './components/footerComponents/TermsAndPolicies/TermsAndPolicies';
import TermsOfService from './components/footerComponents/TermsOfService/TermsOfService';
import "./App.css";
import LoginForm from "./components/authForms/LoginForm";
import RegistrationForm from "./components/authForms/RegistrationForm";
import ListingDailyPage from "./components/listingDaily/ListingDailyPage";
// Import the new NotFound component
import NotFound from "./components/notFound/NotFound";

const PrivateRoute = ({ children, loggedInUserId }) => {
    return loggedInUserId ? children : <Navigate to="/login" replace />;
};

function App() {
    const [isLightTheme, setIsLightTheme] = useState(() => {
        const savedTheme = localStorage.getItem('isLightTheme');
        return savedTheme !== null ? JSON.parse(savedTheme) : true;
    });

    const [loggedInUserId, setLoggedInUserId] = useState(null);

    useEffect(() => {
        localStorage.setItem('isLightTheme', JSON.stringify(isLightTheme));
    }, [isLightTheme]);

    useEffect(() => {
        const userId = localStorage.getItem('userId');
        if (userId) {
            setLoggedInUserId(userId);
        }
    }, []);

    const handleLogin = (userId) => {
        localStorage.setItem('userId', userId);
        setLoggedInUserId(userId);
    };
    
    const handleLogout = () => {
        localStorage.removeItem('userId');
        setLoggedInUserId(null);
    };

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

    const onLogoutAndRedirect = () => {
        handleLogout();
        navigate('/login');
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
                    <Route path="/" element={<Main isLightTheme={isLightTheme} />} />
                    <Route path="/daily" element={<DailyPage isLightTheme={isLightTheme} />} />
                    <Route path="/monthly" element={<MonthlyPage isLightTheme={isLightTheme} />} />
                    <Route path="/wishlist" element={<WishList isLightTheme={isLightTheme} loggedInUserId={loggedInUserId} />} />
                    <Route path="/about-us" element={<AboutUs isLightTheme={isLightTheme} />} />
                    <Route path="/contact" element={<Contact isLightTheme={isLightTheme} />} />
                    <Route path="/cooperation" element={<Cooperation isLightTheme={isLightTheme} />} />
                    <Route path="/copyright" element={<Copyright isLightTheme={isLightTheme} />} />
                    <Route path="/private-policy" element={<PrivatePolicy isLightTheme={isLightTheme} />} />
                    <Route path="/real-estate" element={<RealEstate isLightTheme={isLightTheme} />} />
                    <Route path="/support" element={<Support isLightTheme={isLightTheme} />} />
                    <Route path="/terms-and-policies" element={<TermsAndPolicies isLightTheme={isLightTheme} />} />
                    <Route path="/terms-of-service" element={<TermsOfService isLightTheme={isLightTheme} />} />
                    <Route path="/login" element={<LoginForm isLightTheme={isLightTheme} onLogin={handleLogin} />} />
                    <Route path="/register" element={<RegistrationForm isLightTheme={isLightTheme} />} />
                    <Route path="/listing-daily/:id" element={<ListingDailyPage isLightTheme={isLightTheme} />} />
                    <Route path="/listing-monthly/:id" element={<ListingDailyPage isLightTheme={isLightTheme} />} />

                    <Route
                        path="/account"
                        element={<PrivateRoute loggedInUserId={loggedInUserId}><Profile isLightTheme={isLightTheme} onLogout={onLogoutAndRedirect} /></PrivateRoute>}
                    />
                    <Route
                        path="/create-listing"
                        element={<PrivateRoute loggedInUserId={loggedInUserId}><CreateListing isLightTheme={isLightTheme} loggedInUserId={loggedInUserId} /></PrivateRoute>}
                    />
                    <Route
                        path="/edit-listing/:id"
                        element={<PrivateRoute loggedInUserId={loggedInUserId}><CreateListing isLightTheme={isLightTheme} loggedInUserId={loggedInUserId} /></PrivateRoute>}
                    />
                    <Route path="*" element={<NotFound isLightTheme={isLightTheme} />} />
                </Routes>
            </main>
            <Footer isLightTheme={isLightTheme} />
        </div>
    );
}

export default App;