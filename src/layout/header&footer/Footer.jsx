import React from 'react';
import { FaFacebookF, FaYoutube, FaTwitter, FaInstagram, FaTiktok, FaTelegramPlane } from 'react-icons/fa';
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
            <li><a href="/about-us">Про нас</a></li>
            <li><a href="/support">Підтримка</a></li>
          </ul>
          <div className="cta-section">
            <p>Хочете замовити розміщення свого об'єкта?</p>
            <a href="/support-form">Заповніть форму зворотнього зв'язку — і ми з вами зв'яжемося.</a>
          </div>
        </div>

        {/* Секція 2: Соціальні мережі */}
        <div className="footer-section">
          <h4>Соціальні мережі</h4>
          <div className="social-icons-container">
            <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer"><FaFacebookF /></a>
            <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer"><FaInstagram /></a>
            <a href="https://t.me/" target="_blank" rel="noopener noreferrer"><FaTelegramPlane /></a>
            <a href="https://www.youtube.com" target="_blank" rel="noopener noreferrer"><FaYoutube /></a>
            <a href="https://www.twitter.com" target="_blank" rel="noopener noreferrer"><FaTwitter /></a>
            <a href="https://www.tiktok.com" target="_blank" rel="noopener noreferrer"><FaTiktok /></a>
          </div>
        </div>

        {/* Секція 3: Корисні посилання */}
        <div className="footer-section">
          <h4>Корисні посилання</h4>
          <ul className="footer-links-list">
            <li><a href="/terms-and-policies">Умови та політика</a></li>
            <li><a href="/terms-of-service">Умови обслуговування</a></li>
            <li><a href="/private-policy">Політика конфіденційності</a></li>
            <li><a href="/copyright">Авторські права</a></li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        &copy; {currentYear} House24 | Усі права захищені
      </div>
    </footer>
  );
};

export default Footer;