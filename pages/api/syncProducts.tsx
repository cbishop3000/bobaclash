import prisma from '../../lib/prisma'; // Import the Prisma client
import stripe from '../../lib/stripe'; // Import the initialized Stripe client

const syncStripeProducts = async () => {
  try {
    console.log('🔄 Fetching products from Stripe...');

    // Fetch products from Stripe (limit to 100)
    const stripeProducts = await stripe.products.list({ limit: 100 });

    if (!stripeProducts.data.length) {
      console.log('⚠️ No products found in Stripe.');
      return;
    }

    for (const product of stripeProducts.data) {
      console.log(`🔄 Syncing Product ID: ${product.id}`);

      // Fetch associated prices for this product
      const prices = await stripe.prices.list({ product: product.id });

      // Get the first valid price (Stripe can have multiple prices per product)
      const price = prices.data?.[0]?.unit_amount ? prices.data[0].unit_amount / 100 : 0;

      console.log(price)
      // Upsert the product in Prisma
      await prisma.product.upsert({
        where: { stripeId: product.id }, // Use Stripe ID as the unique key
        update: {
          name: product.name,
          description: product.description || '',
          price: price, // Store the correct price from Stripe
          imageUrl: product.images.length > 0 ? product.images[0] : '',
        },
        create: {
          stripeId: product.id,
          name: product.name,
          description: product.description || '',
          price: price, // Store the correct price from Stripe
          imageUrl: product.images.length > 0 ? product.images[0] : '',
        },
      });

      console.log(`✅ Product synced: ${product.name} ($${price})`);
    }

    console.log('🎉 Successfully synced all products to Prisma!');
  } catch (error) {
    console.error('❌ Error syncing products:', error);
  }
};

export default syncStripeProducts;
