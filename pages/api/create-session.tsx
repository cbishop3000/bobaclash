import { NextApiRequest, NextApiResponse } from "next";
import Stripe from "stripe";

// Define the products list as it was in the `page.tsx` file
const products = {
  Coffee: [
    { name: 'Espresso', price: 3.5, imageUrl: 'https://example.com/espresso.jpg' },
    { name: 'Latte', price: 4.0, imageUrl: 'https://example.com/latte.jpg' },
    { name: 'Cappuccino', price: 4.5, imageUrl: 'https://example.com/cappuccino.jpg' }
  ],
  'Milk Tea': [
    { name: 'Bubble Tea', price: 5.0, imageUrl: 'https://example.com/bubble-tea.jpg' },
    { name: 'Green Tea', price: 4.0, imageUrl: 'https://example.com/green-tea.jpg' }
  ],
  Clashades: [
    { name: 'Sunglasses A', price: 20.0, imageUrl: 'https://example.com/sunglasses-a.jpg' },
    { name: 'Sunglasses B', price: 25.0, imageUrl: 'https://example.com/sunglasses-b.jpg' }
  ],
  'Clash Lightning': [
    { name: 'Lightning Bolt Drink', price: 6.5, imageUrl: 'https://example.com/lightning-bolt.jpg' },
    { name: 'Electro Drink', price: 7.0, imageUrl: 'https://example.com/electro-drink.jpg' }
  ],
};

// Initialize Stripe with your secret key
const stripe = new Stripe(process.env.STRIPE_PUBLISHABLE_KEY as string);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    const { cart } = req.body;
    console.log(cart)

    // Validate the cart and map items to the Stripe API format
    const items = Object.keys(cart).map((item) => {
      const product = Object.values(products).flat().find((p) => p.name === item);
      
      // Ensure the product exists in the products list
      if (!product) {
        return null;  // Return null if the product is not found
      }

      return {
        price_data: {
          currency: "usd",
          product_data: {
            name: item,
            images: [product.imageUrl],
          },
          unit_amount: Math.round(product.price * 100),  // Convert to cents
        },
        quantity: cart[item],
      };
    }).filter(item => item !== null);  // Remove invalid/null items from the array

    // Ensure there are items to send to Stripe
    if (items.length === 0) {
      return res.status(400).json({ error: "No valid products in cart" });
    }

    try {
      // Create Stripe session with success and cancel URLs based on localhost
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: items as Stripe.Checkout.SessionCreateParams.LineItem[], // Cast to proper Stripe LineItem type
        mode: "payment",
        success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/Success`,
        cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/Cancel`,
      });

      res.status(200).json({ id: session.id });
    } catch (error) {
      console.error("Error creating session:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  } else {
    res.status(405).json({ error: "Method Not Allowed" });
  }
}
