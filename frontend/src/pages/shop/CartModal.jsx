import React from 'react';
import { useDispatch } from 'react-redux';
import OrderSummary from './OrderSummary';
import { removeFromCart, updateQuantity } from '../../redux/features/cart/cartSlice';

const CartModal = React.forwardRef(({ products, isOpen, onClose }, ref) => {
  const dispatch = useDispatch();

  const handleQuantity = (type, id) => {
    dispatch(updateQuantity({ type, id }));
  };

  const handleRemove = (e, id) => {
    e.preventDefault();
    dispatch(removeFromCart({ id }));
  };

  return (
    <div className="fixed z-[1000] inset-0 bg-black bg-opacity-80 pointer-events-auto">
      <div ref={ref} className="cart-panel fixed right-0 top-0 md:w-1/3 w-full bg-white h-full overflow-y-auto">
        <div className="p-4 mt-4">
          <div className="flex justify-between items-center mb-4">
            <h4 className="text-xl font-semibold">Your Cart</h4>

            <button onClick={onClose} className="text-gray-600 hover:text-primary transition-colors duration-300 ease-in-out p-2 rounded-full hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2">
              <i className="ri-close-large-line bg-primary p-1 text-white rounded-full"></i>
            </button>
          </div>

          {/* cart details */}
          <div className="cart-items max-w-4xl mx-auto">
            {products.length === 0 ? (
              <div className="text-center text-gray-600 py-6">Your cart is empty</div>
            ) : (
              products.map((item, index) => (
                <div key={index} className="flex flex-col md:flex-row md:items-center shadow-lg p-4 mb-6 rounded-lg bg-white transition-transform duration-300 ease-in-out transform hover:scale-[1.02]">
                  {/* Product Info and Quantity Controls */}
                  <div className="flex flex-col md:flex-row md:items-center w-full gap-4">
                    {/* Product Info (Index, Image, Name, Price) */}
                    <div className="flex items-center gap-3 flex-grow min-w-0">
                      <span className="text-white bg-primary rounded-full w-8 h-8 flex items-center justify-center text-lg font-semibold flex-shrink-0">{index + 1}</span>
                      <img src={item.image} alt={item.name} className="w-16 h-16 md:w-20 md:h-20 object-cover rounded-lg flex-shrink-0" />
                      <div className="flex flex-col min-w-0 flex-grow">
                        <h5 className="text-lg font-medium text-gray-800 line-clamp-2">{item.name}</h5>
                        <p className="text-gray-600 text-sm">${Number(item.price).toFixed(2)}</p>
                      </div>
                    </div>

                    {/* Quantity Controls */}
                    <div className="flex items-center justify-center gap-1 md:gap-1 flex-shrink-0">
                      <button onClick={() => handleQuantity('decrement', item._id)} className="w-8 h-8 rounded-full bg-gray-200 text-gray-700 hover:bg-primary hover:text-white transition-all duration-300 flex items-center justify-center" aria-label={`Decrease quantity of ${item.name}`}>
                        -
                      </button>
                      <span className="text-center text-lg font-semibold w-3">{item.quantity}</span>
                      <button onClick={() => handleQuantity('increment', item._id)} className="w-8 h-8 rounded-full bg-gray-200 text-gray-700 hover:bg-primary hover:text-white transition-all duration-300 flex items-center justify-center" aria-label={`Increase quantity of ${item.name}`}>
                        +
                      </button>
                    </div>
                  </div>

                  {/* Remove Button */}
                  <div className="flex justify-center md:justify-end mt-4 md:mt-0 md:ml-3">
                    <button onClick={(e) => handleRemove(e, item._id)} className="text-red-500 hover:text-red-700 font-medium px-4 py-1 rounded-md hover:bg-red-50 transition-all duration-300" aria-label={`Remove ${item.name} from cart`}>
                      Remove
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {products.length > 0 && <OrderSummary />}
        </div>
      </div>
    </div>
  );
});

export default CartModal;
