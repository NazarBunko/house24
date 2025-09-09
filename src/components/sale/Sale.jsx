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

// Дані для зручностей та правил - можна винести в окремий файл
const monthlyAmenitiesData = {
    'Основні': [
        'Wi-Fi', 'Пральна машина', 'Холодильник', 'Опалення', 'Кондиціонер',
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
const rulesData = ['Можна з тваринами'];

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
            try {
                const response = await fetch(`${process.env.REACT_APP_API_URL}/sales/${id}`); 
                if (!response.ok) {
                    throw new Error('Оголошення не знайдено');
                }
                const data = await response.json();
                
                if (data) {
                    const updatedPhotos = data.photos.map(photo => `${photo}`);
                    const listingData = { ...data, photos: updatedPhotos };
                    setListing(listingData);
                    setIsLiked(getLikedStatus(listingData.id));
                } else {
                    setListing(null);
                }
            } catch (error) {
                console.error('Помилка при завантаженні оголошення:', error);
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

    if (!listing) {
        return (
            <div className={`listing-page-container ${themeClass}`} style={{ textAlign: 'center', marginTop: '50px' }}>
                <Title level={3}>Оголошення не знайдено</Title>
            </div>
        );
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
                            {listing.photos.map((photo, index) => (
                                <div key={index} onClick={() => handlePreview(photo)}>
                                    <img src={photo} alt={`Property ${index + 1}`} className="listing-photo" />
                                </div>
                            ))}
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
                            кімнат: {listing.rooms} · санвузлів: {listing.bathrooms}
                        </Text>
                        <Divider />
                        
                        <Title level={4}>Опис помешкання</Title>
                        <Text>{listing.description}</Text>
                        <Divider />
                        
                        <Title level={4}>Зручності</Title>
                        <Collapse defaultActiveKey={['0']} bordered={false} className={isLightTheme ? '' : 'dark-theme-collapse'}>
                            {Object.entries(monthlyAmenitiesData).map(([category, items], index) => {
                                const availableAmenities = items.filter(item => {
                                    const itemName = typeof item === 'string' ? item : item.name;
                                    return listing.amenities?.[category]?.[itemName];
                                });
                                if (availableAmenities.length === 0) return null;

                                return (
                                    <Panel
                                        header={<Text strong>{category}</Text>}
                                        key={index}
                                        className={isLightTheme ? '' : 'dark-theme-panel'}
                                    >
                                        <Space direction="vertical" style={{ width: '100%' }}>
                                            {availableAmenities.map((item, i) => {
                                                const itemName = typeof item === 'string' ? item : item.name;
                                                return (
                                                    <span key={i}>
                                                        <CheckOutlined style={{ color: 'green', marginRight: '8px' }} />
                                                        {itemName}
                                                    </span>
                                                );
                                            })}
                                        </Space>
                                    </Panel>
                                );
                            })}
                        </Collapse>
                        <Divider />

                        <Title level={4}>Правила проживання</Title>
                        <Space direction="vertical">
                            {rulesData.map((rule, index) => (
                                <span key={index}>
                                    {listing.rules?.[rule] ? (
                                        <CheckOutlined style={{ color: 'green', marginRight: '8px' }} />
                                    ) : (
                                        <CloseOutlined style={{ color: 'red', marginRight: '8px' }} />
                                    )}
                                    {rule}
                                </span>
                            ))}
                        </Space>
                        <Divider />

                        <Title level={4}>Локація</Title>
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
                    </Col>
                </Row>
            </Card>
        </div>
    );
};

export default Sale;