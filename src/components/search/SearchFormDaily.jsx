import React from "react";
import { Form, Select, DatePicker, Button, Row, Col } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import dayjs from "dayjs";

const { Option } = Select;

const cities = ["Київ", "Львів", "Одеса", "Харків", "Дніпро"];
const numbers = Array.from({ length: 10 }, (_, i) => (i + 1).toString());

const SearchFormDaily = ({ formData, setFormData, onSearch }) => {
  const [form] = Form.useForm();

  const handleDateChange = (date, dateString, field) => {
    setFormData({ ...formData, [field]: dateString });
  };

  const onFinish = () => {
    onSearch(formData);
  };

  return (
    <Form
      form={form}
      onFinish={onFinish}
      initialValues={{
        ...formData,
        checkIn: formData.checkIn ? dayjs(formData.checkIn) : null,
        checkOut: formData.checkOut ? dayjs(formData.checkOut) : null,
      }}
      layout="vertical"
      style={{ width: "100%" }}
    >
      {/* Місто */}
      <Form.Item label="Місто" name="location" style={{ marginTop: 15 }}>
        <Select
          showSearch
          placeholder="Виберіть або введіть місто"
          value={formData.location}
          onChange={(value) => setFormData({ ...formData, location: value })}
          filterOption={(input, option) =>
            option?.children.toLowerCase().includes(input.toLowerCase())
          }
          style={{ width: "100%" }}
        >
          {cities.map((city) => (
            <Option key={city} value={city}>
              {city}
            </Option>
          ))}
        </Select>
      </Form.Item>

      {/* Дати */}
      <Form.Item label="Дати" style={{ marginTop: 25 }}>
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12}>
            <Form.Item name="checkIn" style={{ marginBottom: 0 }}>
              <DatePicker
                placeholder="Заїзд"
                style={{ width: "100%" }}
                onChange={(date, dateString) =>
                  handleDateChange(date, dateString, "checkIn")
                }
                size="large"
                placement="bottomLeft"
              />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12}>
            <Form.Item name="checkOut" style={{ marginBottom: 0 }}>
              <DatePicker
                placeholder="Виїзд"
                style={{ width: "100%" }}
                onChange={(date, dateString) =>
                  handleDateChange(date, dateString, "checkOut")
                }
                size="large"
                placement="bottomLeft" // завжди вниз
              />
            </Form.Item>
          </Col>
        </Row>
      </Form.Item>

      {/* Гості */}
      <Form.Item style={{ marginTop: 25 }}>
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

      {/* Кнопка пошуку */}
      <Form.Item style={{ textAlign: "center", marginTop: 35 }}>
        <Button
          type="primary"
          htmlType="submit"
          size="large"
          style={{
            width: 250,
            borderRadius: 8,
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
            transition: "all 0.3s ease",
          }}
        >
          <SearchOutlined /> Знайти
        </Button>
      </Form.Item>
    </Form>
  );
};

export default SearchFormDaily;
