import { useCartStore } from "../stores/cartStore";
import { useEffect, useRef } from "react";

const Confirmation = () => {
  const { toggleConfirmation, clearCart, getTotalPrice } = useCartStore();
  const modalRef = useRef<HTMLDivElement>(null);

  // Format price to USD
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(price);
  };

  // Handle click outside to close modal
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        toggleConfirmation();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [toggleConfirmation]);

  // Handle keyboard events (Escape to close)
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        toggleConfirmation();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [toggleConfirmation]);

  // Handle new order
  const handleNewOrder = () => {
    clearCart();
    toggleConfirmation();
  };

  return (
    <dialog
      className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 m-0 w-full h-full"
      open
      aria-labelledby="confirmation-title"
      aria-modal="true"
    >
      <article
        ref={modalRef}
        className="bg-white rounded-lg shadow-xl max-w-sm w-full p-8 flex flex-col items-center"
      >
        <header className="text-center">
          <img
            src="/assets/images/icon-order-confirmed.svg"
            alt=""
            className="w-16 h-16 mb-6 mx-auto"
            aria-hidden="true"
          />

          <h2 id="confirmation-title" className="text-2xl font-bold mb-3">
            Order Confirmed!
          </h2>

          <p className="text-Rose-500 mb-8">
            Your order has been confirmed. Thank you for your purchase!
          </p>
        </header>

        <section className="bg-Rose-50 p-6 rounded-lg w-full mb-8">
          <dl className="flex justify-between items-center">
            <dt className="font-medium">Total Amount:</dt>
            <dd className="font-bold text-xl">
              {formatPrice(getTotalPrice())}
            </dd>
          </dl>

          <figure className="flex items-center gap-2 mt-4 text-Green">
            <img
              src="/assets/images/icon-carbon-neutral.svg"
              alt=""
              className="w-5 h-5"
              aria-hidden="true"
            />
            <figcaption className="text-sm">Carbon-neutral delivery</figcaption>
          </figure>
        </section>

        <footer>
          <button
            onClick={handleNewOrder}
            className="w-full bg-Red hover:bg-opacity-90 text-white py-3 px-4 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-Red focus:ring-opacity-50"
          >
            Start New Order
          </button>
        </footer>
      </article>
    </dialog>
  );
};

export default Confirmation;
