import React, { useState, useCallback } from 'react';
import { Form, Select, DatePicker, Button, Row, Col, Space, Card, ConfigProvider } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import './SearchForm.css';

const cities = ['Київ', 'Львів', 'Одеса', 'Харків', 'Дніпро'];
const numbers = Array.from({ length: 10 }, (_, i) => (i + 1).toString());
const numbersChildern = Array.from({ length: 11 }, (_, i) => i.toString());

const cityOptions = cities.map(city => ({ value: city, label: city }));
const numberOptions = numbers.map(num => ({ value: num, label: num }));
const numberOptionsChildren = numbersChildern.map(num => ({ value: num, label: num }));

// Компонент форми для подобової оренди
const SearchFormDaily = ({ formData, setFormData, onSearch, isLightTheme }) => {
    
    const selectDropdownClassName = isLightTheme ? 'light-theme-dropdown' : 'dark-theme-dropdown';
    const buttonStyle = isLightTheme ? { backgroundColor: '#1a1a1a', color: '#fff', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' } : { backgroundColor: '#fff', color: '#1a1a1a', boxShadow: '0 2px 8px rgba(255, 255, 255, 0.1)' };

    // Функція для відключення дат до сьогоднішнього дня
    const disabledDate = (current) => {
      return current && current < dayjs().startOf('day');
    };

    // Функція для відключення дати виїзду, якщо вона раніше дати заїзду
    const disabledCheckoutDate = (current) => {
        const checkIn = formData.checkIn ? dayjs(formData.checkIn) : dayjs().subtract(1, 'day');
        return current && current < checkIn.endOf('day');
    };
    
    return (
        <Form
            onFinish={() => onSearch(formData)}
            initialValues={{ ...formData }}
            layout="vertical"
            style={{ width: '100%' }}
        >
            <Form.Item label="Місто" name="location">
                <Select
                    showSearch
                    placeholder="Виберіть або введіть місто"
                    value={formData.location}
                    onChange={value => setFormData(prev => ({ ...prev, location: value }))}
                    filterOption={(input, option) => option.label.toLowerCase().includes(input.toLowerCase())}
                    dropdownClassName={selectDropdownClassName}
                    options={cityOptions}
                />
            </Form.Item>

            <Row gutter={16}>
                <Col xs={24} sm={12}>
                    <Form.Item label="Заїзд" name="checkIn">
                        <DatePicker
                            placeholder="Заїзд"
                            style={{width: '100%'}}
                            size="large"
                            value={formData.checkIn ? dayjs(formData.checkIn) : null}
                            onChange={(date, dateString) => setFormData(prev => ({ ...prev, checkIn: dateString }))}
                            disabledDate={disabledDate}
                            getPopupContainer={trigger => trigger.parentElement}
                        />
                    </Form.Item>
                </Col>
                <Col xs={24} sm={12}>
                    <Form.Item label="Виїзд" name="checkOut">
                        <DatePicker
                            placeholder="Виїзд"
                            style={{width: '100%'}}
                            size="large"
                            value={formData.checkOut ? dayjs(formData.checkOut) : null}
                            onChange={(date, dateString) => setFormData(prev => ({ ...prev, checkOut: dateString }))}
                            disabledDate={disabledCheckoutDate}
                            getPopupContainer={trigger => trigger.parentElement}
                        />
                    </Form.Item>
                </Col>
            </Row>

            <Row gutter={16}>
                <Col xs={24} sm={12}>
                    <Form.Item label="Дорослі" name="adults">
                        <Select
                            placeholder="Дорослі"
                            value={formData.adults}
                            onChange={value => setFormData(prev => ({ ...prev, adults: value }))}
                            dropdownClassName={selectDropdownClassName}
                            options={numberOptions}
                        />
                    </Form.Item>
                </Col>
                <Col xs={24} sm={12}>
                    <Form.Item label="Діти" name="children">
                        <Select
                            placeholder="Діти"
                            value={formData.children}
                            onChange={value => setFormData(prev => ({ ...prev, children: value }))}
                            dropdownClassName={selectDropdownClassName}
                            options={numberOptionsChildren}
                        />
                    </Form.Item>
                </Col>
            </Row>

            <Form.Item style={{ textAlign: 'center', marginTop: 35 }}>
                <Button type="primary" htmlType="submit" size="large" style={{ width: 250, borderRadius: 8, transition: 'all 0.3s ease', ...buttonStyle }}>
                    <SearchOutlined /> Знайти
                </Button>
            </Form.Item>
        </Form>
    );
};

// Компонент форми для помісячної оренди (без змін)
const SearchFormMonthly = ({ formData, setFormData, onSearch, isLightTheme }) => {
    const textTheme = isLightTheme ? {} : { color: '#fff' };
    const selectDropdownClassName = isLightTheme ? 'light-theme-dropdown' : 'dark-theme-dropdown';
    const spaceBg = isLightTheme ? '#f0f2f5' : '#2d2d2d';
    const buttonBgActive = isLightTheme ? 'white' : '#444';
    const boxShadow = isLightTheme ? '0 2px 8px rgba(0, 0, 0, 0.1)' : '0 2px 8px rgba(255, 255, 255, 0.1)'
    const searchButtonStyles = isLightTheme ? { backgroundColor: '#1a1a1a', color: '#fff', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' } : { backgroundColor: '#fff', color: '#1a1a1a', boxShadow: '0 2px 8px rgba(255, 255, 255, 0.1)' };
    const checkboxBorder = isLightTheme ? '#d9d9d9' : '#555';

    return (
        <Form
            onFinish={() => onSearch(formData)}
            initialValues={{ ...formData }}
            layout="vertical"
            style={{ width: '100%' }}
        >
            <Form.Item label="Місто" name="location">
                <Select
                    showSearch
                    placeholder="Виберіть або введіть місто"
                    value={formData.location}
                    onChange={value => setFormData(prev => ({ ...prev, location: value }))}
                    filterOption={(input, option) => option.label.toLowerCase().includes(input.toLowerCase())}
                    dropdownClassName={selectDropdownClassName}
                    options={cityOptions}
                />
            </Form.Item>

            <Form.Item label="Тип житла" name="propertyType">
                <Space style={{ width: '100%', backgroundColor: spaceBg, borderRadius: 10, padding: 4 }}>
                    <Button
                        onClick={() => setFormData(prev => ({ ...prev, propertyType: 'cottage' }))}
                        style={{ flex: 1, backgroundColor: formData.propertyType === 'cottage' ? buttonBgActive : 'transparent', fontWeight: formData.propertyType === 'cottage' ? 'bold' : 'normal', boxShadow: formData.propertyType === 'cottage' ? boxShadow : 'none', transition: 'background-color 0.3s, box-shadow 0.3s' }}
                    >
                        Котедж
                    </Button>
                    <Button
                        onClick={() => setFormData(prev => ({ ...prev, propertyType: 'apartment' }))}
                        style={{ flex: 1, backgroundColor: formData.propertyType === 'apartment' ? buttonBgActive : 'transparent', fontWeight: formData.propertyType === 'apartment' ? 'bold' : 'normal', boxShadow: formData.propertyType === 'apartment' ? boxShadow : 'none', transition: 'background-color 0.3s, box-shadow 0.3s' }}
                    >
                        Квартира
                    </Button>
                </Space>
            </Form.Item>

            <Row gutter={16}>
                <Col xs={24} sm={12}>
                    <Form.Item label="Дорослі" name="adults">
                        <Select
                            placeholder="Дорослі"
                            value={formData.adults}
                            onChange={value => setFormData(prev => ({ ...prev, adults: value }))}
                            dropdownClassName={selectDropdownClassName}
                            options={numberOptions}
                        />
                    </Form.Item>
                </Col>
                <Col xs={24} sm={12}>
                    <Form.Item label="Діти" name="children">
                        <Select
                            placeholder="Діти"
                            value={formData.children}
                            onChange={value => setFormData(prev => ({ ...prev, children: value }))}
                            dropdownClassName={selectDropdownClassName}
                            options={numberOptionsChildren}
                        />
                    </Form.Item>
                </Col>
            </Row>

            <Form.Item name="petsAllowed" valuePropName="checked" style={{ textAlign: 'left', marginTop: -15 }}>
                <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', ...textTheme }}>
                    <input
                        type="checkbox"
                        checked={formData.petsAllowed}
                        onChange={e => setFormData(prev => ({ ...prev, petsAllowed: e.target.checked }))}
                        style={{ appearance: 'none', WebkitAppearance: 'none', width: 16, height: 16, borderRadius: 4, border: `2px solid ${checkboxBorder}`, marginRight: 8, position: 'relative', cursor: 'pointer', transition: 'border-color 0.3s, background-color 0.3s', backgroundColor: formData.petsAllowed ? '#1a1a1a' : 'transparent' }}
                    />
                    <span style={{ position: 'relative', top: '20px', right: '10px' }}>Дозволено з тваринами</span>
                </label>
            </Form.Item>

            <Form.Item style={{ textAlign: 'center', marginTop: 35 }}>
                <Button type="primary" htmlType="submit" size="large" style={{ width: 250, borderRadius: 8, ...searchButtonStyles }}>
                    <SearchOutlined /> Знайти
                </Button>
            </Form.Item>
        </Form>
    );
};

// Основний компонент SearchForm
const SearchForm = ({ isLightTheme }) => {
    const [mode, setMode] = useState('daily');
    const [formData, setFormData] = useState({
        location: 'Київ',
        checkIn: '',
        checkOut: '',
        adults: '1',
        children: '0',
        propertyType: 'apartment',
        petsAllowed: false,
    });

    const handleSearch = useCallback(data => {
        console.log(`Searching in "${mode}" mode with data:`, data);
    }, [mode]);

    const cardBg = isLightTheme ? '#fff' : '#1a1a1a';
    const spaceBg = isLightTheme ? '#f0f2f5' : '#2d2d2d';
    const buttonBgActive = isLightTheme ? 'white' : '#444';
    const boxShadow = isLightTheme ? '0 2px 8px rgba(0, 0, 0, 0.1)' : '0 2px 8px rgba(255, 255, 255, 0.1)';

    const customTheme = {
        token: {
            colorPrimary: isLightTheme ? '#1a1a1a' : '#fff',
            colorText: isLightTheme ? '#333' : '#fff',
            colorTextLabel: isLightTheme ? '#333' : '#fff',
            borderRadius: 8
        },
        components: {
            Button: { borderRadius: 8, controlHeight: 48, defaultBg: isLightTheme ? '#e9ecef' : '#444', defaultBorderColor: 'transparent', defaultColor: isLightTheme ? 'black' : 'white', paddingInline: 16 },
            Card: { padding: 30 },
            Input: { controlHeight: 48, borderRadius: 8, activeBorderColor: isLightTheme ? '#1a1a1a' : '#fff', hoverBorderColor: isLightTheme ? '#1a1a1a' : '#fff', colorText: isLightTheme ? '#333' : '#fff', colorTextPlaceholder: isLightTheme ? '#aaa' : '#fff', colorBgContainer: isLightTheme ? '#f5f5f5' : '#1e1e1e' },
            Select: { controlHeight: 48, borderRadius: 8, activeBorderColor: isLightTheme ? '#1a1a1a' : '#fff', hoverBorderColor: isLightTheme ? '#1a1a1a' : '#fff', colorText: isLightTheme ? '#333' : '#fff', colorTextPlaceholder: isLightTheme ? '#aaa' : '#fff', colorBgContainer: isLightTheme ? '#f5f5f5' : '#1e1e1e' },
            DatePicker: {
                colorText: isLightTheme ? '#333' : '#fff',
                colorBgContainer: isLightTheme ? '#f5f5f5' : '#1e1e1e',
                colorBorder: isLightTheme ? '#d9d9d9' : '#444',
                controlHeight: 48,
                borderRadius: 8,
                activeBorderColor: isLightTheme ? '#1a1a1a' : '#fff',
                hoverBorderColor: isLightTheme ? '#1a1a1a' : '#fff',
                colorTextPlaceholder: isLightTheme ? '#aaa' : '#fff',
            },
            Form: {
                // You can add component-specific styles here if needed.
            },
        },
    };

    return (
        <ConfigProvider theme={customTheme}>
            <Card style={{ width: '100%', maxWidth: 600, margin: '2rem auto', borderRadius: 16, backgroundColor: cardBg }} className={isLightTheme ? '' : 'dark-theme'}>
                <Space style={{ marginBottom: 20, width: '100%', justifyContent: 'center', backgroundColor: spaceBg, borderRadius: 10, padding: 4, transition: 'box-shadow 0.3s' }}>
                    <Button
                        type="default"
                        onClick={() => setMode('daily')}
                        style={{ flex: 1, backgroundColor: mode === 'daily' ? buttonBgActive : 'transparent', fontWeight: mode === 'daily' ? 'bold' : 'normal', boxShadow: mode === 'daily' ? boxShadow : 'none', transition: 'background-color 0.3s, box-shadow 0.3s' }}
                    >
                        Подобово
                    </Button>
                    <Button
                        type="default"
                        onClick={() => setMode('monthly')}
                        style={{ flex: 1, backgroundColor: mode === 'monthly' ? buttonBgActive : 'transparent', fontWeight: mode === 'monthly' ? 'bold' : 'normal', boxShadow: mode === 'monthly' ? boxShadow : 'none', transition: 'background-color 0.3s, box-shadow 0.3s' }}
                    >
                        Помісячно
                    </Button>
                </Space>
                {mode === 'daily' ? (
                    <SearchFormDaily formData={formData} setFormData={setFormData} onSearch={handleSearch} isLightTheme={isLightTheme} />
                ) : (
                    <SearchFormMonthly formData={formData} setFormData={setFormData} onSearch={handleSearch} isLightTheme={isLightTheme} />
                )}
            </Card>
        </ConfigProvider>
    );
};

export default SearchForm;