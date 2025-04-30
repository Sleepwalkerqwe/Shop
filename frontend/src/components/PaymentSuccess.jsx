import React, { useEffect, useState } from 'react';
import { getBaseUrl } from '../utils/baseURL';
import TimelineStep from './TimelineStep';
import { Link } from 'react-router-dom';

import { useFetchProductsByIdsQuery } from '../redux/features/products/productsApi';

const PaymentSuccess = () => {
  const [order, setOrder] = useState(null);
  useEffect(() => {
    const query = new URLSearchParams(window.location.search);
    const sessionId = query.get('session_id');

    if (sessionId) {
      fetch(`${getBaseUrl()}/api/order/confirm-payment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // <<< ОБЯЗАТЕЛЬНО для отправки cookies
        body: JSON.stringify({ session_id: sessionId }),
      })
        .then((res) => res.json())
        .then((data) => setOrder(data.order))
        .catch((err) => console.error('Error confirming payment', err));
    }
  }, []);

  const productIds = React.useMemo(() => order?.products.map((p) => p.productId), [order]);
  const { data: productData, isLoading: productsLoading } = useFetchProductsByIdsQuery(productIds, {
    skip: !order,
  });

  if (productData) console.log('product data-', productData);

  console.log(order?.products);

  if (!order) return <div>Loading...</div>;

  const isCompleted = (status) => {
    const statuses = ['pending', 'processing', 'shipped', 'completed'];
    return statuses.indexOf(status) < statuses.indexOf(order.status);
  };

  const isCurrent = (status) => order.status === status;
  const steps = [
    {
      status: 'pending',
      label: 'Pending',
      description: 'Your order has been created and is awaiting processing.',
      icon: {
        iconName: 'time-line',
        bgColor: 'red-500',
        textColor: 'gray-800',
      },
    },
    {
      status: 'processing',
      label: 'Processing',
      description: 'Your order is currently being processed.',
      icon: {
        iconName: 'loader-line',
        bgColor: 'yellow-800',
        textColor: 'yellow-800',
      },
    },
    {
      status: 'shipped',
      label: 'Shipped',
      description: 'Your order has been shipped.',
      icon: {
        iconName: 'truck-line',
        bgColor: 'blue-800',
        textColor: 'blue-800',
      },
    },
    {
      status: 'completed',
      label: 'Completed',
      description: 'Your order has been successfully completed.',
      icon: {
        iconName: 'check-line',
        bgColor: 'green-800',
        textColor: 'green-900',
      },
    },
  ];

  return (
    <section className="section__container rounded p-6">
      <h2 className="text-2xl font-semibold mb-4">Payment {order?.status}</h2>
      <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
        {productData?.map((product, index) => (
          <Link to={`/shop/${product._id}`} key={index}>
            <div className=" rounded-xl p-4 shadow-lg flex flex-col items-center transition duration-300 hover:shadow-xl hover:scale-[1.02]">
              <img src={product.image} alt={product.name} className="w-32 h-32 object-contain mb-3 rounded-lg transition-transform duration-300 ease-in-out hover:scale-125" />

              <p className="text-lg font-semibold text-center">Product: {product.name}</p>
              <p className="text-md ">Price: {product.price} $</p>
            </div>
          </Link>
        ))}
      </div>

      <p className="mb-4">Order Id: {order?.orderId}</p>
      <p className="mb-16">Status: {order?.status}</p>

      <ol className="sm:flex items-center relative ">
        {steps.map((step, index) => (
          <TimelineStep key={index} step={step} order={order} isCompleted={isCompleted(step.status)} isCurrent={isCurrent(step.status)} isLastStep={index === steps.length - 1} icon={step.icon} description={step.description} />
        ))}
      </ol>
    </section>
  );
};

export default PaymentSuccess;
