import React, { useState, useMemo, useEffect } from "react";
import { Card, Row, Col, Select, Button, InputNumber, Slider, Drawer, message } from "antd";
import { LeftOutlined, RightOutlined, FilterOutlined, HeartOutlined, HeartFilled } from "@ant-design/icons";
import { Link } from 'react-router-dom';
import "antd/dist/reset.css"; // Додано для коректного стилю
import "./MonthlyPage.css";

const { Option } = Select;

const notFoundImagePath = `${process.env.PUBLIC_URL}/images/notfound.png`;

const dummyData = Array.from({ length: 30 }, (_, i) => ({
    id: i + 1,
    image: `/images/hotel${(i % 5) + 1}.jpg`,
    beds: Math.floor(Math.random() * 4) + 2, // 2-5 beds
    rooms: Math.floor(Math.random() * 3) + 1, // 1-3 rooms
    bathrooms: Math.floor(Math.random() * 2) + 1, // 1-2 bathrooms
    city: ["Київ", "Львів", "Одеса", "Харків", "Дніпро"][i % 5],
    pricePerMonth: Math.floor(Math.random() * (50000 - 10000 + 1)) + 10000, // price from 10000 to 50000
    type: ["apartment", "house", "villa"][Math.floor(Math.random() * 3)],
    amenities: {
        fireplace: Math.random() > 0.5,
        parking: Math.random() > 0.5,
        airConditioner: Math.random() > 0.5,
        petsAllowed: Math.random() > 0.5,
    },
}));

const FilterContent = ({ filters, setFilters, toggleCheckbox, isLightTheme, onReset }) => (
    <div className={`mp-filters-panel-content`}>
        <h3 className="mp-panel-title">Фільтри</h3>
        <div className="mp-filter-section">
            <p className="mp-filter-label">Розташування</p>
            <Select
                value={filters.city}
                onChange={(val) => setFilters({ ...filters, city: val })}
                className="mp-custom-select"
                dropdownClassName={isLightTheme ? 'light-theme' : 'dark-theme'}
            >
                <Option value={null}>Всі міста</Option>
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
                    onChange={(val) => setFilters({ ...filters, adults: val })}
                    className="mp-custom-input-number"
                />
            </div>
            <div className="mp-number-input-group">
                <span className="mp-number-input-label">Діти</span>
                <InputNumber
                    min={0}
                    value={filters.children}
                    onChange={(val) => setFilters({ ...filters, children: val })}
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
                onChange={(val) => setFilters({ ...filters, priceRange: val })}
                value={filters.priceRange}
                step={500}
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
                onChange={(val) => setFilters({ ...filters, rooms: val })}
                className="mp-custom-select"
                dropdownClassName={isLightTheme ? 'light-theme' : 'dark-theme'}
            >
                <Option value={null}>Всі</Option>
                {[1, 2, 3, 4, 5].map(n => <Option key={n} value={n}>{n}</Option>)}
            </Select>
        </div>
        <div className="mp-filter-section">
            <p className="mp-filter-label">Кількість санвузлів</p>
            <Select
                value={filters.bathrooms}
                onChange={(val) => setFilters({ ...filters, bathrooms: val })}
                className="mp-custom-select"
                dropdownClassName={isLightTheme ? 'light-theme' : 'dark-theme'}
            >
                <Option value={null}>Всі</Option>
                {[1, 2, 3].map(n => <Option key={n} value={n}>{n}</Option>)}
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
        <div className="mp-filter-buttons">
            <Button className="mp-reset-button" onClick={onReset} style={{ width: '100%', marginBottom: '10px' }}>
                Очистити фільтри
            </Button>
            <Button className="mp-apply-button" style={{ width: '100%', marginTop: 0 }}>
                Застосувати
            </Button>
        </div>
    </div>
);

function MonthlyPage({ isLightTheme }) {
    const itemsPerPage = 15;
    const [currentPage, setCurrentPage] = useState(1);
    const [showFilters, setShowFilters] = useState(false);
    const [sortOrder, setSortOrder] = useState("default");
    const [likedItems, setLikedItems] = useState(() => {
        try {
            const storedLikes = localStorage.getItem('likedItems');
            return storedLikes ? new Set(JSON.parse(storedLikes)) : new Set();
        } catch (error) {
            console.error("Failed to parse liked items from localStorage", error);
            return new Set();
        }
    });

    const [filters, setFilters] = useState({
        city: null,
        adults: 1,
        children: 0,
        priceRange: [0, 50000],
        type: {
            apartment: false,
            house: false,
            villa: false,
        },
        rooms: null,
        bathrooms: null,
        amenities: {
            fireplace: false,
            parking: false,
            airConditioner: false,
            petsAllowed: false,
        },
    });

    useEffect(() => {
        try {
            localStorage.setItem('likedItems', JSON.stringify(Array.from(likedItems)));
        } catch (error) {
            console.error("Failed to save liked items to localStorage", error);
        }
    }, [likedItems]);

    const toggleLike = (id, event) => {
        event.preventDefault();
        event.stopPropagation();

        const newLikedItems = new Set(likedItems);
        if (newLikedItems.has(id)) {
            newLikedItems.delete(id);
            message.info('Ви видалили з обраного');
        } else {
            newLikedItems.add(id);
            message.success('Додано до обраного');
        }
        setLikedItems(newLikedItems);
    };

    const toggleCheckbox = (group, key) => {
        setFilters({
            ...filters,
            [group]: { ...filters[group], [key]: !filters[group][key] }
        });
    };

    const resetFilters = () => {
        setFilters({
            city: null,
            adults: 1,
            children: 0,
            priceRange: [0, 50000],
            type: {
                apartment: false,
                house: false,
                villa: false,
            },
            rooms: null,
            bathrooms: null,
            amenities: {
                fireplace: false,
                parking: false,
                airConditioner: false,
                petsAllowed: false,
            },
        });
    };

    const filteredAndSortedData = useMemo(() => {
        let result = [...dummyData];

        result = result.filter(item => {
            if (filters.city && filters.city !== "Всі міста" && item.city !== filters.city) {
                return false;
            }
            const [minPrice, maxPrice] = filters.priceRange;
            if (item.pricePerMonth < minPrice || item.pricePerMonth > maxPrice) {
                return false;
            }
            if (filters.rooms && item.rooms !== filters.rooms) {
                return false;
            }
            if (filters.bathrooms && item.bathrooms !== filters.bathrooms) {
                return false;
            }
            const selectedTypes = Object.keys(filters.type).filter(key => filters.type[key]);
            if (selectedTypes.length > 0 && !selectedTypes.includes(item.type)) {
                return false;
            }
            const selectedAmenities = Object.keys(filters.amenities).filter(key => filters.amenities[key]);
            for (const amenity of selectedAmenities) {
                if (!item.amenities[amenity]) {
                    return false;
                }
            }
            return true;
        });

        if (sortOrder === "cheapest") {
            result.sort((a, b) => a.pricePerMonth - b.pricePerMonth);
        } else if (sortOrder === "expensive") {
            result.sort((a, b) => b.pricePerMonth - a.pricePerMonth);
        } else if (sortOrder === "newest") {
            result.sort((a, b) => b.id - a.id);
        }

        return result;
    }, [filters, sortOrder]);

    const totalPages = Math.ceil(filteredAndSortedData.length / itemsPerPage);
    const paginatedData = useMemo(() => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        return filteredAndSortedData.slice(startIndex, endIndex);
    }, [filteredAndSortedData, currentPage, itemsPerPage]);

    const themeClass = isLightTheme ? 'light-theme' : 'dark-theme';

    return (
        <div className={`mp-monthly-page-container ${themeClass}`}>
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

            <div className={`mp-filters-panel`}>
                <FilterContent
                    filters={filters}
                    setFilters={setFilters}
                    toggleCheckbox={toggleCheckbox}
                    isLightTheme={isLightTheme}
                    onReset={resetFilters}
                />
            </div>

            <Drawer
                title="Фільтри"
                placement="left"
                onClose={() => setShowFilters(false)}
                visible={showFilters}
                className={`mp-mobile-drawer ${themeClass}`}
                bodyStyle={{ backgroundColor: isLightTheme ? '#f0f2f5' : '#222', color: isLightTheme ? '#000' : '#fff', padding: '1rem' }}
                headerStyle={{ backgroundColor: isLightTheme ? '#fff' : '#1a1a1a', borderBottom: `1px solid ${isLightTheme ? '#ddd' : '#444'}` }}
                closeIcon={<LeftOutlined style={{ color: isLightTheme ? '#000' : '#fff' }} />}
            >
                <FilterContent
                    filters={filters}
                    setFilters={setFilters}
                    toggleCheckbox={toggleCheckbox}
                    isLightTheme={isLightTheme}
                    onReset={resetFilters}
                />
            </Drawer>

            <div className="mp-cards-list-container">
                <h2 className="mp-title">Помісячна оренда</h2>
                <div className="mp-sort-container">
                    <span className="mp-sort-label">Сортувати:</span>
                    <Select
                        value={sortOrder}
                        onChange={(value) => setSortOrder(value)}
                        className="mp-custom-select"
                        style={{ width: '200px' }}
                        dropdownClassName={themeClass}
                    >
                        <Option value="default">за замовчуванням</Option>
                        <Option value="cheapest">спочатку дешевші</Option>
                        <Option value="expensive">спочатку дорожчі</Option>
                        <Option value="newest">новинки</Option>
                    </Select>
                </div>

                <Row gutter={[16, 16]}>
                    {paginatedData.length > 0 ? (
                        paginatedData.map(item => (
                            <Col xs={24} sm={12} md={8} key={item.id}>
                                <Link to={`/listing-monthly/${item.id}`} className="mp-card-link">
                                    <Card
                                        hoverable
                                        className={`mp-card-hover-animation`}
                                        style={{ backgroundColor: isLightTheme ? '#fff' : '#2e2e2e', border: 'none' }}
                                        cover={
                                            <div className="mp-card-image-container">
                                                <img
                                                    alt={`Apartment ${item.id}`}
                                                    src={item.image || notFoundImagePath}
                                                    className="mp-card-image"
                                                    onError={(e) => { e.target.onerror = null; e.target.src = notFoundImagePath; }}
                                                />
                                                <Button
                                                    className="mp-favorite-button"
                                                    type="text"
                                                    onClick={(e) => toggleLike(item.id, e)}
                                                >
                                                    {likedItems.has(item.id) ? (
                                                        <HeartFilled style={{ color: 'red' }} />
                                                    ) : (
                                                        <HeartOutlined className={isLightTheme ? '' : 'mp-heart-outline-dark'} />
                                                    )}
                                                </Button>
                                                <div className="mp-price-tag" style={{ backgroundColor: 'rgba(0, 0, 0, 0.6)' }}>
                                                    Від {item.pricePerMonth} грн/місяць
                                                </div>
                                            </div>
                                        }
                                    >
                                        <div className="dp-card-info-section" style={{marginTop: 0}}>
                                            <Row gutter={[16, 16]}>
                                                <Col span={8}>
                                                    <p className="mp-card-info-value" style={{ color: '#4CAF50' }}>{item.beds}</p>
                                                    <p className="mp-card-info-label" style={{ color: isLightTheme ? '#666' : '#ccc' }}>Місць</p>
                                                </Col>
                                                <Col span={8}>
                                                    <p className="mp-card-info-value" style={{ color: '#4CAF50' }}>{item.rooms}</p>
                                                    <p className="mp-card-info-label" style={{ color: isLightTheme ? '#666' : '#ccc' }}>Кімнати</p>
                                                </Col>
                                                <Col span={8}>
                                                    <p className="mp-card-info-value" style={{ color: '#4CAF50' }}>{item.bathrooms}</p>
                                                    <p className="mp-card-info-label" style={{ color: isLightTheme ? '#666' : '#ccc' }}>Санвузли</p>
                                                </Col>
                                            </Row>
                                        </div>
                                        <p className="mp-card-city-name" style={{ color: isLightTheme ? '#000' : '#fff' }}>{item.city}</p>
                                    </Card>
                                </Link>
                            </Col>
                        ))
                    ) : (
                        <Col span={24}>
                            <div className="mp-no-results" style={{ border: `1px dashed ${isLightTheme ? '#ccc' : '#444'}`, color: isLightTheme ? '#888' : '#888' }}>
                                На жаль, за вашим запитом нічого не знайдено.
                            </div>
                        </Col>
                    )}
                </Row>

                <div className="mp-pagination-group">
                    <Button
                        className={`mp-pagination-button ${themeClass}`}
                        onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                        icon={<LeftOutlined />}
                        disabled={currentPage === 1}
                    />
                    <span className={`mp-pagination-label`}>Сторінка {currentPage} з {totalPages}</span>
                    <Button
                        className={`mp-pagination-button ${themeClass}`}
                        onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                        icon={<RightOutlined />}
                        disabled={currentPage === totalPages || totalPages === 0}
                    />
                </div>
            </div>
        </div>
    );
}

export default MonthlyPage;