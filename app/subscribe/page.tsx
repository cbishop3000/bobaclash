"use client";
import { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { useAuth } from "@/app/context/AuthContext";
import { motion } from 'framer-motion'; // Importing motion for animations

interface SubscriptionInfo {
  title: string;
  description: string;
  priceCents: number;
  features: string[];
  stripePriceId: string;
}

export default function Subscribe() {
  const { isLoggedIn, user, loading: authLoading } = useAuth();
  const [priceId, setPriceId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [cancellationLog, setCancellationLog] = useState<any>(null);

  useEffect(() => {
    const fetchSubscription = async () => {
      if (!user?.email) {
        setIsLoading(false);
        return;
      }
  
      try {
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
          setCancellationLog(logData.cancellationLog);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };
  
    fetchSubscription();
  }, [authLoading, user?.email]);
  
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

  if (isLoading || authLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-yellow-500"></div>
      </div>
    );
  }

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
      <motion.div
        key={index}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ duration: 0.25 }}
        className="relative"
      >
        {priceId &&
          cancellationLog?.cancellationStatus === 'success' &&
          priceId !== info.stripePriceId && (
            <div className="absolute inset-0 bg-yellow-400/50 rounded-2xl z-20 flex items-start justify-end p-2 pointer-events-none">
              <span className="bg-yellow-600 text-white text-xs font-semibold px-3 py-1 rounded-full shadow">
                Canceled - Wait until Next Month
              </span>
            </div>
          )}

        <motion.div
          className={`group h-80 bg-white rounded-2xl shadow-xl border-4 p-6 transition-all duration-300 relative overflow-hidden ${
            isCurrentPlan ? 'border-green-500' : 'border-gray-200'
          }`}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
        >
          {isCurrentPlan && (
            <>
              <span
                className={`absolute top-3 right-3 text-white text-xs font-semibold px-3 py-1 rounded-full shadow ${
                  isCancellingCurrentPlan ? 'bg-yellow-500' : 'bg-green-500'
                }`}
              >
                {isCancellingCurrentPlan ? 'Plan Being Cancelled' : 'Current Plan'}
              </span>

              {!isCancellingCurrentPlan && (
                <button
                  onClick={handleCancelSubscription}
                  className="absolute bottom-3 right-3 text-red-600 text-sm underline hover:text-red-700 z-30"
                >
                  Cancel Subscription
                </button>
              )}
            </>
          )}

          <motion.h2
            className="text-xl font-bold mb-2 text-gray-900"
            initial={{ x: -10 }}
            animate={{ x: 0 }}
            transition={{ duration: 0.25 }}
          >
            {info.title}
          </motion.h2>
          <motion.p
            className="text-gray-600 mb-4 whitespace-pre-line text-sm"
            initial={{ y: 10 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.25 }}
          >
            {info.description}
          </motion.p>
          <p className="text-2xl font-semibold text-gray-900 mb-6">
            ${(info.priceCents / 100).toFixed(2)}
          </p>

          <button
            disabled={isCurrentPlan || (hasActivePlan && !isCurrentPlan)}
            className={`w-full py-2 px-4 rounded-full font-medium text-white transition-colors duration-200 ${
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
        </motion.div>
      </motion.div>
    );
  })}
</div>

    </div>
  );
}
