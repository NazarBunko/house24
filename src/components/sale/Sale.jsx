import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Carousel,
    Modal,
    Typography,
    Card,
    Row,
    Col,
    Divider,
    Space,
    Collapse,
    Spin,
    Button,
    DatePicker,
    TimePicker,
    notification,
} from 'antd';
import {
    CheckOutlined,
    CloseOutlined,
    HeartOutlined,
} from '@ant-design/icons';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import './Sale.css';
import L from 'leaflet';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';

import { dispatchFavoriteUpdate } from '../../layout/header&footer/Header';

dayjs.extend(customParseFormat);

const { Title, Text } = Typography;
const { Panel } = Collapse;

// Дані для зручностей та правил
const monthlyAmenitiesData = {
    'Основні': [
        'Wi-Fi', 'Пральна машина', 'Холодильник', 'Опалення', 'Кондиціонер', 'Можна з тваринами',
    ],
    'Кухня': [
        'Власна кухня', 'Плита', 'Мікрохвильова піч', 'Посуд', 'Посудомийна машина',
    ],
    'Меблі': [
        'Ліжко', 'Шафа', 'Обідній стіл', 'Диван',
    ],
    'Зручності на території': [
        'Безкоштовна парковка', 'Камери відеоспостереження',
    ],
};

const saleAmenitiesData = {
    'Інфраструктура': [
        'Дитячий садок', 'Школа', 'Магазин', 'Зупинка транспорту', 'Лікарня',
    ],
    'Комунікації': [
        'Вода', 'Газ', 'Електрика', 'Каналізація',
    ],
    'Під’їзд': [
        'Асфальтований під’їзд',
    ],
    'Безпека': [
        'Охорона', 'Огорожа по всьому периметру', 'Камери відеоспостереження',
    ],
    'Житловий комплекс': [
        'ЖК',
    ],
};

const allAmenitiesData = { ...monthlyAmenitiesData, ...saleAmenitiesData };

// Іконка для карти
const customMarkerIcon = new L.Icon({
    iconUrl: 'https://cdn-icons-png.flaticon.com/512/684/684908.png',
    iconSize: [35, 35],
    iconAnchor: [17, 35],
    popupAnchor: [0, -35],
});

const Sale = ({ isLightTheme, loggedInUserId }) => {
    const { id } = useParams();
    const navigate = useNavigate();
    
    // Стан компонента
    const [listing, setListing] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [previewVisible, setPreviewVisible] = useState(false);
    const [previewImage, setPreviewImage] = useState('');
    const [selectedDate, setSelectedDate] = useState(null);
    const [selectedTime, setSelectedTime] = useState(null);
    const [isLiked, setIsLiked] = useState(false);

    const themeClass = isLightTheme ? 'light-theme' : 'dark-theme';

    const getLikedStatus = (itemId) => {
        try {
            const likedItems = JSON.parse(localStorage.getItem('likedItemsSales')) || [];
            return likedItems.includes(itemId);
        } catch (error) {
            console.error("Помилка при читанні likedItemsSales з localStorage:", error);
            return false;
        }
    };

    useEffect(() => {
        const fetchListing = async () => {
            setLoading(true);
            setError(null);
            try {
                const API_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080';
                const response = await fetch(`${API_URL}/api/sales/${id}`, {
                    method: 'GET',
                    credentials: 'include',
                });
                console.log('Fetch listing response:', response);
                if (!response.ok) {
                    throw new Error(`Помилка завантаження оголошення: ${response.status}`);
                }
                const data = await response.json();
                console.log('Fetched listing:', data);
                
                if (data) {
                    // Обробка фото: додавання префіксу API_URL, якщо потрібно
                    const updatedPhotos = data.photos && Array.isArray(data.photos) 
                        ? data.photos.map(photo => 
                            photo.startsWith('http') ? photo : `${API_URL}${photo}`
                          )
                        : [];
                    const listingData = { ...data, photos: updatedPhotos };
                    setListing(listingData);
                    setIsLiked(getLikedStatus(listingData.id));
                } else {
                    setListing(null);
                }
            } catch (error) {
                console.error('Помилка при завантаженні оголошення:', error);
                setError(error.message || 'Не вдалося завантажити оголошення');
                setListing(null);
            } finally {
                setLoading(false);
            }
        };

        fetchListing();
    }, [id]);

    const handlePreview = (photoUrl) => {
        setPreviewImage(photoUrl);
        setPreviewVisible(true);
    };

    const getPopupContainer = (triggerNode) => {
        return triggerNode.parentNode;
    };

    const handleBooking = () => {
        if (!loggedInUserId) {
            notification.warning({
                message: 'Помилка',
                description: 'Будь ласка, увійдіть у свій обліковий запис, щоб записатися на перегляд.',
            });
            navigate('/login');
            return;
        }

        if (!selectedDate || !selectedTime) {
            notification.error({
                message: 'Помилка',
                description: 'Будь ласка, оберіть дату та час для перегляду.',
            });
            return;
        }

        notification.success({
            message: 'Успішно',
            description: `Ви записалися на перегляд на ${selectedDate.format('DD.MM.YYYY')} о ${selectedTime.format('HH:mm')}.`,
        });
        
        console.log('Запис на перегляд:', {
            listingId: listing.id,
            date: selectedDate.format('YYYY-MM-DD'),
            time: selectedTime.format('HH:mm'),
        });
    };

    const handleLikeClick = () => {
        // Захист від відсутності оголошення
        if (!listing || !listing.id) {
            return;
        }

        try {
            const likedItems = JSON.parse(localStorage.getItem('likedItemsSales')) || [];
            const isCurrentlyLiked = likedItems.includes(listing.id);
            let updatedLikedItems;

            if (isCurrentlyLiked) {
                // Видаляємо оголошення зі списку
                updatedLikedItems = likedItems.filter(itemId => itemId !== listing.id);
                notification.info({
                    message: 'Видалено',
                    description: 'Оголошення видалено з обраного.',
                });
            } else {
                // Додаємо оголошення до списку
                updatedLikedItems = [...likedItems, listing.id];
                notification.success({
                    message: 'Додано',
                    description: 'Оголошення додано до обраного.',
                });
            }

            // Оновлюємо localStorage
            localStorage.setItem('likedItemsSales', JSON.stringify(updatedLikedItems));
            // Оновлюємо локальний стан
            setIsLiked(!isCurrentlyLiked);
            // Відправляємо подію для оновлення Header
            dispatchFavoriteUpdate();

        } catch (error) {
            console.error("Помилка при оновленні likedItemsSales:", error);
            notification.error({
                message: 'Помилка',
                description: 'Не вдалося оновити список обраного.',
            });
        }
    };

    // Умовний рендеринг: показуємо спінер або сторінку
    if (loading) {
        return (
            <div className={`listing-page-container ${themeClass}`} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
                <Spin size="large" tip="Завантаження оголошення..." />
            </div>
        );
    }

    if (error || !listing) {
        return (
            <div className={`listing-page-container ${themeClass}`} style={{ textAlign: 'center', marginTop: '50px' }}>
                <Title level={3}>Оголошення не знайдено</Title>
                {error && <Text type="danger">{error}</Text>}
            </div>
        );
    }

    // Обробка amenities: перетворення масиву в об'єкт для легшого пошуку
    const amenitiesObj = {};
    if (listing.amenities && Array.isArray(listing.amenities)) {
        listing.amenities.forEach(amenity => {
            amenitiesObj[amenity] = true;
        });
    }

    return (
        <div className={`listing-page-container ${themeClass}`}>
            <Card className="listing-card">
                <Row gutter={[16, 16]}>
                    <Col xs={24} lg={8} className="order-lg-2">
                        <Card className="booking-card" bordered={true}>
                            <Title level={3} style={{ textAlign: 'center' }}>
                                Записатися на перегляд
                            </Title>
                            <Divider />
                            <Space direction="vertical" style={{ width: '100%' }}>
                                <Text strong>Ціна:</Text>
                                <Title level={4} style={{ color: '#007bff' }}>{listing.basePrice}$</Title>
                                <Divider />
                                <Text strong>Оберіть дату:</Text>
                                <DatePicker 
                                    style={{ width: '100%' }} 
                                    onChange={(date) => setSelectedDate(date)} 
                                    disabledDate={current => current && current < dayjs().startOf('day')}
                                    className={isLightTheme ? '' : 'dark-theme-datepicker'}
                                    showToday={false}
                                />
                                <Text strong>Оберіть час:</Text>
                                <TimePicker 
                                    style={{ width: '100%' }} 
                                    onChange={(time) => setSelectedTime(time)} 
                                    format="HH:mm" 
                                    minuteStep={5}
                                    className={isLightTheme ? '' : 'dark-theme-timepicker'}
                                    getPopupContainer={getPopupContainer}
                                    showNow={false}
                                />
                                <Button
                                    type="primary"
                                    size="large"
                                    style={{ width: '100%', marginTop: '1rem' }}
                                    onClick={handleBooking}
                                >
                                    Записатися на перегляд
                                </Button>
                                <Button
                                    type="text"
                                    icon={<HeartOutlined style={{ color: isLiked ? 'red' : 'inherit' }} />}
                                    className="wishlist-btn"
                                    onClick={handleLikeClick}
                                    disabled={loading}
                                >
                                    {isLiked ? 'Видалити з обраного' : 'Додати в обране'}
                                </Button>
                            </Space>
                        </Card>
                    </Col>
                    <Col xs={24} lg={16} className="order-lg-1">
                        <Carousel
                            autoplay
                            dotPosition="bottom"
                            arrows={true}
                        >
                            {listing.photos && listing.photos.length > 0 ? (
                                listing.photos.map((photo, index) => (
                                    <div key={index} onClick={() => handlePreview(photo)}>
                                        <img src={photo} alt={`Property ${index + 1}`} className="listing-photo" />
                                    </div>
                                ))
                            ) : (
                                <div>
                                    <img src={`${process.env.PUBLIC_URL}/images/notfound.png`} alt="No image" className="listing-photo" />
                                </div>
                            )}
                        </Carousel>
                        <Modal
                            style={{marginTop: '-5rem'}}
                            open={previewVisible}
                            title={null}
                            footer={null}
                            onCancel={() => setPreviewVisible(false)}
                            wrapClassName="image-modal-no-border"
                            width={800}
                        >
                            <img alt="Preview" style={{ width: '100%' }} src={previewImage} />
                        </Modal>

                        <Title level={2} style={{ marginTop: 20 }}>{listing.title}</Title>
                        <Text className="listing-meta">
                            кімнат: {listing.rooms} · санвузлів: {listing.bathrooms} · житлова площа: {listing.livingArea} м² · площа ділянки: {listing.landArea} м² · поверхи: {listing.numberOfFloors}
                        </Text>
                        <Divider />
                        
                        <Title level={4}>Опис помешкання</Title>
                        <Text>{listing.description}</Text>
                        <Divider />
                        
                        <Title level={4}>Зручності</Title>
                        <Collapse defaultActiveKey={['0']} bordered={false} className={isLightTheme ? '' : 'dark-theme-collapse'}>
                            {Object.entries(allAmenitiesData).map(([category, items], index) => {
                                const availableAmenities = items.filter(item => amenitiesObj[item]);
                                if (availableAmenities.length === 0) return null;

                                return (
                                    <Panel
                                        header={<Text strong>{category}</Text>}
                                        key={index}
                                        className={isLightTheme ? '' : 'dark-theme-panel'}
                                    >
                                        <Space direction="vertical" style={{ width: '100%' }}>
                                            {availableAmenities.map((item, i) => (
                                                <span key={i}>
                                                    <CheckOutlined style={{ color: 'green', marginRight: '8px' }} />
                                                    {item}
                                                </span>
                                            ))}
                                        </Space>
                                    </Panel>
                                );
                            })}
                        </Collapse>
                        <Divider />

                        <Title level={4}>Локація</Title>
                        {listing.location && listing.location.lat && listing.location.lng ? (
                            <div className="map-container" style={{ height: '400px', borderRadius: '8px', overflow: 'hidden' }}>
                                <MapContainer
                                    center={[listing.location.lat, listing.location.lng]}
                                    zoom={13}
                                    scrollWheelZoom={false}
                                    style={{ height: '100%', width: '100%' }}
                                >
                                    <TileLayer
                                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                    />
                                    <Marker position={[listing.location.lat, listing.location.lng]} icon={customMarkerIcon}>
                                        <Popup>Точне розташування помешкання</Popup>
                                    </Marker>
                                </MapContainer>
                            </div>
                        ) : (
                            <Text>Локація не вказана</Text>
                        )}
                    </Col>
                </Row>
            </Card>
        </div>
    );
};

export default Sale;