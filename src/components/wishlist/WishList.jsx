import React, { useState, useEffect, useMemo } from 'react';
import { Card, Col, Row, Spin, message, Alert } from 'antd';
import { HeartFilled } from "@ant-design/icons";
import { Link } from 'react-router-dom';
import "./WishList.css";

import { dispatchFavoriteUpdate } from '../../layout/header&footer/Header';

const notFoundImagePath = `${process.env.PUBLIC_URL}/images/notfound.png`;
const API_URL = process.env.REACT_APP_API_URL;

/**
 * Fetches all daily listings from the backend.
 * @returns {Promise<object[]>} - A promise with the list of daily listings.
 */
const fetchAllDailyListings = async () => {
    try {
        const response = await fetch(`${API_URL}/daily-listings`);
        if (!response.ok) {
            throw new Error('Failed to fetch all daily listings.');
        }
        return await response.json();
    } catch (error) {
        console.error("Error fetching all daily listings:", error);
        throw error;
    }
};

const fetchAllSellingsListings = async () => {
    try {
        const response = await fetch(`${API_URL}/sellings`);
        if (!response.ok) {
            throw new Error('Failed to fetch all sellings.');
        }
        return await response.json();
    } catch (error) {
        console.error("Error fetching all sellings listings:", error);
        throw error;
    }
};

const WishList = ({ isLightTheme }) => {
    const [allDailyListings, setAllDailyListings] = useState([]);
    const [allsellingsListings, setAllsellingsListings] = useState([]);
    const [loading, setLoading] = useState(true);

    const [likedDailyIds, setLikedDailyIds] = useState(() => {
        try {
            return new Set(JSON.parse(localStorage.getItem('likedItemsDaily') || '[]'));
        } catch (error) {
            console.error("Error parsing likedItemsDaily from localStorage:", error);
            return new Set();
        }
    });

    const [likedsellingsIds, setLikedsellingsIds] = useState(() => {
        try {
            return new Set(JSON.parse(localStorage.getItem('likedItemsSellings') || '[]'));
        } catch (error) {
            console.error("Error parsing likedItemsSellings from localStorage:", error);
            return new Set();
        }
    });

    useEffect(() => {
        const fetchAllListings = async () => {
            setLoading(true);
            try {
                const [daily, sellings] = await Promise.all([
                    fetchAllDailyListings(),
                    fetchAllSellingsListings()
                ]);
                setAllDailyListings(daily);
                setAllsellingsListings(sellings);
            } catch (error) {
                console.error("Error fetching all listings:", error);
                message.error('Не вдалося завантажити всі оголошення.');
            } finally {
                setLoading(false);
            }
        };

        fetchAllListings();
    }, []);

    const likedDailyListings = useMemo(() => {
        return allDailyListings.filter(listing => likedDailyIds.has(String(listing.id)));
    }, [allDailyListings, likedDailyIds]);

    const likedsellingsListings = useMemo(() => {
        return allsellingsListings.filter(listing => likedsellingsIds.has(String(listing.id)));
    }, [allsellingsListings, likedsellingsIds]);

    const handleUnlike = (id, isDaily) => {
        if (isDaily) {
            const newLikedIds = new Set(likedDailyIds);
            newLikedIds.delete(String(id));
            setLikedDailyIds(newLikedIds);
            localStorage.setItem('likedItemsDaily', JSON.stringify(Array.from(newLikedIds)));
        } else {
            const newLikedIds = new Set(likedsellingsIds);
            newLikedIds.delete(String(id));
            setLikedsellingsIds(newLikedIds);
            localStorage.setItem('likedItemsSellings', JSON.stringify(Array.from(newLikedIds)));
        }
        message.success('Оголошення видалено з обраних.');
        // Виклик функції для оновлення лічильника в хедері
        dispatchFavoriteUpdate();
    };

    const themeClass = isLightTheme ? 'light-theme' : 'dark-theme';

    const renderListingCard = (listing, isDaily) => (
        <Col key={listing.id} xs={24} sm={12} md={8} lg={6}>
            <Link to={`/${isDaily ? 'listing-daily' : 'selling'}/${listing.id}`} style={{ textDecoration: 'none' }}>
                <Card
                    hoverable
                    className={`lkd-card-hover-animation ${isLightTheme ? 'light-card' : 'dark-card'}`}
                    cover={
                        <div className="lkd-card-image-container">
                            <img
                                alt={listing.title}
                                src={listing.photos && listing.photos[0] ? `${listing.photos[0]}` : notFoundImagePath}
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
                        {listing.location ? listing.location.city : 'Невідомо'}
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
                    <p>Завантаження всіх оголошень...</p>
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
                        {likedsellingsListings.length > 0 ? (
                            <Row gutter={[16, 16]}>
                                {likedsellingsListings.map(listing => renderListingCard(listing, false))}
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