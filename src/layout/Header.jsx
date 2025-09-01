import React, { useEffect } from "react";
import { Avatar, Badge, Button } from "antd";
import { UserOutlined, HeartOutlined, CalendarOutlined, HomeOutlined } from "@ant-design/icons";
import M from "materialize-css";

function Header({ favoriteCount }) {
  useEffect(() => {
    const elems = document.querySelectorAll(".dropdown-trigger");
    M.Dropdown.init(elems, {
      coverTrigger: false,
      alignment: "right",
    });
  }, []);

  return (
    <div>
      <ul id="dropdown1" className="dropdown-content" style={{ backgroundColor: "#222" }}>
        <li><a href="#!" style={{ color: "#ccc" }}>Мій профіль</a></li>
        <li><a href="#!" style={{ color: "#ccc" }}>Мої оголошення</a></li>
        <li className="divider"></li>
        <li><a href="#!" style={{ color: "#ccc" }}>Вийти</a></li>
      </ul>

      <nav style={{ backgroundColor: "#222" }}>
        <div className="nav-wrapper">
          <a href="#!" className="brand-logo">
            <img 
                src="../logo.png" 
                alt="House24" 
                style={{ height: "50px", objectFit: "contain" }}
            />
          </a>
          <ul
            className="right hide-on-med-and-down"
            style={{ display: "flex", alignItems: "center", gap: "1rem" }}
          >
            <li className="daily-logo">
              <Button 
                style={{ color: "#ccc", borderColor: "#ccc" }} 
                ghost 
                icon={<HomeOutlined />}
              >
                Подобово
              </Button>
            </li>
            <li className="monthly-logo">
              <Button 
                style={{ color: "#ccc", borderColor: "#ccc" }} 
                ghost 
                icon={<CalendarOutlined />}
              >
                Помісячно
              </Button>
            </li>
            <li className="heart-logo">
                <a className="heart-trigger" href="#!">
                <Badge count={99} overflowCount={99} offset={[0, 0]}>
                  <Avatar size={40} icon={<HeartOutlined style={{ color: "white" }} />} style={{ backgroundColor: "#555" }} />
                </Badge>
              </a>
            </li>
            <li className="avatar-logo">
              <a className="dropdown-trigger" href="#!" data-target="dropdown1">
                <Avatar size={40} icon={<UserOutlined />} style={{ backgroundColor: "#555", color: "white" }} />
              </a>
            </li>
          </ul>
        </div>
      </nav>
    </div>
  );
}

export default Header;
