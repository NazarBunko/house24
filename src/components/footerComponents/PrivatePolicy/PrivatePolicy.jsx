import React from 'react';
import { Card, Typography, Space, Divider } from 'antd';
import { LockOutlined, FileTextOutlined, SafetyOutlined } from '@ant-design/icons';
import "antd/dist/reset.css";
import './PrivatePolicy.css';

const { Title, Paragraph } = Typography;

const PrivatePolicy = ({ isLightTheme }) => {
    const themeClass = isLightTheme ? 'light-theme' : 'dark-theme';

    return (
        <div className={`privacy-policy-page ${themeClass}`}>
            <Card className="privacy-policy-card">
                <Title level={2} className="privacy-policy-title">Політика конфіденційності</Title>
                <Paragraph className="privacy-policy-text">
                    Ця політика конфіденційності пояснює, як **House24** (далі "ми", "нас", "наш") збирає, використовує, зберігає та захищає вашу особисту інформацію, коли ви користуєтеся нашим веб-сайтом house24.ua.
                </Paragraph>

                <Space direction="vertical" size="large" style={{ width: '100%' }}>
                    <div className="section">
                        <Title level={3} className="section-title">
                            <FileTextOutlined className="section-icon" /> Яку інформацію ми збираємо?
                        </Title>
                        <Paragraph className="section-text">
                            Ми можемо збирати такі типи особистої інформації:
                        </Paragraph>
                        <ul className="info-list">
                            <li className="list-item">
                                **Ідентифікаційні дані:** ім'я, прізвище, адреса електронної пошти, номер телефону, що ви надаєте під час реєстрації або заповнення форми.
                            </li>
                            <li className="list-item">
                                **Дані для бронювання:** інформація про ваше бронювання (дати, кількість гостей, тип житла).
                            </li>
                            <li className="list-item">
                                **Платіжні дані:** інформація, необхідна для обробки платежів, яка обробляється через наших надійних платіжних партнерів. Ми не зберігаємо повні дані вашої кредитної картки.
                            </li>
                            <li className="list-item">
                                **Технічні дані:** IP-адреса, тип браузера, операційна система, дата та час доступу, а також дані, зібрані за допомогою файлів cookie.
                            </li>
                        </ul>
                    </div>

                    <Divider className="privacy-divider" />

                    <div className="section">
                        <Title level={3} className="section-title">
                            <LockOutlined className="section-icon" /> Як ми використовуємо вашу інформацію?
                        </Title>
                        <Paragraph className="section-text">
                            Ми використовуємо зібрану інформацію для наступних цілей:
                        </Paragraph>
                        <ul className="info-list">
                            <li className="list-item">Надання послуг, які ви запитуєте, зокрема для обробки бронювань.</li>
                            <li className="list-item">Покращення роботи нашого сайту та персоналізація вашого досвіду.</li>
                            <li className="list-item">Надсилання вам повідомлень, пов'язаних з бронюванням, або маркетингових матеріалів, якщо ви дали на це згоду.</li>
                            <li className="list-item">Забезпечення безпеки та запобігання шахрайству.</li>
                        </ul>
                    </div>
                    
                    <Divider className="privacy-divider" />

                    <div className="section">
                        <Title level={3} className="section-title">
                            <SafetyOutlined className="section-icon" /> Захист ваших даних
                        </Title>
                        <Paragraph className="section-text">
                            Ми вживаємо належних технічних та організаційних заходів для захисту вашої особистої інформації від несанкціонованого доступу, зміни, розкриття або знищення. Однак жоден метод передачі даних через Інтернет не є на 100% безпечним, і ми не можемо гарантувати абсолютний захист.
                        </Paragraph>
                    </div>

                </Space>
            </Card>
        </div>
    );
};

export default PrivatePolicy;