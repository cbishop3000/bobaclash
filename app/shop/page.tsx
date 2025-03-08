"use client"

import { useState, useEffect } from "react";
import CheckoutButton from "../components/CheckoutButton";
import { loadStripe } from '@stripe/stripe-js';

type Tab = "Coffee" | "Milk Tea" | "Clashades" | "Clash Lightning";

const Shop = () => {
  const [quantity, setQuantity] = useState<Record<string, number>>({});
  const [cart, setCart] = useState<{ [key: string]: number }>({});
  const [activeTab, setActiveTab] = useState<Tab>("Coffee");
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState<any[]>([]); // Products fetched from Stripe

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("/api/products");
        const data = await response.json();
        setProducts(data); // Set the fetched products
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchProducts();
  }, []);

  const handleQuantityChange = (item: string, action: 'increase' | 'decrease') => {
    setQuantity((prevQuantity) => {
      const currentQuantity = prevQuantity[item] || 0;
      const newQuantity = action === 'increase' ? currentQuantity + 1 : Math.max(0, currentQuantity - 1);
      return { ...prevQuantity, [item]: newQuantity };
    });
  };

  const handleAddToCart = (item: string) => {
    const itemQuantity = quantity[item] || 0;
    if (itemQuantity > 0) {
      setCart((prevCart) => {
        const newCart = { ...prevCart, [item]: (prevCart[item] || 0) + itemQuantity };
        return newCart;
      });
    }
  };

  const totalCost = Object.keys(cart).reduce((acc, itemName) => {
    const product = products.find((p) => p.name === itemName);
    if (product) {
      return acc + product.price * cart[itemName];
    }
    return acc;
  }, 0);

  const createCheckoutSession = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/create-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ cart }),
      });

      if (!response.ok) {
        throw new Error('Failed to create checkout session');
      }

      const session = await response.json();
      const stripe = await loadStripe(process.env.STRIPE_SECRET_KEY as string);

      if (!stripe) {
        throw new Error('Stripe.js failed to load');
      }

      const { id } = session;
      const { error } = await stripe.redirectToCheckout({ sessionId: id });

      if (error) {
        console.error('Stripe Checkout error:', error);
      }
    } catch (error) {
      console.error("Error creating checkout session:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex justify-center gap-4 mb-4 p-4">
        {["Coffee", "Milk Tea", "Clashades", "Clash Lightning"].map((tab) => (
          <button
            key={tab}
            className={`py-2 px-4 rounded-lg text-white ${activeTab === tab ? "bg-blue-500" : "bg-gray-500"}`}
            onClick={() => setActiveTab(tab as Tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="m-4 flex-grow">
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))", gap: "20px" }}>
          {products.filter((product) => product.category === activeTab).map((item, index) => (
            <div key={index} className="border p-6 rounded-lg bg-white shadow-lg hover:shadow-xl transition-shadow duration-200">
              <h3 className="text-xl font-semibold mb-2">{item.name}</h3>
              <p className="text-gray-500 mb-4">{item.description}</p>

              <div className="mb-4">
                <span className="text-lg font-semibold text-blue-500">${item.price.toFixed(2)}</span>
              </div>

              <div className="mb-4">
                <img src={item.imageUrl} alt={item.name} className="w-full h-auto rounded-md shadow-md" />
              </div>

              <div className="mb-4">
                <label htmlFor={`${item.name}-quantity`} className="block text-sm font-medium mb-2">Quantity</label>
                <div className="flex items-center justify-between">
                  <button
                    className="px-2 py-1 border rounded-md bg-gray-200 hover:bg-gray-300 transition"
                    onClick={() => handleQuantityChange(item.name, "decrease")}
                  >
                    -
                  </button>
                  <span id={`${item.name}-quantity`} className="text-lg font-medium">{quantity[item.name] || 0}</span>
                  <button
                    className="px-2 py-1 border rounded-md bg-gray-200 hover:bg-gray-300 transition"
                    onClick={() => handleQuantityChange(item.name, "increase")}
                  >
                    +
                  </button>
                </div>
              </div>

              <button
                className="w-full py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition duration-200"
                onClick={() => handleAddToCart(item.name)}
              >
                Add to Cart
              </button>
            </div>
          ))}
        </div>
      </div>

      <div
        className="fixed left-0 w-full bg-gray-800 text-white p-4"
        style={{ bottom: '3vh', maxHeight: "30vh", overflowY: "auto", zIndex: 1000 }}
      >
        <h3 className="text-xl font-semibold mb-2">Cart</h3>
        {Object.keys(cart).length > 0 && (
          <div className="mb-2">
            <button
              className="bg-blue-500 text-white py-2 px-4 rounded-md"
              onClick={createCheckoutSession}
              disabled={loading}
            >
              {loading ? "Processing..." : `Checkout: $${totalCost.toFixed(2)}`}
            </button>
          </div>
        )}

        <div className="overflow-y-auto max-h-64">
          {Object.keys(cart).length === 0 ? (
            <div>Your cart is empty</div>
          ) : (
            Object.keys(cart).map((item) => {
              const product = products.find((p) => p.name === item);
              return (
                <div key={item} className="flex items-center space-x-4 mb-4 p-2 bg-gray-700 rounded-lg">
                  <img src={product?.imageUrl} alt={product?.name} className="w-16 h-16 object-cover rounded-md" />
                  <div className="flex-grow">
                    <div className="font-semibold">{product?.name}</div>
                    <div>Quantity: {cart[item]}</div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default Shop;
