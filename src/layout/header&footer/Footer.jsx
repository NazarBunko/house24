import React from 'react';
import { FacebookFilled, YoutubeFilled } from '@ant-design/icons';
import { FaTiktok, FaInstagram } from 'react-icons/fa'; // Використовуємо react-icons для TikTok та Instagram
import './styles/Footer.css';

const Footer = ({ isLightTheme }) => {
  return (
    <footer className={isLightTheme ? 'light-theme-footer' : 'dark-theme-footer'}>
      <div className="footer-content">
        <div className="footer-section about">
          <h4>Про нас</h4>
          <p>
            Ми надаємо послуги оренди нерухомості з 2024 року. Ми знаємо, що потрібно нашим клієнтам!
          </p>
          <div className="contact">
            <span><i className="fa fa-phone"></i> +380 99 999 99 99</span>
            <span><i className="fa fa-envelope"></i> info@house24.com</span>
          </div>
          <div className="socials">
            <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer"><FacebookFilled /></a>
            <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer"><FaInstagram /></a>
            <a href="https://www.tiktok.com" target="_blank" rel="noopener noreferrer"><FaTiktok /></a>
            <a href="https://www.youtube.com" target="_blank" rel="noopener noreferrer"><YoutubeFilled /></a>
          </div>
        </div>
        <div className="footer-section links">
          <h4>Корисні посилання</h4>
          <ul>
            <li><a href="/">Поширені запитання</a></li>
            <li><a href="/">Політика конфіденційності</a></li>
            <li><a href="/">Умови використання</a></li>
            <li><a href="/">Зв'язатися з нами</a></li>
          </ul>
        </div>
      </div>
      <div className="footer-bottom">
        &copy; {new Date().getFullYear()} House24 | Всі права захищені
      </div>
    </footer>
  );
};

export default Footer;