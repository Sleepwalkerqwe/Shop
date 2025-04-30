import React from 'react';
import { useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';

import { useGetOrderByIdQuery } from '../../../redux/features/orders/orderApi';
import TimelineStep from '../../../components/TimelineStep';

const OrderDetails = () => {
  const { orderId } = useParams();
  console.log(orderId);
  const { data: orderData, error, isLoading } = useGetOrderByIdQuery(orderId);
  console.log('data - ', orderData?.products);
  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>No orders!</div>;

  const isCompleted = (status) => {
    const statuses = ['pending', 'processing', 'shipped', 'completed'];
    return statuses.indexOf(status) < statuses.indexOf(orderData.order.status);
  };

  const isCurrent = (status) => orderData.order.status === status;
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
      <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
        {orderData?.products.map((product, index) => (
          <Link to={`/shop/${product._id}`} key={index}>
            <div className=" rounded-xl p-4 shadow-lg flex flex-col items-center transition duration-300 hover:shadow-xl hover:scale-[1.08]">
              <img src={product.image} alt={product.name} className="w-32 h-32 object-contain mb-3 rounded-lg transition-transform duration-300 ease-in-out hover:scale-125" />

              <p className="text-lg font-semibold text-center">Product: {product.name}</p>
              <p className="text-md ">Price: {product.price} $</p>
            </div>
          </Link>
        ))}
      </div>

      <h2 className="text-2xl font-semibold mt-8">Payment {orderData?.order.status}</h2>
      <p className="mt-4 mb-5">Order Id: {orderData?.order.orderId}</p>
      <p className="mb-8">Status: {orderData?.order.status}</p>

      <ol className="sm:flex items-center relative">
        {steps.map((step, index) => (
          <TimelineStep key={index} step={step} order={orderData?.order} isCompleted={isCompleted(step.status)} isCurrent={isCurrent(step.status)} isLastStep={index === steps.length - 1} icon={step.icon} description={step.description} />
        ))}
      </ol>
    </section>
  );
};

export default OrderDetails;
