import React, { useEffect } from "react";
import { Avatar, Badge } from "antd";
import {
  UserOutlined,
  HeartOutlined,
  CalendarOutlined,
  HomeOutlined,
  MenuOutlined,
} from "@ant-design/icons";
import M from "materialize-css";

function Header({ favoriteCount }) {
  useEffect(() => {
    const dropdowns = document.querySelectorAll(".dropdown-trigger");
    M.Dropdown.init(dropdowns, {
      coverTrigger: false,
      alignment: "right",
    });

    const sidenavs = document.querySelectorAll(".sidenav");
    M.Sidenav.init(sidenavs, { edge: "right" });

    const collapsibles = document.querySelectorAll(".collapsible");
    M.Collapsible.init(collapsibles);
  }, []);

  return (
    <div>
      {/* Dropdown для профілю (ПК) */}
      <ul
        id="dropdown1"
        className="dropdown-content"
        style={{ backgroundColor: "#222" }}
      >
        <li>
          <a href="#!" style={{ color: "#ccc" }}>
            Мій профіль
          </a>
        </li>
        <li>
          <a href="#!" style={{ color: "#ccc" }}>
            Мої оголошення
          </a>
        </li>
        <li className="divider"></li>
        <li>
          <a href="#!" style={{ color: "#ccc" }}>
            Вийти
          </a>
        </li>
      </ul>

      {/* Навбар */}
      <nav style={{ backgroundColor: "#222" }}>
        <div className="nav-wrapper" style={{ padding: "0 1rem" }}>
          {/* Лого */}
          <a href="/" className="brand-logo">
            <img
              src={`${process.env.PUBLIC_URL}/images/logo.png`}
              alt="House24"
              style={{ height: "50px", objectFit: "contain" }}
            />
          </a>

          {/* ПК меню */}
          <ul
            className="right hide-on-med-and-down nav-list"
            style={{ display: "flex", alignItems: "center", gap: "1rem" }}
          >
            <li>
              <a href="/daily" style={{ color: "#ccc" }}>
                <HomeOutlined /> Подобово
              </a>
            </li>
            <li>
              <a href="/monthly" style={{ color: "#ccc" }}>
                <CalendarOutlined /> Помісячно
              </a>
            </li>
            <li className="heart-logo"> 
              <a className="heart-trigger" href="/wishlist"> 
                <Badge count={99} overflowCount={99} offset={[0, 0]}> 
                  <Avatar size={40} icon={<HeartOutlined style={{ color: "white" }} />} style={{ backgroundColor: "#555" }} /> 
                </Badge> 
              </a> 
            </li>
            <li>
              <a className="dropdown-trigger" href="#!" data-target="dropdown1">
                <Avatar
                  size={40}
                  icon={<UserOutlined />}
                  style={{ backgroundColor: "#555", color: "white" }}
                />
              </a>
            </li>
          </ul>

          {/* Кнопка-бургер (мобільне меню) */}
          <a
            href="#!"
            data-target="mobile-menu"
            className="sidenav-trigger right hide-on-large-only burger-trigger"
          >
            <MenuOutlined style={{ fontSize: 24, color: "white" }} />
          </a>
        </div>
      </nav>

      {/* Мобільне меню */}
      <ul
        className="sidenav"
        id="mobile-menu"
        style={{ backgroundColor: "#222", paddingTop: "1rem" }}
      >
        <li>
          <a href="/daily" style={{ color: "white" }}>
            <HomeOutlined /> Подобово
          </a>
        </li>
        <li>
          <a href="/monthly" style={{ color: "white" }}>
            <CalendarOutlined /> Помісячно
          </a>
        </li>
        <li>
          <a href="/wishlist" style={{ color: "white" }}>
            <Badge count={favoriteCount} overflowCount={99}>
              <HeartOutlined style={{ fontSize: "20px", color: "white" }} />
            </Badge>{" "}
            Вибране
          </a>
        </li>

        <li>
          <ul className="collapsible collapsible-accordion">
            <li>
              {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
              <a
                className="collapsible-header"
                style={{ color: "white", display: "flex", alignItems: "center" }}
              >
                <UserOutlined style={{ marginRight: "8px" }} />
                Обліковий запис
              </a>
              <div className="collapsible-body" style={{ backgroundColor: "#333" }}>
                <ul>
                  <li>
                    <a href="#!" style={{ color: "#ccc" }}>
                      Мій профіль
                    </a>
                  </li>
                  <li>
                    <a href="#!" style={{ color: "#ccc" }}>
                      Мої оголошення
                    </a>
                  </li>
                  <li>
                    <a href="#!" style={{ color: "#ccc" }}>
                      Вийти
                    </a>
                  </li>
                </ul>
              </div>
            </li>
          </ul>
        </li>
      </ul>
    </div>
  );
}

export default Header;
