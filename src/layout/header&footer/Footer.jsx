import React from 'react';
import { Link } from 'react-router-dom'; // Import Link
import { FaFacebookF, FaInstagram, FaTiktok, FaTelegramPlane } from 'react-icons/fa';
import './styles/Footer.css';

const Footer = ({ isLightTheme }) => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className={isLightTheme ? 'light-theme-footer' : 'dark-theme-footer'}>
      <div className="footer-container">
        {/* Секція 1: Про нас */}
        <div className="footer-section">
          <h4>Про нас</h4>
          <ul className="footer-links-list">
            <li><Link to="/about-us">Про нас</Link></li>
            <li><Link to="/support">Підтримка</Link></li>
          </ul>
          <div className="cta-section">
            <p>Хочете замовити розміщення свого об'єкта?</p>
            <Link to="/support-form">Заповніть форму зворотнього зв'язку — і ми з вами зв'яжемося.</Link>
          </div>
        </div>

        {/* Секція 2: Соціальні мережі */}
        <div className="footer-section">
          <h4>Соціальні мережі</h4>
          <div className="social-icons-container">
            <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer"><FaFacebookF /></a>
            <a href="https://www.instagram.com/24house.in.ua/" target="_blank" rel="noopener noreferrer"><FaInstagram /></a>
            <a href="https://t.me/" target="_blank" rel="noopener noreferrer"><FaTelegramPlane /></a>
            <a href="https://www.tiktok.com" target="_blank" rel="noopener noreferrer"><FaTiktok /></a>
          </div>
        </div>

        {/* Секція 3: Корисні посилання */}
        <div className="footer-section">
          <h4>Корисні посилання</h4>
          <ul className="footer-links-list">
            <li><Link to="/terms-and-policies">Умови та політика</Link></li>
            <li><Link to="/terms-of-service">Умови обслуговування</Link></li>
            <li><Link to="/private-policy">Політика конфіденційності</Link></li>
            <li><Link to="/copyright">Авторські права</Link></li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        &copy; {currentYear} 24House | Усі права захищені
      </div>
    </footer>
  );
};

export default Footer;