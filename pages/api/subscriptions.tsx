import { NextApiRequest, NextApiResponse } from 'next';
import Stripe from 'stripe';
import prisma from '../../lib/prisma';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method === 'GET') {
      // Fetch products and prices from Stripe
      const products = await stripe.products.list();
      const prices = await stripe.prices.list();

      // Log the fetched data to check if everything is coming through
      console.log('Fetched Products:', products);
      console.log('Fetched Prices:', prices);

      // Loop through the products and update or create the plans
      for (const product of products.data) {
        const price = prices.data.find((p) => p.product === product.id);

        const stripeProductId = product.id;
        const stripePriceId = price?.id || 'unknown';
        const title = product.name;
        const description = product.description || '';
        const priceCents = price?.unit_amount || 0;
        const currency = price?.currency || 'usd';

        // Fetch the plan with the matching stripeProductId
        const plan = await prisma.plan.findFirst({
          where: { stripeProductId: stripeProductId },
        });

        // If the plan exists, update it
        if (plan) {
          console.log(`Found plan with ID: ${plan.id}, updating...`);
          try {
            await prisma.plan.update({
              where: { id: plan.id },
              data: {
                stripePriceId,
                title,
                description,
                priceCents,
                currency,
              },
            });
            console.log(`Plan with ID: ${plan.id} updated successfully`);
          } catch (updateError) {
            console.error(`Failed to update plan with ID: ${plan.id}`, updateError);
          }
        } else {
          // If the plan doesn't exist, create a new one
          console.log(`Plan with stripeProductId ${stripeProductId} not found. Creating new plan...`);
          try {
            await prisma.plan.create({
              data: {
                stripeProductId,
                stripePriceId,
                title,
                description,
                priceCents,
                currency,
              },
            });
            console.log(`New plan for stripeProductId ${stripeProductId} created successfully`);
          } catch (createError) {
            console.error(`Failed to create new plan for stripeProductId ${stripeProductId}`, createError);
          }
        }
      }

      res.status(200).json({ message: 'Plans synced successfully' });
    } else {
      res.status(405).json({ message: 'Method not allowed' });
    }
  } catch (error) {
    console.error('Error syncing plans:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}
