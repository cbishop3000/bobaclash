'use client';

import { motion } from 'framer-motion';
import Carousel from './Carousel';

const FeaturedVibes = () => {
  return (
    <section className="relative py-32 bg-gradient-to-br from-[#F1F1F1] via-[#E0E0E0] to-[#B5B5B5] text-gray-800 overflow-hidden">
      {/* Soft background gradient with warm tones */}
      <div className="absolute inset-0 bg-[#F1F1F1] opacity-90 pointer-events-none" />
      
      {/* Subtle texture for warmth */}
      <div className="absolute inset-0 bg-[url('/paper-texture.svg')] bg-repeat opacity-15 pointer-events-none" />

      {/* Soft overlay for modern and cozy vibe */}
      <div className="absolute inset-0 bg-amber-50 opacity-20 pointer-events-none" />
      
      {/* Main content wrapper */}
      <div className="max-w-7xl mx-auto px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: -40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          {/* Title with a modern gradient text */}
          <h2 className="text-5xl font-bold tracking-tight bg-clip-text">
            Featured Vibes
          </h2>
          {/* Descriptive text with a relaxed, friendly vibe */}
          <p className="mt-4 text-lg text-gray-600 max-w-3xl mx-auto">
            Curated drops to elevate your mood. Step into the vibe and experience the flow.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: 'easeOut', delay: 0.2 }}
          viewport={{ once: true }}
          className="relative z-10"
        >
          {/* Carousel for showcasing content */}
          <Carousel />
        </motion.div>

        {/* Optional footer for the coffee shop feel */}
        <div className="text-center mt-16 text-gray-500">
          <p className="text-lg">Brewing up fresh vibes for you every week. Join the vibe!</p>
        </div>
      </div>
    </section>
  );
};

export default FeaturedVibes;
