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
    Modal,
    message
} from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet'; // Додано useMapEvents
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import "antd/dist/reset.css";
import '../createListing/CreateListing.css';

const { TextArea } = Input;
const { Title, Text } = Typography;
const { Panel } = Collapse;

// Прибираємо мок-дані для нової логіки
const mockSellingData = {
    title: 'Продаж затишного будинку з ділянкою',
    sellingPrice: 150000,
    livingArea: 120,
    landArea: 10,
    numberOfRooms: 4,
    numberOfFloors: 2,
    type: 'Котедж',
    amenities: {
        'Технічні характеристики': {
            'Електрика': true,
            'Газ': true,
            'Вода': false,
            'Каналізація': true,
        },
        'Особливості ділянки': {
            'Цільове призначення': true,
        }
    },
    description: 'Просторий будинок для постійного проживання з чудовим садом та усіма комунікаціями.',
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

const listingTypes = [
    'Будинок',
    'Квартира',
    'Вілла',
];

const customMarkerIcon = new L.Icon({
    iconUrl: 'https://cdn-icons-png.flaticon.com/512/684/684908.png',
    iconSize: [35, 35],
    iconAnchor: [17, 35],
    popupAnchor: [0, -35],
});

const salesFeaturesData = {
    'Технічні характеристики': [
        'Електрика', 'Газ', 'Вода', 'Каналізація',
    ],
    'Особливості ділянки': [
        { name: 'ЖК', description: 'Чи входить квартира/будинок в житловий комплекс' },
        'Охорона',
        'Асфальтований під’їзд',
        'Огорожа по всьому периметру'
    ],
    'Інфраструктура': [
        'Магазин', 'Школа', 'Дитячий садок', 'Лікарня', 'Зупинка транспорту'
    ],
};

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

const CreateSelling = ({ isLightTheme }) => {
    const { id } = useParams();
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [nearByAmenities, setNearByAmenities] = useState([{ name: '', distance: '' }]);
    const [fileList, setFileList] = useState([]);
    const [amenities, setAmenities] = useState({});
    const [location, setLocation] = useState({
        lat: 49.4431,
        lng: 32.0745,
    });
    const [selectedType, setSelectedType] = useState(null);

    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewImage, setPreviewImage] = useState('');

    const isEditMode = !!id;

    // Створення компонента-обробника кліків на карті
    const MapEventHandler = () => {
        useMapEvents({
            click: (e) => {
                setLocation(e.latlng); // Оновлює стан локації при кліку
                message.info(`Координати оновлено: ${e.latlng.lat.toFixed(4)}, ${e.latlng.lng.toFixed(4)}`);
            },
        });
        return null;
    };

    useEffect(() => {
        if (isEditMode) {
            setLoading(true);
            setTimeout(() => {
                const data = mockSellingData;
                form.setFieldsValue({
                    title: data.title,
                    sellingPrice: data.sellingPrice,
                    livingArea: data.livingArea,
                    landArea: data.landArea,
                    numberOfRooms: data.numberOfRooms,
                    numberOfFloors: data.numberOfFloors,
                    description: data.description,
                    address: 'Імітована адреса',
                });
                setNearByAmenities(data.nearByAmenities);
                setAmenities(data.amenities);
                setLocation(data.location);
                setFileList(data.photos);
                setSelectedType(data.type);
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

    const handleAmenityChange = (category, name, isChecked) => {
        setAmenities(prev => {
            const newAmenities = { ...prev, [category]: prev[category] || {} };
            newAmenities[category][name] = isChecked;
            return newAmenities;
        });
    };

    const handleTypeChange = (type) => {
        setSelectedType(type);
    };

    const onFinish = async (values) => {
        setLoading(true);
        const userId = localStorage.getItem('userId');
        if (!userId) {
            message.error("Не вдалося знайти ID користувача. Будь ласка, увійдіть знову.");
            setLoading(false);
            return;
        }

        const payload = {
            ...values,
            userId: userId,
            type: selectedType,
            amenities,
            location, // Тут тепер будуть координати, обрані на карті
            photos: fileList.map(f => f.url || f.response),
        };

        if (isEditMode) {
            try {
                const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/sales/${id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(payload),
                });
                if (response.ok) {
                    alert('Оголошення успішно оновлено!');
                } else {
                    alert('Помилка оновлення оголошення.');
                }
            } catch (error) {
                console.error("Error updating listing:", error);
                alert('Помилка з\'єднання з сервером.');
            } finally {
                setLoading(false);
            }
        } else {
            try {
                const response = await fetch('http://localhost:8080/api/sales/add', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(payload),
                });

                if (response.ok) {
                    alert('Оголошення успішно розміщено! Воно проходить перевірку і незабаром буде опубліковано.');
                    form.resetFields();
                    setFileList([]);
                    setAmenities({});
                    setSelectedType(null);
                } else {
                    alert('Помилка при розміщенні оголошення.');
                }
            } catch (error) {
                console.error("Error creating listing:", error);
                alert('Помилка з\'єднання з сервером.');
            } finally {
                setLoading(false);
            }
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
                    {isEditMode ? 'Редагувати оголошення' : 'Створити оголошення про продаж'}
                </Title>

                <Form form={form} layout="vertical" onFinish={onFinish}>
                    <Form.Item
                        name="title"
                        label={<Text>Назва</Text>}
                        rules={[{ required: true, message: "Будь ласка, введіть назву" }]}
                    >
                        <Input placeholder="Наприклад: Затишний будинок з великою ділянкою" allowClear />
                    </Form.Item>

                    <Title level={4} className="form-subtitle">Тип житла</Title>
                    <Collapse defaultActiveKey={['1']} className="amenities-collapse">
                        <Panel header={<Text>Оберіть один тип</Text>} key="1">
                            <Space direction="vertical" style={{ width: '100%' }}>
                                {listingTypes.map((type, index) => (
                                    <label key={index} className="dp-dailypage-checkbox" style={{ color: isLightTheme ? "black" : "white" }}>
                                        <input
                                            type="checkbox"
                                            checked={selectedType === type}
                                            onChange={() => handleTypeChange(type)}
                                        />
                                        <span>{type}</span>
                                    </label>
                                ))}
                            </Space>
                        </Panel>
                    </Collapse>

                    <Form.Item label={<Text>Фотографії</Text>} style={{ marginTop: '1rem' }}>
                        <Upload
                            listType="picture-card"
                            fileList={fileList}
                            onPreview={handlePreview}
                            onChange={handleFileUpload}
                            beforeUpload={async (file) => {
                                const watermarkedFile = await applyWatermark(file);
                                const newFile = {
                                    uid: file.uid || Math.random().toString(36).substring(2),
                                    name: file.name,
                                    status: 'done',
                                    url: URL.createObjectURL(watermarkedFile),
                                    originFileObj: watermarkedFile,
                                };
                                setFileList((prevList) => [...prevList, newFile]);
                                return false;
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

                    <Modal open={previewOpen} title={null} footer={null} onCancel={() => setPreviewOpen(false)}>
                        <img alt="Preview" style={{ width: '100%' }} src={previewImage} />
                    </Modal>

                    <Title level={4} className="form-subtitle">Характеристики</Title>
                    <Row gutter={16} style={{ marginBottom: '1rem' }}>
                        <Col xs={24} sm={12}>
                            <Form.Item
                                name="livingArea"
                                label={<Text>Площа житла (кв.м)</Text>}
                                rules={[{ required: true, message: "Обов'язкове поле" }]}
                            >
                                <InputNumber min={1} style={{ width: '100%' }} />
                            </Form.Item>
                        </Col>
                        <Col xs={24} sm={12}>
                            <Form.Item
                                name="landArea"
                                label={<Text>Площа ділянки (соток)</Text>}
                            >
                                <InputNumber min={0} style={{ width: '100%' }} />
                            </Form.Item>
                        </Col>
                        <Col xs={24} sm={12}>
                            <Form.Item
                                name="numberOfRooms"
                                label={<Text>Кількість кімнат</Text>}
                                rules={[{ required: true, message: "Обов'язкове поле" }]}
                            >
                                <InputNumber min={1} style={{ width: '100%' }} />
                            </Form.Item>
                        </Col>
                        <Col xs={24} sm={12}>
                            <Form.Item
                                name="numberOfFloors"
                                label={<Text>Кількість поверхів</Text>}
                                rules={[{ required: true, message: "Обов'язкове поле" }]}
                            >
                                <InputNumber min={1} style={{ width: '100%' }} />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Title level={4} className="form-subtitle">Ціна</Title>
                    <Form.Item
                        name="sellingPrice"
                        label={<Text>Ціна продажу (USD)</Text>}
                        rules={[{ required: true, message: "Будь ласка, вкажіть ціну" }]}
                    >
                        <InputNumber min={0} style={{ width: '100%' }} formatter={value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')} />
                    </Form.Item>

                    <Title level={4} className="form-subtitle">Особливості</Title>
                    <Collapse defaultActiveKey={['0']} className="amenities-collapse">
                        {Object.entries(salesFeaturesData).map(([category, items], index) => (
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
                        <Text strong style={{ marginBottom: '10px', display: 'block' }}>Клікніть на карті, щоб встановити розташування</Text>
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
                            <MapEventHandler /> {/* Додано обробник подій */}
                            <Marker position={[location.lat, location.lng]} icon={customMarkerIcon}>
                                <Popup>
                                    Точне розташування вашого помешкання
                                </Popup>
                            </Marker>
                        </MapContainer>
                    </div>

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

export default CreateSelling;