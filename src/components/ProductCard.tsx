import { useState, useEffect } from "react";
import { useCartStore, Product } from "../stores/cartStore";
import { motion, AnimatePresence } from "framer-motion";

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const { addToCart, cart } = useCartStore();
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);

  // Get the current quantity of this product in the cart
  const getCartQuantity = () => {
    const item = cart.find((item) => item.name === product.name);
    return item ? item.quantity : 0;
  };

  // Update the quantity state when the cart changes
  useEffect(() => {
    const cartQuantity = getCartQuantity();
    if (cartQuantity === 0 && isAdding) {
      // If item is removed from cart, revert to Add to Cart button
      setIsAdding(false);
      setQuantity(1);
    } else if (cartQuantity > 0 && isAdding) {
      // Update quantity to match cart
      setQuantity(cartQuantity);
    }
  }, [cart, product.name, isAdding]);

  const formatPrice = (price: number) => {
    return price.toFixed(2);
  };

  const handleAddToCart = () => {
    if (!isAdding) {
      // First click - show quantity controls
      setIsAdding(true);
      // If product is already in cart, set quantity to match
      const cartQuantity = getCartQuantity();
      if (cartQuantity > 0) {
        setQuantity(cartQuantity);
      } else {
        // Add to cart with quantity 1
        addToCart(product);
      }
    } else {
      // Second click - hide quantity controls
      setIsAdding(false);
      setQuantity(1);
    }
  };

  const handleQuantityChange = (newQuantity: number) => {
    // If new quantity is 0, revert to Add to Cart button
    if (newQuantity === 0) {
      setIsAdding(false);
      setQuantity(1);
      // Remove from cart
      useCartStore.getState().removeFromCart(product.name);
      return;
    }

    // Calculate the difference between new and current quantity
    const diff = newQuantity - quantity;

    if (diff > 0) {
      // If increasing, add to cart
      addToCart(product);
    } else if (diff < 0) {
      // If decreasing, decrease quantity in cart
      useCartStore.getState().decreaseQuantity(product.name);
    }

    // Update the quantity state
    setQuantity(newQuantity);
  };

  const increaseQuantity = () => {
    const newQuantity = quantity + 1;
    handleQuantityChange(newQuantity);
  };

  const decreaseQuantity = () => {
    const newQuantity = quantity - 1;
    handleQuantityChange(newQuantity);
  };

  return (
    <motion.article
      className="flex flex-col bg-white rounded-md h-full overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={{
        boxShadow: "0 10px 25px rgba(0, 0, 0, 0.1)",
        y: -5,
      }}
    >
      {/* Top section with image */}
      <div className="relative">
        {/* Product image */}
        <figure>
          <motion.div
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.2 }}
          >
            <picture>
              <source
                media="(min-width: 1024px)"
                srcSet={product.image.desktop}
              />
              <source
                media="(min-width: 768px)"
                srcSet={product.image.tablet}
              />
              <source
                media="(min-width: 375px)"
                srcSet={product.image.mobile}
              />
              <img
                src={product.image.thumbnail}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </picture>
          </motion.div>
        </figure>

        {/* Add to cart button positioned half on image, half below */}
        <div className="right-0 -bottom-5 left-0 absolute px-4">
          <AnimatePresence mode="wait">
            {!isAdding ? (
              <motion.button
                key="add-button"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                onClick={handleAddToCart}
                className="flex justify-center items-center gap-2 bg-white hover:bg-Rose-100 shadow-md px-4 py-2 border border-Rose-200 rounded-full w-full text-Rose-900"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                aria-label={`Add ${product.name} to cart`}
              >
                <motion.img
                  src="/assets/images/icon-add-to-cart.svg"
                  alt=""
                  className="w-4 h-4"
                  aria-hidden="true"
                  initial={{ rotate: 0 }}
                  animate={{ rotate: [0, -10, 10, -5, 5, 0] }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                />
                <span>Add to Cart</span>
              </motion.button>
            ) : (
              <motion.div
                key="quantity-controls"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="flex justify-between items-center bg-Red shadow-md px-4 py-2 rounded-full w-full"
              >
                <motion.button
                  onClick={decreaseQuantity}
                  className="flex justify-center items-center bg-white hover:bg-Rose-100 rounded-full w-8 h-8"
                 
                  whileTap={{ scale: 0.9 }}
                  aria-label="Decrease quantity"
                  disabled={quantity <= 1}
                >
                  <span className="font-medium text-Red text-lg">−</span>
                </motion.button>

                <motion.span
                  className="font-medium text-lg text-white"
                  key={quantity}
                  initial={{ scale: 1.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  {quantity}
                </motion.span>

                <motion.button
                  onClick={increaseQuantity}
                  className="flex justify-center items-center hover:bg-Rose-100 rounded-full w-8 h-8 bg-white"
                  
                  whileTap={{ scale: 0.9 }}
                  aria-label="Increase quantity"
                >
                  <span className="font-medium text-Red text-lg">+</span>
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Content section with extra padding for the overlapping button */}
      <div className="flex flex-col flex-grow p-4 pt-10">
        {/* Category and name */}
        <motion.header
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <p className="text-Rose-500 text-sm">{product.category}</p>
          <h3 className="mt-1 font-medium text-base">{product.name}</h3>
        </motion.header>

        {/* Price */}
        <motion.p
          className="mt-1 font-medium text-Red"
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <span className="sr-only">Price:</span>${formatPrice(product.price)}
        </motion.p>
      </div>
    </motion.article>
  );
};

export default ProductCard;
