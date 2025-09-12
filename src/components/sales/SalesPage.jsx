import React, { useState, useMemo, useEffect } from "react";
import { Card, Row, Col, Select, Button, Slider, Drawer, Spin, Alert } from "antd";
import { LeftOutlined, RightOutlined, FilterOutlined, HeartOutlined, HeartFilled } from "@ant-design/icons";
import { Link, useSearchParams } from 'react-router-dom';
import "antd/dist/reset.css";
import "./SalesPage.css";

import { dispatchFavoriteUpdate } from '../../layout/header&footer/Header';

const { Option } = Select;

const notFoundImagePath = `${process.env.PUBLIC_URL}/images/notfound.png`;
const API_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080';

const typeKeyMapping = {
    apartment: 'Квартира',
    house: 'Будинок',
    villa: 'Вілла'
};

const typeValueMapping = typeKeyMapping;

const amenitiesKeyMapping = {
    fireplace: 'Камін',
    parking: 'Паркінг',
    airConditioner: 'Кондиціонер',
    petsAllowed: 'Можна з тваринами',
};

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
            <p className="mp-filter-label">Ціна</p>
            <Slider
                range
                min={0}
                max={500000}
                defaultValue={[0, 500000]}
                onChange={(val) => setFilters({ ...filters, priceRange: val })}
                value={filters.priceRange}
                step={1000}
            />
            <div className="mp-slider-label-group">
                <span>{filters.priceRange[0]} $</span>
                <span>{filters.priceRange[1]} $</span>
            </div>
        </div>
        <div className="mp-filter-section">
            <p className="mp-filter-label">Тип житла</p>
            <div className="mp-filter-row">
                {Object.entries(typeKeyMapping).map(([key, label]) => (
                    <label className="mp-monthlypage-checkbox" key={key}>
                        <input
                            type="checkbox"
                            checked={filters.type[key] || false}
                            onChange={() => toggleCheckbox("type", key)}
                        />
                        <span>{label}</span>
                    </label>
                ))}
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
                {Object.entries(amenitiesKeyMapping).map(([key, label]) => (
                    <label className="mp-monthlypage-checkbox" key={key}>
                        <input
                            type="checkbox"
                            checked={filters.amenities[key] || false}
                            onChange={() => toggleCheckbox("amenities", key)}
                        />
                        <span>{label}</span>
                    </label>
                ))}
            </div>
        </div>
        <div className="dp-filter-buttons">
            <Button className="dp-reset-button" onClick={onReset} style={{ width: '100%', marginBottom: '10px' }}>
                Очистити фільтри
            </Button>
        </div>
    </div>
);

const initialFilters = {
    city: null,
    priceRange: [0, 500000],
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
};

function SalesPage({ isLightTheme }) {
    const itemsPerPage = 15;
    const [currentPage, setCurrentPage] = useState(1);
    const [showFilters, setShowFilters] = useState(false);
    
    const [likedItems, setLikedItems] = useState(() => {
        try {
            const storedLikes = localStorage.getItem('likedItemsSales');
            return storedLikes ? new Set(JSON.parse(storedLikes)) : new Set();
        } catch (error) {
            console.error("Помилка при парсингу вподобань з localStorage", error);
            return new Set();
        }
    });

    const [sortOrder, setSortOrder] = useState(() => {
        const storedSort = localStorage.getItem('SalesSortOrder');
        return storedSort || "default";
    });

    const [filters, setFilters] = useState(initialFilters);

    const [listings, setListings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [searchParams] = useSearchParams();

    // Sync filters with URL parameters
    useEffect(() => {
        const cityParam = searchParams.get('location');
        const typeParam = searchParams.get('propertyType');
        const petsAllowedParam = searchParams.get('petsAllowed');

        setFilters(prevFilters => {
            const newType = { ...initialFilters.type };
            if (typeParam && newType.hasOwnProperty(typeParam)) {
                newType[typeParam] = true;
            }

            const newAmenities = { ...initialFilters.amenities };
            if (petsAllowedParam === 'true') {
                newAmenities.petsAllowed = true;
            }

            return {
                ...initialFilters,
                city: cityParam || initialFilters.city,
                type: newType,
                amenities: newAmenities,
            };
        });
    }, [searchParams]);

    // Sync filters with localStorage
    useEffect(() => {
        localStorage.setItem('SalesFilters', JSON.stringify(filters));
        setCurrentPage(1);
    }, [filters]);

    // Sync sort order with localStorage
    useEffect(() => {
        localStorage.setItem('SalesSortOrder', sortOrder);
        setCurrentPage(1);
    }, [sortOrder]);

    // Sync liked items with localStorage
    useEffect(() => {
        try {
            localStorage.setItem('likedItemsSales', JSON.stringify(Array.from(likedItems)));
            dispatchFavoriteUpdate();
        } catch (error) {
            console.error("Помилка при збереженні вподобань в localStorage", error);
        }
    }, [likedItems]);

    // Fetch all sales listings
    useEffect(() => {
        const fetchListings = async () => {
            setLoading(true);
            try {
                const response = await fetch(`${API_URL}/api/sales/all/active`, {
                    method: 'GET',
                    credentials: 'include',
                });
                console.log('Fetch listings response:', response);
                if (!response.ok) {
                    throw new Error(`Помилка завантаження оголошень: ${response.status}`);
                }
                const data = await response.json();
                console.log('Fetched listings:', data);
                setListings(data);
                setError(null);
            } catch (err) {
                console.error("Помилка при завантаженні оголошень:", err);
                setError(`Не вдалося завантажити оголошення: ${err.message}. Спробуйте пізніше.`);
            } finally {
                setLoading(false);
            }
        };

        fetchListings();
    }, []);

    const toggleLike = (id, event) => {
        event.preventDefault();
        event.stopPropagation();
        const newLikedItems = new Set(likedItems);
        const itemId = String(id);
        if (newLikedItems.has(itemId)) {
            newLikedItems.delete(itemId);
        } else {
            newLikedItems.add(itemId);
        }
        setLikedItems(newLikedItems);
    };

    const toggleCheckbox = (group, key) => {
        setFilters(prevFilters => {
            const newGroup = { ...initialFilters[group] };
            newGroup[key] = !prevFilters[group][key];
            return {
                ...prevFilters,
                [group]: newGroup
            };
        });
    };

    const resetFilters = () => {
        setFilters(initialFilters);
    };

    const filteredAndSortedData = useMemo(() => {
        let result = [...listings];

        console.log('Raw listings before filtering:', result);

        result = result.filter(item => {
            // Include active and pending listings
            if (!['active', 'pending'].includes(item.status)) {
                return false;
            }

            const itemCity = item.location ? item.location.city : null;
            if (filters.city && itemCity !== filters.city) {
                return false;
            }

            const [minPrice, maxPrice] = filters.priceRange;
            if (item.basePrice < minPrice || item.basePrice > maxPrice) {
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
                const selectedUkrainianTypes = selectedTypes.map(key => typeValueMapping[key]);
                if (!selectedUkrainianTypes.includes(item.type)) {
                    return false;
                }
            }

            const selectedAmenities = Object.keys(filters.amenities).filter(key => filters.amenities[key]);
            for (const amenity of selectedAmenities) {
                if (amenity === 'petsAllowed') {
                    if (!item.rules || !item.rules.includes('petsAllowed')) {
                        return false;
                    }
                } else {
                    const ukrainianAmenityName = amenitiesKeyMapping[amenity];
                    if (!item.amenities || !item.amenities.includes(ukrainianAmenityName)) {
                        return false;
                    }
                }
            }

            return true;
        });

        console.log('Filtered listings:', result);

        if (sortOrder === "cheapest") {
            result.sort((a, b) => a.basePrice - b.basePrice);
        } else if (sortOrder === "expensive") {
            result.sort((a, b) => b.basePrice - a.basePrice);
        } else if (sortOrder === "newest") {
            result.sort((a, b) => {
                const idA = a.id ? parseInt(a.id.split('-')[0]) : 0;
                const idB = b.id ? parseInt(b.id.split('-')[0]) : 0;
                return idB - idA;
            });
        }

        return result;
    }, [filters, sortOrder, listings]);

    const totalPages = Math.ceil(filteredAndSortedData.length / itemsPerPage);
    const paginatedData = useMemo(() => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        const paginated = filteredAndSortedData.slice(startIndex, endIndex);
        console.log('Paginated data:', paginated);
        return paginated;
    }, [filteredAndSortedData, currentPage, itemsPerPage]);

    const themeClass = isLightTheme ? 'light-theme' : 'dark-theme';

    const getPhotoSrc = (item) => {
        if (item.photos && Array.isArray(item.photos) && item.photos.length > 0 && item.photos[0]) {
            return item.photos[0].startsWith('http') ? item.photos[0] : `${API_URL}${item.photos[0]}`;
        }
        return notFoundImagePath;
    };

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
                <h2 className="mp-title">Продаж</h2>
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

                {loading ? (
                    <div style={{ textAlign: 'center', padding: '50px 0' }}>
                        <Spin size="large" />
                        <p style={{ marginTop: '10px' }}>Завантаження оголошень...</p>
                    </div>
                ) : error ? (
                    <div className="mp-error-container">
                        <Alert message="Помилка" description={error} type="error" showIcon />
                    </div>
                ) : (
                    <Row gutter={[16, 16]}>
                        {paginatedData.length > 0 ? (
                            paginatedData.map(item => {
                                const photoSrc = getPhotoSrc(item);
                                return (
                                    <Col xs={24} sm={12} md={8} key={item.id}>
                                        <Link to={`/sale/${item.id}`} className="mp-card-link">
                                            <Card
                                                hoverable
                                                className={`mp-card-hover-animation`}
                                                style={{ backgroundColor: isLightTheme ? '#fff' : '#2e2e2e', border: 'none' }}
                                                cover={
                                                    <div className="mp-card-image-container">
                                                        <img
                                                            alt={`Оголошення ${item.id}`}
                                                            src={photoSrc}
                                                            className="mp-card-image"
                                                            onError={(e) => { 
                                                                console.error(`Помилка завантаження зображення для оголошення ${item.id}: ${photoSrc}`);
                                                                e.target.onerror = null; 
                                                                e.target.src = notFoundImagePath; 
                                                            }}
                                                        />
                                                        <Button
                                                            className="mp-favorite-button"
                                                            type="text"
                                                            onClick={(e) => toggleLike(item.id, e)}
                                                        >
                                                            {likedItems.has(String(item.id)) ? (
                                                                <HeartFilled style={{ color: 'red' }} />
                                                            ) : (
                                                                <HeartOutlined className={isLightTheme ? '' : 'mp-heart-outline-dark'} />
                                                            )}
                                                        </Button>
                                                        <div className="mp-price-tag" style={{ backgroundColor: 'rgba(0, 0, 0, 0.6)' }}>
                                                            ${item.basePrice}
                                                        </div>
                                                    </div>
                                                }
                                            >
                                                <div className="dp-card-info-section" style={{ marginTop: 0 }}>
                                                    <Row gutter={[16, 16]}>
                                                        <Col span={12}>
                                                            <p className="mp-card-info-value" style={{ color: '#4CAF50' }}>{item.rooms}</p>
                                                            <p className="mp-card-info-label" style={{ color: isLightTheme ? '#666' : '#ccc' }}>Кімнати</p>
                                                        </Col>
                                                        <Col span={12}>
                                                            <p className="mp-card-info-value" style={{ color: '#4CAF50' }}>{item.bathrooms}</p>
                                                            <p className="mp-card-info-label" style={{ color: isLightTheme ? '#666' : '#ccc' }}>Санвузли</p>
                                                        </Col>
                                                    </Row>
                                                </div>
                                                <p className="mp-card-city-name" style={{ color: isLightTheme ? '#000' : '#fff' }}>{item.location ? item.location.city : 'Невідоме місто'}</p>
                                            </Card>
                                        </Link>
                                    </Col>
                                );
                            })
                        ) : (
                            <Col span={24}>
                                <div className="mp-no-results" style={{ border: `1px dashed ${isLightTheme ? '#ccc' : '#444'}`, color: isLightTheme ? '#888' : '#888' }}>
                                    На жаль, за вашим запитом нічого не знайдено.
                                </div>
                            </Col>
                        )}
                    </Row>
                )}

                {!loading && filteredAndSortedData.length > 0 && (
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
                )}
            </div>
        </div>
    );
}

export default SalesPage;