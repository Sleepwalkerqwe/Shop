import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import axios from 'axios';

import RatingStars from '../../components/RatingStars';
import { addToCart } from '../../redux/features/cart/cartSlice';
import toastr from '../../utils/toastConfig';
import { getBaseUrl } from '../../utils/baseURL';

const ProductCards = ({ products }) => {
  const dispatch = useDispatch();
  const cardRefs = React.useRef([]);

  // Используем IntersectionObserver
  React.useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('fadeInUp');
            observer.unobserve(entry.target); // Чтобы не повторялась анимация
          }
        });
      },
      { threshold: 0.1 }
    );

    cardRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => {
      if (cardRefs.current) {
        cardRefs.current.forEach((ref) => {
          if (ref) observer.unobserve(ref);
        });
      }
    };
  }, [products]);

  const navigate = useNavigate();
  // Функция проверки авторизации
  const checkAuth = async () => {
    try {
      const response = await axios.get(`${getBaseUrl()}/auth-check`, { withCredentials: true });
      return response.status === 200;
    } catch (error) {
      if (error.response && error.response.status === 401) {
        toastr.error('Session expired or you are not logged in');

        return false;
      }
      console.error('Error checking authorization', error);
      return false;
    }
  };
  const handleAddToCart = async (product) => {
    const isAuthorized = await checkAuth();

    if (!isAuthorized) {
      setError('Session expired or you are not logged in. Please login first.');
      toastr.error('Session expired or you are not logged in. Please login first.');
      // Перенаправляем на страницу входа
      setTimeout(() => {
        navigate('/login');
      }, 2000); // можно задать задержку, чтобы пользователь успел увидеть ошибку
      return;
    } else {
      console.log('Successfuly auth');
    }
    dispatch(addToCart(product));
    toastr.success('Product successfully added');
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
      {products.map((product, index) => (
        <div
          key={index}
          className="product__card" // начальное состояние opacity: 0
          ref={(el) => (cardRefs.current[index] = el)}
        >
          <div className="relative">
            <Link to={`/shop/${product._id}`}>
              <img src={product.image} alt="product" className="max-h-96 md:h-64 w-full object-cover hover:scale-105 transition-all duration-300" />
            </Link>
            <div className="hover:block absolute top-3 right-3">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleAddToCart(product);
                }}
              >
                <i className="ri-shopping-cart-2-line bg-primary p-1.5 text-white hover:bg-primary-dark"></i>
              </button>
            </div>
          </div>

          <div className="product__card__content">
            <h4>{product.name}</h4>
            <p>
              ${product.price} {product?.oldPrice && <s>${product.oldPrice}</s>}
            </p>
            <RatingStars rating={product.rating} />
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProductCards;
