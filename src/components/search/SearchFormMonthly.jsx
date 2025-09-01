import React from "react";
import {
  Form,
  Select,
  Button,
  Row,
  Col,
  Space,
} from "antd";
import { SearchOutlined } from "@ant-design/icons";

const { Option } = Select;

const cities = ["Київ", "Львів", "Одеса", "Харків", "Дніпро"];
const numbers = Array.from({ length: 10 }, (_, i) => (i + 1).toString());

const SearchFormMonthly = ({ formData, setFormData, onSearch }) => {
  const [form] = Form.useForm();

  const onFinish = () => {
    onSearch(formData);
  };

  return (
    <Form
      className="form-mothly"
      form={form}
      onFinish={onFinish}
      initialValues={{ ...formData }}
      layout="vertical"
      style={{ width: "100%" }}
    >
      <Form.Item label="Місто" name="location">
        <Select
          showSearch
          placeholder="Виберіть або введіть місто"
          value={formData.location}
          onChange={(value) => setFormData({ ...formData, location: value })}
          filterOption={(input, option) =>
            option?.children.toLowerCase().includes(input.toLowerCase())
          }
        >
          {cities.map((city) => (
            <Option key={city} value={city}>
              {city}
            </Option>
          ))}
        </Select>
      </Form.Item>

      <Form.Item label="Тип житла" name="propertyType">
        <Space
          style={{
            width: '100%',
            backgroundColor: '#f0f2f5',
            borderRadius: 10,
            padding: 4,
          }}
        >
          <Button
            onClick={() => setFormData({ ...formData, propertyType: 'cottage' })}
            style={{
              flex: 1,
              backgroundColor: formData.propertyType === 'cottage' ? 'white' : 'transparent',
              fontWeight: formData.propertyType === 'cottage' ? 'bold' : 'normal',
              boxShadow: formData.propertyType === 'cottage' ? '0 2px 8px rgba(0, 0, 0, 0.1)' : 'none',
              transition: 'background-color 0.3s, box-shadow 0.3s',
              '&:hover': {
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
              }
            }}
          >
            Котедж
          </Button>
          <Button
            onClick={() => setFormData({ ...formData, propertyType: 'apartment' })}
            style={{
              flex: 1,
              backgroundColor: formData.propertyType === 'apartment' ? 'white' : 'transparent',
              fontWeight: formData.propertyType === 'apartment' ? 'bold' : 'normal',
              boxShadow: formData.propertyType === 'apartment' ? '0 2px 8px rgba(0, 0, 0, 0.1)' : 'none',
              transition: 'background-color 0.3s, box-shadow 0.3s',
              '&:hover': {
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
              }
            }}
          >
            Квартира
          </Button>
        </Space>
      </Form.Item>

      <Form.Item style={{ marginBottom: 20 }}>
        <Row gutter={16}>
          <Col xs={24} sm={12}>
            <Form.Item label="Дорослі" name="adults">
              <Select
                placeholder="Дорослі"
                value={formData.adults}
                onChange={(value) => setFormData({ ...formData, adults: value })}
              >
                {numbers.map((n) => (
                  <Option key={n} value={n}>
                    {n}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col xs={24} sm={12}>
            <Form.Item label="Діти" name="children">
              <Select
                placeholder="Діти"
                value={formData.children}
                onChange={(value) => setFormData({ ...formData, children: value })}
              >
                {numbers.map((n) => (
                  <Option key={n} value={n}>
                    {n}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
        </Row>
      </Form.Item>

      <Form.Item name="petsAllowed" valuePropName="checked" style={{ textAlign: "left", marginLeft: "-20px", marginTop: "-20px" }}>
        <label
          style={{
            display: 'flex',
            alignItems: 'center',
            cursor: 'pointer',
            color: 'rgba(0, 0, 0, 0.88)'
          }}
        >
          <input
            type="checkbox"
            checked={formData.petsAllowed}
            onChange={(e) => setFormData({ ...formData, petsAllowed: e.target.checked })}
            style={{
              appearance: 'none',
              WebkitAppearance: 'none',
              width: 16,
              height: 16,
              borderRadius: 4,
              border: '2px solid #d9d9d9',
              marginRight: 8,
              position: 'relative',
              cursor: 'pointer',
              transition: 'border-color 0.3s, background-color 0.3s',
            }}
          />
          <span style={{ position: 'relative', top: '-1px' }}>Дозволено з тваринами</span>
        </label>
      </Form.Item>

      <Form.Item style={{ textAlign: "center", marginTop: 20 }}>
        <Button
          type="primary"
          htmlType="submit"
          size="large"
          style={{ width: 250, borderRadius: 8 }}
        >
          <SearchOutlined /> Знайти
        </Button>
      </Form.Item>
    </Form>
  );
};

export default SearchFormMonthly;