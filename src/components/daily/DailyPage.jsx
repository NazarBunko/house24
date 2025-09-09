import React, { useState, useMemo, useEffect } from "react";
import { Card, Row, Col, Select, Button, InputNumber, Slider, DatePicker as AntdDatePicker, Drawer, message, Spin, Alert } from "antd";
import { LeftOutlined, RightOutlined, FilterOutlined, HeartOutlined, HeartFilled } from "@ant-design/icons";
import { Link, useSearchParams } from 'react-router-dom';
import "antd/dist/reset.css";
import "./DailyPage.css";
import dayjs from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import { dispatchFavoriteUpdate } from '../../layout/header&footer/Header';

dayjs.extend(isBetween);
dayjs.extend(isSameOrBefore);
dayjs.extend(isSameOrAfter);

const { Option } = Select;
const notFoundImagePath = `${process.env.PUBLIC_URL}/images/notfound.png`;
const API_URL = process.env.REACT_APP_API_URL;

const typeKeyMapping = {
    hotel: 'Готель',
    apartment: 'Квартира',
    hostel: 'Хостел',
    miniHotel: 'Міні готель',
    privateEstate: 'Приватна садиба',
    villa: 'Вілла',
    cottage: 'Котедж',
    resort: 'База відпочинку',
    chalet: 'Шале',
    spaHotel: 'Спа готель'
};
const typeFullNames = Object.values(typeKeyMapping);

const FilterContent = ({ filters, setFilters, toggleCheckbox, isLightTheme, onReset }) => (
    <div className="dp-filters-panel-content">
        <h3 className="dp-panel-title">Фільтри</h3>
        <div className="dp-filter-section">
            <p className="dp-filter-label">Розташування</p>
            <Select
                value={filters.city}
                onChange={(val) => setFilters({ ...filters, city: val })}
                className="dp-custom-select"
                dropdownClassName={isLightTheme ? "light-mode" : "dark-mode"}
            >
                <Option value={null}>Всі міста</Option>
                {["Київ", "Львів", "Одеса", "Харків", "Дніпро"].map(c => <Option key={c} value={c}>{c}</Option>)}
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
                    filters.checkIn ? current && current.isSameOrBefore(filters.checkIn, "day") : false
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
                    onChange={(val) => setFilters({ ...filters, adults: val })}
                    className="dp-custom-input-number"
                />
            </div>
            <div className="dp-number-input-group">
                <span className="dp-number-input-label">Діти</span>
                <InputNumber
                    min={0}
                    value={filters.children}
                    onChange={(val) => setFilters({ ...filters, children: val })}
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
                value={filters.priceRange}
                onChange={(val) => setFilters({ ...filters, priceRange: val })}
            />
            <div className="dp-slider-label-group">
                <span>{filters.priceRange[0]} грн</span>
                <span>{filters.priceRange[1]} грн</span>
            </div>
        </div>
        <div className="dp-filter-section">
            <p className="dp-filter-label">Тип житла</p>
            <div className="dp-filter-row">
                {typeFullNames.map(type => (
                    <label className="dp-dailypage-checkbox" key={type}>
                        <input
                            type="checkbox"
                            checked={filters.type[type]}
                            onChange={() => toggleCheckbox("type", type)}
                        />
                        <span>{type}</span>
                    </label>
                ))}
            </div>
        </div>
        <div className="dp-filter-section">
            <p className="dp-filter-label">Кількість кімнат</p>
            <Select
                value={filters.rooms}
                onChange={(val) => setFilters({ ...filters, rooms: val })}
                className="dp-custom-select"
                dropdownClassName={isLightTheme ? 'light-theme' : 'dark-theme'}
            >
                <Option value={null}>Всі</Option>
                {[1, 2, 3, 4, 5].map(n => <Option key={n} value={n}>{n}</Option>)}
            </Select>
        </div>
        <div className="dp-filter-section">
            <p className="dp-filter-label">Кількість санвузлів</p>
            <Select
                value={filters.bathrooms}
                onChange={(val) => setFilters({ ...filters, bathrooms: val })}
                className="dp-custom-select"
                dropdownClassName={isLightTheme ? 'light-theme' : 'dark-theme'}
            >
                <Option value={null}>Всі</Option>
                {[1, 2, 3].map(n => <Option key={n} value={n}>{n}</Option>)}
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
        <div className="dp-filter-buttons">
            <Button className="dp-reset-button" onClick={onReset} style={{ width: '100%' }}>
                Очистити фільтри
            </Button>
        </div>
    </div>
);

function DailyPage({ isLightTheme }) {
    const itemsPerPage = 15;
    const [currentPage, setCurrentPage] = useState(1);
    const [showFilters, setShowFilters] = useState(false);
    const [sortOrder, setSortOrder] = useState("default");

    const [likedItems, setLikedItems] = useState(() => {
        try {
            const storedLikes = localStorage.getItem('likedItemsDaily');
            return storedLikes ? new Set(JSON.parse(storedLikes)) : new Set();
        } catch (error) {
            console.error("Failed to parse liked items from localStorage", error);
            return new Set();
        }
    });

    const [dailyListings, setDailyListings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const initialTypeFilters = useMemo(() => {
        return typeFullNames.reduce((acc, type) => {
            acc[type] = false;
            return acc;
        }, {});
    }, []);

    const initialFilters = useMemo(() => ({
        city: null,
        checkIn: null,
        checkOut: null,
        adults: 1,
        children: 0,
        priceRange: [0, 20000],
        type: initialTypeFilters,
        rooms: null,
        bathrooms: null,
        amenities: {
            fireplace: false,
            sauna: false,
            vat: false,
            petsAllowed: false,
            pool: false,
        },
    }), [initialTypeFilters]);

    const [searchParams] = useSearchParams();
    const [filters, setFilters] = useState(initialFilters);

    useEffect(() => {
        const cityParam = searchParams.get('location');
        const checkInParam = searchParams.get('checkIn');
        const checkOutParam = searchParams.get('checkOut');
        const adultsParam = searchParams.get('adults');
        const childrenParam = searchParams.get('children');

        const newFilters = {
            ...initialFilters,
            city: cityParam || null,
            checkIn: checkInParam ? dayjs(checkInParam) : null,
            checkOut: checkOutParam ? dayjs(checkOutParam) : null,
            adults: adultsParam ? parseInt(adultsParam, 10) : 1,
            children: childrenParam ? parseInt(childrenParam, 10) : 0,
        };
        setFilters(newFilters);
    }, [searchParams, initialFilters]);

    useEffect(() => {
        const fetchListings = async () => {
            try {
                setLoading(true);
                const response = await fetch(`${API_URL}/daily-listings`);
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                const data = await response.json();
                
                // --- Start of the added code ---
                // Filter the listings to only include those with status 'active'
                const activeListings = data.filter(item => item.status === 'active');
                // --- End of the added code ---
                
                const formattedData = activeListings.map(item => ({
                    ...item,
                    id: item.id,
                    image: item.photos && item.photos.length > 0 ? `${item.photos[0]}` : notFoundImagePath,
                    pricePerNight: item.basePrice,
                    city: item.location.city,
                    beds: item.beds,
                    rooms: item.rooms,
                    bathrooms: item.bathrooms,
                    amenities: {
                        fireplace: item.amenities?.['Комфорт']?.['Камін'] || false,
                        sauna: item.amenities?.['Комфорт']?.['Сауна'] || false,
                        vat: item.amenities?.['Комфорт']?.['Чан'] || false,
                        petsAllowed: item.rules?.['Можна з тваринами'] || false,
                        pool: item.amenities?.['Зручності на території']?.['Басейн'] || false,
                    },
                    bookedDates: item.bookedDates || []
                }));
                setDailyListings(formattedData);
            } catch (err) {
                console.error("Failed to fetch listings:", err);
                setError("Не вдалося завантажити оголошення.");
                message.error("Не вдалося завантажити оголошення.");
            } finally {
                setLoading(false);
            }
        };
        fetchListings();
    }, []);

    useEffect(() => {
        try {
            localStorage.setItem('likedItemsDaily', JSON.stringify(Array.from(likedItems)));
            localStorage.getItem('likedItemsSales');
            dispatchFavoriteUpdate();
        } catch (error) {
            console.error("Помилка при збереженні вподобань в localStorage", error);
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
        setFilters(initialFilters);
    };

    const filteredAndSortedData = useMemo(() => {
        let result = [...dailyListings];
        const totalGuests = filters.adults + filters.children;

        result = result.filter(item => {
            if (filters.city && item.city !== filters.city) {
                return false;
            }

            if (item.pricePerNight < filters.priceRange[0] || item.pricePerNight > filters.priceRange[1]) {
                return false;
            }
            
            if (item.beds < totalGuests) {
                return false;
            }

            if (filters.rooms && item.rooms !== filters.rooms) {
                return false;
            }

            if (filters.bathrooms && item.bathrooms !== filters.bathrooms) {
                return false;
            }
            
            const selectedTypes = Object.keys(filters.type).filter(key => filters.type[key]);
            if (selectedTypes.length > 0) {
                const matchesType = selectedTypes.some(typeKey => item.type.includes(typeKey));
                if (!matchesType) {
                    return false;
                }
            }
            
            const selectedAmenities = Object.keys(filters.amenities).filter(key => filters.amenities[key]);
            for (const amenity of selectedAmenities) {
                if (!item.amenities?.[amenity]) {
                    return false;
                }
            }

            if (filters.checkIn && filters.checkOut) {
                const checkInDate = dayjs(filters.checkIn);
                const checkOutDate = dayjs(filters.checkOut);
                
                const isBooked = item.bookedDates.some(bookedDateStr => {
                    const bookedDate = dayjs(bookedDateStr);
                    return bookedDate.isBetween(checkInDate, checkOutDate, 'day', '[)');
                });

                if (isBooked) {
                    return false;
                }
            }

            return true;
        });

        if (sortOrder === "cheapest") {
            result.sort((a, b) => a.pricePerNight - b.pricePerNight);
        } else if (sortOrder === "expensive") {
            result.sort((a, b) => b.pricePerNight - a.pricePerNight);
        } else if (sortOrder === "newest") {
            result.sort((a, b) => parseInt(b.id) - parseInt(a.id));
        }
        
        return result;
    }, [dailyListings, filters, sortOrder]);

    const totalPages = Math.ceil(filteredAndSortedData.length / itemsPerPage);
    const paginatedData = useMemo(() => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        return filteredAndSortedData.slice(startIndex, endIndex);
    }, [filteredAndSortedData, currentPage, itemsPerPage]);

    const themeClass = isLightTheme ? 'light-mode' : 'dark-mode';

    return (
        <div className={`dp-daily-page-container ${themeClass}`}>
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
                    onReset={resetFilters}
                />
            </div>
            
            <Drawer
                title={<span style={{ color: isLightTheme ? '#333' : '#fff' }}>Фільтри</span>}
                placement="left"
                onClose={() => setShowFilters(false)}
                visible={showFilters}
                className={`dp-mobile-drawer ${themeClass}`}
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
                    onReset={resetFilters}
                />
            </Drawer>
            
            <div className="dp-cards-list-container">
                <h2 className="dp-title">Подобова оренда</h2>
                <div className="dp-controls-container">
                    <div className="dp-sort-container">
                        <span className="dp-sort-label">Сортувати:</span>
                        <Select
                            value={sortOrder}
                            onChange={(value) => setSortOrder(value)}
                            className="dp-custom-select"
                            style={{ width: '200px' }}
                            dropdownClassName={themeClass}
                        >
                            <Option value="default">за замовчуванням</Option>
                            <Option value="cheapest">спочатку дешевші</Option>
                            <Option value="expensive">спочатку дорожчі</Option>
                            <Option value="newest">новинки</Option>
                        </Select>
                    </div>
                </div>
                
                {loading ? (
                    <div style={{ textAlign: 'center', padding: '50px 0' }}>
                        <Spin size="large" />
                        <p style={{ marginTop: '10px' }}>Завантаження оголошень...</p>
                    </div>
                ) : error ? (
                    <div className="mp-error-container">
                        <Alert message="Помилка" description={error} type="error" showIcon />
                    </div>
                ) : paginatedData.length > 0 ? (
                    <Row gutter={[16, 16]}>
                        {paginatedData.map(item => (
                            <Col xs={24} sm={12} md={8} key={item.id}>
                                <Link to={`/listing-daily/${item.id}`}>
                                    <Card
                                        hoverable
                                        className="dp-card-hover-animation"
                                        style={{ backgroundColor: isLightTheme ? '#fff' : '#2e2e2e', border: 'none' }}
                                        cover={
                                            <div className="dp-card-image-container">
                                                <img
                                                    alt={`Hotel ${item.id}`}
                                                    src={item.image}
                                                    className="dp-card-image"
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
                                                <div className="dp-price-tag">
                                                    Від {item.pricePerNight} грн/доба
                                                </div>
                                            </div>
                                        }
                                    >
                                        <div className="dp-card-info-section" style={{ marginTop: 0 }}>
                                            <Row gutter={[16, 16]}>
                                                <Col span={8}>
                                                    <p className="dp-card-info-value" style={{ color: isLightTheme ? '#4CAF50' : '#4CAF50' }}>{item.beds}</p>
                                                    <p className="dp-card-info-label" style={{ color: isLightTheme ? '#666' : '#ccc' }}>Місць</p>
                                                </Col>
                                                <Col span={8}>
                                                    <p className="dp-card-info-value" style={{ color: isLightTheme ? '#4CAF50' : '#4CAF50' }}>{item.rooms}</p>
                                                    <p className="dp-card-info-label" style={{ color: isLightTheme ? '#666' : '#ccc' }}>Кімнати</p>
                                                </Col>
                                                <Col span={8}>
                                                    <p className="dp-card-info-value" style={{ color: isLightTheme ? '#4CAF50' : '#4CAF50' }}>{item.bathrooms}</p>
                                                    <p className="dp-card-info-label" style={{ color: isLightTheme ? '#666' : '#ccc' }}>Санвузли</p>
                                                </Col>
                                            </Row>
                                        </div>
                                        <p className="dp-card-city-name" style={{ color: isLightTheme ? '#000' : '#fff' }}>{item.city}</p>
                                    </Card>
                                </Link>
                            </Col>
                        ))}
                    </Row>
                ) : (
                    <Col span={24}>
                        <div className="dp-no-results" style={{ border: `1px dashed ${isLightTheme ? '#ccc' : '#444'}`, color: isLightTheme ? '#888' : '#888' }}>
                            На жаль, за вашим запитом нічого не знайдено.
                        </div>
                    </Col>
                )}
                
                {(!loading && !error && paginatedData.length > 0) && (
                    <div className="dp-pagination-group">
                        <Button 
                            className={`dp-pagination-button ${themeClass}`}
                            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))} 
                            icon={<LeftOutlined />} 
                            disabled={currentPage === 1}
                        />
                        <span className={`dp-pagination-label`}>Сторінка {currentPage} з {totalPages}</span>
                        <Button 
                            className={`dp-pagination-button ${themeClass}`}
                            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))} 
                            icon={<RightOutlined />} 
                            disabled={currentPage === totalPages || totalPages === 0}
                        />
                    </div>
                )}
            </div>
        </div>
    );
}

export default DailyPage;