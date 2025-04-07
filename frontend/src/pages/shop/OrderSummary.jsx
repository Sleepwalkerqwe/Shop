import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { loadStripe } from '@stripe/stripe-js';
import axios from 'axios';

import { clearCart } from '../../redux/features/cart/cartSlice';

import { getBaseUrl } from '../../utils/baseURL';
import toastr from '../../utils/toastConfig';

const OrderSummary = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const products = useSelector((store) => store.cart.products);

  const { selectedItems, totalPrice, tax, taxRate, grandTotal } = useSelector((store) => store.cart);

  const handleClearCart = () => {
    dispatch(clearCart());
  };

  const navigate = useNavigate();
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
  // payment integration
  const makePayment = async (e) => {
    const isAuthorized = await checkAuth();
    if (!isAuthorized) {
      toastr.error('Session expired or you are not logged in. Please login first.');
      // Перенаправляем на страницу входа
      setTimeout(() => {
        navigate('/login');
      }, 2000); // можно задать задержку, чтобы пользователь успел увидеть ошибку
      return;
    } else {
      console.log('Successfuly auth');
    }

    const stripe = await loadStripe(import.meta.env.VITE_STRIPE_PK);

    const body = {
      products: products,
      userId: user?._id,
    };

    const headers = {
      'Content-Type': 'application/json',
    };

    const response = await fetch(`${getBaseUrl()}/api/order/create-checkout-session`, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(body),
      credentials: 'include',
    });

    const session = await response.json();
    console.log('session: ', session);

    const result = await stripe.redirectToCheckout({
      sessionId: session.id,
    });

    console.log('Result:', result);
    if (result.error) {
      console.log('Error:', result.error);
    }
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-lg mt-8 w-full max-w-md mx-auto text-sm md:text-base animate-fade-in">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4 border-b pb-2">Order Summary</h2>

      <div className="space-y-3 text-gray-700">
        {/* <p>Items in Cart: {selectedItems}</p> */}
        <p>
          <span className="font-medium">Total Price:</span> ${totalPrice.toFixed(2)}
        </p>
        {/* <p>Tax ({taxRate * 100}%): ${tax.toFixed(2)}</p> */}
        {/* <p className="font-bold text-lg">Grand Total: ${grandTotal.toFixed(2)}</p> */}
      </div>

      <div className="mt-6 space-y-3">
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleClearCart();
          }}
          className="w-full flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 text-white font-medium py-2 rounded-xl transition-all duration-300 shadow hover:shadow-md active:scale-95"
        >
          <i className="ri-delete-bin-7-line text-lg"></i>
          Clear Cart
        </button>

        <button
          onClick={(e) => {
            e.stopPropagation();
            makePayment();
          }}
          className="w-full flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white font-medium py-2 rounded-xl transition-all duration-300 shadow hover:shadow-md active:scale-95"
        >
          <i className="ri-bank-card-line text-lg"></i>
          Proceed to Checkout
        </button>
      </div>
    </div>
  );
};

export default OrderSummary;
