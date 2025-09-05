import React, { useState, useEffect, useMemo } from 'react';
import { Card, Col, Row, Select, Spin, message } from 'antd';
import "./WishList.css"

const { Option } = Select;
const notFoundImagePath = `${process.env.PUBLIC_URL}/images/notfound.png`;

const fetchListingById = async (listingId) => {
    const mockListing = {
        id: listingId,
        title: Math.random() < 0.5 ? 'Квартира подобово' : 'Квартира помісячно',
        image: null,
        is_daily: Math.random() < 0.5,
        is_monthly: Math.random() < 0.5,
        price_per_day: Math.floor(Math.random() * 2000) + 200,
        price_per_month: Math.floor(Math.random() * 30000) + 100,
        beds: Math.floor(Math.random() * 4) + 1,
        rooms: Math.floor(Math.random() * 5) + 1,
        bathrooms: Math.floor(Math.random() * 3) + 1,
        city: ['Київ', 'Львів', 'Одеса', 'Дніпро', 'Харків'][Math.floor(Math.random() * 5)],
    };

    return new Promise(resolve => setTimeout(() => resolve(mockListing), 200));
};

const WishList = ({ isLightTheme }) => {
    const [sortOption, setSortOption] = useState('price_asc');
    const [listings, setListings] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUserWishlist = async () => {
            setLoading(true);
            const userId = localStorage.getItem('userId');

            try {
                if (userId) {
                    // Scenario 1: User is logged in. Fetch from backend.
                    // Replace with your actual backend call.
                    const response = await fetch(`/api/user/${userId}/wishlist`);
                    if (!response.ok) {
                        throw new Error('Failed to fetch user wishlist.');
                    }
                    const data = await response.json();
                    setListings(data.wishlistItems);
                } else {
                    // Scenario 2: Guest user. Fetch from local storage.
                    const guestFavorites = JSON.parse(localStorage.getItem('guestFavorites') || '[]');
                    const fetchedListings = await Promise.all(
                        guestFavorites.map(id => fetchListingById(id))
                    );
                    setListings(fetchedListings);
                }
            } catch (error) {
                console.error("Error fetching wishlist:", error);
                message.error('Failed to load your favorite listings.');
                setListings([]);
            } finally {
                setLoading(false);
            }
        };

        fetchUserWishlist();
    }, []);

    const sortedListings = useMemo(() => {
        const sorted = [...listings];
        const getPrice = (item) => item.is_daily ? item.price_per_day : item.price_per_month;

        switch (sortOption) {
            case "price_asc":
                sorted.sort((a, b) => getPrice(a) - getPrice(b));
                break;
            case "price_desc":
                sorted.sort((a, b) => getPrice(b) - getPrice(a));
                break;
            case "daily_first":
                sorted.sort((a, b) => (b.is_daily ? 1 : 0) - (a.is_daily ? 1 : 0));
                break;
            case "monthly_first":
                sorted.sort((a, b) => (b.is_monthly ? 1 : 0) - (a.is_monthly ? 1 : 0));
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
                        {sortedListings.length > 0 ? (
                            sortedListings.map(listing => (
                                <Col key={listing.id} xs={24} sm={12} md={8} lg={6} className="dp-card-hover-animation">
                                    <a href={`/listing/${listing.id}`} style={{ textDecoration: 'none' }}>
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
                                    </a>
                                </Col>
                            ))
                        ) : (
                            <div className="lkd-no-listings-container">
                                <p>Ви ще не додали жодних оголошень до улюблених.</p>
                            </div>
                        )}
                    </Row>
                )}
            </div>
        </>
    );
};

export default WishList;