import React from 'react';
import { InstagramOutlined, YoutubeOutlined } from '@ant-design/icons';

function Footer() {
    return (
        <footer className="page-footer" style={{ backgroundColor: "#222", paddingTop: "2rem" }}>
            <div className="container">
                <div className="row">
                    <div className="col l6 s12">
                        <img 
                            src={`${process.env.PUBLIC_URL}/images/logo.png`}
                            alt="House24" 
                            style={{ height: "50px", objectFit: "contain", marginBottom: "1rem" }} 
                        />
                        <p className="grey-text text-lighten-4">
                            Ваш надійний партнер у виборі житла.
                        </p>
                        <div style={{ marginTop: "1rem", display: "flex", gap: "1rem" }}>
                            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
                                <InstagramOutlined style={{ fontSize: '24px', color: 'white' }} />
                            </a>
                            <a href="https://youtube.com" target="_blank" rel="noopener noreferrer">
                                <YoutubeOutlined style={{ fontSize: '24px', color: 'white' }} />
                            </a>
                        </div>
                    </div>

                    <div className="col l3 s12 company">
                        <h5 className="white-text">Компанія</h5>
                        <ul>
                            <li><a className="grey-text text-lighten-3" href="#!">Допомога</a></li>
                            <li><a className="grey-text text-lighten-3" href="#!">Про нас</a></li>
                            <li><a className="grey-text text-lighten-3" href="#!">Контакти</a></li>
                        </ul>
                    </div>

                    <div className="col l3 s12 conditions">
                        <h5 className="white-text">Умови та політика</h5>
                        <ul>
                            <li><a className="grey-text text-lighten-3" href="#!">Умови обслуговування</a></li>
                            <li><a className="grey-text text-lighten-3" href="#!">Політика конфіденційності</a></li>
                            <li><a className="grey-text text-lighten-3" href="#!">Авторські права</a></li>
                        </ul>
                    </div>
                </div>
            </div>
            <div className="footer-copyright">
                <div className="container grey-text text-lighten-1">
                    © 2025 House24
                </div>
            </div>
        </footer>
    );
}

export default Footer;
