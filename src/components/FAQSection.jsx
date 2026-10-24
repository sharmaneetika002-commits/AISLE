
import React, { useState } from 'react';
import '../styles/faq.css';

const faqs = [
    {
        question: 'What is Aisle?',
        answer:
            'Aisle is a furniture shopping destination for thoughtfully designed pieces that bring comfort, functionality, and timeless style into your home.'
    },
    {
        question: 'How do I find the right furniture for my space?',
        answer:
            'Explore our product categories to discover furniture for different rooms. Check each product’s dimensions and specifications to find the right fit for your space.'
    },
    {
        question: 'How does delivery work?',
        answer:
            'Delivery availability and charges may depend on your location and order. You can check the delivery details associated with your order before completing your purchase.'
    },
    {
        question: 'Can I return or exchange a product?',
        answer:
            'Our return and exchange policy will provide details about eligible products, conditions, and timelines. Please check the applicable policy before placing your order.'
    },
    {
        question: 'Are the products on the Deals page available for a limited time?',
        answer:
            'Our Deals page features selected furniture at special prices. Offers may change or end, so we recommend checking the product page for the latest pricing and availability.'
    },
    {
        question: 'How can I contact Aisle?',
        answer:
            'You can reach out to us through the Contact Us section on our website for questions about products, orders, or anything else you need help with.'
    }
];

export default function FAQSection() {
    const [openIndex, setOpenIndex] = useState(null);

    const toggleFAQ = (index) => {
        setOpenIndex((currentIndex) =>
            currentIndex === index ? null : index
        );
    };

    return (
        <section className="faq-section" id="faq">
            <div className="faq-container">

                <div className="faq-heading">
                    <p className="faq-eyebrow">
                        HERE TO HELP
                    </p>

                    <h2>
                        A few things you might
                        <br />
                        be <em>wondering.</em>
                    </h2>

                    <p className="faq-intro">
                        Have questions? We have answers.
                        Find out more about shopping with Aisle.
                    </p>
                </div>

                <div className="faq-list">
                    {faqs.map((faq, index) => {
                        const isOpen = openIndex === index;

                        return (
                            <div
                                className={`faq-item ${isOpen ? 'open' : ''
                                    }`}
                                key={index}
                            >
                                <button
                                    className="faq-question"
                                    onClick={() => toggleFAQ(index)}
                                    aria-expanded={isOpen}
                                    aria-controls={`faq-answer-${index}`}
                                >
                                    {faq.question}
                                </button>
                                <div
                                    className="faq-answer"
                                    id={`faq-answer-${index}`}
                                    hidden={!isOpen}
                                >
                                    <p>{faq.answer}</p>
                                </div>
                            </div>
                        );
                    })}
                </div>



            </div>
        </section>
    );
}
