import React, { useEffect, useRef, useState } from 'react';

import instaImg1 from '../assets/instagram-1.jpg';
import instaImg2 from '../assets/instagram-2.jpg';
import instaImg3 from '../assets/instagram-3.jpg';
import instaImg4 from '../assets/instagram-4.jpg';
import instaImg5 from '../assets/instagram-5.jpg';
import instaImg6 from '../assets/instagram-6.jpg';

const Footer = () => {
  const [isVisible, setIsVisible] = useState(false);
  const footerRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );

    if (footerRef.current) observer.observe(footerRef.current);

    return () => {
      if (footerRef.current) observer.unobserve(footerRef.current);
    };
  }, []);

  return (
    <>
      <footer ref={footerRef} id="footer" className={`section__container footer__container transition-all duration-1000 ease-out ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
        <div className="footer__col transition-opacity duration-700 delay-100">
          <h4>CONTACT INFO</h4>
          <p>
            <span>
              <i className="ri-map-pin-2-fill"></i>
            </span>
            123, London Bridge Street, London
          </p>
          <p>
            <span>
              <i className="ri-mail-fill"></i>
            </span>
            support@sleep.com
          </p>
          <p>
            <span>
              <i className="ri-phone-fill"></i>
            </span>
            (+012) 3456 789
          </p>
        </div>

        <div className="footer__col transition-opacity duration-700 delay-200">
          <h4>COMPANY</h4>
          <a href="/" className="footer-link">
            Home
          </a>
          <a href="/" className="footer-link">
            About Us
          </a>
          <a href="/" className="footer-link">
            Work With Us
          </a>
          <a href="/" className="footer-link">
            Terms & Condition
          </a>
        </div>

        <div className="footer__col transition-opacity duration-700 delay-300">
          <h4>USEFUL LINK</h4>
          <a href="/" className="footer-link">
            Help
          </a>
          <a href="/" className="footer-link">
            Track your order
          </a>
        </div>

        <div className="footer__col transition-opacity duration-700 delay-400">
          <h4>INSTAGRAM</h4>
          <div className="instagram__grid">
            {[instaImg1, instaImg2, instaImg3, instaImg4, instaImg5, instaImg6].map((src, index) => (
              <img key={index} src={src} alt={`instagram ${index + 1}`} className={`transition-all duration-700 ease-out delay-${index * 100} hover:scale-125 ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`} />
            ))}
          </div>
        </div>
      </footer>

      <div className="footer__bar">Copyright © 2025 by Sleep. All rights reserved.</div>
    </>
  );
};

export default Footer;
