import React from "react";
import { HashRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./layout/header&footer/Header";
import Footer from "./layout/header&footer/Footer";
import Main from "./layout/Main";
import DailyPage from "./layout/DailyPage";
import MonthlyPage from "./layout/MonthlyPage";

function App() {
  return (
    <Router>
      <Header /> {/* хідер завжди зверху */}
      
      <main style={{ minHeight: "calc(100vh - 128px)" }}>
        {/* 128px = висота хідера + футера (підкоригуй) */}
        <Routes>
          <Route path="/" element={<Main />} />
          <Route path="/daily" element={<DailyPage />} />
          <Route path="/monthly" element={<MonthlyPage />} />
        </Routes>
      </main>

      <Footer /> {/* футер завжди знизу */}
    </Router>
  );
}

export default App;
