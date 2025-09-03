import React, { useState, useMemo } from "react";
import { Card, Row, Col, Select, Button, InputNumber, Slider, DatePicker as AntdDatePicker, Drawer } from "antd";
import { LeftOutlined, RightOutlined, FilterOutlined } from "@ant-design/icons";
import "./styles/DailyPage.css";

const { Option } = Select;

const notFoundImagePath = `${process.env.PUBLIC_URL}/images/notfound.png`;

const dummyData = Array.from({ length: 15 }, (_, i) => ({
    id: i + 1,
    image: `/images/hotel${(i % 5) + 1}.jpg`,
    beds: Math.floor(Math.random() * 4) + 1,
    rooms: Math.floor(Math.random() * 3) + 1,
    bathrooms: Math.floor(Math.random() * 2) + 1,
    city: ["Kyiv", "Lviv", "Odesa", "Kharkiv", "Dnipro"][i % 5],
    pricePerNight: Math.floor(Math.random() * 4001) + 1000,
}));

const FilterContent = ({ filters, setFilters, toggleCheckbox, isLightTheme }) => (
    <div className="dp-filters-panel-content">
        <h3 className="dp-panel-title">Фільтри</h3>
        
        <div className="dp-filter-section">
            <p className="dp-filter-label">Розташування</p>
            <Select
              value={filters.city}
              onChange={(val) => setFilters({...filters, city: val})}
              className="dp-custom-select"
              dropdownClassName={isLightTheme ? "light-mode" : ""}
            >
              {["Kyiv", "Lviv", "Odesa", "Kharkiv", "Dnipro"].map(c => <Option key={c} value={c}>{c}</Option>)}
            </Select>
        </div>
        
        <div className="dp-filter-section">
            <p className="dp-filter-label">Дата заїзду</p>
            <AntdDatePicker
              className="dp-custom-datepicker"
              placeholder="Заїзд"
              value={filters.checkIn}
              onChange={(date) => {
                setFilters({
                  ...filters,
                  checkIn: date,
                  checkOut: filters.checkOut && date && filters.checkOut.isBefore(date) ? null : filters.checkOut
                });
              }}
            />
            <p className="dp-filter-label" style={{ marginTop: "1rem" }}>Дата виїзду</p>
            <AntdDatePicker
              className="dp-custom-datepicker"
              placeholder="Виїзд"
              value={filters.checkOut}
              disabledDate={(current) =>
                filters.checkIn ? current && current.isBefore(filters.checkIn, "day") : false
              }
              onChange={(date) => setFilters({ ...filters, checkOut: date })}
            />
        </div>
        
        <div className="dp-filter-section">
            <p className="dp-filter-label">Кількість людей</p>
            <div className="dp-number-input-group">
                <span className="dp-number-input-label">Дорослі</span>
                <InputNumber
                  min={1}
                  value={filters.adults}
                  onChange={(val) => setFilters({...filters, adults: val})}
                  className="dp-custom-input-number"
                />
            </div>
            <div className="dp-number-input-group">
                <span className="dp-number-input-label">Діти</span>
                <InputNumber
                  min={0}
                  value={filters.children}
                  onChange={(val) => setFilters({...filters, children: val})}
                  className="dp-custom-input-number"
                />
            </div>
        </div>
        
        <div className="dp-filter-section">
            <p className="dp-filter-label">Ціна за добу</p>
            <Slider
              range
              min={0}
              max={20000}
              defaultValue={[0, 20000]}
              onChange={(val) => setFilters({...filters, priceRange: val})}
            />
            <div className="dp-slider-label-group">
                <span>{filters.priceRange[0]} грн</span>
                <span>{filters.priceRange[1]} грн</span>
            </div>
        </div>
        
        <div className="dp-filter-section">
            <p className="dp-filter-label">Тип житла</p>
            <div className="dp-filter-row">
                <label className="dp-dailypage-checkbox">
                    <input type="checkbox" checked={filters.type.room} onChange={() => toggleCheckbox("type", "room")} />
                    <span>Номер</span>
                </label>
                <label className="dp-dailypage-checkbox">
                    <input type="checkbox" checked={filters.type.cottage} onChange={() => toggleCheckbox("type", "cottage")} />
                    <span>Котедж</span>
                </label>
                <label className="dp-dailypage-checkbox">
                    <input type="checkbox" checked={filters.type.apartments} onChange={() => toggleCheckbox("type", "apartments")} />
                    <span>Апартаменти</span>
                </label>
            </div>
        </div>
        
        <div className="dp-filter-section">
            <p className="dp-filter-label">Кількість кімнат</p>
            <Select
              value={filters.rooms}
              onChange={(val) => setFilters({...filters, rooms: val})}
              className="dp-custom-select"
              dropdownClassName={isLightTheme ? "light-mode" : ""}
            >
              {[1,2,3,4,5].map(n => <Option key={n} value={n}>{n}</Option>)}
            </Select>
        </div>
        <div className="dp-filter-section">
            <p className="dp-filter-label">Кількість санвузлів</p>
            <Select
              value={filters.bathrooms}
              onChange={(val) => setFilters({...filters, bathrooms: val})}
              className="dp-custom-select"
              dropdownClassName={isLightTheme ? "light-mode" : ""}
            >
              {[1,2,3].map(n => <Option key={n} value={n}>{n}</Option>)}
            </Select>
        </div>
        
        <div className="dp-filter-section">
            <p className="dp-filter-label">Зручності</p>
            <div className="dp-filter-row">
                <label className="dp-dailypage-checkbox">
                    <input type="checkbox" checked={filters.amenities.fireplace} onChange={() => toggleCheckbox("amenities", "fireplace")} />
                    <span>Камін</span>
                </label>
                <label className="dp-dailypage-checkbox">
                    <input type="checkbox" checked={filters.amenities.sauna} onChange={() => toggleCheckbox("amenities", "sauna")} />
                    <span>Сауна</span>
                </label>
                <label className="dp-dailypage-checkbox">
                    <input type="checkbox" checked={filters.amenities.vat} onChange={() => toggleCheckbox("amenities", "vat")} />
                    <span>Чан</span>
                </label>
                <label className="dp-dailypage-checkbox">
                    <input type="checkbox" checked={filters.amenities.petsAllowed} onChange={() => toggleCheckbox("amenities", "petsAllowed")} />
                    <span>Можна з тваринами</span>
                </label>
                <label className="dp-dailypage-checkbox">
                    <input type="checkbox" checked={filters.amenities.pool} onChange={() => toggleCheckbox("amenities", "pool")} />
                    <span>Басейн</span>
                </label>
            </div>
        </div>
        <Button className="dp-apply-button" onClick={() => {}}>Застосувати</Button>
    </div>
);

function DailyPage({ isLightTheme }) {
    const [currentPage, setCurrentPage] = useState(1);
    const [showFilters, setShowFilters] = useState(false);
    const [sortOrder, setSortOrder] = useState("default");
    const [filters, setFilters] = useState({
        city: "Kyiv",
        dates: null,
        adults: 1,
        children: 0,
        priceRange: [0, 20000],
        type: {
            room: false,
            cottage: false,
            apartments: false,
        },
        rooms: 1,
        bathrooms: 1,
        amenities: {
            fireplace: false,
            sauna: false,
            vat: false,
            petsAllowed: false,
            pool: false,
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
            sorted.sort((a, b) => a.pricePerNight - b.pricePerNight);
        } else if (sortOrder === "expensive") {
            sorted.sort((a, b) => b.pricePerNight - a.pricePerNight);
        } else if (sortOrder === "newest") {
            sorted.sort((a, b) => b.id - a.id);
        }
        return sorted;
    }, [sortOrder]);
    
    return (
        <>
            <div className={`dp-daily-page-container ${isLightTheme ? 'light-mode' : ''}`}>
                <div className="dp-filter-button-mobile-container">
                    <Button
                      type="primary"
                      onClick={() => setShowFilters(true)}
                      className="dp-filter-button-mobile"
                      icon={<FilterOutlined />}
                    >
                        Показати фільтри
                    </Button>
                </div>
                
                <div className="dp-filters-panel">
                    <FilterContent
                      filters={filters}
                      setFilters={setFilters}
                      toggleCheckbox={toggleCheckbox}
                      isLightTheme={isLightTheme}
                    />
                </div>
                
                <Drawer
                  title={
                    <span style={{ color: isLightTheme ? '#333' : '#fff' }}>
                      Фільтри
                    </span>
                  }
                  placement="left"
                  onClose={() => setShowFilters(false)}
                  visible={showFilters}
                  className={`dp-mobile-drawer ${isLightTheme ? 'light-mode' : ''}`}
                  bodyStyle={{
                    backgroundColor: isLightTheme ? '#f0f2f5' : '#222',
                    color: isLightTheme ? '#333' : '#fff',
                    padding: '1rem'
                  }}
                  headerStyle={{
                    backgroundColor: isLightTheme ? '#fff' : '#1a1a1a',
                    borderBottom: isLightTheme ? '1px solid #ddd' : '1px solid #444'
                  }}
                  closeIcon={<LeftOutlined style={{ color: isLightTheme ? '#333' : '#fff' }} />}
                >
                    <FilterContent
                      filters={filters}
                      setFilters={setFilters}
                      toggleCheckbox={toggleCheckbox}
                      isLightTheme={isLightTheme}
                    />
                </Drawer>
                
                <div className="dp-cards-list-container">
                    <div className="dp-sort-container">
                        <span className="dp-sort-label">Сортувати:</span>
                        <Select
                          value={sortOrder}
                          onChange={(value) => setSortOrder(value)}
                          className="dp-custom-select"
                          style={{ width: '200px' }}
                          dropdownClassName={isLightTheme ? "light-mode" : ""}
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
                                      className="dp-card-hover-animation"
                                      style={{ backgroundColor: isLightTheme ? '#fff' : '#2e2e2e', border: 'none' }}
                                      cover={
                                          <div className="dp-card-image-container">
                                              <img
                                                alt={`Hotel ${item.id}`}
                                                src={item.image || notFoundImagePath}
                                                className="dp-card-image"
                                                onError={(e) => { e.target.onerror = null; e.target.src=notFoundImagePath; }}
                                              />
                                              <div className="dp-price-tag">
                                                  Від {item.pricePerNight} грн/доба
                                              </div>
                                          </div>
                                      }
                                    >
                                    <div className="dp-card-info-section">
                                        <Row gutter={[16, 16]}>
                                            <Col span={8}>
                                                <p className="dp-card-info-value">{item.beds}</p>
                                                <p className="dp-card-info-label">Місць</p>
                                            </Col>
                                            <Col span={8}>
                                                <p className="dp-card-info-value">{item.rooms}</p>
                                                <p className="dp-card-info-label">Кімнати</p>
                                            </Col>
                                            <Col span={8}>
                                                <p className="dp-card-info-value">{item.bathrooms}</p>
                                                <p className="dp-card-info-label">Санвузли</p>
                                            </Col>
                                        </Row>
                                    </div>
                                    <p className="dp-card-city-name">{item.city}</p>
                                    </Card>
                                </Col>
                            );
                        })}
                    </Row>
                    
                    <div className="dp-pagination-group">
                        <Button className="dp-pagination-button" onClick={() => setCurrentPage(currentPage - 1)} icon={<LeftOutlined />} disabled={currentPage === 1} />
                        <span className="dp-pagination-label">Сторінка {currentPage}</span>
                        <Button className="dp-pagination-button" onClick={() => setCurrentPage(currentPage + 1)} icon={<RightOutlined />} />
                    </div>
                </div>
            </div>
        </>
    );
}

export default DailyPage;