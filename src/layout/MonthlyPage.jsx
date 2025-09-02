import React, { useState, useMemo } from "react";
import { Card, Row, Col, Select, Button, InputNumber, Slider, Drawer } from "antd";
import { LeftOutlined, RightOutlined, FilterOutlined } from "@ant-design/icons";
import "./styles/MonthlyPage.css";

const { Option } = Select;

const notFoundImagePath = `${process.env.PUBLIC_URL}/images/notfound.png`;

const dummyData = Array.from({ length: 15 }, (_, i) => ({
  id: i + 1,
  image: `/images/hotel${(i % 5) + 1}.jpg`,
  beds: Math.floor(Math.random() * 4) + 2, // 2-5 місць
  rooms: Math.floor(Math.random() * 3) + 1, // 1-3 кімнати
  bathrooms: Math.floor(Math.random() * 2) + 1, // 1-2 санвузли
  city: ["Київ", "Львів", "Одеса", "Харків", "Дніпро"][i % 5],
  pricePerMonth: Math.floor(Math.random() * (50000 - 10000 + 1)) + 10000, // ціна від 10000 до 50000
}));

function MonthlyPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);
  const [sortOrder, setSortOrder] = useState("default");
  const [filters, setFilters] = useState({
    city: "Київ",
    adults: 1,
    children: 0,
    priceRange: [0, 50000],
    type: {
      apartment: false,
      house: false,
      villa: false,
    },
    rooms: 1,
    bathrooms: 1,
    amenities: {
      fireplace: false,
      parking: false,
      airConditioner: false,
      petsAllowed: false,
    },
  });

  const toggleCheckbox = (group, key) => {
    setFilters({
      ...filters,
      [group]: { ...filters[group], [key]: !filters[group][key] }
    });
  };

  const sortedData = useMemo(() => {
    let sorted = [...dummyData];
    if (sortOrder === "cheapest") {
      sorted.sort((a, b) => a.pricePerMonth - b.pricePerMonth);
    } else if (sortOrder === "expensive") {
      sorted.sort((a, b) => b.pricePerMonth - a.pricePerMonth);
    } else if (sortOrder === "newest") {
      sorted.sort((a, b) => b.id - a.id);
    }
    return sorted;
  }, [sortOrder]);

  const filterContent = (
    <div className="mp-filters-panel-content">
      <h3 className="mp-panel-title">Фільтри</h3>
      <div className="mp-filter-section">
        <p className="mp-filter-label">Розташування</p>
        <Select
          value={filters.city}
          onChange={(val) => setFilters({...filters, city: val})}
          className="mp-custom-select"
        >
          {["Київ", "Львів", "Одеса", "Харків", "Дніпро"].map(c => <Option key={c} value={c}>{c}</Option>)}
        </Select>
      </div>
      <div className="mp-filter-section">
        <p className="mp-filter-label">Кількість людей</p>
        <div className="mp-number-input-group">
          <span className="mp-number-input-label">Дорослі</span>
          <InputNumber
            min={1}
            value={filters.adults}
            onChange={(val) => setFilters({...filters, adults: val})}
            className="mp-custom-input-number"
          />
        </div>
        <div className="mp-number-input-group">
          <span className="mp-number-input-label">Діти</span>
          <InputNumber
            min={0}
            value={filters.children}
            onChange={(val) => setFilters({...filters, children: val})}
            className="mp-custom-input-number"
          />
        </div>
      </div>
      <div className="mp-filter-section">
        <p className="mp-filter-label">Ціна за місяць</p>
        <Slider
          range
          min={0}
          max={50000}
          defaultValue={[0, 50000]}
          onChange={(val) => setFilters({...filters, priceRange: val})}
        />
        <div className="mp-slider-label-group">
          <span>{filters.priceRange[0]} грн</span>
          <span>{filters.priceRange[1]} грн</span>
        </div>
      </div>
      <div className="mp-filter-section">
        <p className="mp-filter-label">Тип житла</p>
        <div className="mp-filter-row">
          <label className="mp-monthlypage-checkbox">
            <input type="checkbox" checked={filters.type.apartment} onChange={() => toggleCheckbox("type", "apartment")} />
            <span>Квартира</span>
          </label>
          <label className="mp-monthlypage-checkbox">
            <input type="checkbox" checked={filters.type.house} onChange={() => toggleCheckbox("type", "house")} />
            <span>Будинок</span>
          </label>
          <label className="mp-monthlypage-checkbox">
            <input type="checkbox" checked={filters.type.villa} onChange={() => toggleCheckbox("type", "villa")} />
            <span>Вілла</span>
          </label>
        </div>
      </div>
      <div className="mp-filter-section">
        <p className="mp-filter-label">Кількість кімнат</p>
        <Select
          value={filters.rooms}
          onChange={(val) => setFilters({...filters, rooms: val})}
          className="mp-custom-select"
        >
          {[1,2,3,4,5].map(n => <Option key={n} value={n}>{n}</Option>)}
        </Select>
      </div>
      <div className="mp-filter-section">
        <p className="mp-filter-label">Кількість санвузлів</p>
        <Select
          value={filters.bathrooms}
          onChange={(val) => setFilters({...filters, bathrooms: val})}
          className="mp-custom-select"
        >
          {[1,2,3].map(n => <Option key={n} value={n}>{n}</Option>)}
        </Select>
      </div>
      <div className="mp-filter-section">
        <p className="mp-filter-label">Зручності</p>
        <div className="mp-filter-row">
          <label className="mp-monthlypage-checkbox">
            <input type="checkbox" checked={filters.amenities.fireplace} onChange={() => toggleCheckbox("amenities", "fireplace")} />
            <span>Камін</span>
          </label>
          <label className="mp-monthlypage-checkbox">
            <input type="checkbox" checked={filters.amenities.parking} onChange={() => toggleCheckbox("amenities", "parking")} />
            <span>Паркінг</span>
          </label>
          <label className="mp-monthlypage-checkbox">
            <input type="checkbox" checked={filters.amenities.airConditioner} onChange={() => toggleCheckbox("amenities", "airConditioner")} />
            <span>Кондиціонер</span>
          </label>
          <label className="mp-monthlypage-checkbox">
            <input type="checkbox" checked={filters.amenities.petsAllowed} onChange={() => toggleCheckbox("amenities", "petsAllowed")} />
            <span>Можна з тваринами</span>
          </label>
        </div>
      </div>
      <Button className="mp-apply-button" onClick={() => setShowFilters(false)}>Застосувати</Button>
    </div>
  );

  return (
    <div className="mp-monthly-page-container">
      
      <div className="mp-filter-button-mobile-container">
        <Button
          type="primary"
          onClick={() => setShowFilters(true)}
          className="mp-filter-button-mobile"
          icon={<FilterOutlined />}
        >
          Показати фільтри
        </Button>
      </div>
      
      <div className="mp-filters-panel">
        {filterContent}
      </div>

      <Drawer
        title="Фільтри"
        placement="left"
        onClose={() => setShowFilters(false)}
        visible={showFilters}
        className="mp-mobile-drawer"
        bodyStyle={{ backgroundColor: '#222', color: '#fff', padding: '1rem' }}
        headerStyle={{ backgroundColor: '#1a1a1a', borderBottom: '1px solid #444' }}
        closeIcon={<LeftOutlined style={{ color: '#fff' }} />}
      >
        {filterContent}
      </Drawer>

      <div className="mp-cards-list-container">
        <div className="mp-sort-container">
          <span className="mp-sort-label">Сортувати:</span>
          <Select
            value={sortOrder}
            onChange={(value) => setSortOrder(value)}
            className="mp-custom-select"
            style={{ width: '200px' }}
          >
            <Option value="default">за замовчуванням</Option>
            <Option value="cheapest">спочатку дешевші</Option>
            <Option value="expensive">спочатку дорожчі</Option>
            <Option value="newest">новинки</Option>
          </Select>
        </div>
        <Row gutter={[16, 16]}>
        {sortedData.map(item => {
            return (
            <Col xs={24} sm={12} md={8} key={item.id}>
              <Card
              hoverable
              className="mp-card-hover-animation"
              style={{ backgroundColor: '#2e2e2e', border: 'none' }}
              cover={
                  <div className="mp-card-image-container">
                    <img
                        alt={`Apartment ${item.id}`}
                        src={item.image || notFoundImagePath}
                        className="mp-card-image"
                        onError={(e) => { e.target.onerror = null; e.target.src=notFoundImagePath; }}
                    />
                    <div className="mp-price-tag">
                        Від {item.pricePerMonth} грн/місяць
                    </div>
                  </div>
              }
              >
              <div className="mp-card-info-section">
                <Row gutter={[16, 16]}>
                  <Col span={8}>
                    <p className="mp-card-info-value">{item.beds}</p>
                    <p className="mp-card-info-label">Місць</p>
                  </Col>
                  <Col span={8}>
                    <p className="mp-card-info-value">{item.rooms}</p>
                    <p className="mp-card-info-label">Кімнати</p>
                  </Col>
                  <Col span={8}>
                    <p className="mp-card-info-value">{item.bathrooms}</p>
                    <p className="mp-card-info-label">Санвузли</p>
                  </Col>
                </Row>
              </div>
              <p className="mp-card-city-name">{item.city}</p>
              </Card>
            </Col>
            );
        })}
        </Row>

        <div className="mp-pagination-group">
          <Button className="mp-pagination-button" onClick={() => setCurrentPage(currentPage - 1)} icon={<LeftOutlined />} disabled={currentPage === 1} />
          <span className="mp-pagination-label">Сторінка {currentPage}</span>
          <Button className="mp-pagination-button" onClick={() => setCurrentPage(currentPage + 1)} icon={<RightOutlined />} />
        </div>
      </div>
    </div>
  );
}

export default MonthlyPage;
