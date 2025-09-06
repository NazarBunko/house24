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
import './ListingMonthlyPage.css';
import L from 'leaflet';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';

dayjs.extend(customParseFormat);

const { Title, Text } = Typography;
const { Panel } = Collapse;

const mockListingData = {
    id: '123-monthly',
    title: 'Простора квартира в центрі міста',
    description: 'Ідеальне житло для довгострокової оренди. Квартира розташована в тихому районі з відмінним доступом до громадського транспорту та всією необхідною інфраструктурою.',
    rooms: 3,
    bathrooms: 1,
    basePrice: 12000,
    owner: {
        firstName: 'Олександр',
        lastName: 'Коваль',
        phone: '+380971234567',
    },
    amenities: {
        'Основні': { 'Wi-Fi': true, 'Пральна машина': true, 'Холодильник': true, 'Опалення': true },
        'Кухня': { 'Власна кухня': true, 'Плита': true, 'Мікрохвильова піч': true, 'Посуд': true },
        'Зручності на території': { 'Безкоштовна парковка': true, 'Камери відеоспостереження': true },
    },
    rules: {
        'Можна з тваринами': true,
    },
    location: { lat: 49.4431, lng: 32.0745 },
    photos: [
        `${process.env.PUBLIC_URL}/images/house1.jpg`,
        `${process.env.PUBLIC_URL}/images/house2.jpg`,
        `${process.env.PUBLIC_URL}/images/house3.jpg`,
        `${process.env.PUBLIC_URL}/images/house4.jpg`,
        `${process.env.PUBLIC_URL}/images/house5.jpg`,
    ],
};

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

const customMarkerIcon = new L.Icon({
    iconUrl: 'https://cdn-icons-png.flaticon.com/512/684/684908.png',
    iconSize: [35, 35],
    iconAnchor: [17, 35],
    popupAnchor: [0, -35],
});

// Змінено тут: приймаємо проп loggedInUserId
const ListingMonthlyPage = ({ isLightTheme, loggedInUserId }) => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [listing, setListing] = useState(null);
    const [loading, setLoading] = useState(true);
    const [previewVisible, setPreviewVisible] = useState(false);
    const [previewImage, setPreviewImage] = useState('');
    
    // Нові стани для вибору дати і часу
    const [selectedDate, setSelectedDate] = useState(null);
    const [selectedTime, setSelectedTime] = useState(null);

    const themeClass = isLightTheme ? 'light-theme' : 'dark-theme';

    useEffect(() => {
        setLoading(true);
        setTimeout(() => {
            setListing(mockListingData);
            setLoading(false);
        }, 1000);
    }, [id]);

    const handlePreview = (photoUrl) => {
        setPreviewImage(photoUrl);
        setPreviewVisible(true);
    };

    const getPopupContainer = (triggerNode) => {
        return triggerNode.parentNode;
    };

    const handleBooking = () => {
        // Змінено тут: перевірка наявності loggedInUserId замість localStorage
        if (!loggedInUserId) {
            notification.warning({
                message: 'Помилка',
                description: 'Будь ласка, увійдіть у свій обліковий запис, щоб записатися на перегляд.',
            });
            // Перенаправлення на сторінку логіну
            navigate('/login');
            return;
        }

        // Перевірка, чи вибрані дата і час
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
        
        // Тут можна додати логіку для відправки запиту на бекенд
        console.log('Запис на перегляд:', {
            listingId: listing.id,
            date: selectedDate.format('YYYY-MM-DD'),
            time: selectedTime.format('HH:mm'),
        });
    };

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
                        {/* Нова картка для запису на перегляд */}
                        <Card className="booking-card" bordered={true}>
                            <Title level={3} style={{ textAlign: 'center' }}>
                                Записатися на перегляд
                            </Title>
                            <Divider />
                            <Space direction="vertical" style={{ width: '100%' }}>
                                <Text strong>Ціна за місяць:</Text>
                                <Title level={4} style={{ color: '#007bff' }}>{listing.basePrice} грн</Title>
                                <Divider />
                                <Text strong>Оберіть дату:</Text>
                                <DatePicker 
                                    style={{ width: '100%' }} 
                                    onChange={(date) => setSelectedDate(date)} 
                                    disabledDate={current => current && current < dayjs().startOf('day')}
                                    className={isLightTheme ? '' : 'dark-theme-datepicker'}
                                />
                                <Text strong>Оберіть час:</Text>
                                <TimePicker 
                                    style={{ width: '100%' }} 
                                    onChange={(time) => setSelectedTime(time)} 
                                    format="HH:mm" 
                                    minuteStep={5}
                                    className={isLightTheme ? '' : 'dark-theme-timepicker'}
                                    getPopupContainer={getPopupContainer}
                                />
                                <Button
                                    type="primary"
                                    size="large"
                                    style={{ width: '100%', marginTop: '1rem' }}
                                    onClick={handleBooking}
                                >
                                    Записатися на перегляд
                                </Button>
                                <Button type="text" icon={<HeartOutlined />} className="wishlist-btn">
                                    Додати в обране
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
                            {listing.rooms} спальні · {listing.bathrooms} ванна
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
                                    return listing.amenities[category]?.[itemName];
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
                                    {listing.rules[rule] ? (
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

export default ListingMonthlyPage;