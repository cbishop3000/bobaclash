"use client";
import { loadStripe } from '@stripe/stripe-js';
import { useCart } from '../context/CartContext'; // Adjust path if needed
import { useState, useEffect } from 'react';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY as string);

const CheckoutButton = () => {
  const cart = useCart(); // Accessing the cart from context
  const [products, setProducts] = useState<any[]>([]); // Store fetched products
  const [loading, setLoading] = useState(false); // Loading state for Stripe

  // Fetch the product list from your server or API
  useEffect(() => {
    async function fetchProducts() {
      const res = await fetch('/api/products');
      const data = await res.json();
      setProducts(data);
    }
    fetchProducts();
  }, []);

  // Map the cart to products array (adjusting to cart as an object of CartItem objects)
  const cartItems = Object.values(cart).map((item) => {
    const product = products.find((p: any) => p.id === item.id); // Find product details by ID
    return product
      ? {
          name: product.name,
          quantity: item.quantity, // Use the quantity from cart
          price: item.price, // Use price from the cart
          description: product.description,
          imageUrl: product.imageUrl,
        }
      : null;
  }).filter((item: any) => item !== null);

  // Create Checkout session
  const createCheckoutSession = async () => {
    setLoading(true);
    try {
      const cartItemsArray = Object.values(cart || []); // Converts the cart object to an array of cart items
  
      // Ensure the array isn't empty before sending
      if (cartItemsArray.length === 0) {
        throw new Error('Cart is empty');
      }
  
      const response = await fetch("/api/create-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ cart: cartItemsArray }), // Send the array here
      });
  
      if (!response.ok) {
        throw new Error("Failed to create checkout session");
      }
  
      const session = await response.json();
      const stripe = await loadStripe(process.env.STRIPE_PUBLISHABLE_KEY as string);
  
      if (!stripe) {
        throw new Error("Stripe.js failed to load");
      }
  
      const { id } = session;
      const { error } = await stripe.redirectToCheckout({ sessionId: id });
  
      if (error) {
        console.error("Stripe Checkout error:", error);
      }
    } catch (error) {
      console.error("Error creating checkout session:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button onClick={createCheckoutSession} disabled={loading || cartItems.length === 0}>
      {loading ? 'Loading...' : 'Go to Checkout'}
    </button>
  );
};

export default CheckoutButton;
