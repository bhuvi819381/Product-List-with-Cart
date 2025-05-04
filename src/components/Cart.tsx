import { useCartStore } from "../stores/cartStore";
import type { CartItem } from "../stores/cartStore";
import { useEffect, useRef } from "react";

const Cart = () => {
  const {
    cart,
    removeFromCart,
    increaseQuantity,
    decreaseQuantity,
    toggleCart,
    getTotalPrice,
    toggleConfirmation,
    clearCart,
  } = useCartStore();

  const cartRef = useRef<HTMLDivElement>(null);

  // Handle click outside to close cart
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (cartRef.current && !cartRef.current.contains(event.target as Node)) {
        toggleCart();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [toggleCart]);

  // Format price to USD
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price);
  };

  // Handle order confirmation
  const handleConfirmOrder = () => {
    toggleConfirmation();
    toggleCart();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-end">
      <aside
        ref={cartRef}
        className="bg-white w-full max-w-sm h-full overflow-y-auto shadow-lg flex flex-col"
        aria-labelledby="cart-heading"
      >
        <div className="p-6 border-b border-Rose-100 flex justify-between items-center">
          <h2 id="cart-heading" className="text-xl font-semibold">
            Your Cart
          </h2>
          <button
            onClick={toggleCart}
            className="p-1.5 hover:bg-Rose-100 rounded-full transition-colors"
            aria-label="Close cart"
          >
            <img
              src="/assets/images/icon-remove-item.svg"
              alt=""
              className="w-4 h-4"
              aria-hidden="true"
            />
          </button>
        </div>

        {cart.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center p-6 text-Rose-500">
            <img
              src="/assets/images/illustration-empty-cart.svg"
              alt=""
              className="w-24 h-24 mb-4"
              aria-hidden="true"
            />
            <p className="mb-6 text-center">Your cart is empty</p>
            <button
              onClick={toggleCart}
              className="bg-Red text-white py-2.5 px-6 rounded-md hover:bg-opacity-90 transition-colors"
            >
              Continue Shopping
            </button>
          </div>
        ) : (
          <>
            <ul className="flex-1 p-6 space-y-6">
              {cart.map((item) => (
                <CartItem
                  key={item.name}
                  item={item}
                  onRemove={removeFromCart}
                  onIncrease={increaseQuantity}
                  onDecrease={decreaseQuantity}
                  formatPrice={formatPrice}
                />
              ))}
            </ul>

            <div className="p-6 border-t border-Rose-100">
              <div className="flex justify-between items-center mb-6">
                <span className="font-semibold">Total:</span>
                <span className="font-bold text-lg">
                  {formatPrice(getTotalPrice())}
                </span>
              </div>

              <div className="flex flex-col gap-3">
                <button
                  onClick={handleConfirmOrder}
                  className="w-full bg-Green hover:bg-opacity-90 text-white py-3 px-4 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-Green focus:ring-opacity-50"
                  disabled={cart.length === 0}
                >
                  Confirm Order
                </button>

                <button
                  onClick={clearCart}
                  className="w-full bg-Rose-100 hover:bg-Rose-300 text-Rose-900 py-3 px-4 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-Rose-300 focus:ring-opacity-50"
                >
                  Start New Order
                </button>
              </div>
            </div>
          </>
        )}
      </aside>
    </div>
  );
};

// Cart item component
interface CartItemProps {
  item: CartItem;
  onRemove: (name: string) => void;
  onIncrease: (name: string) => void;
  onDecrease: (name: string) => void;
  formatPrice: (price: number) => string;
}

const CartItem = ({
  item,
  onRemove,
  onIncrease,
  onDecrease,
  formatPrice,
}: CartItemProps) => {
  return (
    <li className="flex items-center gap-4 hover:bg-Rose-50 rounded-md transition-colors">
      <img
        src={item.image.thumbnail}
        alt=""
        className="w-16 h-16 object-cover rounded-md"
        aria-hidden="true"
      />

      <div className="flex-1 min-w-0">
        <h3 className="font-medium truncate">{item.name}</h3>
        <p className="text-sm text-Rose-500 mt-1">
          {formatPrice(item.price)} each
        </p>

        <div className="flex items-center mt-2">
          <div className="flex items-center bg-Red rounded-md overflow-hidden">
            <button
              onClick={() => onDecrease(item.name)}
              className="p-2 text-white hover:bg-opacity-90 transition-colors"
              aria-label={`Decrease quantity of ${item.name}`}
            >
              <img
                src="/assets/images/icon-decrement-quantity.svg"
                alt=""
                className="w-2.5 h-2.5"
                aria-hidden="true"
              />
            </button>

            <span
              className="px-3 text-white font-medium"
              aria-label={`Quantity: ${item.quantity}`}
            >
              {item.quantity}
            </span>

            <button
              onClick={() => onIncrease(item.name)}
              className="p-2 text-white hover:bg-opacity-90 transition-colors"
              aria-label={`Increase quantity of ${item.name}`}
            >
              <img
                src="/assets/images/icon-increment-quantity.svg"
                alt=""
                className="w-2.5 h-2.5"
                aria-hidden="true"
              />
            </button>
          </div>
        </div>
      </div>

      <div className="flex flex-col items-end">
        <span className="font-semibold">
          {formatPrice(item.price * item.quantity)}
        </span>

        <button
          onClick={() => onRemove(item.name)}
          className="p-1 mt-2 hover:bg-Rose-100 rounded-full transition-colors"
          aria-label={`Remove ${item.name} from cart`}
        >
          <img
            src="/assets/images/icon-remove-item.svg"
            alt=""
            className="w-4 h-4"
            aria-hidden="true"
          />
        </button>
      </div>
    </li>
  );
};

export default Cart;
