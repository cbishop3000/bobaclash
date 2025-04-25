"use client";
import { useState, useEffect } from 'react';

interface SubscriptionInfo {
  title: string;
  description: string;
  priceCents: number; // price stored in cents
  features: string[];
  stripePriceId: string; // ID used for Stripe checkout
}

export default function Subscribe() {
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(false);
  const [priceId, setPriceId] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Hardcoded subscription data (just for illustration, should be from DB)
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

  const checkLoggedIn = () => {
    // You would replace this with a real login check, such as checking localStorage or a token
    const isLoggedIn = localStorage.getItem('userLoggedIn') === 'true';
    setIsUserLoggedIn(isLoggedIn);
  };

  useEffect(() => {
    // Run the checkLoggedIn function when the component mounts
    checkLoggedIn();
  }, []);

  // Handle the subscription logic, triggered when the user is logged in
  const handleSubscription = async () => {
    if (isUserLoggedIn && priceId) {
      console.log('Processing subscription for priceId:', priceId);
      // Call Stripe or backend to create a subscription session
      // Example: redirect to Stripe checkout or API call
    }
  };

  // Handle login and redirection to signup page
  const handleLoginAndSubscribe = () => {
    console.log('Redirecting to login or account creation...');
    // Implement your redirect to login or signup flow
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-4xl font-bold mb-6 text-center">Coffee Subscription</h1>

      {/* Main Content - Grid of subscription options */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {subscriptionInfo.map((info, index) => (
          <div key={index} className="bg-white shadow-lg rounded-lg p-6">
            <h2 className="text-2xl font-semibold mb-2">{info.title}</h2>
            <p className="text-gray-700 mb-4">{info.description}</p>
            <p className="text-xl font-bold mb-4">{`$${(info.priceCents / 100).toFixed(2)} / month`}</p>
            <h3 className="font-medium mb-2">Features:</h3>
            <ul className="list-disc pl-6 space-y-2 text-gray-700">
              {info.features.map((feature, idx) => (
                <li key={idx}>{feature}</li>
              ))}
            </ul>

            {/* Button */}
            <button
              onClick={() => {
                // Check if the user is logged in
                if (!isUserLoggedIn) {
                  // If not logged in, prompt to login or sign up
                  handleLoginAndSubscribe();
                } else {
                  // If logged in, set the price ID and open the modal
                  setPriceId(info.stripePriceId); // Set the selected subscription's Stripe price ID
                  setIsModalOpen(true); // Open modal when user selects a plan
                }
              }}
              className={`mt-4 py-2 px-4 rounded-full ${
                isUserLoggedIn ? 'bg-blue-500 text-white' : 'bg-gray-400 text-gray-200 cursor-not-allowed'
              }`}
              disabled={!isUserLoggedIn}
            >
              {isUserLoggedIn ? 'Subscribe Now' : 'Signup and Pay!'}
            </button>

          </div>
        ))}
      </div>

      {/* Modal for Subscription Flow */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg w-80">
            {!isUserLoggedIn ? (
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
            ) : (
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
            )}
            <button
              onClick={() => setIsModalOpen(false)} // Close modal on cancel
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
