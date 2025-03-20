import React from 'react';

import card1 from '../../assets/card-1.png';
import card2 from '../../assets/card-2.png';
import card3 from '../../assets/card-3.png';

import AOS from 'aos';
import 'aos/dist/aos.css'; // обязательно импортируем стили

const cards = [
  {
    id: 1,
    image: card1,
    trend: '2024 Trend',
    title: 'Womens Shirt',
  },
  {
    id: 2,
    image: card2,
    trend: '2024 Trend',
    title: 'Womens Dresses',
  },
  {
    id: 3,
    image: card3,
    trend: '2024 Trend',
    title: 'Womens Casuals',
  },
];

const HeroSection = () => {
  React.useEffect(() => {
    AOS.init({
      duration: 1000, // продолжительность анимации
      easing: 'ease-out', // тип анимации
      once: true, // анимация будет воспроизводиться только один раз
    });
  }, []);

  return (
    <section className="section__container hero__container">
      {cards.map((card, index) => (
        <div
          key={card.id}
          className="hero__card"
          data-aos="fade-up" // Анимация появления
          data-aos-delay={`${index * 200}`} // Задержка, зависит от индекса
          data-aos-duration="1000" // Продолжительность анимации
        >
          <img src={card.image} alt="" />
          <div className="hero__content">
            <p>{card.trend}</p>
            <h4>{card.title}</h4>
            <a href="#">Discover More</a>
          </div>
        </div>
      ))}
    </section>
  );
};

export default HeroSection;
