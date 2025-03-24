"use client";

import { useState, useEffect } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { useCart } from "../context/CartContext"; // Ensure the import path is correct

type Cart = Record<string, CartItem>;

interface CartItem {
  quantity: number;
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  stripeId?: string; // Optional if you need it
}

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
}

const Shop = () => {
  const { cart = {}, addItem } = useCart() || {}; // Destructure cart and addItem, default to empty object
  const [quantity, setQuantity] = useState<Record<string, number>>({}); // Track quantity of each product in the cart
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState<Product[]>([]); // Store fetched products from the API

  // Fetch products from the server
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("/api/products"); // Assuming relative path for your API
        if (response.ok) {
          const data: Product[] = await response.json(); // Explicitly typing response
          setProducts(data); // Populate products array
        } else {
          console.error("Failed to fetch products:", response.status);
        }
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };
    fetchProducts();
  }, []);

  // Handle quantity change (increase/decrease)
  const handleQuantityChange = (item: string, action: "increase" | "decrease") => {
    setQuantity((prevQuantity) => {
      const currentQuantity = prevQuantity[item] || 0;
      const newQuantity = action === "increase" ? currentQuantity + 1 : Math.max(0, currentQuantity - 1);
      return { ...prevQuantity, [item]: newQuantity };
    });
  };

  // Handle adding an item to the cart
  const handleAddToCart = (item: Product) => {
    const itemQuantity = quantity[item.name] || 0; // Assuming 'item.name' is always a string here
    if (itemQuantity > 0) {
      const itemWithQuantity = {
        ...item,
        quantity: itemQuantity,
      };
      addItem(itemWithQuantity); // Add item directly through useCart
    }
  };

  // Calculate the total cost
  const totalCost = Object.entries(cart).reduce((acc, [itemName, cartItem]) => {
    const item = cartItem as CartItem; // Explicitly type cartItem as CartItem
    console.log(item)
    if (!item) return acc;

    // Find the product in the 'products' array that matches the itemName.
    const product = products.find((p) => p.name === itemName);

    if (product) {
      // Add price * quantity to total cost
      return acc + product.price * item.quantity;
    }

    return acc;  // If no product found, just return the accumulated cost
  }, 0);

  // Handle Stripe checkout session creation
  const createCheckoutSession = async () => {
    setLoading(true);
    try {
      // Validate that cart is not empty
      if (!cart || Object.keys(cart).length === 0) {
        throw new Error("Cart is empty, cannot create a session.");
      }
  
      // Create the checkout session
      const response = await fetch("/api/create-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ cart }),  // Ensure 'cart' is in the expected format
      });
  
      // Check for successful response
      if (!response.ok) {
        throw new Error(`Failed to create checkout session: ${response.statusText}`);
      }
  
      // Get session ID from the response
      const session = await response.json();
  
      // Ensure Stripe.js is loaded properly
      const stripe = await loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY as string);
      if (!stripe) {
        throw new Error("Stripe.js failed to load. Please try again later.");
      }
  
      // Redirect to Stripe Checkout with the session ID
      const { id } = session;
      const { error } = await stripe.redirectToCheckout({ sessionId: id });
  
      if (error) {
        console.error("Error with Stripe Checkout:", error);
        alert(`An error occurred: ${error.message}`);
      }
    } catch (error: any) {
      console.error("Error creating checkout session:", error);
      alert(`Error: ${error.message || "Something went wrong."}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Product Display */}
      <div className="m-4 flex-grow">
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))", gap: "20px" }}>
          {products.map((item) => (
            <div key={item.id} className="border p-6 rounded-lg bg-white shadow-lg hover:shadow-xl transition-shadow duration-200">
              <h3 className="text-xl font-semibold mb-2">{item.name}</h3>
              <p className="text-gray-500 mb-4">{item.description}</p>
              <div className="mb-4">
                <span className="text-lg font-semibold text-blue-500">${item.price.toFixed(2)}</span>
              </div>
              <div className="mb-4">
                <img src={item.imageUrl} alt={item.name} className="w-full h-auto rounded-md shadow-md" />
              </div>

              {/* Quantity Control */}
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

      {/* Cart */}
      <div className="fixed left-0 w-full bg-gray-800 text-white p-4" style={{ bottom: '3vh', maxHeight: "30vh", overflowY: "auto", zIndex: 1000 }}>
        <h3 className="text-xl font-semibold mb-2">Cart</h3>
        {Object.entries(cart).length > 0 && (
          <div className="mb-2">
            <button
              className="bg-blue-500 text-white py-2 px-4 rounded-md"
              onClick={createCheckoutSession}
              disabled={loading}
            >
              {loading ? "Processing..." : `Checkout: $${Object.values(cart).reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2)}`}
            </button>
          </div>
        )}
        <div className="overflow-y-auto max-h-64">
          {Object.keys(cart).length === 0 ? (
            <div>Your cart is empty</div>
          ) : (
            Object.entries(cart).map(([itemName, cartItem]) => {
              const item = cartItem as CartItem; // Explicitly typing cartItem as CartItem
              const product = products.find((p) => p.id === item.id); // Match correct product

              return (
                <div key={itemName} className="flex items-center space-x-4 mb-4 p-2 bg-gray-700 rounded-lg">
                  {product && (
                    <>
                      <img src={product.imageUrl} alt={product.name} className="w-16 h-16 object-cover rounded-md" />
                      <div className="flex-grow">
                        <div className="font-semibold">{product.name}</div>
                        <div>Quantity: {item.quantity}</div>
                        <div>Total Price: ${item.price * item.quantity}</div>
                      </div>
                    </>
                  )}
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
