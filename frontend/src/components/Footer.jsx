import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  useEffect(() => {
    const handleScroll = () => {
      const footer = document.getElementById('footer');
      if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight - 1) {
        footer.classList.remove('hidden');
        footer.classList.add('flex');
      } else {
        footer.classList.remove('flex');
        footer.classList.add('hidden');
      }
    };

    window.addEventListener('scroll', handleScroll);

    // Clean up event listener on component unmount
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div id="footer" className="hidden fixed inset-x-0 bottom-0 w-full py-4 bg-indigo-600 shadow-md">
      <ul className="flex space-x-16 text-lg mx-auto">
        <li>
          <Link to="/help" className="text-gray-200">Help & FAQ</Link>
        </li>
        <li>
          <Link to="/terms" className="text-gray-200">Terms of Use</Link>
        </li>
        <li>
          <Link to="/privacyPolicy" className="text-gray-200">Privacy Policy</Link>
        </li>
      </ul>
    </div>
  );
};

export default Footer;
