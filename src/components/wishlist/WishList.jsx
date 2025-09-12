import React, { useState, useEffect, useMemo } from 'react';
import { Card, Col, Row, Spin, message, Alert } from 'antd';
import { HeartFilled } from "@ant-design/icons";
import { Link } from 'react-router-dom';
import "./WishList.css";

import { dispatchFavoriteUpdate } from '../../layout/header&footer/Header';

const notFoundImagePath = `${process.env.PUBLIC_URL}/images/notfound.png`;
const API_URL = process.env.REACT_APP_API_URL;

/**
 * Fetches daily listings by IDs from the backend.
 * @param {string[]} ids - Array of listing IDs.
 * @returns {Promise<object[]>} - A promise with the list of daily listings.
 */
const fetchDailyListingsByIds = async (ids) => {
    if (!ids || ids.length === 0) return [];
    try {
        const response = await fetch(`${API_URL}/daily-listings/by-ids`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(ids),
        });
        if (!response.ok) {
            throw new Error(`Failed to fetch daily listings: ${response.status}`);
        }
        const data = await response.json();
        console.log('Daily listings by IDs API response:', data);
        return data.map(listing => ({
            ...listing,
            photos: listing.photos.map(photo => `${API_URL.replace('/api', '')}${photo}`),
        }));
    } catch (error) {
        console.error("Error fetching daily listings by IDs:", error);
        throw error;
    }
};

/**
 * Fetches sales listings by IDs from the backend.
 * @param {string[]} ids - Array of listing IDs.
 * @returns {Promise<object[]>} - A promise with the list of sales listings.
 */
const fetchSalesListingsByIds = async (ids) => {
    if (!ids || ids.length === 0) return [];
    try {
        const response = await fetch(`${API_URL}/sales/by-ids`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(ids),
        });
        if (!response.ok) {
            throw new Error(`Failed to fetch sales listings: ${response.status}`);
        }
        const data = await response.json();
        console.log('Sales listings by IDs API response:', data);
        return data.map(listing => ({
            ...listing,
            photos: listing.photos.map(photo => `${API_URL.replace('/api', '')}${photo}`),
        }));
    } catch (error) {
        console.error("Error fetching sales listings by IDs:", error);
        throw error;
    }
};

const WishList = ({ isLightTheme }) => {
    const [likedDailyListings, setLikedDailyListings] = useState([]);
    const [likedSalesListings, setLikedSalesListings] = useState([]);
    const [loading, setLoading] = useState(true);

    const [likedDailyIds, setLikedDailyIds] = useState(() => {
        try {
            return new Set(JSON.parse(localStorage.getItem('likedItemsDaily') || '[]'));
        } catch (error) {
            console.error("Error parsing likedItemsDaily from localStorage:", error);
            return new Set();
        }
    });

    const [likedSalesIds, setLikedSalesIds] = useState(() => {
        try {
            return new Set(JSON.parse(localStorage.getItem('likedItemsSales') || '[]'));
        } catch (error) {
            console.error("Error parsing likedItemsSales from localStorage:", error);
            return new Set();
        }
    });

    useEffect(() => {
        const fetchLikedListings = async () => {
            setLoading(true);
            try {
                const dailyIds = Array.from(likedDailyIds);
                const salesIds = Array.from(likedSalesIds);
                const [daily, sales] = await Promise.all([
                    fetchDailyListingsByIds(dailyIds),
                    fetchSalesListingsByIds(salesIds)
                ]);
                
                setLikedDailyListings(daily);
                setLikedSalesListings(sales);
            } catch (error) {
                console.error("Error fetching liked listings:", error);
                message.error('Не вдалося завантажити обрані оголошення.');
            } finally {
                setLoading(false);
            }
        };

        fetchLikedListings();
    }, [likedDailyIds, likedSalesIds]);

    const handleUnlike = (id, isDaily) => {
        if (isDaily) {
            const newLikedIds = new Set(likedDailyIds);
            newLikedIds.delete(String(id));
            setLikedDailyIds(newLikedIds);
            localStorage.setItem('likedItemsDaily', JSON.stringify(Array.from(newLikedIds)));
            setLikedDailyListings(prev => prev.filter(listing => listing.id !== id));
        } else {
            const newLikedIds = new Set(likedSalesIds);
            newLikedIds.delete(String(id));
            setLikedSalesIds(newLikedIds);
            localStorage.setItem('likedItemsSales', JSON.stringify(Array.from(newLikedIds)));
            setLikedSalesListings(prev => prev.filter(listing => listing.id !== id));
        }
        message.success('Оголошення видалено з обраних.');
        dispatchFavoriteUpdate();
    };

    const themeClass = isLightTheme ? 'light-theme' : 'dark-theme';

    const renderListingCard = (listing, isDaily) => (
        <Col key={listing.id} xs={24} sm={12} md={8} lg={6}>
            <Link to={`/${isDaily ? 'listing-daily' : 'sale'}/${listing.id}`} style={{ textDecoration: 'none' }}>
                <Card
                    hoverable
                    className={`lkd-card-hover-animation ${isLightTheme ? 'light-card' : 'dark-card'}`}
                    cover={
                        <div className="lkd-card-image-container" style={{height: 350}}>
                            <img
                                alt={listing.title}
                                src={listing.photos && listing.photos.length > 0 ? listing.photos[0] : notFoundImagePath}
                                className="lkd-card-image"
                                onError={(e) => { e.target.onerror = null; e.target.src = notFoundImagePath; }}
                            />
                            <div className="lkd-price-tag">
                                {isDaily ? `Від ${listing.basePrice} грн/доба` : `${listing.basePrice}$`}
                            </div>
                            <button
                                className="lkd-unlike-button"
                                onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    handleUnlike(listing.id, isDaily);
                                }}
                            >
                                <HeartFilled style={{ color: 'red' }} />
                            </button>
                        </div>
                    }
                >
                    <div className="lkd-card-info-section">
                        <Row gutter={[16, 16]}>
                            <Col span={8} style={{fontSize: 19}}>
                                <p className="lkd-card-info-value">{listing.beds}</p>
                                <p className="lkd-card-info-label">Місць</p>
                            </Col>
                            <Col span={8} style={{fontSize: 19}}>
                                <p className="lkd-card-info-value">{listing.rooms}</p>
                                <p className="lkd-card-info-label">Кімнати</p>
                            </Col>
                            <Col span={8} style={{fontSize: 19}}>
                                <p className="lkd-card-info-value">{listing.bathrooms}</p>
                                <p className="lkd-card-info-label">Санвузли</p>
                            </Col>
                        </Row>
                    </div>
                    <p className="lkd-card-city-name" style={{fontSize: 20, fontWeight: 'bold', color: isLightTheme ? "black" : "white"}}>
                        {listing.location && listing.location.city ? listing.location.city : 'Невідома адреса'}
                    </p>
                </Card>
            </Link>
        </Col>
    );

    return (
        <div className={`lkd-liked-page-container ${themeClass}`}>
            <h1 className="lkd-page-title">Обрані оголошення</h1>
            {loading ? (
                <div className="lkd-loading-container">
                    <Spin size="large" />
                    <p>Завантаження обраних оголошень...</p>
                </div>
            ) : (
                <>
                    {/* Розділ для подобової оренди */}
                    <div className="lkd-section-wrapper">
                        <h2 className="lkd-section-title" style={{marginBottom: 10}}>Подобова оренда</h2>
                        {likedDailyListings.length > 0 ? (
                            <Row gutter={[16, 16]}>
                                {likedDailyListings.map(listing => renderListingCard(listing, true))}
                            </Row>
                        ) : (
                            <Alert 
                                message="Немає обраних оголошень"
                                description="Ви ще не додали жодних оголошень до улюблених для подобової оренди."
                                type="info"
                                showIcon
                                className="lkd-no-results-alert"
                            />
                        )}
                    </div>

                    {/* Розділ для продажу */}
                    <div className="lkd-section-wrapper">
                        <h2 className="lkd-section-title" style={{marginBottom: 10}}>Продаж</h2>
                        {likedSalesListings.length > 0 ? (
                            <Row gutter={[16, 16]}>
                                {likedSalesListings.map(listing => renderListingCard(listing, false))}
                            </Row>
                        ) : (
                            <Alert
                                message="Немає обраних оголошень"
                                description="Ви ще не додали жодних оголошень до улюблених для продажу."
                                type="info"
                                showIcon
                                className="lkd-no-results-alert"
                            />
                        )}
                    </div>
                </>
            )}
        </div>
    );
};

export default WishList;