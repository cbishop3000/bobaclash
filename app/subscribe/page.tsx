"use client"
import { useState, useEffect } from 'react';

interface SubscriptionInfo {
  title: string;
  description: string;
  price: string;
  features: string[];
}

export default function Subscribe() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(false); // Assuming you have a way to check this
  const [email, setEmail] = useState('');
  const [priceId, setPriceId] = useState('');
  
  const [subscriptionInfo, setSubscriptionInfo] = useState<SubscriptionInfo[]>([]);

  useEffect(() => {
    // Here, you can fetch dynamic subscription info (pricing, service features)
    // This could be fetched from your backend or hardcoded for simplicity.
    setSubscriptionInfo([
      {
        title: "Premium Coffee Subscription",
        description: "Get freshly roasted, hand-picked coffee delivered to your door every month.",
        price: "$19.99 / month",
        features: [
          "Freshly roasted coffee beans",
          "Free delivery to your doorstep",
          "Exclusive access to special blends",
          "Flexible subscription options"
        ]
      },
      {
        title: "Basic Coffee Subscription",
        description: "Enjoy freshly brewed coffee delivered monthly, with great savings.",
        price: "$9.99 / month",
        features: [
          "Freshly brewed coffee",
          "Free delivery",
          "Discount on future orders"
        ]
      }
    ]);
  }, []);

  const handleSubscribe = async () => {
    // Open the modal to check if the user is logged in
    setIsModalOpen(true);
    await checkLoginStatus();
  };

  const checkLoginStatus = async () => {
    // Example: Check if user is logged in (fetch token or session)
    const res = await fetch('/api/check-login');
    const data = await res.json();
    setIsUserLoggedIn(data.loggedIn);
  };

  const handleSubscription = async () => {
    if (isUserLoggedIn) {
      // Proceed with subscription logic
      console.log('Proceeding with subscription for: ', priceId);
    } else {
      // Prompt user to log in or create an account
      handleLoginAndSubscribe();
    }
  };

  const handleLoginAndSubscribe = () => {
    console.log('Redirecting to login or account creation...');
    // Redirect to login or handle the signup process
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-4xl font-bold mb-6 text-center">Coffee Subscription</h1>
      
      {/* Main Content */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {subscriptionInfo.map((info: SubscriptionInfo, index) => (
          <div key={index} className="bg-white shadow-lg rounded-lg p-6">
            <h2 className="text-2xl font-semibold mb-2">{info.title}</h2>
            <p className="text-gray-700 mb-4">{info.description}</p>
            <p className="text-xl font-bold mb-4">{info.price}</p>
            <h3 className="font-medium mb-2">Features:</h3>
            <ul className="list-disc pl-6 space-y-2 text-gray-700">
              {info.features.map((feature, idx) => (
                <li key={idx}>{feature}</li>
              ))}
            </ul>
            <button
              onClick={() => setPriceId(info.price)}
              className="mt-4 bg-blue-500 text-white py-2 px-4 rounded-full"
            >
              Subscribe Now
            </button>
          </div>
        ))}
      </div>

      {/* Subscription Modal */}
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
              onClick={() => setIsModalOpen(false)}
              className="mt-4 text-red-500 w-full text-center"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
