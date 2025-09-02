import React, { useState } from "react";
import { ConfigProvider, Space, Card, Button } from "antd";
import SearchFormDaily from "./SearchFormDaily";
import SearchFormMonthly from "./SearchFormMonthly";

const SearchForm = () => {
  const [mode, setMode] = useState("daily");
  const [formData, setFormData] = useState({
    location: "",
    checkIn: "",
    checkOut: "",
    adults: "",
    children: "",
    propertyType: "cottage",
    petsAllowed: false,
  });

  const handleSearch = (data) => {
    console.log(`Пошук у режимі "${mode}" з даними:`, data);
  };

  const customTheme = {
    token: {
      colorPrimary: '#1a1a1a',
      colorText: '#333',
      borderRadius: 8,
    },
    components: {
      Button: {
        borderRadius: 8,
        controlHeight: 48,
        defaultBg: '#e9ecef',
        defaultBorderColor: 'transparent',
        defaultColor: 'black',
        paddingInline: 16,
      },
      Card: {
        padding: 30,
      },
      Input: {
        controlHeight: 48,
        borderRadius: 8,
      },
      Select: {
        controlHeight: 48,
        borderRadius: 8,
      },
    },
  };

  return (
    <ConfigProvider theme={customTheme} style={{backgroundColor: "white"}}>
      <Card
        style={{
          width: '100%',
          maxWidth: 600,
          margin: '2rem auto',
          borderRadius: 16,
          // Додаємо білий фон, щоб він не успадковував чорний колір від тіла сторінки
          backgroundColor: 'white',
        }}
      >
        <Space
          style={{
            marginBottom: 20,
            width: '100%',
            justifyContent: 'center',
            backgroundColor: '#f0f2f5',
            borderRadius: 10,
            padding: 4,
            transition: 'box-shadow 0.3s',
          }}
        >
          <Button
            type="default"
            onClick={() => setMode("daily")}
            style={{
              flex: 1,
              backgroundColor: mode === 'daily' ? 'white' : 'transparent',
              fontWeight: mode === 'daily' ? 'bold' : 'normal',
              boxShadow: mode === 'daily' ? '0 2px 8px rgba(0, 0, 0, 0.1)' : 'none',
              transition: 'background-color 0.3s, box-shadow 0.3s',
              // Нова анімація при наведенні
              '&:hover': {
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
              }
            }}
          >
            Подобово
          </Button>
          <Button
            type="default"
            onClick={() => setMode("monthly")}
            style={{
              flex: 1,
              backgroundColor: mode === 'monthly' ? 'white' : 'transparent',
              fontWeight: mode === 'monthly' ? 'bold' : 'normal',
              boxShadow: mode === 'monthly' ? '0 2px 8px rgba(0, 0, 0, 0.1)' : 'none',
              transition: 'background-color 0.3s, box-shadow 0.3s',
              // Нова анімація при наведенні
              '&:hover': {
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
              }
            }}
          >
            Помісячно
          </Button>
        </Space>
        {mode === "daily" ? (
          <SearchFormDaily formData={formData} setFormData={setFormData} onSearch={handleSearch} />
        ) : (
          <SearchFormMonthly formData={formData} setFormData={setFormData} onSearch={handleSearch} />
        )}
      </Card>
    </ConfigProvider>
  );
};

export default SearchForm;
