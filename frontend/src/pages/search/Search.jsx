import React from 'react';

import ProductCards from '../shop/ProductCards';
import { useFetchAllProductsQuery } from '../../redux/features/products/productsApi';

const Search = () => {
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

  const [searchQuery, setSearchQuery] = React.useState('');
  const [filteredProducts, setFilteredProducts] = React.useState(products);
  const [typingTimeout, setTypingTimeout] = React.useState(null);

  // Основная логика фильтрации
  const handleSearch = () => {
    const query = searchQuery.toLowerCase();

    const filtered = products.filter((product) => product.name.toLowerCase().includes(query) || product.description.toLowerCase().includes(query));

    setFilteredProducts(filtered);
  };

  // Отслеживание печати и задержка
  React.useEffect(() => {
    if (!products) return;

    if (typingTimeout) clearTimeout(typingTimeout);

    const timeout = setTimeout(() => {
      handleSearch();
    }, 1500); //

    setTypingTimeout(timeout);

    return () => clearTimeout(timeout); // очищаем при размонтировании или новом вводе
  }, [searchQuery, products]);

  // при первичной загрузке
  React.useEffect(() => {
    if (products) {
      setFilteredProducts(products);
    }
  }, [products]);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading products.</div>;

  return (
    <>
      <section className="section__container bg-primary-light">
        <h2 className="section__header capitalize">Search Products</h2>
        <p className="section__subheader">Browse a diverse range of categories, from chic dresses to versatile accessories. Elevate your style today!</p>
      </section>

      <section className="section__container">
        <div className="w-full mb-12 flex flex-col md:flex-row items-center justify-center gap-4">
          <div className="relative w-full max-w-4xl">
            <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="search-bar w-full p-2 pr-10 border rounded" placeholder="Search for products..." />

            {searchQuery && (
              <button type="button" onClick={() => setSearchQuery('')} className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700">
                <i className="ri-close-line text-lg"></i>
                {/* или просто ✕ */}
              </button>
            )}
          </div>

          <button onClick={handleSearch} className="search-button w-full md:w-auto py-2 px-8 bg-primary text-white rounded">
            Search
          </button>
        </div>

        <ProductCards products={filteredProducts} />
      </section>
    </>
  );
};

export default Search;
