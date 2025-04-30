import React from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import toastr from '../../../../utils/toastConfig';

import { useAddProductMutation } from '../../../../redux/features/products/productsApi';

import TextInput from './TextInput';
import SelectInput from './SelectInput';
import UploadImage from './UploadImage';

const categories = [
  { label: 'Accessories', value: 'accessories' },
  { label: 'Dress', value: 'dress' },
  { label: 'Jewellery', value: 'jewellery' },
  { label: 'Cosmetics', value: 'cosmetics' },
  { label: 'Skin Care', value: 'skin-care' },
];

const colors = [
  { label: 'Black', value: 'black' },
  { label: 'Red', value: 'red' },
  { label: 'Gold', value: 'gold' },
  { label: 'Blue', value: 'blue' },
  { label: 'Silver', value: 'silver' },
  { label: 'Beige', value: 'beige' },
  { label: 'Green', value: 'green' },
];

const AddProduct = () => {
  const { user } = useSelector((state) => state.auth);

  const [product, setProduct] = React.useState({
    name: '',
    category: '',
    color: '',
    price: '',
    description: '',
  });
  const [image, setImage] = React.useState('');

  const [AddProduct, { isLoading, error }] = useAddProductMutation();

  const handleChange = (eOrName, value) => {
    if (typeof eOrName === 'string') {
      // вызов из кастомного SelectInput
      setProduct((prev) => ({
        ...prev,
        [eOrName]: value,
      }));
    } else {
      // обычный input
      const { name, value } = eOrName.target;
      setProduct((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!product.name || !product.category || !product.price || !product.description || !product.color) {
      toastr.error('Please fill all the required fields');
      return;
    }

    try {
      await AddProduct({ ...product, image, author: user?._id }).unwrap();
      toastr.success('Product added successfully');
      setProduct({ name: '', category: '', color: '', price: '', description: '' });
      setImage('');
      navigate('/shop');
    } catch (error) {
      console.log('Failed to submit product', error);
    }
  };

  return (
    <div className="container mx-auto mt-8">
      <h2 className="text-2xl font-bold mb-6">Add New Product</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <TextInput label="Product Name" name="name" placeholder="Ex: Diamond Earrings" value={product.name} onChange={handleChange} />
        <div>
          <SelectInput label="Category" name="category" value={product.category} onChange={handleChange} options={categories} />
        </div>

        <SelectInput label="Color" name="color" value={product.color} onChange={handleChange} options={colors} />

        <TextInput label="Price" name="price" type="number" placeholder="50" value={product.price} onChange={handleChange} />

        <UploadImage name="image" id="image" value={(e) => setImage(e.target.value)} placeholder="Image" setImage={setImage} />
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">
            Description
          </label>
          <textarea name="description" id="description" className="add-product-InputCSS" value={product.description} placeholder="Write a product description" onChange={handleChange}></textarea>
        </div>

        <div>
          <button type="submit" className="add-product-btn">
            Add Product
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddProduct;
