import React from 'react';

import ProductCards from '../shop/ProductCards';
import { useFetchAllProductsQuery } from '../../redux/features/products/productsApi';

const Search = () => {
  const [filtersState, setFiltersState] = React.useState({
    category: 'all',
    color: 'all',
    priceRange: '',
  });

  const [currentPage, setCurrentPage] = React.useState(1);
  const [ProductsPerPage] = React.useState(8);

  const { category, color, priceRange } = filtersState;
  const [minPrice, maxPrice] = priceRange.split('-').map(Number);

  const queryParams = React.useMemo(
    () => ({
      category: 'all',
      color: 'all',
      minPrice: '',
      maxPrice: '',
      page: currentPage,
      limit: ProductsPerPage,
    }),
    [category, color, minPrice, maxPrice, currentPage, ProductsPerPage]
  );

  const { data: { products = [], totalPages, totalProducts } = {}, error, isLoading } = useFetchAllProductsQuery(queryParams);

  const [searchQuery, setSearchQuery] = React.useState('');
  const [filteredProducts, setFilteredProducts] = React.useState(products);

  if (products) console.log('products data- ', products);

  const handleSearch = () => {
    const query = searchQuery.toLowerCase();

    const filtered = products.filter((product) => product.name.toLowerCase().includes(query) || product.description.toLowerCase().includes(query));

    setFilteredProducts(filtered);
  };

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
          <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="search-bar w-full max-w-4xl p-2 border rounded" placeholder="Search for products..." />

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
