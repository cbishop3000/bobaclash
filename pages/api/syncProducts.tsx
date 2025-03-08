import prisma from '../../lib/prisma'; // Import the Prisma client
import stripe from '../../lib/stripe'; // Import the initialized Stripe client

const syncStripeProducts = async () => {
  try {
    console.log('Fetching products from Stripe...');

    // Fetch products from Stripe (limit to 100 for now)
    const stripeProducts = await stripe.products.list({ limit: 100 });

    // Log the data to see if products are fetched correctly
    console.log('Fetched products from Stripe:', stripeProducts.data);

    // Loop through the fetched products and upsert them in the Prisma database
    for (const product of stripeProducts.data) {
      console.log(`Syncing Product ID: ${product.id}`);

      // Upsert the product in Prisma (update or create)
      await prisma.product.upsert({
        where: { stripeId: product.id }, // Use Stripe ID to match the product
        update: {
          name: product.name,
          description: product.description || '',
          imageUrl: product.images.length > 0 ? product.images[0] : '', // Handle images array
        },
        create: {
          stripeId: product.id, // Store Stripe Product ID
          name: product.name,
          description: product.description || '',
          price: 0, // Prices are handled separately
          imageUrl: product.images.length > 0 ? product.images[0] : '', // Handle images array
        },
      });
      console.log(`Product with ID: ${product.id} synced successfully!`);
    }

    console.log('✅ Successfully synced products to Prisma!');
  } catch (error) {
    console.error('❌ Error syncing products:', error);
  }
};

export default syncStripeProducts;
