import React from 'react';
import { Link } from 'react-router-dom';

import category1 from '../../assets/category-1.jpg';
import category2 from '../../assets/category-2.jpg';
import category3 from '../../assets/category-3.jpg';
import category4 from '../../assets/category-4.jpg';

const Categories = () => {
  const cardsRef = React.useRef([]);

  const categories = [
    { name: 'Accessories', path: 'accessories', image: category1 },
    { name: 'Dress Collection', path: 'dress', image: category2 },
    { name: 'Jewellery', path: 'jewellery', image: category3 },
    { name: 'Cosmetics', path: 'cosmetics', image: category4 },
  ];

  React.useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
          }
        });
      },
      { threshold: 0.1 }
    );

    cardsRef.current.forEach((el) => el && observer.observe(el));

    return () => {
      cardsRef.current.forEach((el) => el && observer.unobserve(el));
    };
  }, []);

  return (
    <div className="product__grid">
      {categories.map((category, index) => (
        <Link key={category.name} to={`/categories/${category.path}`} className="categories__card" ref={(el) => (cardsRef.current[index] = el)}>
          <img src={category.image} alt={category.name} />
          <h4>{category.name}</h4>
        </Link>
      ))}
    </div>
  );
};

export default Categories;
