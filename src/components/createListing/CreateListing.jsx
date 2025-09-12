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
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import "antd/dist/reset.css";
import './CreateListing.css';

// Helper to remove the default Leaflet icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const { TextArea } = Input;
const { Title, Text } = Typography;
const { Panel } = Collapse;

const listingTypes = [
    'Готель', 'Квартира', 'Хостел', 'Міні готель', 'Приватна садиба',
    'Вілла', 'Котедж', 'База відпочинку', 'Шале', 'Спа готель'
];

const customMarkerIcon = new L.Icon({
    iconUrl: 'https://cdn-icons-png.flaticon.com/512/684/684908.png',
    iconSize: [35, 35],
    iconAnchor: [17, 35],
    popupAnchor: [0, -35],
});

const amenitiesData = {
    'Зручності на території': ['Альтанка', 'Мангал та шампури', { name: 'Решітка для вогню' },
        { name: 'Дрова для мангалу', paid: true, price: '200 грн/ящик' },
        'Гойдалка', 'Камери відеоспостереження на території', 'Огорожа по всьому периметру',
        'Безкоштовна парковка'],
    'Кухня': ['Власна кухня', 'Холодильник', 'Плита', 'Мікрохвильова піч', 'Електрочайник', 'Посуд',
        'Мийний засіб для посуду'],
    'Техніка': ['Wi-Fi', 'Пральна машина', { name: 'Резервне електроживлення', description: 'генератор' }],
    'Меблі': ['Ліжко', 'Комод', 'Обідній стіл'],
    'Комфорт': ['Постіль', 'Кімнатні капці', 'Вішалки для одягу'],
    'Санвузол': ['Власний санвузол', 'Душ/Ванна', 'Туалет', 'Рушники', 'Фен', 'Туалетний папір', 'Мило'],
    'Опалення та клімат': ['Опалення газове', 'Опалення твердопаливне'],
    'Послуги': [{ name: 'Трансфер', paid: true }, { name: 'Замовлення сніданку', paid: true }, { name: 'Екскурсії', paid: true }],
};

const rulesData = ['Можна з тваринами', 'Можна курити', 'Можна зі своїми продуктами'];

const applyWatermark = (file) => {
    return new Promise((resolve, reject) => {
        if (!(file instanceof Blob || file instanceof File)) {
            reject(new Error('Invalid file: not a Blob or File'));
            return;
        }
        const reader = new FileReader();
        reader.onload = (e) => {
            const img = new Image();
            img.onload = () => {
                const canvas = document.createElement('canvas');
                canvas.width = img.width;
                canvas.height = img.height;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0);
                const watermarkText = '24House';
                const fontSize = Math.floor(img.width / 20);
                ctx.font = `bold ${fontSize}px Arial`;
                ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
                
                // Виправлено для центрування водяного знака
                ctx.textAlign = 'center';
                ctx.textBaseline = 'bottom';
                
                // Тепер водяний знак розташований по центру внизу
                ctx.fillText(watermarkText, canvas.width / 2, canvas.height - 20);
                
                canvas.toBlob((blob) => {
                    const watermarkedFile = new File([blob], file.name, { type: file.type });
                    resolve(watermarkedFile);
                }, file.type);
            };
            img.onerror = () => reject(new Error('Failed to load image'));
            img.src = e.target.result;
        };
        reader.onerror = () => reject(new Error('Failed to read file'));
        reader.readAsDataURL(file);
    });
};

const CreateListing = ({ isLightTheme }) => {
    const { id } = useParams();
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [fileList, setFileList] = useState([]);
    const [amenities, setAmenities] = useState([]);
    const [rules, setRules] = useState([]);
    const [location, setLocation] = useState({
        lat: 49.4431, lng: 32.0745, address: '',
    });
    const [selectedType, setSelectedType] = useState(null);
    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewImage, setPreviewImage] = useState('');
    const [isUploading, setIsUploading] = useState(false);

    const isEditMode = !!id;

    const MapEventHandler = () => {
        useMapEvents({
            click: (e) => {
                setLocation({ ...location, lat: e.latlng.lat, lng: e.latlng.lng });
                message.info(`Координати оновлено: ${e.latlng.lat.toFixed(4)}, ${e.latlng.lng.toFixed(4)}`);
            },
        });
        return null;
    };

    useEffect(() => {
        if (isEditMode) {
            setLoading(true);
            fetch(`${process.env.REACT_APP_API_BASE_URL}/api/daily-listings/${id}`, {
                method: 'GET',
                credentials: 'include',
            })
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Failed to fetch listing');
                    }
                    return response.json();
                })
                .then(data => {
                    form.setFieldsValue({
                        title: data.title,
                        basePrice: data.basePrice,
                        beds: data.beds,
                        rooms: data.rooms,
                        bathrooms: data.bathrooms,
                        description: data.description,
                        address: data.location.city,
                    });
                    setLocation({
                        lat: data.location.lat,
                        lng: data.location.lng,
                        address: data.location.city,
                    });
                    setAmenities(data.amenities || []);
                    setRules(data.rules || []);
                    const photos = data.photos || [];
                    setFileList(photos.map((url, index) => ({
                        uid: `${url}-${index}`, // Унікальний UID для кожного фото
                        name: `photo-${index}`,
                        status: 'done',
                        url,
                    })));
                    setSelectedType(data.type);
                    setLoading(false);
                })
                .catch(error => {
                    console.error("Error fetching listing:", error);
                    message.error('Помилка завантаження даних оголошення.');
                    setLoading(false);
                });
        }
    }, [isEditMode, form, id]);

    const themeClass = isLightTheme ? 'light-theme' : 'dark-theme';

    const handleFileUpload = async ({ file, fileList: newFileList }) => {
        // Оновлюємо fileList для відображення в UI
        const updatedFileList = newFileList.map(f => {
            if (f.uid === file.uid) {
                return { ...f, status: 'uploading' };
            }
            return f;
        });
        setFileList(updatedFileList);
        setIsUploading(true);

        const fileToProcess = newFileList.find(item => item.uid === file.uid);
        if (!fileToProcess || !fileToProcess.originFileObj) {
            setIsUploading(false);
            return;
        }

        try {
            const watermarkedFile = await applyWatermark(fileToProcess.originFileObj);
            const formData = new FormData();
            formData.append('file', watermarkedFile);

            const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/daily-listings/upload`, {
                method: 'POST',
                credentials: 'include',
                body: formData,
            });

            if (response.ok) {
                const data = await response.json();
                const finalFileList = updatedFileList.map(item =>
                    item.uid === file.uid ? { ...item, status: 'done', url: data.url } : item
                );
                setFileList(finalFileList);
                message.success(`${file.name} успішно завантажено.`);
            } else {
                const errorText = await response.text();
                const finalFileList = updatedFileList.map(item =>
                    item.uid === file.uid ? { ...item, status: 'error' } : item
                );
                setFileList(finalFileList);
                message.error(`Помилка завантаження ${file.name}: ${errorText}`);
            }
        } catch (error) {
            const finalFileList = updatedFileList.map(item =>
                item.uid === file.uid ? { ...item, status: 'error' } : item
            );
            setFileList(finalFileList);
            message.error(`Помилка завантаження ${file.name}: ${error.message}`);
        } finally {
            setIsUploading(false); // Завжди скидаємо стан, коли поточний файл оброблено
        }
    };

    const handlePreview = async (file) => {
        if (!file.url && !file.preview) {
            file.preview = await new Promise((resolve) => {
                const reader = new FileReader();
                reader.readAsDataURL(file.originFileObj || file);
                reader.onload = () => resolve(reader.result);
            });
        }
        setPreviewImage(file.url || file.preview);
        setPreviewOpen(true);
    };

    const handleRemoveFile = (file) => {
        const newFileList = fileList.filter(item => item.uid !== file.uid);
        setFileList(newFileList);
        return true;
    };

    const handleAmenityChange = (category, name, isChecked) => {
        setAmenities(prev => {
            if (isChecked) {
                return [...prev, name];
            } else {
                return prev.filter(item => item !== name);
            }
        });
    };

    const handleRuleChange = (rule, isChecked) => {
        setRules(prev => {
            if (isChecked) {
                return [...prev, rule];
            } else {
                return prev.filter(item => item !== rule);
            }
        });
    };

    const handleTypeChange = (type) => {
        setSelectedType(type);
    };

    const onFinish = async (values) => {
        if (!selectedType) {
            message.error('Будь ласка, оберіть тип житла');
            return;
        }

        const validPhotos = fileList.filter(f => f.status === 'done' && f.url);
        if (validPhotos.length === 0) {
            message.error('Будь ласка, завантажте принаймні одну фотографію.');
            return;
        }

        setLoading(true);

        const payload = {
            title: values.title,
            description: values.description || '',
            beds: values.beds,
            rooms: values.rooms,
            bathrooms: values.bathrooms,
            basePrice: values.basePrice,
            type: selectedType,
            location: {
                latitude: location.lat,
                longitude: location.lng,
                address: values.address,
            },
            photos: validPhotos.map(f => f.url),
            amenities: amenities,
            rules: rules,
            bookedDates: [],
            status: isEditMode ? undefined : 'pending',
        };

        try {
            const url = isEditMode
                ? `${process.env.REACT_APP_API_BASE_URL}/api/daily-listings/${id}`
                : `${process.env.REACT_APP_API_BASE_URL}/api/daily-listings/add`;
            const method = isEditMode ? 'PUT' : 'POST';

            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify(payload),
            });

            if (response.ok) {
                message.success(isEditMode ? 'Оголошення успішно оновлено!' : 'Оголошення успішно розміщено! Воно проходить перевірку і незабаром буде опубліковано.');
                if (!isEditMode) {
                    form.resetFields();
                    setFileList([]);
                    setAmenities([]);
                    setRules([]);
                    setSelectedType(null);
                    setLocation({ lat: 49.4431, lng: 32.0745, address: '' });
                }
            } else {
                const errorData = await response.json();
                console.error("Backend error:", errorData);
                message.error(isEditMode ? `Помилка оновлення оголошення: ${errorData.message || 'Невідома помилка'}` : `Помилка при розміщенні оголошення: ${errorData.message || 'Невідома помилка'}`);
            }
        } catch (error) {
            console.error("Network error:", error);
            message.error('Помилка з\'єднання з сервером: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    const onFinishFailed = (errorInfo) => {
        message.error('Будь ласка, заповніть усі обов’язкові поля.');
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
                    {isEditMode ? 'Редагувати оголошення' : 'Створити оголошення про подобову оренду'}
                </Title>
                <Form form={form} layout="vertical" onFinish={onFinish} onFinishFailed={onFinishFailed}>
                    <Form.Item
                        name="title"
                        label={<Text>Назва</Text>}
                        rules={[{ required: true, message: "Будь ласка, введіть назву" }, { max: 255, message: "Назва не може перевищувати 255 символів" }]}
                    >
                        <Input placeholder="Наприклад: Затишна квартира в центрі" allowClear />
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

                    <Form.Item
                        label={<Text>Фотографії</Text>}
                        // Прибрано `name="photos"` та `valuePropName="fileList"`
                    >
                        <Upload
                            listType="picture-card"
                            fileList={fileList}
                            onPreview={handlePreview}
                            onRemove={handleRemoveFile}
                            beforeUpload={() => false}
                            onChange={handleFileUpload}
                            multiple
                            accept="image/*"
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

                    <Row gutter={16} style={{ marginBottom: '1rem' }}>
                        <Col xs={24} sm={8}>
                            <Form.Item
                                name="beds"
                                label={<Text>Кількість місць</Text>}
                                rules={[{ required: true, message: "Обов'язкове поле" }, { type: 'number', min: 1, message: "Мінімум 1" }]}
                            >
                                <InputNumber min={1} style={{ width: '100%' }} />
                            </Form.Item>
                        </Col>
                        <Col xs={24} sm={8}>
                            <Form.Item
                                name="rooms"
                                label={<Text>Кількість кімнат</Text>}
                                rules={[{ required: true, message: "Обов'язкове поле" }, { type: 'number', min: 1, message: "Мінімум 1" }]}
                            >
                                <InputNumber min={1} style={{ width: '100%' }} />
                            </Form.Item>
                        </Col>
                        <Col xs={24} sm={8}>
                            <Form.Item
                                name="bathrooms"
                                label={<Text>Кількість санвузлів</Text>}
                                rules={[{ required: true, message: "Обов'язкове поле" }, { type: 'number', min: 1, message: "Мінімум 1" }]}
                            >
                                <InputNumber min={1} style={{ width: '100%' }} />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Title level={4} className="form-subtitle">Ціни</Title>
                    <Form.Item
                        name="basePrice"
                        label={<Text>Базова ціна за ніч</Text>}
                        rules={[{ required: true, message: "Будь ласка, вкажіть ціну" }, { type: 'number', min: 0, message: "Ціна не може бути від’ємною" }]}
                    >
                        <InputNumber min={0} style={{ width: '100%' }} formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')} />
                    </Form.Item>

                    <Title level={4} className="form-subtitle">Зручності</Title>
                    <Collapse defaultActiveKey={['0']} className="amenities-collapse">
                        {Object.entries(amenitiesData).map(([category, items], index) => (
                            <Panel header={<Text>{category}</Text>} key={index}>
                                <Space direction="vertical" style={{ width: '100%' }}>
                                    {items.map((item, i) => {
                                        const itemName = typeof item === 'string' ? item : item.name;
                                        return (
                                            <label key={i} className="mp-monthlypage-checkbox">
                                                <input
                                                    type="checkbox"
                                                    checked={amenities.includes(itemName)}
                                                    onChange={(e) => handleAmenityChange(category, itemName, e.target.checked)}
                                                />
                                                <span>
                                                    {itemName}
                                                    {item.description && <span className="amenity-description"> ({item.description})</span>}
                                                    {item.paid && <span className="amenity-price"> ({item.price || 'Платно'})</span>}
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
                        rules={[{ required: true, message: "Будь ласка, додайте короткий опис" }, { max: 2000, message: "Опис не може перевищувати 2000 символів" }]}
                        style={{ marginTop: '20px' }}
                    >
                        <TextArea rows={6} placeholder="Напишіть про помешкання, його переваги та особливості." />
                    </Form.Item>

                    <Title level={4} className="form-subtitle">Локація</Title>
                    <Form.Item
                        name="address"
                        label={<Text>Адреса</Text>}
                        rules={[{ required: true, message: "Будь ласка, введіть адресу" }]}
                    >
                        <Input placeholder="Введіть адресу для відображення на карті" className="address-input" allowClear onChange={(e) => setLocation({ ...location, address: e.target.value })} />
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
                            <MapEventHandler />
                            <Marker position={[location.lat, location.lng]} icon={customMarkerIcon}>
                                <Popup>Точне розташування вашого помешкання</Popup>
                            </Marker>
                        </MapContainer>
                    </div>

                    <Title level={4} className="form-subtitle">Правила проживання</Title>
                    <Space direction="vertical">
                        {rulesData.map((rule, index) => (
                            <label key={index} className="mp-monthlypage-checkbox">
                                <input
                                    type="checkbox"
                                    checked={rules.includes(rule)}
                                    onChange={(e) => handleRuleChange(rule, e.target.checked)}
                                />
                                <span>{rule}</span>
                            </label>
                        ))}
                    </Space>

                    <Form.Item style={{ marginTop: '2rem' }}>
                        <Button type="primary" htmlType="submit" style={{ width: '100%' }} loading={loading || isUploading} disabled={loading || isUploading}>
                            {isEditMode ? 'Оновити оголошення' : 'Розмістити оголошення'}
                        </Button>
                    </Form.Item>
                </Form>
            </Card>
        </div>
    );
};

export default CreateListing;