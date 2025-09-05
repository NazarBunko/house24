import React from 'react';
import { Link } from 'react-router-dom';
import './NotFound.css';

const NotFound = ({ isLightTheme }) => {
    return (
        <div className={`not-found-container ${isLightTheme ? 'light-theme' : 'dark-theme'}`}>
            <h1 className="not-found-title">404</h1>
            <h2 className="not-found-subtitle">Сторінка не знайдена</h2>
            <p className="not-found-text">
                На жаль, сторінка, яку ви шукаєте, не існує.
            </p>
            <Link to="/" className="not-found-link">
                Повернутися на головну
            </Link>
        </div>
    );
};

export default NotFound;