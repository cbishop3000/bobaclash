"use client";
import { useState, useEffect } from 'react';
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
  const [priceId, setPriceId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [cancellationLog, setCancellationLog] = useState<any>(null);

  useEffect(() => {
    const fetchSubscription = async () => {
      if (!user?.email) return;

      const res = await fetch('/api/get-subs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: user.email }),
      });

      const data = await res.json();

      if (data.subscriptionTier) {
        const tierMapping: { [key: string]: string } = {
          'CLASHAHOLIC': 'price_1RFjlBHyP3FLprp1stDcSwmc',
          'I_NEED_COFFEE': 'price_1RFjkhHyP3FLprp1dzlAwJCp',
          'I_LOVE_COFFEE': 'price_1RFjjOHyP3FLprp1t7p5AOwM',
          'I_LIKE_COFFEE': 'price_1RFjiLHyP3FLprp1YhkDlNA3',
        };
        setPriceId(tierMapping[data.subscriptionTier] || '');
      }

      if (user?.id) {
        const logRes = await fetch('/api/get-cancellation-log', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId: user.id }),
        });

        const logData = await logRes.json();
        console.log(logData)
        setCancellationLog(logData.cancellationLog);
      }
    };

    fetchSubscription();
  }, [user]);

  const handleCancelSubscription = async () => {
    try {
      if (!user || !user.stripeCustomerId) {
        alert("You are not logged in or do not have a Stripe customer ID.");
        return;
      }
  
      const customerId = user.stripeCustomerId;
      const reason = "User request";
  
      const response = await fetch('/api/cancel-subscription', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ priceId, customerId }),
      });
  
      if (!response.ok) throw new Error("Failed to cancel subscription.");
  
      await fetch('/api/log-cancellation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          cancellationStatus: 'success',
          reason,
        }),
      });
  
      setPriceId(null);
  
      alert("Subscription will be canceled at the end of your billing period.");
  
      // Refresh the page to update all data and UI
      window.location.reload();
  
    } catch (err: any) {
      console.error(err);
  
      await fetch('/api/log-cancellation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user?.id,
          cancellationStatus: 'failed',
          errorMessage: err.message,
        }),
      });
  
      alert("Something went wrong canceling your subscription.");
    }
  };  

  const subscriptionInfo: SubscriptionInfo[] = [
    {
      title: "Clashaholic",
      description: "1 x 1lb bag\nPerks: Monthly delivery + sticker pack + premium merch (surprise)\nPrice: $35/month",
      priceCents: 3500,
      features: ["1 x 1lb bag", "Monthly delivery", "Sticker pack", "Premium merch (surprise)"],
      stripePriceId: 'price_1RFjlBHyP3FLprp1stDcSwmc',
    },
    {
      title: "I Need Coffee",
      description: "2 x 10oz bags\nPerks: Monthly delivery + sticker pack\nPrice: $27/month",
      priceCents: 2700,
      features: ["2 x 10oz bags", "Monthly delivery", "Sticker pack"],
      stripePriceId: 'price_1RFjkhHyP3FLprp1dzlAwJCp',
    },
    {
      title: "I Love Coffee",
      description: "1 x 1lb bag\nPerks: Monthly delivery + sticker pack\nPrice: $22/month",
      priceCents: 2200,
      features: ["1 x 1lb bag", "Monthly delivery", "Sticker pack"],
      stripePriceId: 'price_1RFjjOHyP3FLprp1t7p5AOwM',
    },
    {
      title: "I Like Coffee",
      description: "1 x 10oz bag\nPerks: Monthly delivery + sticker pack\nPrice: $15/month",
      priceCents: 1500,
      features: ["1 x 10oz bag", "Monthly delivery", "Sticker pack"],
      stripePriceId: 'price_1RFjiLHyP3FLprp1YhkDlNA3',
    },
  ];

  const handleSubscription = async (stripePriceId: string) => {
    if (!isLoggedIn) {
      window.location.href = '/login';
      return;
    }

    const response = await fetch('/api/create-checkout-session', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ priceId: stripePriceId, email: user?.email }),
    });

    if (!response.ok) {
      console.error('Failed to create checkout session');
      return;
    }

    const session = await response.json();
    const stripe = await loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '');

    if (!stripe) {
      console.error('Stripe failed to load');
      return;
    }

    const { error } = await stripe.redirectToCheckout({ sessionId: session.id });
    if (error) console.error('Error redirecting to checkout:', error.message);
  };
  

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-4xl font-bold mb-6 text-center">Coffee Subscription</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {subscriptionInfo.map((info, index) => {
          const isCurrentPlan = priceId === info.stripePriceId;
          const hasActivePlan = !!priceId;

          const isCancellingCurrentPlan =
            cancellationLog?.cancellationStatus === 'success' &&
            priceId === info.stripePriceId;

          return (
            <div key={index} className="relative">
              {priceId && cancellationLog?.cancellationStatus === 'success' && priceId !== info.stripePriceId && (
                <div className="absolute inset-0 bg-yellow-500 bg-opacity-50 rounded-lg z-20 pointer-events-none">
                  <span className="absolute top-2 right-2 bg-yellow-500 text-white text-xs font-semibold px-2 py-1 rounded-full">
                    Canceled - Wait until Next Month
                  </span>
                </div>
              )}

              <div className={`relative bg-white shadow-lg rounded-lg p-6 border-4 transition-all duration-300 ${
                isCurrentPlan
                  ? 'border-green-500'  // Green for active subscriptions
                  : 'border-transparent'
              }`}>
                {isCurrentPlan && (
                  <>
                    <span
                      className={`absolute top-2 right-2 text-white text-xs font-semibold px-2 py-1 rounded-full ${
                        isCancellingCurrentPlan ? 'bg-yellow-500' : 'bg-green-500'
                      }`}
                    >
                      {isCancellingCurrentPlan ? 'Plan Being Cancelled' : 'Current Plan'}
                    </span>

                    {!isCancellingCurrentPlan && (
                      <button
                        onClick={handleCancelSubscription}
                        className="absolute bottom-2 right-2 text-red-600 text-xs font-medium underline z-30 hover:text-red-700"
                      >
                        Cancel Subscription
                      </button>
                    )}
                  </>
                )}
                <h2 className="text-2xl font-semibold mb-2">{info.title}</h2>
                <p className="text-gray-700 mb-4 whitespace-pre-line">{info.description}</p>
                <p className="text-xl font-bold mb-4">${(info.priceCents / 100).toFixed(2)}</p>

                <button
                  disabled={isCurrentPlan || (hasActivePlan && !isCurrentPlan)}
                  className={`w-full py-2 px-4 rounded-full text-white ${
                    isCurrentPlan || (hasActivePlan && !isCurrentPlan)
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-blue-600 hover:bg-blue-700'
                  }`}
                  onClick={() => handleSubscription(info.stripePriceId)}
                >
                  {isCurrentPlan
                    ? 'Subscribed'
                    : hasActivePlan
                    ? 'You Have an Active Plan'
                    : 'Subscribe'}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
