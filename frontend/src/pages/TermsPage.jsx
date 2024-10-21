import React from 'react';

const Terms = () => {
  return (
    <div className="terms-container bg-[#09081d] min-h-screen text-white py-10 px-6">
      <h1 className="text-center text-4xl font-bold mb-10">Terms of Use</h1>
      <div className="terms-content max-w-4xl mx-auto text-justify space-y-6">
        <section>
          <h2 className="text-lg md:text-2xl font-semibold mb-4">1. Introduction</h2>
          <p className='text-sm md:text-base'>
            Welcome to Movie Mingle. By accessing or using our services, you agree to comply with and
            be bound by the following terms and conditions. Please review these terms carefully.
          </p>
        </section>

        <section>
          <h2 className="text-lg md:text-2xl font-semibold mb-4">2. Use of Our Services</h2>
          <p className='text-sm md:text-base'>
            You agree to use our services for lawful purposes only. You are responsible for ensuring that your use of the website complies with all applicable local, state, and international laws.
          </p>
        </section>

        <section>
          <h2 className="text-lg md:text-2xl font-semibold mb-4">3. User Accounts</h2>
          <p className='text-sm md:text-base'>
            You are required to create an account to use certain features of the website. You agree to provide accurate and up-to-date information during the registration process.
          </p>
        </section>

        <section>
          <h2 className="text-lg md:text-2xl font-semibold mb-4">4. Ticket Purchases</h2>
          <p className='text-sm md:text-base'>
            All ticket purchases are final. Refunds may be issued in certain circumstances, subject to our refund policy. You are responsible for ensuring that all details provided during the purchase process are accurate.
          </p>
        </section>

        <section>
          <h2 className="text-lg md:text-2xl font-semibold mb-4">5. Intellectual Property</h2>
          <p className='text-sm md:text-base'>
            All content on this site, including text, graphics, logos, and images, is the property of Movie Mingle. You may not reproduce or distribute any part of the site without our prior written permission.
          </p>
        </section>

        <section>
          <h2 className="text-lg md:text-2xl font-semibold mb-4">6. Disclaimer of Warranties</h2>
          <p className='text-sm md:text-base'>
            Our services are provided "as is" without any guarantees or warranties of any kind. We do not guarantee that the services will be uninterrupted, error-free, or secure.
          </p>
        </section>

        <section>
          <h2 className="text-lg md:text-2xl font-semibold mb-4">7. Limitation of Liability</h2>
          <p className='text-sm md:text-base'>
            Movie Mingle shall not be liable for any damages arising from the use or inability to use our services, including but not limited to direct, indirect, incidental, or consequential damages.
          </p>
        </section>

        <section>
          <h2 className="text-lg md:text-2xl font-semibold mb-4">8. Changes to Terms</h2>
          <p className='text-sm md:text-base'>
            We reserve the right to modify these terms at any time. Your continued use of the site after changes are made will constitute your acceptance of the new terms.
          </p>
        </section>

        <section>
          <h2 className="text-lg md:text-2xl font-semibold mb-4">9. Contact Information</h2>
          <p className='text-sm md:text-base'>
            If you have any questions regarding these terms, please contact us at support@moviemingle.com.
          </p>
        </section>
      </div>
    </div>
  );
};

export default Terms;
