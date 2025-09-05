import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
    Form,
    Input,
    InputNumber,
    Button,
    Upload,
    Space,
    Card,
    Typography,
    Collapse,
    Row,
    Col,
    Spin,
    Modal // Додаємо Modal для перегляду фото
} from 'antd';
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import "antd/dist/reset.css";
import './CreateListing.css';
import dayjs from 'dayjs';

const { TextArea } = Input;
const { Title, Text } = Typography;
const { Panel } = Collapse;

// Імітація даних, які прийшли б з API
const mockListingData = {
    title: 'Затишна квартира біля парку',
    guests: 4,
    rooms: 2,
    bathrooms: 1,
    basePrice: 1500,
    specialPrices: [
        { checkIn: dayjs('2025-12-24'), checkOut: dayjs('2025-12-31'), price: 2000 },
    ],
    amenities: {
        'Зручності на території': {
            'Альтанка': true,
            'Мангал та шампури': true
        },
        'Кухня': {
            'Власна кухня': true,
            'Холодильник': true
        }
    },
    rules: {
        'Можна з тваринами': true
    },
    description: 'Це чудове помешкання з усіма зручностями та фантастичним краєвидом.',
    nearByAmenities: [
        { name: 'Супермаркет', distance: 0.5 },
        { name: 'Парк', distance: 0.2 },
    ],
    location: { lat: 49.4431, lng: 32.0745 },
    photos: [
        { uid: '1', name: 'photo1.png', status: 'done', url: 'https://via.placeholder.com/150' },
        { uid: '2', name: 'photo2.png', status: 'done', url: 'https://via.placeholder.com/150' },
    ]
};

const customMarkerIcon = new L.Icon({
    iconUrl: 'https://cdn-icons-png.flaticon.com/512/684/684908.png',
    iconSize: [35, 35],
    iconAnchor: [17, 35],
    popupAnchor: [0, -35],
});

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

const rulesData = [
    'Можна з тваринами',
    'Можна курити',
    'Можна зі своїми продуктами',
];

// Функція для накладання водяного знака
const applyWatermark = (file) => {
    return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            const img = new Image();
            img.onload = () => {
                const canvas = document.createElement('canvas');
                canvas.width = img.width;
                canvas.height = img.height;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0);

                const watermarkText = 'House24';
                const fontSize = Math.floor(img.width / 20);
                ctx.font = `bold ${fontSize}px Arial`;
                ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
                ctx.textAlign = 'right';
                ctx.textBaseline = 'bottom';
                ctx.fillText(watermarkText, img.width - 20, img.height - 20);

                canvas.toBlob((blob) => {
                    const watermarkedFile = new File([blob], file.name, { type: file.type });
                    resolve(watermarkedFile);
                }, file.type);
            };
            img.src = e.target.result;
        };
        reader.readAsDataURL(file);
    });
};

const CreateListing = ({ isLightTheme }) => {
    const { id } = useParams();
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [nearByAmenities, setNearByAmenities] = useState([{ name: '', distance: '' }]);
    const [fileList, setFileList] = useState([]);
    const [amenities, setAmenities] = useState({});
    const [rules, setRules] = useState({});
    const [specialPrices, setSpecialPrices] = useState([{ checkIn: null, checkOut: null, price: null }]);
    const [location, setLocation] = useState({
        lat: 49.4431,
        lng: 32.0745,
    });

    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewImage, setPreviewImage] = useState('');

    const isEditMode = !!id;

    useEffect(() => {
        if (isEditMode) {
            setLoading(true);
            setTimeout(() => {
                const data = mockListingData;
                form.setFieldsValue({
                    title: data.title,
                    guests: data.guests,
                    rooms: data.rooms,
                    bathrooms: data.bathrooms,
                    basePrice: data.basePrice,
                    description: data.description,
                    address: 'Імітована адреса',
                });
                setNearByAmenities(data.nearByAmenities);
                setSpecialPrices(data.specialPrices);
                setAmenities(data.amenities);
                setRules(data.rules);
                setLocation(data.location);
                setFileList(data.photos);
                setLoading(false);
            }, 1000);
        }
    }, [isEditMode, form, id]);

    const themeClass = isLightTheme ? 'light-theme' : 'dark-theme';

    const handleFileUpload = ({ fileList }) => {
        setFileList(fileList);
    };

    const handlePreview = async (file) => {
        if (!file.url && !file.preview) {
            file.preview = await new Promise((resolve) => {
                const reader = new FileReader();
                reader.readAsDataURL(file.originFileObj);
                reader.onload = () => resolve(reader.result);
            });
        }
        setPreviewImage(file.url || file.preview);
        setPreviewOpen(true);
    };

    const handleNearByChange = (index, key, value) => {
        const newAmenities = [...nearByAmenities];
        newAmenities[index][key] = value;
        setNearByAmenities(newAmenities);
        if (index === newAmenities.length - 1 && newAmenities[index].name !== '' && newAmenities[index].distance !== '') {
            setNearByAmenities([...newAmenities, { name: '', distance: '' }]);
        }
    };

    const handleRemoveNearBy = (index) => {
        const newAmenities = nearByAmenities.filter((_, i) => i !== index);
        setNearByAmenities(newAmenities);
    };

    const handleAmenityChange = (category, name, isChecked) => {
        setAmenities(prev => {
            const newAmenities = { ...prev, [category]: prev[category] || {} };
            newAmenities[category][name] = isChecked;
            return newAmenities;
        });
    };

    const handleRuleChange = (rule, isChecked) => {
        setRules(prev => ({
            ...prev,
            [rule]: isChecked,
        }));
    };

    const onFinish = (values) => {
        const payload = {
            ...values,
            specialPrices: specialPrices.filter(p => p.checkIn && p.checkOut && p.price).map(p => ({
                checkIn: p.checkIn.format('YYYY-MM-DD'),
                checkOut: p.checkOut.format('YYYY-MM-DD'),
                price: p.price,
            })),
            nearByAmenities,
            amenities,
            rules,
            location,
            photos: fileList.map(f => f.response || f.name),
        };

        if (isEditMode) {
            console.log('Дані для оновлення:', { id, ...payload });
        } else {
            console.log('Дані для створення:', payload);
        }
    };

    if (isEditMode && loading) {
        return (
            <div className={`create-listing-page ${themeClass}`} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
                <Spin size="large" tip="Завантаження даних..." />
            </div>
        );
    }

    return (
        <div className={`create-listing-page ${themeClass}`}>
            <Card className="create-listing-card">
                <Title level={2} className="form-title">
                    {isEditMode ? 'Редагувати оголошення' : 'Створити нове оголошення'}
                </Title>

                <Form form={form} layout="vertical" onFinish={onFinish}>
                    <Form.Item
                        name="title"
                        label={<Text>Назва</Text>}
                        rules={[{ required: true, message: "Будь ласка, введіть назву" }]}
                    >
                        <Input placeholder="Наприклад: Затишна квартира в центрі" allowClear />
                    </Form.Item>

                    <Form.Item label={<Text>Фотографії</Text>}>
                        <Upload
                            listType="picture-card"
                            fileList={fileList}
                            onPreview={handlePreview}
                            onChange={handleFileUpload}
                            beforeUpload={async (file) => {
                                const watermarkedFile = await applyWatermark(file);
                                // Створюємо новий файл об'єкт для Ant Design з URL
                                const newFile = {
                                    uid: file.uid || Math.random().toString(36).substring(2),
                                    name: file.name,
                                    status: 'done',
                                    url: URL.createObjectURL(watermarkedFile),
                                    originFileObj: watermarkedFile,
                                };
                                setFileList((prevList) => [...prevList, newFile]);
                                return false; // Запобігаємо стандартному завантаженню
                            }}
                            multiple
                        >
                            {fileList.length < 8 && (
                                <div className="upload-icon-container">
                                    <PlusOutlined />
                                    <div>Завантажити</div>
                                </div>
                            )}
                        </Upload>
                    </Form.Item>
                    
                    {/* Модальне вікно для попереднього перегляду фото */}
                    <Modal open={previewOpen} title={null} footer={null} onCancel={() => setPreviewOpen(false)}>
                        <img alt="Preview" style={{ width: '100%' }} src={previewImage} />
                    </Modal>

                    <Row gutter={16} style={{ marginBottom: '1rem' }}>
                        <Col xs={24} sm={8}>
                            <Form.Item
                                name="guests"
                                label={<Text>Кількість гостей</Text>}
                                rules={[{ required: true, message: "Обов'язкове поле" }]}
                            >
                                <InputNumber min={1} style={{ width: '100%' }} />
                            </Form.Item>
                        </Col>
                        <Col xs={24} sm={8}>
                            <Form.Item
                                name="rooms"
                                label={<Text>Кількість кімнат</Text>}
                                rules={[{ required: true, message: "Обов'язкове поле" }]}
                            >
                                <InputNumber min={1} style={{ width: '100%' }} />
                            </Form.Item>
                        </Col>
                        <Col xs={24} sm={8}>
                            <Form.Item
                                name="bathrooms"
                                label={<Text>Кількість санвузлів</Text>}
                                rules={[{ required: true, message: "Обов'язкове поле" }]}
                            >
                                <InputNumber min={1} style={{ width: '100%' }} />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Title level={4} className="form-subtitle">Ціни</Title>
                    <Form.Item
                        name="basePrice"
                        label={<Text>Базова ціна за ніч</Text>}
                        rules={[{ required: true, message: "Будь ласка, вкажіть ціну" }]}
                    >
                        <InputNumber min={0} style={{ width: '100%' }} />
                    </Form.Item>

                    <Title level={4} className="form-subtitle">Зручності</Title>
                    <Collapse defaultActiveKey={['0']} className="amenities-collapse">
                        {Object.entries(amenitiesData).map(([category, items], index) => (
                            <Panel
                                header={<Text>{category}</Text>}
                                key={index}
                            >
                                <Space direction="vertical" style={{ width: '100%' }}>
                                    {items.map((item, i) => {
                                        const itemName = typeof item === 'string' ? item : item.name;

                                        return (
                                            <label key={i} className="mp-monthlypage-checkbox">
                                                <input
                                                    type="checkbox"
                                                    checked={!!(amenities[category] || {})[itemName]}
                                                    onChange={(e) => handleAmenityChange(category, itemName, e.target.checked)}
                                                />
                                                <span>
                                                    {itemName}
                                                    {item.description && (
                                                        <span className="amenity-description"> ({item.description})</span>
                                                    )}
                                                    {item.paid && (
                                                        <span className="amenity-price"> ({item.price || 'Платно'})</span>
                                                    )}
                                                </span>
                                            </label>
                                        );
                                    })}
                                </Space>
                            </Panel>
                        ))}
                    </Collapse>

                    <Title level={4} className="form-subtitle" style={{ marginTop: 20 }}>Короткий опис</Title>
                    <Form.Item
                        name="description"
                        rules={[{ required: true, message: "Будь ласка, додайте короткий опис" }]}
                        style={{ marginTop: '20px' }}
                    >
                        <TextArea
                            rows={6}
                            placeholder="Напишіть про помешкання, його переваги та особливості."
                        />
                    </Form.Item>

                    <Title level={4} className="form-subtitle">Що є поруч</Title>
                    <div style={{ width: '100%' }}>
                        {nearByAmenities.map((item, index) => (
                            <div key={index} style={{ display: 'flex', alignItems: 'flex-start', marginBottom: '8px' }}>
                                <Input
                                    placeholder="Назва місця"
                                    value={item.name}
                                    onChange={(e) => handleNearByChange(index, 'name', e.target.value)}
                                    style={{ width: '67%', marginRight: '8px', height: 28 }}
                                />
                                <InputNumber
                                    placeholder="Відстань (км)"
                                    value={item.distance}
                                    onChange={(value) => handleNearByChange(index, 'distance', value)}
                                    min={0}
                                    style={{ width: '25%' }}
                                />
                                {nearByAmenities.length > 1 && (
                                    <Button
                                        type="text"
                                        danger
                                        icon={<DeleteOutlined />}
                                        onClick={() => handleRemoveNearBy(index)}
                                    />
                                )}
                            </div>
                        ))}
                    </div>

                    <Title level={4} className="form-subtitle">Локація</Title>
                    <Form.Item
                        name="address"
                        label={<Text>Адреса</Text>}
                        rules={[{ required: true, message: "Будь ласка, введіть адресу" }]}
                    >
                        <Input
                            placeholder="Введіть адресу для відображення на карті"
                            className="address-input"
                            allowClear
                        />
                    </Form.Item>
                    <div className="map-container">
                        <MapContainer
                            center={[location.lat, location.lng]}
                            zoom={13}
                            scrollWheelZoom={false}
                            style={{ height: "400px", width: "100%" }}
                        >
                            <TileLayer
                                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                            />
                            <Marker position={[location.lat, location.lng]} icon={customMarkerIcon}>
                                <Popup>
                                    Точне розташування вашого помешкання
                                </Popup>
                            </Marker>
                        </MapContainer>
                    </div>

                    <Title level={4} className="form-subtitle">Правила проживання</Title>
                    <Space direction="vertical">
                        {rulesData.map((rule, index) => (
                            <label key={index} className="mp-monthlypage-checkbox">
                                <input
                                    type="checkbox"
                                    checked={!!rules[rule]}
                                    onChange={(e) => handleRuleChange(rule, e.target.checked)}
                                />
                                <span>{rule}</span>
                            </label>
                        ))}
                    </Space>

                    <Form.Item style={{ marginTop: '2rem' }}>
                        <Button type="primary" htmlType="submit" style={{ width: '100%' }}>
                            {isEditMode ? 'Оновити оголошення' : 'Розмістити оголошення'}
                        </Button>
                    </Form.Item>
                </Form>
            </Card>
        </div>
    );
};

export default CreateListing;