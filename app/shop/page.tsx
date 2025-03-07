"use client";
import { useState, useEffect } from 'react';
import CartFooter from '../components/CartFooter';

type Tab = 'Coffee' | 'Milk Tea' | 'Clashades' | 'Clash Lightning'; 

const Shop = () => {
  // State to hold quantities for each item
  const [quantity, setQuantity] = useState<Record<string, number>>({}); // Stores the quantity of each product
  const [activeTab, setActiveTab] = useState<Tab>('Coffee');  // Default tab is 'Coffee'
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false); // Track login status
  const [cart, setCart] = useState<Record<string, number>>({}); // Track the cart items

  // Check if the user is logged in (this could be a session or token check)
  useEffect(() => {
    const token = document.cookie.match(/auth_token=([^;]+)/); // Adjust to your token method
    if (token) {
      setIsLoggedIn(true);
    }
  }, []);

  // Function to increase or decrease the quantity of a specific item
  const handleQuantityChange = (item: string, action: 'increase' | 'decrease') => {
    setQuantity((prevQuantity) => {
      const currentQuantity = prevQuantity[item] || 0; // Get the current quantity (defaults to 0 if not found)
      const newQuantity = action === 'increase' ? currentQuantity + 1 : Math.max(0, currentQuantity - 1); // Ensure quantity doesn't go below 0
      return { ...prevQuantity, [item]: newQuantity }; // Update the quantity of the specific item
    });
  };

  // Function to add items to the cart
  const handleAddToCart = (item: string) => {
    const itemQuantity = quantity[item] || 0;
    if (itemQuantity > 0) {
      setCart((prevCart) => {
        const updatedCart = { ...prevCart };
        updatedCart[item] = itemQuantity;
        return updatedCart;
      });
    }
  };

  // Example list of products (you can replace this with your actual data)
  const products = {
    Coffee: ['Espresso', 'Latte', 'Cappuccino'],
    'Milk Tea': ['Bubble Tea', 'Green Tea'],
    Clashades: ['Sunglasses A', 'Sunglasses B'],
    'Clash Lightning': ['Lightning Bolt Drink', 'Electro Drink'],
  };

  return (
    <div>
      <div className="flex justify-center gap-4 mb-4">
        {['Coffee', 'Milk Tea', 'Clashades', 'Clash Lightning'].map(tab => (
          <button
            key={tab}
            className={`py-2 px-4 rounded-lg text-white ${activeTab === tab ? 'bg-blue-500' : 'bg-gray-500'}`}
            onClick={() => setActiveTab(tab as Tab)} // Ensure that `tab` is of type `Tab`
          >
            {tab}
          </button>
        ))}
      </div>
      <div className="m-4">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '20px' }}>
          {products[activeTab].map((item, index) => (
            <div key={index} className="border p-6 rounded-lg bg-white shadow-lg hover:shadow-xl transition-shadow duration-200">
              <h3 className="text-xl font-semibold mb-2">{item}</h3>
              <p className="text-gray-500 mb-4">Description of {item}</p>

              {/* Label and Quantity Control */}
              <div className="mb-4">
                <label htmlFor={`${item}-quantity`} className="block text-sm font-medium mb-2">Quantity</label>
                <div className="flex items-center justify-between">
                  <button
                    className="px-2 py-1 border rounded-md bg-gray-200 hover:bg-gray-300 transition"
                    onClick={() => handleQuantityChange(item, 'decrease')}
                  >
                    -
                  </button>
                  <span id={`${item}-quantity`} className="text-lg font-medium">{quantity[item] || 0}</span>
                  <button
                    className="px-2 py-1 border rounded-md bg-gray-200 hover:bg-gray-300 transition"
                    onClick={() => handleQuantityChange(item, 'increase')}
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Add to Cart Button */}
              <button 
                className="w-full py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition duration-200"
                onClick={() => handleAddToCart(item)}
              >
                Add to Cart
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Show Cart Footer only if the user is logged in */}
      {isLoggedIn && <CartFooter cart={cart} />}
    </div>
  );
};

export default Shop;
