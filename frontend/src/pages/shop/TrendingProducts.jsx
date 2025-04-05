import React, { useEffect, useRef, useState } from 'react';
import ProductCards from './ProductCards';
import { useFetchAllProductsQuery } from '../../redux/features/products/productsApi';
import SkeletonCard from '../../components/SkeletonCard';

const TrendingProducts = () => {
  const [visibleProducts, setVisibleProducts] = useState(8);
  const [currentPage, setCurrentPage] = useState(1);
  const [ProductsPerPage] = useState(8);
  const [isInView, setIsInView] = useState(false); // Состояние для отслеживания видимости
  const [loading, setLoading] = useState(true); // Состояние загрузки

  const queryParams = React.useMemo(
    () => ({
      category: 'all',
      color: 'all',
      minPrice: '',
      maxPrice: '',
      page: currentPage,
      limit: ProductsPerPage,
    }),
    [currentPage, ProductsPerPage]
  );

  const { data: { products = [], totalPages, totalProducts } = {}, error, isLoading } = useFetchAllProductsQuery(queryParams);

  // Устанавливаем состояние загрузки на false, когда данные загружены
  useEffect(() => {
    if (!isLoading) {
      setLoading(false);
    }
  }, [isLoading]);

  const loadMoreProducts = () => {
    setVisibleProducts((prevCount) => prevCount + 4);
  };

  const observerRef = useRef();

  // Создаем наблюдатель видимости для элементов
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('fadeInUp'); // Когда элемент видим, добавляем анимацию
          }
        });
      },
      {
        threshold: 0.1,
      }
    );

    const currentObserver = observerRef.current;
    if (currentObserver) {
      observer.observe(currentObserver);
    }

    return () => {
      if (currentObserver) {
        observer.unobserve(currentObserver);
      }
    };
  }, [products]);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + window.innerHeight;
      const threshold = document.documentElement.scrollHeight - 200;

      if (scrollPosition >= threshold && visibleProducts < products.length) {
        loadMoreProducts();
      }
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [visibleProducts, products.length]);

  return (
    <section className="section__container product__container">
      <h2 className="section__header">Trending Products</h2>
      <p className="section__subheader mb-12">Discover the Hottest Picks: Elevate Your Style with Our Curated Collection of Trending Women's Fashion Products.</p>

      {/* products card */}
      <div className="mt-12" ref={observerRef}>
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {Array.from({ length: visibleProducts }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : (
          // <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          //   {Array.from({ length: visibleProducts }).map((_, i) => (
          //     <SkeletonCard key={i} />
          //   ))}
          // </div>
          <ProductCards products={products.slice(0, visibleProducts)} />
        )}
      </div>

      {/* load more products btn */}
      <div className="product__btn">
        {visibleProducts < products.length && !loading && (
          <button className="btn" onClick={loadMoreProducts}>
            Load More
          </button>
        )}
      </div>
    </section>
  );
};

export default TrendingProducts;
