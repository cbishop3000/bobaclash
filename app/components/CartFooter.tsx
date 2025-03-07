// components/CartFooter.tsx
import { FC } from 'react';

interface CartFooterProps {
  cart: Record<string, number>;
}

const CartFooter: FC<CartFooterProps> = ({ cart }) => {
  return (
    <footer className="fixed bottom-0 left-0 w-full bg-gray-800 text-white p-4">
      <h2 className="text-xl font-semibold mb-2">Your Cart</h2>
      <div className="flex flex-col space-y-2">
        {Object.keys(cart).length === 0 ? (
          <p>Your cart is empty</p>
        ) : (
          Object.keys(cart).map((item, index) => (
            <div key={index} className="flex justify-between items-center">
              <span>{item}</span>
              <span>{cart[item]}</span>
            </div>
          ))
        )}
      </div>
      <div className="mt-4 text-right">
        <button className="py-2 px-4 bg-green-500 text-white rounded-md hover:bg-green-600 transition duration-200">
          Proceed to Checkout
        </button>
      </div>
    </footer>
  );
};

export default CartFooter;
