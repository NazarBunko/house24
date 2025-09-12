import React, { useState, useEffect } from 'react';
import { Card, Tabs, List, Button, Typography, Spin, message, Space, Image } from 'antd';
import {
  CheckCircleOutlined,
  EditOutlined,
  EyeOutlined,
  DeleteOutlined,
  FileSearchOutlined,
} from '@ant-design/icons';
import { Link } from 'react-router-dom';
import './AdminPanel.css';

const { TabPane } = Tabs;
const { Title } = Typography;

const AdminPanel = ({ isLightTheme }) => {
  const [allRentals, setAllRentals] = useState([]);
  const [allSales, setAllSales] = useState([]);
  const [activeTab, setActiveTab] = useState('1');
  const [loading, setLoading] = useState(true);

  const apiBaseUrl = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080';

  useEffect(() => {
    const fetchAllListings = async () => {
      setLoading(true);
      try {
        const rentResponse = await fetch(`${apiBaseUrl}/api/daily-listings/pending`, {
          method: 'GET',
          credentials: 'include',
        });
        const rentData = await rentResponse.json();
        if (!rentResponse.ok) {
          throw new Error(rentData.message || 'Failed to fetch rental listings');
        }
        console.log('Орендні оголошення:', rentData);
        setAllRentals(rentData);

        const saleResponse = await fetch(`${apiBaseUrl}/api/sales/all`, {
          method: 'GET',
          credentials: 'include',
        });
        const saleData = await saleResponse.json();
        if (!saleResponse.ok) {
          throw new Error(saleData.message || 'Failed to fetch sale listings');
        }
        console.log('Оголошення про продаж:', saleData);
        setAllSales(saleData);
      } catch (error) {
        console.error('Failed to fetch listings:', error);
        message.error(`Не вдалося завантажити оголошення: ${error.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchAllListings();
  }, [apiBaseUrl]);

  const pendingRentals = allRentals.filter((item) => item.status === 'pending');
  const pendingSales = allSales.filter((item) => item.status === 'pending');

  const handleActivateListing = async (id, type) => {
    const confirmed = window.confirm('Ви впевнені, що хочете активувати це оголошення?');
    if (!confirmed) return;

    setLoading(true);
    const endpoint =
      type === 'rent'
        ? `${apiBaseUrl}/api/daily-listings/${id}/activate`
        : `${apiBaseUrl}/api/sales/${id}/activate`;

    try {
      const response = await fetch(endpoint, {
        method: 'PUT',
        credentials: 'include',
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to activate listing');
      }

      message.success('Оголошення успішно активовано!');
      if (type === 'rent') {
        setAllRentals((prev) =>
          prev.map((item) =>
            item.id === id ? { ...item, status: 'active' } : item
          )
        );
      } else {
        setAllSales((prev) =>
          prev.map((item) =>
            item.id === id ? { ...item, status: 'active' } : item
          )
        );
      }
    } catch (error) {
      console.error('Activation error:', error);
      message.error(`Помилка активації: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteListing = async (id, type) => {
    const confirmed = window.confirm(
      'Ви впевнені, що хочете видалити це оголошення? Цю дію неможливо скасувати.'
    );
    if (!confirmed) return;

    setLoading(true);
    const endpoint =
      type === 'rent'
        ? `${apiBaseUrl}/api/daily-listings/${id}`
        : `${apiBaseUrl}/api/sales/${id}`;

    try {
      const response = await fetch(endpoint, {
        method: 'DELETE',
        credentials: 'include',
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete listing');
      }

      message.success('Оголошення успішно видалено!');
      if (type === 'rent') {
        setAllRentals((prev) => prev.filter((item) => item.id !== id));
      } else {
        setAllSales((prev) => prev.filter((item) => item.id !== id));
      }
    } catch (error) {
      console.error('Deletion error:', error);
      message.error(`Помилка видалення: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const renderList = (dataSource, type) => (
    <List
      itemLayout="vertical"
      dataSource={dataSource}
      locale={{ emptyText: 'Нових оголошень немає.' }}
      renderItem={(item) => {
        const photoUrl =
          item.photos && Array.isArray(item.photos) && item.photos.length > 0 && item.photos[0]
            ? item.photos[0].startsWith('http')
              ? item.photos[0]
              : `${apiBaseUrl}${item.photos[0]}`
            : 'https://via.placeholder.com/150?text=Немає+зображення';

        console.log(`Оголошення ${item.id}:`, { photos: item.photos, location: item.location });

        return (
          <List.Item key={item.id} className="listing-item">
            <List.Item.Meta
              avatar={
                <Image
                  src={photoUrl}
                  alt={item.title}
                  width={120} // Increased from 60 to 120
                  height={120} // Increased from 60 to 120
                  style={{ objectFit: 'cover', borderRadius: 8, marginRight: 16 }}
                  preview={true} // Enable preview for larger view on click
                  className='listing-item-image'
                  onError={() =>
                    console.error(
                      `Помилка завантаження зображення для оголошення ${item.id}: ${photoUrl}`
                    )
                  }
                />
              }
              title={<Title level={4} style={{ marginBottom: 0 }} className='item-title'>{item.title}</Title>}
              description={
                <div className="item-details">
                  <p><strong>Опис:</strong> {item.description || 'Опис відсутній'}</p>
                  <p>
                    <strong>Автор:</strong>{' '}
                    {item.owner
                      ? `${item.owner.firstName} ${item.owner.lastName}`
                      : 'Невідомий'}
                  </p>
                  <p>
                    <strong>Дата створення:</strong>{' '}
                    {item.createdAt
                      ? new Date(item.createdAt).toLocaleDateString()
                      : 'Невідомо'}
                  </p>
                  <p>
                    <strong>Тип:</strong> {type === 'rent' ? 'Оренда' : 'Продаж'}
                  </p>
                  <p>
                    <strong>Адреса:</strong> {item.location?.city || 'Адреса не вказана'}
                  </p>
                  <p>
                    <strong>Ціна:</strong>{' '}
                    {type === 'rent'
                      ? `$${item.basePrice?.toLocaleString() || '0'} за ніч`
                      : `$${item.basePrice?.toLocaleString() || '0'}`}
                  </p>
                </div>
              }
            />
            <Space
              size="middle"
              style={{ marginTop: '16px', justifyContent: 'center', width: '100%', flexWrap: 'wrap' }}
            >
              <Link to={type === 'rent' ? `/listing-daily/${item.id}` : `/sale/${item.id}`}>
                <Button type="default" icon={<EyeOutlined />}>
                  Переглянути
                </Button>
              </Link>
              <Link
                to={
                  type === 'rent'
                    ? `/edit-listing/${item.id}`
                    : `/edit-sale/${item.id}`
                }
              >
                <Button type="default" icon={<EditOutlined />}>
                  Редагувати
                </Button>
              </Link>
              <Button
                type="default"
                onClick={() => handleActivateListing(item.id, type)}
                icon={<CheckCircleOutlined />}
              >
                Активувати
              </Button>
              <Button
                type="default"
                danger
                onClick={() => handleDeleteListing(item.id, type)}
                icon={<DeleteOutlined />}
              >
                Видалити
              </Button>
            </Space>
          </List.Item>
        );
      }}
    />
  );

  const themeClass = isLightTheme ? '' : 'dark-theme';

  if (loading) {
    return (
      <div
        className={`admin-panel-container ${themeClass}`}
        style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}
      >
        <Spin size="large" tip="Завантаження оголошень..." />
      </div>
    );
  }

  return (
    <div className={`admin-panel-container ${themeClass}`} style={{ borderRadius: 10 }}>
      <Title level={2} style={{ textAlign: 'center', marginBottom: '30px' }}>
        Панель модерації оголошень
      </Title>
      <Card className="admin-panel-card">
        <div className="desktop-tabs">
          <Tabs defaultActiveKey="1" activeKey={activeTab} onChange={setActiveTab}>
            <TabPane tab={`Оренда (${pendingRentals.length})`} key="1">
              {renderList(pendingRentals, 'rent')}
            </TabPane>
            <TabPane tab={`Продаж (${pendingSales.length})`} key="2">
              {renderList(pendingSales, 'sale')}
            </TabPane>
          </Tabs>
        </div>
        <div className="mobile-buttons">
          <Button
            block
            size="large"
            type={activeTab === '1' ? 'primary' : 'default'}
            onClick={() => setActiveTab('1')}
            className={`mobile-tab-button ${activeTab === '1' ? 'active-button' : ''}`}
            style={{ marginTop: 8 }}
          >
            Оренда ({pendingRentals.length})
          </Button>
          <Button
            block
            size="large"
            type={activeTab === '2' ? 'primary' : 'default'}
            onClick={() => setActiveTab('2')}
            className={`mobile-tab-button ${activeTab === '2' ? 'active-button' : ''}`}
            style={{ marginTop: 8, marginBottom: 5 }}
          >
            Продаж ({pendingSales.length})
          </Button>
        </div>
        <div className="mobile-content-container">
          {activeTab === '1' && renderList(pendingRentals, 'rent')}
          {activeTab === '2' && renderList(pendingSales, 'sale')}
        </div>
      </Card>
    </div>
  );
};

export default AdminPanel;