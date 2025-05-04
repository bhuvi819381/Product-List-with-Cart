import { useEffect } from "react";
import { useCartStore, Product } from "./stores/cartStore";
import ProductCard from "./components/ProductCard";
import CartSummary from "./components/CartSummary";
import Confirmation from "./components/Confirmation";

const App = () => {
  const { products, setProducts, showConfirmation } = useCartStore();

  // Fetch products from data.json
  useEffect(() => {
    fetch("/data/data.json")
      .then((res) => res.json())
      .then((data: Product[]) => setProducts(data))
      .catch((error) => console.error("Error fetching products:", error));
  }, [setProducts]);

  return (
    <div className="min-h-screen bg-Rose-50 text-Rose-900">
      <main className="max-w-[1220px] mx-auto  py-20">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main content */}
          <section className="flex-1">
            <h1 className="text-[2.5em] font-bold text-Rose-900 mb-8">Desserts</h1>

            <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 list-none p-0">
              {products.map((product) => (
                <li key={product.name}>
                  <ProductCard product={product} />
                </li>
              ))}
            </ul>
          </section>

          {/* Cart summary */}
          <aside className="lg:w-[350px]">
            <CartSummary />
          </aside>
        </div>
      </main>

      {/* Confirmation Modal */}
      {showConfirmation && <Confirmation />}
    </div>
  );
};

export default App;
