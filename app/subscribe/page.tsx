"use client";
import { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { useAuth } from "@/app/context/AuthContext";

interface SubscriptionInfo {
  title: string;
  description: string;
  priceCents: number;
  features: string[];
  stripePriceId: string;
}

export default function Subscribe() {
  const { isLoggedIn, user } = useAuth();
  const [priceId, setPriceId] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const subscriptionInfo: SubscriptionInfo[] = [
    {
      title: "Clashaholic",
      description: "1 x 1lb bag\nPerks: Monthly delivery + sticker pack + premium merch (surprise)\nPrice: $35/month",
      priceCents: 3500,
      features: [
        "1 x 1lb bag",
        "Monthly delivery",
        "Sticker pack",
        "Premium merch (surprise)"
      ],
      stripePriceId: 'price_1RFjlBHyP3FLprp1stDcSwmc'
    },
    {
      title: "I Need Coffee",
      description: "2 x 10oz bags\nPerks: Monthly delivery + sticker pack\nPrice: $27/month",
      priceCents: 2700,
      features: [
        "2 x 10oz bags",
        "Monthly delivery",
        "Sticker pack"
      ],
      stripePriceId: 'price_1RFjkhHyP3FLprp1dzlAwJCp'
    },
    {
      title: "I Love Coffee",
      description: "1 x 1lb bag\nPerks: Monthly delivery + sticker pack\nPrice: $22/month",
      priceCents: 2200,
      features: [
        "1 x 1lb bag",
        "Monthly delivery",
        "Sticker pack"
      ],
      stripePriceId: 'price_1RFjjOHyP3FLprp1t7p5AOwM'
    },
    {
      title: "I Like Coffee",
      description: "1 x 10oz bag\nPerks: Monthly delivery + sticker pack\nPrice: $15/month",
      priceCents: 1500,
      features: [
        "1 x 10oz bag",
        "Monthly delivery",
        "Sticker pack"
      ],
      stripePriceId: 'price_1RFjiLHyP3FLprp1YhkDlNA3'
    }
  ];

  const handleSubscription = async () => {
    if (isLoggedIn && priceId) {
      console.log('Processing subscription for priceId:', priceId);

      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ priceId, email: user?.email }),
      });

      if (!response.ok) {
        console.error('Failed to create checkout session');
        return;
      }

      const session = await response.json();

      const stripeInstance = await loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '');

      if (!stripeInstance) {
        console.error('Stripe failed to load');
        return;
      }

      const { error } = await stripeInstance.redirectToCheckout({ sessionId: session.id });

      if (error) {
        console.error('Error redirecting to checkout:', error.message);
      }
    }
  };

  const handleLoginAndSubscribe = () => {
    console.log('Redirecting to login or account creation...');
    window.location.href = '/login';
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-4xl font-bold mb-6 text-center">Coffee Subscription</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {subscriptionInfo.map((info, index) => (
          <div key={index} className="bg-white shadow-lg rounded-lg p-6">
            <h2 className="text-2xl font-semibold mb-2">{info.title}</h2>
            <p className="text-gray-700 mb-4 whitespace-pre-line">{info.description}</p>
            <p className="text-xl font-bold mb-4">{`$${(info.priceCents / 100).toFixed(2)} / month`}</p>
            <h3 className="font-medium mb-2">Features:</h3>
            <ul className="list-disc pl-6 space-y-2 text-gray-700">
              {info.features.map((feature, idx) => (
                <li key={idx}>{feature}</li>
              ))}
            </ul>

            <button
              onClick={() => {
                if (!isLoggedIn) {
                  handleLoginAndSubscribe();
                } else {
                  setPriceId(info.stripePriceId);
                  setIsModalOpen(true);
                }
              }}
              className={`mt-4 py-2 px-4 rounded-full w-full ${
                isLoggedIn ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-gray-400 text-white cursor-not-allowed'
              }`}
            >
              {isLoggedIn ? 'Subscribe Now' : 'Signup and Pay!'}
            </button>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg w-80">
            {isLoggedIn ? (
              <div>
                <h2 className="text-xl font-bold mb-2">Ready to Subscribe!</h2>
                <p className="mb-4">Proceeding with your subscription...</p>
                <button
                  onClick={handleSubscription}
                  className="bg-blue-500 text-white py-2 px-4 rounded-full w-full"
                >
                  Subscribe Now
                </button>
              </div>
            ) : (
              <div>
                <h2 className="text-xl font-bold mb-2">You're not logged in</h2>
                <p className="mb-4">To subscribe, you need to create an account.</p>
                <button
                  onClick={handleLoginAndSubscribe}
                  className="bg-green-500 text-white py-2 px-4 rounded-full w-full"
                >
                  Create an Account
                </button>
              </div>
            )}
            <button
              onClick={() => setIsModalOpen(false)}
              className="mt-4 py-2 px-4 rounded-full bg-red-500 text-white w-full"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
