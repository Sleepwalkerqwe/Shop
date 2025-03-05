import React from 'react';
import { useParams } from 'react-router-dom';

// import products from '../../data/products.json';
import ProductCards from '../shop/ProductCards';

import { useFetchAllProductsQuery } from '../../redux/features/products/productsApi';

const CategoryPage = () => {
  const { categoryName } = useParams();
  const [filteredProducts, setFilteredProducts] = React.useState([]);

  const [filtersState, setFiltersState] = React.useState({
    category: 'all',
    color: 'all',
    priceRange: '',
  });
  const { category, color, priceRange } = filtersState;
  const [minPrice, maxPrice] = priceRange.split('-').map(Number);

  const {
    data: { products = [], totalPages, totalProducts } = {},
    error,
    isLoading,
  } = useFetchAllProductsQuery({
    category: category !== 'all' ? category : '',
    color: color !== 'all' ? color : '',
    minPrice: isNaN(minPrice) ? '' : minPrice,
    maxPrice: isNaN(maxPrice) ? '' : maxPrice,
    page: currentPage,
    limit: ProductsPerPage,
  });
  if (isLoading) return <div>Loading....</div>;
  if (error) return <div>Error loading products.</div>;

  React.useEffect(() => {
    const filtered = products.filter((product) => product.category === categoryName.toLowerCase());

    setFilteredProducts(filtered);
  }, [categoryName]);

  React.useEffect(() => {
    window.scrollTo(0, 0);
  });
  return (
    <>
      <section className="section__container bg-primary-light">
        <h2 className="section__header capitalize">{categoryName}</h2>
        <p className="section__subheader">Browse a diverse range of categories, from chic dresses to versatile accessories. Elevate your style today!</p>
      </section>

      {/* products card */}
      <div className="section__container">
        <ProductCards products={filteredProducts} />
      </div>
    </>
  );
};

export default CategoryPage;
