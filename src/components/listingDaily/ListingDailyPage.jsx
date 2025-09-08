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
    DatePicker,
    InputNumber,
    Button,
    Rate,
    Input,
    Form,
    notification,
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

import { dispatchFavoriteUpdate } from '../../layout/header&footer/Header';

dayjs.extend(isSameOrBefore);

const { Title, Text } = Typography;
const { Panel } = Collapse;
const { TextArea } = Input;

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

const ListingDailyPage = ({ isLightTheme, loggedInUserId }) => {
    const { id } = useParams();
    const navigate = useNavigate();
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
    const [reviews, setReviews] = useState([]);
    const [bookedDates, setBookedDates] = useState([]);
    const [isLiked, setIsLiked] = useState(false);

    const themeClass = isLightTheme ? 'light-theme' : 'dark-theme';

    const getLikedStatus = (itemId) => {
        try {
            const likedItems = JSON.parse(localStorage.getItem('likedItemsDaily')) || [];
            return likedItems.includes(itemId);
        } catch (error) {
            console.error("Помилка при читанні likedItemsDaily з localStorage:", error);
            return false;
        }
    };

    useEffect(() => {
        const fetchListing = async () => {
            setLoading(true);
            try {
                const response = await fetch(`${process.env.REACT_APP_API_URL}/listings/${id}`); 
                if (!response.ok) {
                    throw new Error('Оголошення не знайдено');
                }
                const data = await response.json();
                
                if (data) {
                    const updatedPhotos = data.photos.map(photo => `${process.env.REACT_APP_API_BASE_URL}/${photo}`);
                    setListing({ ...data, photos: updatedPhotos, pricePerNight: data.basePrice });
                    setBookedDates(data.bookedDates.map(date => dayjs(date))); 
                    setIsLiked(getLikedStatus(id));
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

    useEffect(() => {
        if (checkInDate && checkOutDate) {
            const nights = checkOutDate.diff(checkInDate, 'day');
            if (nights > 0 && listing) {
                setNightsCount(nights);
                const basePrice = listing.pricePerNight; 
                const finalPrice = nights * basePrice;
                setTotalPrice(finalPrice);
            } else {
                setNightsCount(0);
                setTotalPrice(0);
            }
        } else {
            setNightsCount(0);
            setTotalPrice(0);
        }
    }, [checkInDate, checkOutDate, listing]);

    const handlePreview = (photoUrl) => {
        setPreviewImage(photoUrl);
        setPreviewVisible(true);
    };

    const handleBooking = () => {
        if (!loggedInUserId) {
            notification.warning({
                message: 'Помилка',
                description: 'Будь ласка, увійдіть у свій обліковий запис, щоб забронювати помешкання.',
            });
            navigate('/login');
            return;
        }

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
            content: 'Ваше замовлення відправлено на розгляд.',
        });
    };

    const handleLikeClick = () => {
            // Захист від відсутності оголошення
            if (!listing || !listing.id) {
                return;
            }
    
            try {
                const likedItems = JSON.parse(localStorage.getItem('likedItemsDaily')) || [];
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
                localStorage.setItem('likedItemsDaily', JSON.stringify(updatedLikedItems));
                // Оновлюємо локальний стан
                setIsLiked(!isCurrentlyLiked);
                // Відправляємо подію для оновлення Header
                dispatchFavoriteUpdate();
    
            } catch (error) {
                console.error("Помилка при оновленні likedItemsDily:", error);
                notification.error({
                    message: 'Помилка',
                    description: 'Не вдалося оновити список обраного.',
                });
            }
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

    const disabledDate = (current) => {
        const isPastDate = current && current.isBefore(dayjs().startOf('day'));
        const isBooked = bookedDates.some(date => date.isSame(current, 'day'));
        return isPastDate || isBooked;
    };

    const disabledCheckOutDate = (current) => {
        if (!checkInDate) {
            return true; // Вимикаємо календар виїзду, доки не обрана дата заїзду
        }
    
        const isBeforeCheckIn = current.isSameOrBefore(checkInDate, 'day');
        
        // Перевіряємо, чи є заброньовані дати між checkInDate та поточною датою (current)
        const hasBookedDateInBetween = bookedDates.some(bookedDate => 
            bookedDate.isAfter(checkInDate, 'day') && bookedDate.isSameOrBefore(current, 'day')
        );

        return isBeforeCheckIn || hasBookedDateInBetween || disabledDate(current);
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
                                Ціна за ніч: <span style={{ color: '#007bff' }}>{listing.pricePerNight} грн</span>
                            </Title>
                            <Divider />
                            <Space direction="vertical" style={{ width: '100%' }}>
                                <Text strong>Дата заїзду</Text>
                                <DatePicker
                                    onChange={(date) => {
                                        setCheckInDate(date);
                                        setCheckOutDate(null); // Скидаємо дату виїзду при зміні дати заїзду
                                    }}
                                    style={{ width: '100%' }}
                                    format="YYYY-MM-DD"
                                    disabledDate={disabledDate}
                                    value={checkInDate}
                                    className={isLightTheme ? '' : 'dark-theme-datepicker'}
                                    placeholder="Оберіть дату заїзду"
                                />
                                <Text strong>Дата виїзду</Text>
                                <DatePicker
                                    onChange={setCheckOutDate}
                                    style={{ width: '100%' }}
                                    format="YYYY-MM-DD"
                                    disabledDate={disabledCheckOutDate}
                                    value={checkOutDate}
                                    className={isLightTheme ? '' : 'dark-theme-datepicker'}
                                    placeholder="Оберіть дату виїзду"
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
                                            <Text>{listing.pricePerNight} грн x {nightsCount} {nightsCount === 1 ? 'ніч' : 'ночі'}</Text>
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
                            <Button
                                type="text"
                                icon={<HeartOutlined style={{ color: isLiked ? 'red' : 'inherit' }} />}
                                style={{marginTop: '1rem'}}
                                className="wishlist-btn"
                                onClick={handleLikeClick}
                                disabled={loading}
                            >
                                {isLiked ? 'Видалити з обраного' : 'Додати в обране'}
                            </Button>
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
                            місця: {listing.beds} · кімнати: {listing.rooms} · санвузлів: {listing.bathrooms}
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

export default ListingDailyPage;