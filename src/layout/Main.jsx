import React from "react";
import { Button } from "antd";
import { HomeOutlined, CalendarOutlined, DollarOutlined } from "@ant-design/icons";
import { motion } from "framer-motion";
import SearchForm from '../components/search/SearchForm';
import FAQSection from '../components/faq/FAQSection';

function Main({ isLightTheme }) {
  const buttonSectionBg = isLightTheme ? "#fff" : "#1a1a1a";
  const buttonColor = isLightTheme ? "#333" : "white";
  const buttonBorderColor = isLightTheme ? "#ccc" : "white";
  const buttonHoverBg = isLightTheme ? "rgba(0,0,0,0.05)" : "rgba(255,255,255,0.1)";

  return (
    <main style={{ minHeight: "100vh", overflowX: "hidden" }}>
      <section
        style={{
          minHeight: "80vh",
          width: "100%",
          backgroundImage: `url(${process.env.PUBLIC_URL}/images/carpathian-mountains-blur.png)`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          padding: "2rem 1rem",
        }}
      >
        <SearchForm isLightTheme={isLightTheme}/>
      </section>

      <section
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "30px",
          padding: "3rem 1rem",
          flexWrap: "wrap",
          backgroundColor: buttonSectionBg,
        }}
      >
        {["Оренда", "Покупка", "Інвестування"].map((text, i) => {
          let icon;
          if (text === "Оренда") icon = <HomeOutlined />;
          if (text === "Покупка") icon = <CalendarOutlined />;
          if (text === "Інвестування") icon = <DollarOutlined />;

          return (
            <motion.div key={i} whileHover={{ scale: 1.05 }}>
              <Button
                type="default"
                ghost={!isLightTheme} // 'ghost' тільки для темної теми
                size="large"
                icon={icon}
                style={{
                  color: buttonColor,
                  borderColor: buttonBorderColor,
                  minWidth: "350px",
                  height: "90px",
                  fontWeight: 500,
                  fontSize: "18px",
                  transition: "all 0.3s ease",
                }}
                onMouseEnter={e => (e.currentTarget.style.backgroundColor = buttonHoverBg)}
                onMouseLeave={e => (e.currentTarget.style.backgroundColor = "transparent")}
              >
                {text}
              </Button>
            </motion.div>
          );
        })}
      </section>

      <section>
        <FAQSection isLightTheme={isLightTheme} />
      </section>
    </main>
  );
}

export default Main;