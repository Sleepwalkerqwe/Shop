export const setSelectedItems = (state) => state.products.reduce((total, product) => total + product.quantity, 0);

export const setTotalPrice = (state) => state.products.reduce((total, product) => total + product.quantity * product.price, 0);

export const setTax = (state) => setTotalPrice(state) * state.taxRate;

export const setGrandTotal = (state) => setTotalPrice(state) + setTax(state);
