import React, { useState, useEffect, useMemo } from 'react';
import { Card, Col, Row, Select, Spin } from 'antd';
import "./styles/WishList.css"

const { Option } = Select;
const notFoundImagePath = `${process.env.PUBLIC_URL}/images/notfound.png`;

const generateMockListings = (count) => {
  const cities = ['Київ', 'Львів', 'Одеса', 'Дніпро', 'Харків', 'Мукачево', 'Полтава', 'Івано-Франківськ', 'Тернопіль', 'Чернівці'];
  const listings = [];
  for (let i = 1; i <= count; i++) {
    const isMonthly = Math.random() < 0.5;
    const price = isMonthly ? Math.floor(Math.random() * 30000) + 100 : Math.floor(Math.random() * 2000) + 200;
    listings.push({
      id: i,
      title: isMonthly ? 'Квартира помісячно' : 'Квартира подобово',
      image: null,
      is_daily: !isMonthly,
      is_monthly: isMonthly,
      price_per_day: !isMonthly ? price : null,
      price_per_month: isMonthly ? price : null,
      beds: Math.floor(Math.random() * 4) + 1,
      rooms: Math.floor(Math.random() * 5) + 1,
      bathrooms: Math.floor(Math.random() * 3) + 1,
      city: cities[Math.floor(Math.random() * cities.length)],
    });
  }
  return listings;
};

const WishList = ({ isLightTheme }) => {
  const [sortOption, setSortOption] = useState('price_asc');
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchListings = () => {
      setLoading(true);
      setTimeout(() => {
        setListings(generateMockListings(20));
        setLoading(false);
      }, 1000);
    };
    fetchListings();
  }, []);

  const sortedListings = useMemo(() => {
    const sorted = [...listings];
    const getPrice = (item) => item.price_per_day ?? item.price_per_month ?? 0;
    switch (sortOption) {
      case "price_asc":
        sorted.sort((a, b) => getPrice(a) - getPrice(b));
        break;
      case "price_desc":
        sorted.sort((a, b) => getPrice(b) - getPrice(a));
        break;
      case "daily_first":
        sorted.sort((a, b) => Number(b.is_daily) - Number(a.is_daily));
        break;
      case "monthly_first":
        sorted.sort((a, b) => Number(b.is_monthly) - Number(a.is_monthly));
        break;
      default:
        break;
    }
    return sorted;
  }, [listings, sortOption]);

  const themeClass = isLightTheme ? 'light-theme' : 'dark-theme';
  const dropdownClass = isLightTheme ? 'light-theme-dropdown' : 'dark-theme-dropdown';

  return (
    <>
      <div className={`lkd-liked-page-container ${themeClass}`}>
        <div className="lkd-header-container">
          <h1 className="lkd-page-title">Вибрані оголошення</h1>
          <div className="lkd-sort-container">
            <label className="lkd-sort-label">Сортувати:</label>
            <Select
              value={sortOption}
              onChange={value => setSortOption(value)}
              className="lkd-custom-select"
              dropdownClassName={dropdownClass}
              style={{ width: 200 }}
            >
              <Option value="price_asc">За зростанням ціни</Option>
              <Option value="price_desc">За спаданням ціни</Option>
              <Option value="daily_first">Спочатку подобова</Option>
              <Option value="monthly_first">Спочатку помісячна</Option>
            </Select>
          </div>
        </div>
        {loading ? (
          <div className="lkd-loading-container">
            <Spin size="large" />
          </div>
        ) : (
          <Row gutter={[24, 24]}>
            {sortedListings.map(listing => (
              <Col key={listing.id} xs={24} sm={12} md={8} lg={6} className="dp-card-hover-animation">
                <Card
                  hoverable
                  className="dp-card-hover-animation"
                  cover={
                    <div className="dp-card-image-container">
                      <img
                        alt={listing.title}
                        src={listing.image || notFoundImagePath}
                        className="dp-card-image"
                        onError={(e) => { e.target.onerror = null; e.target.src = notFoundImagePath; }}
                      />
                      <div className="dp-price-tag">
                        {listing.is_daily ? `Від ${listing.price_per_day}грн/доба` : `Від ${listing.price_per_month}грн/місяць`}
                      </div>
                    </div>
                  }
                >
                  <div className="dp-card-info-section">
                    <Row gutter={[16, 16]}>
                      <Col span={8}>
                        <p className="dp-card-info-value">{listing.beds}</p>
                        <p className="dp-card-info-label">Місць</p>
                      </Col>
                      <Col span={8}>
                        <p className="dp-card-info-value">{listing.rooms}</p>
                        <p className="dp-card-info-label">Кімнати</p>
                      </Col>
                      <Col span={8}>
                        <p className="dp-card-info-value">{listing.bathrooms}</p>
                        <p className="dp-card-info-label">Санвузли</p>
                      </Col>
                    </Row>
                  </div>
                  <p className="dp-card-city-name">{listing.city}</p>
                </Card>
              </Col>
            ))}
          </Row>
        )}
      </div>
    </>
  );
};

export default WishList;