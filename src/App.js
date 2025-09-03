import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./layout/header&footer/Header";
import Footer from "./layout/header&footer/Footer";
import Main from "./layout/Main";
import DailyPage from "./components/DailyPage";
import MonthlyPage from "./components/MonthlyPage";
import WishList from "./components/WishList";
import Profile from "./components/profile/Profile";
import "./App.css";
import CreateListing from "./components/CreateListing";

function App() {
  const [isLightTheme, setIsLightTheme] = useState(() => {
    const savedTheme = localStorage.getItem('isLightTheme');
    return savedTheme !== null ? JSON.parse(savedTheme) : true;
  });

  useEffect(() => {
    localStorage.setItem('isLightTheme', JSON.stringify(isLightTheme));
  }, [isLightTheme]);

  return (
    <Router>
      <div className={isLightTheme ? "light-theme-wrapper" : "dark-theme-wrapper"}>
        <Header isLightTheme={isLightTheme} setIsLightTheme={setIsLightTheme} />
        
        <main>
          <Routes>
            <Route path="/" element={<Main isLightTheme={isLightTheme} />} />
            <Route path="/daily" element={<DailyPage isLightTheme={isLightTheme} />} />
            <Route path="/monthly" element={<MonthlyPage isLightTheme={isLightTheme} />} />
            <Route path="/wishlist" element={<WishList isLightTheme={isLightTheme} />} />
            <Route path="/account" element={<Profile isLightTheme={isLightTheme} />} />
            <Route path="/create-listing" element={<CreateListing isLightTheme={isLightTheme} />} />
          </Routes>
        </main>
        <Footer isLightTheme={isLightTheme} />
      </div>
    </Router>
  );
}

export default App;