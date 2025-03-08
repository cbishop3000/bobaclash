import { loadStripe } from '@stripe/stripe-js';
import { useState } from 'react';

interface Cart {
  [itemName: string]: number;
}

interface CheckoutButtonProps {
  cart: Cart;
  totalCost: number;
}

const stripePromise = loadStripe(process.env.STRIPE_SECRET_KEY as string);

const CheckoutButton: React.FC<CheckoutButtonProps> = ({ cart, totalCost }) => {
  const [loading, setLoading] = useState(false);

  const handleCheckout = async () => {
    setLoading(true);

    try {
      const response = await fetch("/api/create-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ cart }),
      });

      const session = await response.json();
      const stripe = await stripePromise;

      if (!stripe || !session.id) {
        throw new Error('Stripe checkout session creation failed');
      }

      const { error } = await stripe.redirectToCheckout({ sessionId: session.id });

      if (error) {
        console.error('Error redirecting to checkout:', error);
      }
    } catch (error) {
      console.error('Checkout failed:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleCheckout}
      className={`w-full py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition duration-200`}
      disabled={loading}
    >
      {loading ? 'Processing...' : `Checkout: $${totalCost.toFixed(2)}`}
    </button>
  );
};

export default CheckoutButton;
