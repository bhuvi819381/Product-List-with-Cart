
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
      className="bg-white shadow-sm p-6 rounded-lg"
      aria-labelledby="cart-heading"
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
    >
      <motion.h2
        id="cart-heading"
        className="mb-6 font-semibold text-Red text-xl"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        Your Cart ({cart.reduce((total, item) => total + item.quantity, 0)})
      </motion.h2>

      {cart.length === 0 ? (
        <motion.div
          className="flex flex-col justify-center items-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <img
            src="/assets/images/illustration-empty-cart.svg"
            alt="empty cart"
          />
          <motion.p className="py-2 text-Rose-500 text-center">
            Your added item will appear here
          </motion.p>
        </motion.div>
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
            className="mb-6 pt-4 border-Rose-100 border-t"
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
            className="bg-Red hover:bg-opacity-90 focus:ring-opacity-50 px-4 py-3 rounded-md focus:outline-none focus:ring-2 focus:ring-Red w-full text-white"
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
          className="font-medium text-Red text-sm"
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
          className="hover:bg-Rose-100 p-1 rounded-full"
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
