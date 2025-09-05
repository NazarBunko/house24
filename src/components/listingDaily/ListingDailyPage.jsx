import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
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
    DatePicker,
    InputNumber,
    Button,
    Rate,
    Input,
    Form,
} from 'antd';
import {
    CheckOutlined,
    CloseOutlined,
    HeartOutlined,
} from '@ant-design/icons';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import './ListingDailyPage.css';
import L from 'leaflet';

import dayjs from 'dayjs';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
dayjs.extend(isSameOrBefore);

const { Title, Text } = Typography;
const { Panel } = Collapse;
const { TextArea } = Input;

const notFoundImagePath = `${process.env.PUBLIC_URL}/images/notfound.png`;

const mockListingData = {
    id: '123',
    title: 'Затишна квартира біля парку',
    description: 'Це чудове помешкання з усіма зручностями та фантастичним краєвидом. Розташоване в тихому районі, ідеально підходить для сімейного відпочинку.',
    guests: 4,
    rooms: 2,
    bathrooms: 1,
    basePrice: 1500,
    specialPrices: [
        { checkIn: '2025-12-24', checkOut: '2025-12-31', price: 2000 },
    ],
    amenities: {
        'Зручності на території': { 'Альтанка': true, 'Мангал та шампури': true, 'Безкоштовна парковка': true },
        'Кухня': { 'Власна кухня': true, 'Холодильник': true, 'Плита': true },
        'Техніка': { 'Wi-Fi': true, 'Пральна машина': true },
        'Комфорт': { 'Постіль': true },
        'Санвузол': { 'Власний санвузол': true, 'Душ/Ванна': true, 'Фен': true },
    },
    rules: {
        'Можна з тваринами': true,
        'Можна курити': false,
    },
    location: { lat: 49.4431, lng: 32.0745 },
    photos: Array(5).fill(notFoundImagePath),
};

const mockReviews = [
    {
        id: 1,
        author: 'Олена К.',
        rating: 5,
        date: '2024-05-15',
        comment: 'Чудова квартира, чисто та затишно. Господарі дуже привітні. Рекомендую!',
    },
    {
        id: 2,
        author: 'Іван П.',
        rating: 4,
        date: '2024-05-10',
        comment: 'Гарне розташування, але Wi-Fi міг би бути швидшим. Загалом задоволений.',
    },
    {
        id: 3,
        author: 'Марія С.',
        rating: 5,
        date: '2024-05-01',
        comment: 'Все ідеально! Помешкання перевершило очікування.',
    },
];

const amenitiesData = {
    'Зручності на території': [
        'Альтанка', 'Мангал та шампури', { name: 'Решітка для вогню' },
        { name: 'Дрова для мангалу', paid: true, price: '200 грн/ящик' },
        'Гойдалка', 'Камери відеоспостереження на території', 'Огорожа по всьому периметру',
        'Безкоштовна парковка'
    ],
    'Кухня': [
        'Власна кухня', 'Холодильник', 'Плита', 'Мікрохвильова піч', 'Електрочайник', 'Посуд',
        'Мийний засіб для посуду'
    ],
    'Техніка': [
        'Wi-Fi', 'Пральна машина', { name: 'Резервне електроживлення', description: 'генератор' }
    ],
    'Меблі': [
        'Ліжко', 'Комод', 'Обідній стіл'
    ],
    'Комфорт': [
        'Постіль', 'Кімнатні капці', 'Вішалки для одягу'
    ],
    'Санвузол': [
        'Власний санвузол', 'Душ/Ванна', 'Туалет', 'Рушники', 'Фен', 'Туалетний папір', 'Мило'
    ],
    'Опалення та клімат': [
        'Опалення газове', 'Опалення твердопаливне'
    ],
    'Послуги': [
        { name: 'Трансфер', paid: true },
        { name: 'Замовлення сніданку', paid: true },
        { name: 'Екскурсії', paid: true }
    ],
};
const rulesData = ['Можна з тваринами', 'Можна курити', 'Можна зі своїми продуктами'];

const customMarkerIcon = new L.Icon({
    iconUrl: 'https://cdn-icons-png.flaticon.com/512/684/684908.png',
    iconSize: [35, 35],
    iconAnchor: [17, 35],
    popupAnchor: [0, -35],
});

const ReviewsSection = ({ reviews, isLightTheme }) => {
    if (!reviews || reviews.length === 0) {
        return null;
    }

    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
    const averageRating = (totalRating / reviews.length).toFixed(1);

    return (
        <div className={`reviews-section ${isLightTheme ? '' : 'dark-theme-reviews'}`}>
            <Row align="middle" gutter={16}>
                <Col>
                    <Title level={4}>Відгуки ({reviews.length})</Title>
                </Col>
                <Col>
                    <Rate allowHalf disabled defaultValue={averageRating} />
                    <Text strong style={{ marginLeft: '8px' }}>{averageRating} з 5</Text>
                </Col>
            </Row>
            <Divider />
            <Space direction="vertical" style={{ width: '100%' }} size="large">
                {reviews.map(review => (
                    <Card key={review.id} className="review-card">
                        <Row justify="space-between" align="middle">
                            <Text strong>{review.author}</Text>
                            <Text type="secondary">{review.date}</Text>
                        </Row>
                        <Rate disabled defaultValue={review.rating} />
                        <p style={{ marginTop: '8px' }}>{review.comment}</p>
                    </Card>
                ))}
            </Space>
        </div>
    );
};

const ReviewForm = ({ isLightTheme, onSubmit }) => {
    const [form] = Form.useForm();
    const [submitting, setSubmitting] = useState(false);

    const onFinish = async (values) => {
        setSubmitting(true);
        await new Promise(resolve => setTimeout(resolve, 1000));
        onSubmit(values);
        setSubmitting(false);
        form.resetFields();
    };

    return (
        <Card className={`review-form-card ${isLightTheme ? '' : 'dark-theme-reviews'}`} title="Написати відгук">
            <Form
                form={form}
                layout="vertical"
                onFinish={onFinish}
            >
                <Form.Item
                    name="rating"
                    label="Ваша оцінка"
                    rules={[{ required: true, message: 'Будь ласка, поставте оцінку!' }]}
                >
                    <Rate />
                </Form.Item>
                <Form.Item
                    name="comment"
                    label="Коментар"
                    rules={[{ required: true, message: 'Будь ласка, напишіть коментар!' }]}
                >
                    <TextArea rows={4} placeholder="Поділіться своїми враженнями від помешкання" />
                </Form.Item>
                <Form.Item>
                    <Button type="primary" htmlType="submit" loading={submitting}>
                        Відправити відгук
                    </Button>
                </Form.Item>
            </Form>
        </Card>
    );
};

const ListingPage = ({ isLightTheme }) => {
    const { id } = useParams();
    const [listing, setListing] = useState(null);
    const [loading, setLoading] = useState(true);
    const [previewVisible, setPreviewVisible] = useState(false);
    const [previewImage, setPreviewImage] = useState('');
    const [adults, setAdults] = useState(1);
    const [children, setChildren] = useState(0);
    const [checkInDate, setCheckInDate] = useState(null);
    const [checkOutDate, setCheckOutDate] = useState(null);
    const [totalPrice, setTotalPrice] = useState(0);
    const [nightsCount, setNightsCount] = useState(0);
    const [reviews, setReviews] = useState(mockReviews);

    const themeClass = isLightTheme ? 'light-theme' : 'dark-theme';

    useEffect(() => {
        setLoading(true);
        setTimeout(() => {
            setListing(mockListingData);
            setLoading(false);
        }, 1000);
    }, [id]);

    useEffect(() => {
        if (checkInDate && checkOutDate && listing) {
            const nights = checkOutDate.diff(checkInDate, 'day');
            setNightsCount(nights);
            
            const basePrice = listing.basePrice;
            let finalPrice = nights * basePrice;

            setTotalPrice(finalPrice);
        } else {
            setTotalPrice(0);
            setNightsCount(0);
        }
    }, [checkInDate, checkOutDate, listing]);

    const handlePreview = (photoUrl) => {
        setPreviewImage(photoUrl);
        setPreviewVisible(true);
    };

    const handleBooking = () => {
        if (!checkInDate || !checkOutDate || nightsCount <= 0 || (adults + children) <= 0) {
            Modal.error({
                title: 'Помилка бронювання',
                content: 'Будь ласка, оберіть дати та кількість гостей.',
            });
            return;
        }

        const bookingDetails = {
            listingId: listing.id,
            checkIn: checkInDate.format('YYYY-MM-DD'),
            checkOut: checkOutDate.format('YYYY-MM-DD'),
            adults,
            children,
            totalPrice,
        };

        console.log('Дані для бронювання:', bookingDetails);
        Modal.success({
            title: 'Бронювання успішне!',
            content: `Ви забронювали ${listing.title} на ${nightsCount} ночей. Загальна сума: ${totalPrice} грн.`,
        });
    };

    const handleReviewSubmit = ({ rating, comment }) => {
        const newReview = {
            id: reviews.length + 1,
            author: 'Ви',
            rating: rating,
            date: dayjs().format('YYYY-MM-DD'),
            comment: comment,
        };
        setReviews([...reviews, newReview]);
        Modal.success({
            title: 'Відгук відправлено!',
            content: 'Дякуємо за ваш відгук!',
        });
    };

    // Виправлена функція для відключення минулих дат
    const disabledDate = (current) => {
        return current && current.isBefore(dayjs().startOf('day'));
    };
    
    // Виправлена функція для відключення дат у календарі виїзду
    const disabledCheckOutDate = (current) => {
        if (!checkInDate) {
            return disabledDate(current);
        }
        return current && current.isSameOrBefore(checkInDate, 'day');
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
                        <Card className="booking-card" bordered={true}>
                            <Title level={3} style={{ textAlign: 'center' }}>
                                Ціна за ніч: <span style={{ color: '#007bff' }}>{listing.basePrice} грн</span>
                            </Title>
                            <Divider />
                            <Space direction="vertical" style={{ width: '100%' }}>
                                <Text strong>Дата заїзду</Text>
                                <DatePicker
                                    onChange={setCheckInDate}
                                    style={{ width: '100%' }}
                                    format="YYYY-MM-DD"
                                    disabledDate={disabledDate}
                                    value={checkInDate}
                                    className={isLightTheme ? '' : 'dark-theme-datepicker'}
                                />
                                <Text strong>Дата виїзду</Text>
                                <DatePicker
                                    onChange={setCheckOutDate}
                                    style={{ width: '100%' }}
                                    format="YYYY-MM-DD"
                                    disabledDate={disabledCheckOutDate}
                                    value={checkOutDate}
                                    className={isLightTheme ? '' : 'dark-theme-datepicker'}
                                />
                                <Text strong style={{ marginTop: '1rem' }}>Кількість гостей</Text>
                                <Space direction="vertical" style={{ width: '100%' }}>
                                    <Space style={{ width: '100%', justifyContent: 'space-between' }}>
                                        <Text>Дорослі</Text>
                                        <InputNumber
                                            min={1}
                                            max={listing.guests}
                                            value={adults}
                                            onChange={setAdults}
                                            className="guest-input"
                                        />
                                    </Space>
                                    <Space style={{ width: '100%', justifyContent: 'space-between' }}>
                                        <Text>Діти</Text>
                                        <InputNumber
                                            min={0}
                                            max={listing.guests - adults}
                                            value={children}
                                            onChange={setChildren}
                                            className="guest-input"
                                        />
                                    </Space>
                                </Space>
                                <Divider />
                                {checkInDate && checkOutDate && nightsCount > 0 && (
                                    <>
                                        <div className="price-line">
                                            <Text>{listing.basePrice} грн x {nightsCount} {nightsCount === 1 ? 'ніч' : 'ночі'}</Text>
                                            <Text>{totalPrice} грн</Text>
                                        </div>
                                        <Divider />
                                        <div className="price-line">
                                            <Text strong>Всього</Text>
                                            <Text strong style={{ fontSize: '1.2rem' }}>{totalPrice} грн</Text>
                                        </div>
                                    </>
                                )}
                                <Button
                                    type="primary"
                                    size="large"
                                    style={{ width: '100%', marginTop: '1rem' }}
                                    onClick={handleBooking}
                                >
                                    Забронювати
                                </Button>
                            </Space>
                            <div style={{ textAlign: 'center', marginTop: '1rem' }}>
                                <Button type="text" icon={<HeartOutlined />} className="wishlist-btn">
                                    Додати в обране
                                </Button>
                            </div>
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
                            open={previewVisible}
                            title={null}
                            footer={null}
                            onCancel={() => setPreviewVisible(false)}
                            wrapClassName="image-modal-no-border"
                            width={1000}
                        >
                            <img alt="Preview" style={{ width: '100%' }} src={previewImage} />
                        </Modal>

                        <Title level={2} style={{ marginTop: 20 }}>{listing.title}</Title>
                        <Text className="listing-meta">
                            {listing.guests} гостей · {listing.rooms} спальні · {listing.bathrooms} ванна
                        </Text>
                        <Divider />
                        
                        <Title level={4}>Опис помешкання</Title>
                        <Text>{listing.description}</Text>
                        <Divider />
                        
                        <Title level={4}>Зручності</Title>
                        <Collapse defaultActiveKey={['0']} bordered={false} className={isLightTheme ? '' : 'dark-theme-collapse'}>
                            {Object.entries(amenitiesData).map(([category, items], index) => {
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
                                                        {item.description && <Text type="secondary"> ({item.description})</Text>}
                                                        {item.paid && <Text type="secondary"> ({item.price || 'Платно'})</Text>}
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

                        <ReviewForm isLightTheme={isLightTheme} onSubmit={handleReviewSubmit} />
                        <Divider />

                        <ReviewsSection reviews={reviews} isLightTheme={isLightTheme} />
                    </Col>
                </Row>
            </Card>
        </div>
    );
};

export default ListingPage;