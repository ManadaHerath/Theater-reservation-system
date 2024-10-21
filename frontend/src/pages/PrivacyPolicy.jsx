import React from 'react';

const PrivacyPolicy = () => {
  return (
    <div className="privacy-container bg-[#09081d] min-h-screen text-white py-10 px-6">
      <h1 className="text-center text-4xl font-bold mb-10">Privacy Policy</h1>
      <div className="privacy-content max-w-4xl mx-auto text-justify space-y-6">
        <section>
          <h2 className="text-lg md:text-2xl font-semibold mb-4">1. Introduction</h2>
          <p className='text-sm md:text-base'>
            At Movie Mingle, we are committed to protecting your privacy. This Privacy Policy outlines how we collect, use, and safeguard your personal information when you use our services.
          </p>
        </section>

        <section>
          <h2 className="text-lg md:text-2xl font-semibold mb-4">2. Information We Collect</h2>
          <p className='text-sm md:text-base'>
            We may collect personal information such as your name, email address, payment details, and preferences when you register for an account or make a ticket purchase. We also collect data about your usage of the site, including your IP address, browser type, and location.
          </p>
        </section>

        <section>
          <h2 className="text-lg md:text-2xl font-semibold mb-4">3. How We Use Your Information</h2>
          <p className='text-sm md:text-base'>
            The information we collect is used to provide and improve our services, process your transactions, and send you updates and promotional offers. We may also use your data for security and fraud prevention purposes.
          </p>
        </section>

        <section>
          <h2 className="text-lg md:text-2xl font-semibold mb-4">4. Sharing Your Information</h2>
          <p className='text-sm md:text-base'>
            We do not sell, trade, or rent your personal information to third parties. However, we may share your data with trusted partners to help us operate our business, including payment processors and service providers, under strict confidentiality agreements.
          </p>
        </section>

        <section>
          <h2 className="text-lg md:text-2xl font-semibold mb-4">5. Data Security</h2>
          <p className='text-sm md:text-base'>
            We take reasonable measures to protect your information from unauthorized access, alteration, or disclosure. However, no method of transmission over the internet is 100% secure, and we cannot guarantee the absolute security of your data.
          </p>
        </section>

        <section>
          <h2 className="text-lg md:text-2xl font-semibold mb-4">6. Cookies</h2>
          <p className='text-sm md:text-base'>
            Our website uses cookies to enhance your experience by remembering your preferences and tracking how you interact with the site. You can disable cookies through your browser settings, but doing so may affect your ability to use some features of the site.
          </p>
        </section>

        <section>
          <h2 className="text-lg md:text-2xl font-semibold mb-4">7. Your Rights</h2>
          <p className='text-sm md:text-base'>
            You have the right to access, update, or delete your personal information at any time. You can also opt out of receiving marketing communications by following the unsubscribe instructions in our emails or by contacting us directly.
          </p>
        </section>

        <section>
          <h2 className="text-lg md:text-2xl font-semibold mb-4">8. Changes to This Policy</h2>
          <p className='text-sm md:text-base'>
            We may update this Privacy Policy from time to time. Any changes will be posted on this page, and we encourage you to review this policy regularly to stay informed about how we protect your information.
          </p>
        </section>

        <section>
          <h2 className="text-lg md:text-2xl font-semibold mb-4">9. Contact Us</h2>
          <p className='text-sm md:text-base'>
            If you have any questions about this Privacy Policy or how we handle your personal data, please contact us at contact@moviemingle.com.
          </p>
        </section>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
