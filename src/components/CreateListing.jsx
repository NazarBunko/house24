import React, { useState } from 'react';
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
    DatePicker
} from 'antd';
import { PlusOutlined, DeleteOutlined, PlusCircleOutlined } from '@ant-design/icons';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import "antd/dist/reset.css";
import './styles/CreateListing.css';
import dayjs from 'dayjs';

const { TextArea } = Input;
const { Title, Text } = Typography;
const { Panel } = Collapse;

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

const CreateListing = ({ isLightTheme }) => {
    const [form] = Form.useForm();
    const [nearByAmenities, setNearByAmenities] = useState([{ name: '', distance: '' }]);
    const [fileList, setFileList] = useState([]);
    const [amenities, setAmenities] = useState({});
    const [rules, setRules] = useState({});
    const [specialPrices, setSpecialPrices] = useState([{ checkIn: null, checkOut: null, price: null }]);
    const [location, setLocation] = useState({
        lat: 49.4431 + (Math.random() - 0.5) * 0.1,
        lng: 32.0745 + (Math.random() - 0.5) * 0.1,
    });

    const themeClass = isLightTheme ? 'light-theme' : 'dark-theme';

    const handleFileUpload = ({ fileList }) => {
        setFileList(fileList);
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
    
    // Нова логіка для спеціальних цін
    const handleSpecialPriceChange = (index, key, value) => {
        const newSpecialPrices = [...specialPrices];
        newSpecialPrices[index][key] = value;
        setSpecialPrices(newSpecialPrices);
    };

    const addSpecialPrice = () => {
        setSpecialPrices([...specialPrices, { checkIn: null, checkOut: null, price: null }]);
    };

    const removeSpecialPrice = (index) => {
        const newSpecialPrices = specialPrices.filter((_, i) => i !== index);
        setSpecialPrices(newSpecialPrices);
    };

    const onFinish = (values) => {
        console.log('Дані оголошення:', {
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
        });
    };
    
    // Функції для відключення дат
    const disabledDate = (current) => {
        return current && current < dayjs().startOf('day');
    };
    
    const disabledEndDate = (current, checkIn) => {
        if (!checkIn) {
            return false;
        }
        return current && current.isBefore(checkIn.endOf('day'));
    };

    return (
        <div className={`create-listing-page ${themeClass}`}>
            <Card className="create-listing-card">
                <Title level={2} className="form-title">Створити нове оголошення</Title>

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
                            onChange={handleFileUpload}
                            beforeUpload={() => false}
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

                    <Title level={5} className="form-subtitle" style={{ marginTop: '1rem' }}>Спеціальні ціни на певні дати</Title>
                    
                    {specialPrices.map((item, index) => (
                        <div key={index} className="special-price-row">
                            <Row gutter={[16, 16]} align="bottom" style={{marginTop: 5}}>
                                <Col xs={24} sm={12} lg={6}>
                                    <Form.Item style={{ marginBottom: 0 }}>
                                        <DatePicker
                                            placeholder="Початок"
                                            style={{ width: '100%', height: 28 }}
                                            onChange={(date) => handleSpecialPriceChange(index, 'checkIn', date)}
                                            value={item.checkIn}
                                            disabledDate={disabledDate}
                                            getPopupContainer={trigger => trigger.parentElement}
                                        />
                                    </Form.Item>
                                </Col>
                                <Col xs={24} sm={12} lg={6}>
                                    <Form.Item style={{ marginBottom: 0 }}>
                                        <DatePicker
                                            placeholder="Кінець"
                                            style={{ width: '100%', height: 28 }}
                                            onChange={(date) => handleSpecialPriceChange(index, 'checkOut', date)}
                                            value={item.checkOut}
                                            disabledDate={(current) => disabledEndDate(current, item.checkIn)}
                                            getPopupContainer={trigger => trigger.parentElement}
                                        />
                                    </Form.Item>
                                </Col>
                                <Col xs={24} sm={12} lg={6}>
                                    <Form.Item style={{ marginBottom: 0 }}>
                                        <InputNumber
                                            placeholder="Ціна"
                                            min={0}
                                            style={{ width: '100%' }}
                                            onChange={(price) => handleSpecialPriceChange(index, 'price', price)}
                                            value={item.price}
                                        />
                                    </Form.Item>
                                </Col>
                                {specialPrices.length > 1 && (
                                    <Col xs={24} sm={12} lg={6}>
                                        <Form.Item style={{ marginBottom: 0, alignSelf: 'center' }}>
                                            <Button
                                                type="text"
                                                danger
                                                className="delete-button-mobile"
                                                icon={<DeleteOutlined />}
                                                onClick={() => removeSpecialPrice(index)}
                                            >
                                                Видалити
                                            </Button>

                                            <Button
                                                type="text"
                                                danger
                                                className="delete-button-desktop"
                                                icon={<DeleteOutlined />}
                                                onClick={() => removeSpecialPrice(index)}
                                            />
                                        </Form.Item>
                                    </Col>
                                )}
                            </Row>
                        </div>
                    ))}
                    <Form.Item>
                        <Button
                            type="dashed"
                            onClick={addSpecialPrice}
                            block
                            icon={<PlusCircleOutlined />}
                            style={{ marginTop: 10 }}
                        >
                            Додати спеціальну ціну
                        </Button>
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

                    <Title level={4} className="form-subtitle" style={{marginTop: 20}}>Короткий опис</Title>
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
                            Розмістити оголошення
                        </Button>
                    </Form.Item>
                </Form>
            </Card>
        </div>
    );
};

export default CreateListing;