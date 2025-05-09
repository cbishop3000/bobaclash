import { motion } from 'framer-motion';

const Carousel = () => {
  return (
    <div className="flex justify-center items-center py-8">
      <div className="overflow-hidden w-80 rounded-xl bg-opacity-10 backdrop-blur-md border border-white">
        <motion.div
          className="flex"
          animate={{ x: '-100%' }}
          transition={{
            repeat: Infinity,
            repeatType: 'reverse',
            duration: 8,  // Slower movement
          }}
        >
          {/* Carousel Items */}
          <div className="flex-none w-80 h-full m-4 rounded-xl bg-white bg-opacity-20 backdrop-blur-sm flex justify-center items-center hover:scale-105 transition-transform duration-300">
            <img
              src="/coffee1.jpeg"
              alt="Coffee"
              className="w-full h-full object-cover rounded-xl"
            />
          </div>

          <div className="flex-none w-80 h-full m-4 rounded-xl bg-white bg-opacity-20 backdrop-blur-sm flex justify-center items-center hover:scale-105 transition-transform duration-300">
            <img
              src="/images/pizza.jpg"
              alt="Pizza"
              className="w-full h-full object-cover rounded-xl"
            />
          </div>

          <div className="flex-none w-80 h-full m-4 rounded-xl bg-white bg-opacity-20 backdrop-blur-sm flex justify-center items-center hover:scale-105 transition-transform duration-300">
            <img
              src="/images/sushi.jpg"
              alt="Sushi"
              className="w-full h-full object-cover rounded-xl"
            />
          </div>

          <div className="flex-none w-80 h-full m-4 rounded-xl bg-white bg-opacity-20 backdrop-blur-sm flex justify-center items-center hover:scale-105 transition-transform duration-300">
            <img
              src="/images/salad.jpg"
              alt="Salad"
              className="w-full h-full object-cover rounded-xl"
            />
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Carousel;
