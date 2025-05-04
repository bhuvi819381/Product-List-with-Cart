import { useCartStore } from "../stores/cartStore";
import type { CartItem } from "../stores/cartStore";
import { motion, AnimatePresence } from "framer-motion";

const CartSummary = () => {
  const { cart, removeFromCart, getTotalPrice, toggleConfirmation } =
    useCartStore();

  // Format price to USD
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(price);
  };

  // Handle order confirmation
  const handleConfirmOrder = () => {
    toggleConfirmation();
  };

  return (
    <motion.section
      className="bg-white rounded-lg shadow-sm p-6"
      aria-labelledby="cart-heading"
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
    >
      <motion.h2
        id="cart-heading"
        className="text-xl font-semibold text-Red mb-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        Your Cart ({cart.reduce((total, item) => total + item.quantity, 0)})
      </motion.h2>

      {cart.length === 0 ? (
        <motion.p
          className="text-center py-8 text-Rose-500"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          Your cart is empty
        </motion.p>
      ) : (
        <>
          <motion.ul
            className="space-y-4 mb-6"
            aria-label="Cart items"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <AnimatePresence>
              {cart.map((item) => (
                <motion.li
                  key={item.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                  transition={{ duration: 0.3 }}
                  layout
                >
                  <CartItem
                    item={item}
                    onRemove={removeFromCart}
                    formatPrice={formatPrice}
                  />
                </motion.li>
              ))}
            </AnimatePresence>
          </motion.ul>

          <motion.div
            className="border-t border-Rose-100 pt-4 mb-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <dl className="flex justify-between items-center">
              <dt className="font-semibold">Order Total</dt>
              <motion.dd
                className="font-bold text-xl"
                key={getTotalPrice()}
                initial={{ scale: 1.2 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                {formatPrice(getTotalPrice())}
              </motion.dd>
            </dl>
          </motion.div>

          <motion.figure
            className="flex items-center gap-2 mb-6 text-Green"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <img
              src="/assets/images/icon-carbon-neutral.svg"
              alt=""
              className="w-5 h-5"
              aria-hidden="true"
            />
            <figcaption className="text-sm">
              This is a carbon-neutral delivery
            </figcaption>
          </motion.figure>

          <motion.button
            onClick={handleConfirmOrder}
            className="w-full bg-Red hover:bg-opacity-90 text-white py-3 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-Red focus:ring-opacity-50"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            Confirm Order
          </motion.button>
        </>
      )}
    </motion.section>
  );
};

// Cart item component
interface CartItemProps {
  item: CartItem;
  onRemove: (name: string) => void;
  formatPrice: (price: number) => string;
}

const CartItem = ({ item, onRemove, formatPrice }: CartItemProps) => {
  return (
    <div className="flex justify-between items-start">
      <div className="flex items-start gap-2">
        <motion.span
          className="text-Red font-medium text-sm"
          aria-label={`Quantity: ${item.quantity}`}
          key={item.quantity}
          initial={{ scale: 1.5 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          {item.quantity}×
        </motion.span>
        <div>
          <h3 className="font-medium">{item.name}</h3>
          <p className="text-Rose-500 text-sm">
            <span className="sr-only">Price per item:</span>@{" "}
            {formatPrice(item.price)}
          </p>
        </div>
      </div>

      <div className="flex items-start gap-3">
        <motion.p
          className="font-semibold"
          key={item.quantity}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <span className="sr-only">Total price:</span>
          {formatPrice(item.price * item.quantity)}
        </motion.p>
        <motion.button
          onClick={() => onRemove(item.name)}
          className="p-1 hover:bg-Rose-100 rounded-full"
          aria-label={`Remove ${item.name} from cart`}
          whileHover={{
            backgroundColor: "rgba(255, 200, 200, 0.3)",
            rotate: 90,
          }}
          whileTap={{ scale: 0.8 }}
        >
          <img
            src="/assets/images/icon-remove-item.svg"
            alt=""
            className="w-4 h-4"
            aria-hidden="true"
          />
        </motion.button>
      </div>
    </div>
  );
};

export default CartSummary;
