import React from "react";
import { Button } from "antd";
import { HomeOutlined, CalendarOutlined, DollarOutlined } from "@ant-design/icons";
import { motion } from "framer-motion";
import SearchForm from '../components/search/SearchForm'
import FAQSection from '../components/FAQSection'

function Main() {
  return (
    <main style={{ minHeight: "100vh", overflowX: "hidden" }}>
      <section
        style={{
            minHeight: "80vh", // мінімум 80% висоти екрана
            width: "100%",
            backgroundImage: "url('/images/carpathian-mountains-blur2.png')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            padding: "2rem 1rem", // відступи зверху/знизу
        }}
        >
        <SearchForm />
    </section>


      <section
        style={{
            display: "flex",
            justifyContent: "center",
            gap: "30px",
            padding: "3rem 1rem",
            flexWrap: "wrap",
            backgroundColor: "#1a1a1a",
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
                ghost
                size="large"
                icon={icon}
                style={{
                    color: "white",
                    borderColor: "white",
                    minWidth: "350px",
                    height: "90px",
                    fontWeight: 500,
                    fontSize: "18px",
                    transition: "all 0.3s ease",
                }}
                onMouseEnter={e => (e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.1)")}
                onMouseLeave={e => (e.currentTarget.style.backgroundColor = "transparent")}
                >
                {text}
                </Button>
            </motion.div>
            );
        })}
      </section>

      <section>
        <FAQSection />
      </section>

    </main>
  );
}

export default Main;
