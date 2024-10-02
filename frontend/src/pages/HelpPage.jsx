import React, { useState } from 'react';

const Help = () => {
  const [activeIndex, setActiveIndex] = useState(null);

  const faqs = [
    { question: "How do I book a ticket?", answer: "You can book a ticket by selecting a movie, choosing a showtime, and selecting your seats before proceeding to payment." },
    { question: "Can I cancel my reservation?", answer: "Yes, you can cancel your reservation up to 24 hours before the showtime. Refund policies may apply." },
    { question: "How can I get discounts?", answer: "Sign up for a Movie Mingle account to receive discounts and stay updated on special offers." },
    { question: "What payment methods are accepted?", answer: "We accept all major credit cards, debit cards, and payment gateways like PayHere." },
    { question: "Is my booking confirmation emailed to me?", answer: "Yes, a booking confirmation along with your e-ticket will be sent to your email." },
  ];

  const toggleFAQ = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <div className="faq-container bg-[#09081d] min-h-screen text-white py-10 px-6">
      <h1 className="text-center text-4xl font-bold mb-10">Help & FAQ</h1>
      <div className="faq-list max-w-3xl mx-auto">
        {faqs.map((faq, index) => (
          <div key={index} className="faq-item mb-5">
            <div
              className="faq-question cursor-pointer bg-gray-800 hover:bg-gray-700 py-4 px-6 rounded-lg flex justify-between items-center"
              onClick={() => toggleFAQ(index)}
            >
              <span>{faq.question}</span>
              <span>{activeIndex === index ? '-' : '+'}</span>
            </div>
            <div
              className={`faq-answer mt-2 px-6 ${activeIndex === index ? 'block' : 'hidden'}`}
            >
              {faq.answer}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Help;
