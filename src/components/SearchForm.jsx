import React, { useState, useCallback } from 'react';
import { Form, Select, DatePicker, Button, Row, Col, Space, Card, ConfigProvider } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import './styles/SearchForm.css';

const { Option } = Select;

const cities = ['Київ', 'Львів', 'Одеса', 'Харків', 'Дніпро'];
const numbers = Array.from({ length: 10 }, (_, i) => (i + 1).toString());

// Компонент форми для подобової оренди
const SearchFormDaily = ({ formData, setFormData, onSearch, isLightTheme }) => {
  const handleDateChange = useCallback((date, dateString, field) => {
    setFormData(prev => ({ ...prev, [field]: dateString }));
  }, [setFormData]);

  const selectDropdownClassName = isLightTheme ? 'light-theme-dropdown' : 'dark-theme-dropdown';
  const buttonStyle = isLightTheme ? { backgroundColor: '#1a1a1a', color: '#fff', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' } : { backgroundColor: '#fff', color: '#1a1a1a', boxShadow: '0 2px 8px rgba(255, 255, 255, 0.1)' };

  return (
    <Form
      onFinish={() => onSearch(formData)}
      initialValues={{ ...formData, checkIn: formData.checkIn ? dayjs(formData.checkIn) : null, checkOut: formData.checkOut ? dayjs(formData.checkOut) : null }}
      layout="vertical"
      style={{ width: '100%' }}
    >
      <Form.Item label="Місто" name="location">
        <Select
          showSearch
          placeholder="Виберіть або введіть місто"
          value={formData.location}
          onChange={value => setFormData(prev => ({ ...prev, location: value }))}
          filterOption={(input, option) => option?.children.toLowerCase().includes(input.toLowerCase())}
          dropdownClassName={selectDropdownClassName}
        >
          {cities.map(city => <Option key={city} value={city}>{city}</Option>)}
        </Select>
      </Form.Item>

      <Form.Item label="Дати">
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12}>
            <Form.Item name="checkIn" style={{ marginBottom: 0 }}>
              <DatePicker
                placeholder="Заїзд"
                style={{ width: '100%' }}
                onChange={(date, dateString) => handleDateChange(date, dateString, 'checkIn')}
                size="large"
                placement="bottomLeft"
                popupClassName={isLightTheme ? 'light-theme-datepicker-popup' : 'dark-theme-datepicker-popup'}
              />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12}>
            <Form.Item name="checkOut" style={{ marginBottom: 0 }}>
              <DatePicker
                placeholder="Виїзд"
                style={{ width: '100%' }}
                onChange={(date, dateString) => handleDateChange(date, dateString, 'checkOut')}
                size="large"
                placement="bottomLeft"
                popupClassName={isLightTheme ? 'light-theme-datepicker-popup' : 'dark-theme-datepicker-popup'}
              />
            </Form.Item>
          </Col>
        </Row>
      </Form.Item>

      <Row gutter={16}>
        <Col xs={24} sm={12}>
          <Form.Item label="Дорослі" name="adults">
            <Select
              placeholder="Дорослі"
              value={formData.adults}
              onChange={value => setFormData(prev => ({ ...prev, adults: value }))}
              dropdownClassName={selectDropdownClassName}
            >
              {numbers.map(n => <Option key={n} value={n}>{n}</Option>)}
            </Select>
          </Form.Item>
        </Col>
        <Col xs={24} sm={12}>
          <Form.Item label="Діти" name="children">
            <Select
              placeholder="Діти"
              value={formData.children}
              onChange={value => setFormData(prev => ({ ...prev, children: value }))}
              dropdownClassName={selectDropdownClassName}
            >
              {numbers.map(n => <Option key={n} value={n}>{n}</Option>)}
            </Select>
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

// Компонент форми для помісячної оренди
const SearchFormMonthly = ({ formData, setFormData, onSearch, isLightTheme }) => {
  const textTheme = isLightTheme ? {} : { color: '#fff' };
  const selectDropdownClassName = isLightTheme ? 'light-theme-dropdown' : 'dark-theme-dropdown';
  const spaceBg = isLightTheme ? '#f0f2f5' : '#2d2d2d';
  const buttonBgActive = isLightTheme ? 'white' : '#444';
  const boxShadow = isLightTheme ? '0 2px 8px rgba(0, 0, 0, 0.1)' : '0 2px 8px rgba(255, 255, 255, 0.1)'
  const searchButtonStyles = isLightTheme ? { backgroundColor: '#1a1a1a', color: '#fff', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' } : { backgroundColor: '#fff', color: '#1a1a1a', boxShadow: '0 2px 8px rgba(255, 255, 255, 0.1)' };
  const checkboxBorder = isLightTheme ? '#d9d9d9' : '#555';

  return (
    <Form onFinish={() => onSearch(formData)} initialValues={{ ...formData }} layout="vertical" style={{ width: '100%' }}>
      <Form.Item label="Місто" name="location">
        <Select
          showSearch
          placeholder="Виберіть або введіть місто"
          value={formData.location}
          onChange={value => setFormData(prev => ({ ...prev, location: value }))}
          filterOption={(input, option) => option?.children.toLowerCase().includes(input.toLowerCase())}
          dropdownClassName={selectDropdownClassName}
        >
          {cities.map(city => <Option key={city} value={city}>{city}</Option>)}
        </Select>
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
            >
              {numbers.map(n => <Option key={n} value={n}>{n}</Option>)}
            </Select>
          </Form.Item>
        </Col>
        <Col xs={24} sm={12}>
          <Form.Item label="Діти" name="children">
            <Select
              placeholder="Діти"
              value={formData.children}
              onChange={value => setFormData(prev => ({ ...prev, children: value }))}
              dropdownClassName={selectDropdownClassName}
            >
              {numbers.map(n => <Option key={n} value={n}>{n}</Option>)}
            </Select>
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
          <span style={{ position: 'relative', top: '-1px' }}>Дозволено з тваринами</span>
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
    location: '',
    checkIn: '',
    checkOut: '',
    adults: '',
    children: '',
    propertyType: 'cottage',
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