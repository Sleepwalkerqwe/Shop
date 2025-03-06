import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import products from '../../data/products.json';
import { useFetchAllProductsQuery } from '../../redux/features/products/productsApi';

import ProductCards from '../shop/ProductCards';

const CategoryPage = () => {
  const { categoryName } = useParams();
  const [filteredProducts, setFilteredProducts] = useState([]);

  const [currentPage, setCurrentPage] = React.useState(1);
  const [ProductsPerPage] = React.useState(8);

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
  if (products) console.log('products data- ', products);

  useEffect(() => {
    const filtered = products.filter((product) => product.category === categoryName.toLowerCase());

    setFilteredProducts(filtered);
  }, [categoryName, products]);

  useEffect(() => {
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
