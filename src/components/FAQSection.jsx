import React from "react";
import { Collapse } from "antd";
import { motion } from "framer-motion";

const { Panel } = Collapse;

function FAQSection() {
  const faqs = [
    {
      question: "Як орендувати будинок?",
      answer:
        "Ви можете обрати потрібний будинок і натиснути 'Оренда'. Далі слідуйте інструкціям на сайті.",
    },
    {
      question: "Чи можна купити квартиру через сайт?",
      answer:
        "Так, просто оберіть кнопку 'Покупка' та заповніть форму запиту.",
    },
    {
      question: "Як зв’язатися з підтримкою?",
      answer:
        "Ви можете написати нам через форму контактів або зателефонувати за вказаним номером.",
    },
    {
      question: "Чи потрібна реєстрація?",
      answer:
        "Реєстрація потрібна для збереження обраних об’єктів та швидкого оформлення оренди чи покупки.",
    },
    {
      question: "Як змінити свої дані в профілі?",
      answer:
        "Перейдіть у 'Мій профіль' та натисніть 'Редагувати', щоб змінити особисті дані.",
    },
    {
      question: "Як додати оголошення на сайт?",
      answer:
        "Увійдіть у свій акаунт, натисніть 'Мої оголошення' та додайте нове оголошення.",
    },
    {
      question: "Які способи оплати доступні?",
      answer:
        "Ми підтримуємо оплату карткою, PayPal та банківський переказ.",
    },
  ];

  return (
    <section
      style={{
        display: "flex",
        flexWrap: "wrap",
        gap: "3rem",
        padding: "4rem 2rem",
        backgroundColor: "#1a1a1a",
        justifyContent: "center",
      }}
    >
      <motion.div
        style={{ flex: "1 1 300px", minWidth: "300px", color: "white" }}
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2 style={{ fontSize: "2.5rem", lineHeight: 1.2, marginBottom: "1rem" }}>
          Є питання? Ми готові допомогти!
        </h2>
        <p style={{ color: "#ccc", fontSize: "1.1rem" }}>
          Тут ви знайдете відповіді на найбільш поширені запитання.
        </p>
      </motion.div>

      <motion.div
        style={{ flex: "1 1 500px", minWidth: "300px" }}
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Collapse accordion bordered={false} style={{ backgroundColor: "transparent" }}>
          {faqs.map((faq, i) => (
            <Panel
              header={
                <span
                  style={{
                    fontSize: "1.3rem",
                    fontWeight: 500,
                    color: "white",
                  }}
                >
                  {faq.question}
                </span>
              }
              key={i}
              style={{
                backgroundColor: "#2a2a2a",
                borderRadius: "8px",
                marginBottom: "15px",
                borderBottom: "none", // прибрали підсвітку
                overflow: "hidden",
              }}
            >
              <motion.p
                style={{ color: "#ccc", fontSize: "1.05rem", margin: 0, padding: "0.5rem 0" }}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                {faq.answer}
              </motion.p>
            </Panel>
          ))}
        </Collapse>
      </motion.div>
    </section>
  );
}

export default FAQSection;
