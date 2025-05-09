'use client';

import { motion } from 'framer-motion';

const WhyChooseUs = () => {
  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    show: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.2,
        duration: 0.6,
        ease: 'easeOut',
      },
    }),
  };

  return (
    <section className="w-full py-24 bg-gradient-to-br from-zinc-900 via-zinc-800 to-black text-white relative overflow-hidden">
      {/* Decorative glowing orbs */}
      <div className="absolute top-0 left-0 w-72 h-72 bg-amber-400 opacity-20 blur-3xl rounded-full transform -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-72 h-72 bg-orange-500 opacity-20 blur-3xl rounded-full transform translate-x-1/2 translate-y-1/2 pointer-events-none" />

      <div className="max-w-6xl mx-auto px-6 relative z-10 text-center">
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-4xl sm:text-5xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-amber-400 via-yellow-300 to-orange-500"
        >
          Why Choose Us?
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          viewport={{ once: true }}
          className="mt-4 text-lg text-zinc-300"
        >
          Our coffee is hand-picked, freshly roasted, and delivered straight to your doorstep.
        </motion.p>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              title: 'Fresh & Bold',
              text: 'Our coffee beans are roasted to perfection to deliver the best flavor.',
            },
            {
              title: 'Convenient',
              text: 'Delivered to your door every month, so you never run out of coffee!',
            },
            {
              title: 'Exclusive Perks',
              text: 'As a member, enjoy exclusive merch and discounts on all products.',
            },
          ].map((item, i) => (
            <motion.div
              key={item.title}
              custom={i}
              initial="hidden"
              whileInView="show"
              variants={cardVariants}
              viewport={{ once: true }}
              className="bg-zinc-800 hover:bg-zinc-700 transition-colors duration-300 p-6 rounded-2xl shadow-xl border border-amber-500/20 backdrop-blur-sm"
            >
              <h3 className="text-2xl font-semibold text-amber-300">{item.title}</h3>
              <p className="mt-3 text-zinc-300">{item.text}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
